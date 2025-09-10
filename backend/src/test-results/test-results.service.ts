import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { TestResult, TestResultDocument } from '../schemas/test-result.schema';
import {
  TestConfig,
  TestConfigDocument,
} from '../schemas/test-configuration.schema';
import { Question, QuestionDocument } from '../schemas/question.schema';

import { SubmitTestDto } from '../dtos/test-configuration.dto';

interface CategoryScore {
  category: string;
  totalQuestions: number;
  correctAnswers: number;
  totalPoints: number;
  obtainedPoints: number;
  percentage: number;
}

interface Answer {
  questionId: Types.ObjectId;
  selectedAnswer: number;
  isCorrect: boolean;
  points: number;
  category: string;
}

@Injectable()
export class TestResultsService {
  constructor(
    @InjectModel(TestResult.name)
    private readonly testResultModel: Model<TestResultDocument>,
    @InjectModel(TestConfig.name)
    private readonly testConfigModel: Model<TestConfigDocument>,
    @InjectModel(Question.name)
    private readonly questionModel: Model<QuestionDocument>,
  ) { }

  async submitTest(
    submitTestDto: SubmitTestDto,
    userId: string,
  ): Promise<{ testResult: TestResult; message: string }> {
    const {
      testConfigId,
      answers,
      startTime,
      endTime,
      cheatingDetected,
      warningsGiven,
    } = submitTestDto;

    // Get test configuration
    const testConfig = await this.testConfigModel
      .findOne({
        _id: new Types.ObjectId(testConfigId),
        userId: new Types.ObjectId(userId),
      })
      .exec();

    if (!testConfig) {
      throw new NotFoundException('Test configuration not found');
    }

    if (testConfig.status === 'Completed') {
      throw new BadRequestException('Test has already been completed');
    }

    // Get all questions for this test
    const questionIds = answers.map(
      (answer) => new Types.ObjectId(answer.questionId),
    );
    const questions = await this.questionModel
      .find({ _id: { $in: questionIds } })
      .exec();

    // Calculate results
    const processedAnswers: Answer[] = [];
    const categoryScores = new Map<string, CategoryScore>();

    for (const answer of answers) {
      const question = questions.find(
        (q) => (q._id as Types.ObjectId).toString() === answer.questionId,
      );
      if (!question) continue;

      const isCorrect = question.correctAnswer === answer.selectedAnswer;
      const points = isCorrect ? question.points : 0;

      processedAnswers.push({
        questionId: new Types.ObjectId(answer.questionId),
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
        points,
        category: question.category,
      });

      // Update category scores
      if (!categoryScores.has(question.category)) {
        categoryScores.set(question.category, {
          category: question.category,
          totalQuestions: 0,
          correctAnswers: 0,
          totalPoints: 0,
          obtainedPoints: 0,
          percentage: 0,
        });
      }

      const categoryScore = categoryScores.get(question.category)!;
      categoryScore.totalQuestions += 1;
      categoryScore.totalPoints += question.points;
      categoryScore.obtainedPoints += points;
      if (isCorrect) categoryScore.correctAnswers += 1;
    }

    // Calculate percentages for categories
    const categoryScoreArray: CategoryScore[] = Array.from(
      categoryScores.values(),
    ).map((score) => ({
      ...score,
      percentage:
        score.totalPoints > 0
          ? (score.obtainedPoints / score.totalPoints) * 100
          : 0,
    }));

    // Calculate overall results
    const totalQuestions = processedAnswers.length;
    const correctAnswers = processedAnswers.filter(
      (answer) => answer.isCorrect,
    ).length;
    
    const totalPoints = processedAnswers.reduce(
      (sum, answer) =>
        sum +
        (questions.find(
          (q) => (q._id as Types.ObjectId).toString() === answer.questionId.toString()
        )?.points || 0),
      0
    );
    const obtainedPoints = processedAnswers.reduce(
      (sum, answer) => sum + answer.points,
      0,
    );
    const percentage =
      totalPoints > 0 ? (obtainedPoints / totalPoints) * 100 : 0;
    const status = percentage >= testConfig.passingScore ? 'Pass' : 'Fail';

    // Create test result
    const testResult = new this.testResultModel({
      userId: new Types.ObjectId(userId),
      testConfigId: new Types.ObjectId(testConfigId),
      testName: testConfig.testName,
      answers: processedAnswers,
      categoryScores: categoryScoreArray,
      totalQuestions,
      correctAnswers,
      totalPoints,
      obtainedPoints,
      percentage: Math.round(percentage * 100) / 100, // Round to 2 decimal places
      status,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      duration: Math.floor(
        (new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000,
      ),
      cheatingDetected: cheatingDetected || false,
      warningsGiven: warningsGiven || 0,
    });

    const savedResult = await testResult.save();

    // Update test config status
    await this.testConfigModel.updateOne(
      { _id: new Types.ObjectId(testConfigId) },
      { status: 'Completed' },
    );

    return {
      testResult: savedResult,
      message: 'Test submitted successfully',
    };
  }

  async getUserTestResults(userId: string): Promise<TestResult[]> {
    return this.testResultModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getTestResultById(
    testResultId: string,
    userId: string,
  ): Promise<TestResult> {
    const testResult = await this.testResultModel
      .findOne({
        _id: new Types.ObjectId(testResultId),
        userId: new Types.ObjectId(userId),
      })
      .exec();

    if (!testResult) {
      throw new NotFoundException('Test result not found');
    }

    return testResult;
  }

  async getUserStatistics(userId: string): Promise<{
    totalAttempted: number;
    totalPassed: number;
    passRate: number;
    averageScore: number;
    categoryAverages: { category: string; average: number }[];
    recentScores: { testName: string; score: number }[];
  }> {
    const testResults = await this.getUserTestResults(userId);

    if (testResults.length === 0) {
      return {
        totalAttempted: 0,
        totalPassed: 0,
        passRate: 0,
        averageScore: 0,
        categoryAverages: [],
        recentScores: [],
      };
    }

    const totalAttempted = testResults.length;
    const totalPassed = testResults.filter(
      (result) => result.status === 'Pass',
    ).length;
    const passRate = (totalPassed / totalAttempted) * 100;
    const averageScore =
      testResults.reduce((sum, result) => sum + result.percentage, 0) /
      totalAttempted;

    // Calculate category averages
    const categoryMap = new Map<string, number[]>();
    testResults.forEach((result) => {
      result.categoryScores.forEach((categoryScore) => {
        if (!categoryMap.has(categoryScore.category)) {
          categoryMap.set(categoryScore.category, []);
        }
        categoryMap.get(categoryScore.category)!.push(categoryScore.percentage);
      });
    });

    const categoryAverages = Array.from(categoryMap.entries()).map(
      ([category, scores]) => ({
        category,
        average: scores.reduce((sum, score) => sum + score, 0) / scores.length,
      }),
    );

    // Get recent scores (last 5 tests)
    const recentScores = testResults.slice(0, 5).map((result) => ({
      testName: result.testName,
      score: result.percentage,
    }));

    return {
      totalAttempted,
      totalPassed,
      passRate: Math.round(passRate * 100) / 100,
      averageScore: Math.round(averageScore * 100) / 100,
      categoryAverages: categoryAverages.map((cat) => ({
        ...cat,
        average: Math.round(cat.average * 100) / 100,
      })),
      recentScores,
    };
  }
}
