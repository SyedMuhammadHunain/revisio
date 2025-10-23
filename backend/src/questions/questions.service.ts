import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateQuestionDto } from '../dtos/questions.dto';
import { Question, QuestionDocument } from '../schemas/question.schema';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name)
    private readonly questionModel: Model<QuestionDocument>,
  ) {}

  async getQuestionsByCategories(
    categories: string[],
    numOfQuestions: number,
  ): Promise<Question[]> {
    const questionsPerCategory = Math.ceil(numOfQuestions / categories.length);
    const allQuestions: Question[] = [];

    for (const category of categories) {
      const categoryQuestions = await this.questionModel
        .aggregate([
          { $match: { category, isActive: true } },
          { $sample: { size: questionsPerCategory } },
        ])
        .exec();

      allQuestions.push(...categoryQuestions);
    }

    // If we have more questions than needed, randomly select the exact number
    if (allQuestions.length > numOfQuestions) {
      const shuffled = allQuestions.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, numOfQuestions);
    }

    if (allQuestions.length < numOfQuestions) {
      throw new NotFoundException(
        `Not enough questions available. Found ${allQuestions.length}, requested ${numOfQuestions}`,
      );
    }

    return allQuestions;
  }

  async getQuestionById(questionId: string): Promise<Question> {
    const question = await this.questionModel.findById(questionId).exec();
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    return question;
  }

  async createSampleQuestions(
    createQuestionDto: CreateQuestionDto,
  ): Promise<Question> {
    const newQuestion = new this.questionModel(createQuestionDto);
    return await newQuestion.save();
  }
}
