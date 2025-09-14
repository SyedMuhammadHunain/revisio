import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { Router } from '@angular/router';

import {
  TestConfig,
  QuestionWithoutAnswer,
  TestResult,
  UserStatistics,
} from '../models/test.model';
import { LocalStorageService } from './local-storage.service';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  private readonly baseUrl = 'http://localhost:3000';
  private httpClient = inject(HttpClient);
  private localStorageService = inject(LocalStorageService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  private getHeaders(): HttpHeaders {
    const token = this.localStorageService.getAccessToken();

    if (!token) {
      console.error('No access token available');
      throw new Error('No authentication token available');
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
  }

  private checkAuthAndGetHeaders(): HttpHeaders {
    if (!this.localStorageService.isTokenValid()) {
      console.error('Token invalid or expired');
      this.handleAuthError();
      throw new Error('Authentication required');
    }

    return this.getHeaders();
  }

  createTestConfig(testConfigData: {
    testName: string;
    email: string;
    numOfQuestions: number;
    categories: string[];
  }): Observable<{ testConfigId: string; message: string }> {
    try {
      const headers = this.checkAuthAndGetHeaders();

      return this.httpClient
        .post<{ testConfigId: string; message: string }>(
          `${this.baseUrl}/test-config/create`,
          testConfigData,
          { headers }
        )
        .pipe(
          map((response) => {
            this.messageService.setMessage(response.message, 'success');
            return response;
          }),
          catchError(this.handleError.bind(this))
        );
    } catch (error) {
      return throwError(() => error);
    }
  }

  startTest(testConfigId: string): Observable<{
    questions: QuestionWithoutAnswer[];
    testConfig: TestConfig;
    message: string;
  }> {
    try {
      const headers = this.checkAuthAndGetHeaders();

      return this.httpClient
        .post<{
          questions: QuestionWithoutAnswer[];
          testConfig: TestConfig;
          message: string;
        }>(`${this.baseUrl}/test-config/start`, { testConfigId }, { headers })
        .pipe(
          map((response) => {
            this.messageService.setMessage(response.message, 'success');
            return response;
          }),
          catchError(this.handleError.bind(this))
        );
    } catch (error) {
      return throwError(() => error);
    }
  }

  submitTest(submitData: {
    testConfigId: string;
    answers: { questionId: string; selectedAnswer: number }[];
    startTime: Date;
    endTime: Date;
    cheatingDetected?: boolean;
    warningsGiven?: number;
  }): Observable<{ testResult: TestResult; message: string }> {
    try {
      const headers = this.checkAuthAndGetHeaders();

      return this.httpClient
        .post<{ testResult: TestResult; message: string }>(
          `${this.baseUrl}/test-results/submit`,
          submitData,
          { headers }
        )
        .pipe(
          map((response) => {
            this.messageService.setMessage(response.message, 'success');
            return response;
          }),
          catchError(this.handleError.bind(this))
        );
    } catch (error) {
      return throwError(() => error);
    }
  }

  getUserTestResults(): Observable<TestResult[]> {
    try {
      const headers = this.checkAuthAndGetHeaders();

      return this.httpClient
        .get<TestResult[]>(`${this.baseUrl}/test-results/user-results`, {
          headers,
        })
        .pipe(
          retry(1), // Retry once on failure
          catchError(this.handleError.bind(this))
        );
    } catch (error) {
      return of([]); // Return empty array on auth error
    }
  }

  getUserStatistics(): Observable<UserStatistics> {
    try {
      const headers = this.checkAuthAndGetHeaders();

      return this.httpClient
        .get<UserStatistics>(`${this.baseUrl}/test-results/statistics`, {
          headers,
        })
        .pipe(
          retry(1), // Retry once on failure
          catchError((error) => {
            console.error('Failed to get user statistics:', error);

            // Return default statistics instead of throwing error
            const defaultStats: UserStatistics = {
              totalAttempted: 0,
              totalPassed: 0,
              passRate: 0,
              averageScore: 0,
              categoryAverages: [],
              recentScores: [],
            };

            // Only show error message if it's not an auth issue
            if (error.status !== 401) {
              this.messageService.setMessage(
                'Unable to load statistics',
                'error'
              );
            }

            return of(defaultStats);
          })
        );
    } catch (error) {
      console.error('Auth error in getUserStatistics:', error);
      // Return default statistics for auth errors
      const defaultStats: UserStatistics = {
        totalAttempted: 0,
        totalPassed: 0,
        passRate: 0,
        averageScore: 0,
        categoryAverages: [],
        recentScores: [],
      };
      return of(defaultStats);
    }
  }

  getUserTestConfigs(): Observable<TestConfig[]> {
    try {
      const headers = this.checkAuthAndGetHeaders();

      return this.httpClient
        .get<TestConfig[]>(`${this.baseUrl}/test-config/user-configs`, {
          headers,
        })
        .pipe(retry(1), catchError(this.handleError.bind(this)));
    } catch (error) {
      return of([]); // Return empty array on auth error
    }
  }

  getTestResult(testResultId: string): Observable<TestResult | null> {
    try {
      const headers = this.checkAuthAndGetHeaders();

      return this.httpClient
        .get<TestResult>(`${this.baseUrl}/test-results/${testResultId}`, {
          headers,
        })
        .pipe(
          catchError((error) => {
            this.handleError(error);
            return of(null);
          })
        );
    } catch (error) {
      return of(null);
    }
  }

  private handleAuthError(): void {
    this.localStorageService.clearAccessToken();
    this.messageService.setMessage('Please sign in to continue', 'error');
    this.router.navigate(['/sign-in']);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('HTTP Error:', error);

    let errorMessage = 'An unknown error occurred';

    if (error.status === 401) {
      this.handleAuthError();
      return throwError(() => new Error('Unauthorized'));
    }

    if (error.status === 403) {
      errorMessage =
        'Access denied. You do not have permission for this action.';
    } else if (error.status === 404) {
      errorMessage = 'The requested resource was not found.';
    } else if (error.status === 500) {
      errorMessage = 'Server error. Please try again later.';
    } else if (error.status === 0) {
      errorMessage =
        'Unable to connect to server. Please check your connection.';
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    this.messageService.setMessage(errorMessage, 'error');
    return throwError(() => error);
  }
}
