import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  TestConfig,
  TestConfigDocument,
} from '../schemas/test-configuration.schema';
import { QuestionDocument } from '../schemas/question.schema';

import { CreateTestConfigDto } from '../dtos/test-configuration.dto';
import { QuestionsService } from '../questions/questions.service';

// Interface for questions without correct answers (for frontend security)
export interface QuestionWithoutAnswer {
  _id: string;
  questionText: string;
  options: string[];
  category: string;
  points: number;
  difficulty: string;
  isActive: boolean;
}

@Injectable()
export class TestConfigService {
  constructor(
    @InjectModel(TestConfig.name)
    private readonly testConfigModel: Model<TestConfigDocument>,
    private readonly questionsService: QuestionsService,
  ) {}

  async createTestConfig(
    createTestConfigDto: CreateTestConfigDto,
    userId: string,
  ): Promise<{ testConfigId: string; message: string }> {
    const { testName, email, numOfQuestions, categories } = createTestConfigDto;

    // Validate categories
    const validCategories = ['DSA', 'OOP', 'PF'];
    const invalidCategories = categories.filter(
      (cat) => !validCategories.includes(cat),
    );

    if (invalidCategories.length > 0) {
      throw new BadRequestException(
        `Invalid categories: ${invalidCategories.join(', ')}`,
      );
    }

    // Check if enough questions are available
    try {
      await this.questionsService.getQuestionsByCategories(
        categories,
        numOfQuestions,
      );
    } catch (error) {
      throw new BadRequestException(error);
    }

    const testConfig = new this.testConfigModel({
      userId: new Types.ObjectId(userId),
      testName,
      email,
      numOfQuestions,
      categories,
      duration: 600, // 10 minutes
      passingScore: 50, // 50%
      status: 'Pending',
    });

    const savedConfig = await testConfig.save();

    return {
      testConfigId: (savedConfig._id as Types.ObjectId).toString(),
      message: 'Test configuration created successfully',
    };
  }

  async getTestConfig(
    testConfigId: string,
    userId: string,
  ): Promise<TestConfig> {
    const testConfig = await this.testConfigModel
      .findOne({
        _id: new Types.ObjectId(testConfigId),
        userId: new Types.ObjectId(userId),
      })
      .exec();

    if (!testConfig) {
      throw new NotFoundException('Test configuration not found');
    }

    return testConfig;
  }

  async startTest(
    testConfigId: string,
    userId: string,
  ): Promise<{
    questions: QuestionWithoutAnswer[]; // Changed return type to match actual data
    testConfig: TestConfig;
    message: string;
  }> {
    const testConfig = await this.getTestConfig(testConfigId, userId);

    // Allow idempotent start: if already in progress, do not error; only block completed
    if (testConfig.status === 'Completed') {
      throw new BadRequestException('Test has already been completed');
    }
    if (testConfig.status === 'Pending') {
      await this.testConfigModel.updateOne(
        { _id: new Types.ObjectId(testConfigId) },
        { status: 'In Progress' },
      );
    }

    // Get questions for the test
    const questions = await this.questionsService.getQuestionsByCategories(
      testConfig.categories,
      testConfig.numOfQuestions,
    );

    // Remove correct answers from questions before sending to frontend
    const questionsWithoutAnswers: QuestionWithoutAnswer[] = questions.map(
      (question) => {
        // Safe access to _id property from MongoDB document
        const questionDoc = question as QuestionDocument;

        return {
          _id: (questionDoc._id as Types.ObjectId).toString(),
          questionText: question.questionText,
          options: question.options,
          category: question.category,
          points: question.points,
          difficulty: question.difficulty,
          isActive: question.isActive,
        };
      },
    );

    return {
      questions: questionsWithoutAnswers, // Now matches the return type
      testConfig,
      message: 'Test started successfully',
    };
  }

  async getUserTestConfigs(userId: string): Promise<TestConfig[]> {
    return this.testConfigModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateTestStatus(
    testConfigId: string,
    status: string,
    userId: string,
  ): Promise<void> {
    const result = await this.testConfigModel.updateOne(
      {
        _id: new Types.ObjectId(testConfigId),
        userId: new Types.ObjectId(userId),
      },
      { status },
    );

    if (result.modifiedCount === 0) {
      throw new NotFoundException(
        'Test configuration not found or unauthorized',
      );
    }
  }
}
