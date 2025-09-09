import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { TestInstructionsComponent } from '../test-instructions/test-instructions.component';
import { TestService } from '../../../services/test.service';
import { TestConfig } from '../../../models/test.model';

@Component({
  selector: 'app-test-instructions-route',
  imports: [CommonModule, TestInstructionsComponent],
  templateUrl: './test-instructions-route.component.html',
  styleUrl: './test-instructions-route.component.css',
})
export class TestInstructionsRouteComponent implements OnInit {
  private testService = inject(TestService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  testConfig: TestConfig | null = null;
  isLoading = true;
  error: string | null = null;

  ngOnInit(): void {
    const testConfigId = this.activatedRoute.snapshot.params['testConfigId'];
    if (testConfigId) {
      this.loadTestConfig(testConfigId);
    } else {
      this.error = 'No test configuration ID provided';
      this.isLoading = false;
    }
  }

  private loadTestConfig(testConfigId: string): void {
    // For now, we'll start the test directly to get the config
    // In a real app, you might want a separate endpoint to get config without starting
    this.testService.startTest(testConfigId).subscribe({
      next: (response) => {
        this.testConfig = response.testConfig;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load test config:', error);
        this.error = 'Failed to load test configuration. Please try again.';
        this.isLoading = false;
      },
    });
  }

  onStartTest(): void {
    if (this.testConfig) {
      this.router.navigate(['/test-environment', this.testConfig._id]);
    }
  }

  goBackToDashboard(): void {
    this.router.navigate(['/dashboard/assessment']);
  }
}
