import { Component, input, output } from '@angular/core';

import { CommonModule } from '@angular/common';

import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-chart',
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css',
})
export class ChartComponent {
  isChartVisible = input<boolean>(false);
  closeChart = output();

  rawData = [
    { name: 'DSA', value: 60 },
    { name: 'OOP', value: 70 },
    { name: 'PF', value: 30 },
  ];

  onClosePopup() {
    this.closeChart.emit();
  }
}
