import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TestResult } from '../../../models/test.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-test-completion',
  imports: [CommonModule],
  templateUrl: './test-completion.component.html',
  styleUrl: './test-completion.component.css',
})
export class TestCompletionComponent implements OnInit {
  testResult!: TestResult;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Get test result from navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['testResult']) {
      this.testResult = navigation.extras.state['testResult'];
    } else {
      // Fallback: redirect to dashboard if no test result
      this.router.navigate(['/dashboard/overview']);
    }
  }

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }

  viewDetailedResults(): void {
    this.router.navigate(['/dashboard/test-result']);
  }

  returnToDashboard(): void {
    this.router.navigate(['/dashboard/overview']);
  }

  takeAnotherTest(): void {
    this.router.navigate(['/dashboard/assessment']);
  }
}
