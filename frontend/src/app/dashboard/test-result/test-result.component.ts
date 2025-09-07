import { CommonModule } from '@angular/common';

import { Component } from '@angular/core';
import { ChartComponent } from './chart/chart.component';

interface TestResult {
  testName: string;
  score: number;
  status: 'Pass' | 'Fail';
}

@Component({
  selector: 'app-test-result',
  imports: [CommonModule, ChartComponent],
  templateUrl: './test-result.component.html',
  styleUrl: './test-result.component.css',
})
export class TestResultComponent {
  testResults: TestResult[] = [
    { testName: 'OOP Basics', score: 85, status: 'Pass' },
    { testName: 'DSA Arrays', score: 45, status: 'Fail' },
    { testName: 'PF Functions', score: 72, status: 'Pass' },
  ];
}
