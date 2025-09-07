import { Component } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-overview',
  imports: [NgxChartsModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css',
})
export class OverviewComponent {
  numberCardData = [
    { name: 'Attempted', value: 15 },
    { name: 'Passed', value: 12 },
    { name: 'Pass Rate', value: 80, display: '80%' },
    { name: 'Average Score', value: 72, display: '72%' },
  ];

  lineChartData = [
    {
      name: 'Scores',
      series: [
        { name: 'Test 1', value: 60 },
        { name: 'Test 2', value: 50 },
        { name: 'Test 3', value: 90 },
        { name: 'Test 4', value: 70 },
        { name: 'Test 5', value: 85 },
      ],
    },
  ];

  barChartData = [
    { name: 'Test 1', value: 60 },
    { name: 'Test 2', value: 50 },
    { name: 'Test 3', value: 90 },
  ];
}
