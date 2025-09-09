import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

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

  async createSampleQuestions(): Promise<void> {
    const sampleQuestions = [
      // DSA Questions
      {
        questionText: 'What is the time complexity of binary search?',
        options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
        correctAnswer: 1,
        category: 'DSA',
        points: 2,
        difficulty: 'Easy',
      },
      {
        questionText: 'Which data structure uses LIFO principle?',
        options: ['Queue', 'Stack', 'Array', 'Tree'],
        correctAnswer: 1,
        category: 'DSA',
        points: 2,
        difficulty: 'Easy',
      },
      {
        questionText: 'What is the worst-case time complexity of quicksort?',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
        correctAnswer: 2,
        category: 'DSA',
        points: 3,
        difficulty: 'Medium',
      },
      {
        questionText:
          'In a binary tree, what is the maximum number of nodes at level 3?',
        options: ['4', '8', '16', '32'],
        correctAnswer: 1,
        category: 'DSA',
        points: 3,
        difficulty: 'Medium',
      },
      {
        questionText:
          'Which algorithm is best for finding shortest path in weighted graph?',
        options: ['BFS', 'DFS', 'Dijkstra', 'Binary Search'],
        correctAnswer: 2,
        category: 'DSA',
        points: 4,
        difficulty: 'Hard',
      },

      // OOP Questions
      {
        questionText: 'What is encapsulation in OOP?',
        options: [
          'Inheritance of properties',
          'Hiding internal details',
          'Creating multiple objects',
          'Method overriding',
        ],
        correctAnswer: 1,
        category: 'OOP',
        points: 2,
        difficulty: 'Easy',
      },
      {
        questionText:
          'Which keyword is used to inherit a class in most OOP languages?',
        options: ['extends', 'inherits', 'derives', 'implements'],
        correctAnswer: 0,
        category: 'OOP',
        points: 2,
        difficulty: 'Easy',
      },
      {
        questionText: 'What is polymorphism?',
        options: [
          'Having multiple constructors',
          'One interface, multiple implementations',
          'Creating private variables',
          'Using static methods',
        ],
        correctAnswer: 1,
        category: 'OOP',
        points: 3,
        difficulty: 'Medium',
      },
      {
        questionText:
          'What is the difference between abstract class and interface?',
        options: [
          'No difference',
          'Abstract class can have implementation',
          'Interface is faster',
          'Abstract class is deprecated',
        ],
        correctAnswer: 1,
        category: 'OOP',
        points: 4,
        difficulty: 'Hard',
      },
      {
        questionText: 'What is method overloading?',
        options: [
          'Same method name, different parameters',
          'Different method name, same parameters',
          'Overriding parent method',
          'Creating static methods',
        ],
        correctAnswer: 0,
        category: 'OOP',
        points: 3,
        difficulty: 'Medium',
      },

      // PF Questions
      {
        questionText: 'What is a function in programming?',
        options: [
          'A variable',
          'A reusable block of code',
          'A data type',
          'A loop',
        ],
        correctAnswer: 1,
        category: 'PF',
        points: 2,
        difficulty: 'Easy',
      },
      {
        questionText: 'Which loop is guaranteed to execute at least once?',
        options: ['for loop', 'while loop', 'do-while loop', 'nested loop'],
        correctAnswer: 2,
        category: 'PF',
        points: 2,
        difficulty: 'Easy',
      },
      {
        questionText: 'What is recursion?',
        options: [
          'A loop that never ends',
          'A function calling itself',
          'A type of variable',
          'An error in code',
        ],
        correctAnswer: 1,
        category: 'PF',
        points: 3,
        difficulty: 'Medium',
      },
      {
        questionText: 'What is the base case in recursion?',
        options: [
          'The first call',
          'The condition to stop recursion',
          'The recursive call',
          'The return statement',
        ],
        correctAnswer: 1,
        category: 'PF',
        points: 3,
        difficulty: 'Medium',
      },
      {
        questionText: 'What is a pure function?',
        options: [
          'A function with no bugs',
          'A function with no side effects and same output for same input',
          'A function written in assembly',
          'A function that uses only global variables',
        ],
        correctAnswer: 1,
        category: 'PF',
        points: 4,
        difficulty: 'Hard',
      },
    ];

    // Check if questions already exist
    const existingCount = await this.questionModel.countDocuments();
    if (existingCount === 0) {
      await this.questionModel.insertMany(sampleQuestions);
      console.log('Sample questions created successfully');
    }
  }
}
