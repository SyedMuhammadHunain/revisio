import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TestService } from '../../services/test.service';
import { UserStatistics } from '../../models/test.model';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../../services/local-storage.service';
import { Subject, takeUntil } from 'rxjs';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  selector: 'app-overview',
  imports: [NgxChartsModule, CommonModule, LoaderComponent, LoaderComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css',
})
export class OverviewComponent implements OnInit, OnDestroy {
  private testService = inject(TestService);
  private localStorageService = inject(LocalStorageService);
  private destroy$ = new Subject<void>();

  // Chart data
  numberCardData: any[] = [];
  lineChartData: any[] = [];
  barChartData: any[] = [];

  // State management
  isLoading = true;
  hasError = false;
  errorMessage = '';

  // Data availability flags
  get hasRecentScores(): boolean {
    return (
      this.lineChartData.length > 0 &&
      this.lineChartData[0]?.series?.length > 0 &&
      this.lineChartData[0].series[0].name !== 'Start Taking Tests'
    );
  }

  get hasCategoryData(): boolean {
    return (
      this.barChartData.length > 0 &&
      this.barChartData.some((item) => item.value > 0)
    );
  }

  ngOnInit(): void {
    this.checkAuthAndLoadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkAuthAndLoadData(): void {
    // Check if user is authenticated
    if (!this.localStorageService.isTokenValid()) {
      console.log('User not authenticated, skipping data load');
      this.hasError = true;
      this.errorMessage = 'Please sign in to view your dashboard';
      this.isLoading = false;
      return;
    }

    this.loadUserStatistics();
  }

  private loadUserStatistics(): void {
    this.isLoading = true;
    this.hasError = false;

    this.testService
      .getUserStatistics()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (statistics: UserStatistics) => {
          console.log('Statistics loaded successfully:', statistics);
          this.prepareChartData(statistics);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Failed to load user statistics:', error);
          this.handleLoadError(error);
        },
      });
  }

  private prepareChartData(statistics: UserStatistics): void {
    // Prepare number card data
    this.numberCardData = [
      {
        name: 'Tests Attempted',
        value: statistics.totalAttempted,
        display: statistics.totalAttempted.toString(),
      },
      {
        name: 'Tests Passed',
        value: statistics.totalPassed,
        display: statistics.totalPassed.toString(),
      },
      {
        name: 'Pass Rate',
        value: statistics.passRate,
        display: `${statistics.passRate}%`,
      },
      {
        name: 'Average Score',
        value: statistics.averageScore,
        display: `${statistics.averageScore}%`,
      },
    ];

    // Prepare line chart data for recent test scores
    if (statistics.recentScores.length > 0) {
      this.lineChartData = [
        {
          name: 'Recent Test Scores',
          series: statistics.recentScores
            .map((score, index) => ({
              name:
                score.testName.length > 15
                  ? score.testName.substring(0, 15) + '...'
                  : score.testName,
              value: score.score,
            }))
            .reverse(), // Show chronological order
        },
      ];
    } else {
      this.lineChartData = [
        {
          name: 'Test Scores',
          series: [{ name: 'Start Taking Tests', value: 0 }],
        },
      ];
    }

    // Prepare bar chart data for category averages
    if (statistics.categoryAverages.length > 0) {
      this.barChartData = statistics.categoryAverages.map((category) => ({
        name: category.category,
        value: Math.round(category.average),
      }));
    } else {
      // Show default categories with 0 values for new users
      this.barChartData = [
        { name: 'DSA', value: 0 },
        { name: 'OOP', value: 0 },
        { name: 'PF', value: 0 },
      ];
    }
  }

  private handleLoadError(error: any): void {
    this.isLoading = false;
    this.hasError = true;

    if (error?.status === 401) {
      this.errorMessage = 'Authentication expired. Please sign in again.';
    } else if (error?.status === 0) {
      this.errorMessage =
        'Unable to connect to server. Please check your connection.';
    } else {
      this.errorMessage = 'Unable to load dashboard data. Please try again.';
    }

    // Load default data to prevent blank dashboard
    this.loadDefaultData();
  }

  private loadDefaultData(): void {
    this.numberCardData = [
      { name: 'Tests Attempted', value: 0, display: '0' },
      { name: 'Tests Passed', value: 0, display: '0' },
      { name: 'Pass Rate', value: 0, display: '0%' },
      { name: 'Average Score', value: 0, display: '0%' },
    ];

    this.lineChartData = [
      {
        name: 'Test Scores',
        series: [{ name: 'Start Taking Tests', value: 0 }],
      },
    ];

    this.barChartData = [
      { name: 'DSA', value: 0 },
      { name: 'OOP', value: 0 },
      { name: 'PF', value: 0 },
    ];
  }

  retryLoadData(): void {
    this.checkAuthAndLoadData();
  }
}
