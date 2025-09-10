export interface TestConfig {
  _id: string;
  testName: string;
  email: string;
  numOfQuestions: number;
  categories: string[];
  duration: number;
  passingScore: number;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Failed';
  createdAt: Date;
  updatedAt?: Date;
}

// Question interface with correctAnswer (used internally on backend only)
export interface Question {
  _id: string;
  questionText: string;
  options: string[];
  category: string;
  points: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isActive: boolean;
}

// QuestionWithoutAnswer interface (what frontend receives)
export interface QuestionWithoutAnswer {
  _id: string;
  questionText: string;
  options: string[];
  category: string;
  points: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isActive: boolean;
  // Note: correctAnswer is intentionally omitted for security
}

export interface Answer {
  questionId: string;
  selectedAnswer: number;
}

export interface DetailedAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  points: number;
  category: string;
}

export interface CategoryScore {
  category: string;
  totalQuestions: number;
  correctAnswers: number;
  totalPoints: number;
  obtainedPoints: number;
  percentage: number;
}

export interface TestResult {
  _id: string;
  testName: string;
  answers: DetailedAnswer[];
  categoryScores: CategoryScore[];
  totalQuestions: number;
  correctAnswers: number;
  totalPoints: number;
  obtainedPoints: number;
  percentage: number;
  status: 'Pass' | 'Fail';
  startTime: Date;
  endTime: Date;
  duration: number; // in seconds
  cheatingDetected: boolean;
  warningsGiven: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface UserStatistics {
  totalAttempted: number;
  totalPassed: number;
  passRate: number;
  averageScore: number;
  categoryAverages: { category: string; average: number }[];
  recentScores: { testName: string; score: number }[];
}

// Request/Response interfaces
export interface CreateTestConfigRequest {
  testName: string;
  email: string;
  numOfQuestions: number;
  categories: string[];
}

export interface CreateTestConfigResponse {
  testConfigId: string;
  message: string;
}

export interface StartTestResponse {
  questions: QuestionWithoutAnswer[]; // Updated to match backend
  testConfig: TestConfig;
  message: string;
}

export interface SubmitTestRequest {
  testConfigId: string;
  answers: Answer[];
  startTime: Date;
  endTime: Date;
  cheatingDetected?: boolean;
  warningsGiven?: number;
}

export interface SubmitTestResponse {
  testResult: TestResult;
  message: string;
}
