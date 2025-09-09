import { Component, output, input } from '@angular/core';
import { TestConfig } from '../../../models/test.model';

@Component({
  selector: 'app-test-instructions',
  imports: [],
  templateUrl: './test-instructions.component.html',
  styleUrl: './test-instructions.component.css',
})
export class TestInstructionsComponent {
  testConfig = input.required<TestConfig>();
  startTest = output<void>();

  isAgreed = false;

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} minutes`;
  }

  onAgreementChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.isAgreed = checkbox.checked;
  }
}
