import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-chart',
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css',
})
export class ChartComponent {
  private rawData = [
    { name: 'DSA', value: 40 },
    { name: 'OOP', value: 70 },
    { name: 'PF', value: 30 },
  ];

  chartData = this.rawData.map(item => ({
    name: `${item.name} - ${item.value >= 50 ? 'Pass' : 'Fail'}`,
    value: item.value
  }));

  colorScheme: Color = {
  name: 'custom',
  selectable: true,
  group: ScaleType.Ordinal,
  domain: ['#cacacaff', '#989898ff', '#616161ff']
};
}
