import { Component, input, output, computed } from '@angular/core';

import { CommonModule } from '@angular/common';
import { TestResult } from '../../../models/test.model';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-chart',
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css',
})
export class ChartComponent {
  isChartVisible = input<boolean>(false);
  testResult = input<TestResult | null>(null);
  closeChart = output();

  // Computed properties for chart data
  pieChartData = computed(() => {
    const result = this.testResult();
    if (!result) return [];

    return result.categoryScores.map((category) => ({
      name: category.category,
      value: category.obtainedPoints,
    }));
  });

  barChartData = computed(() => {
    const result = this.testResult();
    if (!result) return [];

    return result.categoryScores.map((category) => ({
      name: category.category,
      value: Math.round(category.percentage * 100) / 100,
    }));
  });

  onClosePopup() {
    this.closeChart.emit();
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
}
