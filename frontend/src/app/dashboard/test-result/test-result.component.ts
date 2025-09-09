import { CommonModule } from '@angular/common';

import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { ChartComponent } from './chart/chart.component';
import { TestService } from '../../services/test.service';
import { TestResult } from '../../models/test.model';

@Component({
  selector: 'app-test-result',
  imports: [CommonModule, ChartComponent],
  templateUrl: './test-result.component.html',
  styleUrl: './test-result.component.css',
})
export class TestResultComponent implements OnInit {
  private testService = inject(TestService);

  testResults: TestResult[] = [];
  isLoading = true;
  isChartVisible = false;
  selectedTestResult: TestResult | null = null;

  ngOnInit(): void {
    this.loadTestResults();
  }

  private loadTestResults(): void {
    this.testService.getUserTestResults().subscribe({
      next: (results) => {
        this.testResults = results;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load test results:', error);
        this.isLoading = false;
      },
    });
  }

  onClickAnalytics(testResult: TestResult): void {
    this.selectedTestResult = testResult;
    this.isChartVisible = true;
  }

  onCloseChart(): void {
    this.isChartVisible = false;
    this.selectedTestResult = null;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  getUniqueCategories(testResult: TestResult): string[] {
    const categories = testResult.categoryScores.map((score) => score.category);
    return [...new Set(categories)];
  }

  getPassedTests(): number {
    return this.testResults.filter((result) => result.status === 'Pass').length;
  }

  getAverageScore(): number {
    if (this.testResults.length === 0) return 0;

    const totalScore = this.testResults.reduce(
      (sum, result) => sum + result.percentage,
      0
    );
    return Math.round(totalScore / this.testResults.length);
  }

  getPassRate(): number {
    if (this.testResults.length === 0) return 0;

    const passedTests = this.getPassedTests();
    return Math.round((passedTests / this.testResults.length) * 100);
  }
}
