import { CommonModule } from '@angular/common';
import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { TestService } from '../../../services/test.service';
import { MessageService } from '../../../services/message.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
  TestConfig,
  QuestionWithoutAnswer,
  Question,
} from '../../../models/test.model';

@Component({
  selector: 'app-test-environment',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './test-environment.component.html',
  styleUrls: ['./test-environment.component.css'],
})
export class TestEnvironmentComponent implements OnInit, OnDestroy {
  private testService = inject(TestService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  testConfig: TestConfig | null = null;
  questions: Question[] = [];
  currentQuestionIndex = 0;
  answers: Map<string, number> = new Map();
  startTime: Date = new Date();
  timeRemaining = 0;

  warningCount = 0;
  showWarning = false;
  showSubmitModal = false;

  private timer: any;
  private documentHidden = false;

  answerForm = new FormGroup({
    selectedAnswer: new FormControl<number | null>(null),
  });

  ngOnInit(): void {
    const testConfigId = this.activatedRoute.snapshot.params['testConfigId'];
    if (testConfigId) {
      this.startTestSession(testConfigId);
    }

    // Add visibility change listener for cheating detection
    document.addEventListener(
      'visibilitychange',
      this.handleVisibilityChange.bind(this)
    );
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
    document.removeEventListener(
      'visibilitychange',
      this.handleVisibilityChange.bind(this)
    );
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnload(event: BeforeUnloadEvent): void {
    event.preventDefault();
    event.returnValue =
      'Are you sure you want to leave? Your test progress will be lost.';
  }

  @HostListener('window:blur')
  onWindowBlur(): void {
    this.handleCheatingDetection('Window lost focus');
  }

  @HostListener('window:focus')
  onWindowFocus(): void {
    // Window regained focus
  }

  private handleVisibilityChange(): void {
    if (document.hidden && !this.documentHidden) {
      this.documentHidden = true;
      this.handleCheatingDetection('Tab switched or browser minimized');
    } else if (!document.hidden) {
      this.documentHidden = false;
    }
  }

  private handleCheatingDetection(reason: string): void {
    if (this.showWarning || this.showSubmitModal) return;

    this.warningCount++;
    this.showWarning = true;

    console.log(`Cheating detected: ${reason}. Warning #${this.warningCount}`);

    if (this.warningCount >= 2) {
      // Auto-submit after showing warning
      setTimeout(() => {
        this.forceSubmitTest();
      }, 3000);
    }
  }

  private startTestSession(testConfigId: string): void {
    this.testService.startTest(testConfigId).subscribe({
      next: (response) => {
        this.testConfig = response.testConfig;
        this.questions = response.questions;
        this.timeRemaining = this.testConfig.duration;
        this.startTime = new Date();
        this.startTimer();
        this.loadCurrentQuestion();
      },
      error: (error) => {
        console.error('Failed to start test:', error);
        this.router.navigate(['/dashboard/assessment']);
      },
    });
  }

  private startTimer(): void {
    this.timer = setInterval(() => {
      this.timeRemaining--;
      if (this.timeRemaining <= 0) {
        this.timeUp();
      }
    }, 1000);
  }

  private timeUp(): void {
    this.messageService.setMessage(
      'Time is up! Submitting your test automatically.',
      'error'
    );
    this.submitTest(true);
  }

  get currentQuestion(): QuestionWithoutAnswer | null {
    return this.questions[this.currentQuestionIndex] || null;
  }

  get selectedAnswer(): number | null {
    if (!this.currentQuestion) return null;
    return this.answers.get(this.currentQuestion._id) ?? null;
  }

  private loadCurrentQuestion(): void {
    if (this.currentQuestion) {
      const savedAnswer = this.answers.get(this.currentQuestion._id);
      this.answerForm.patchValue({
        selectedAnswer: savedAnswer ?? null,
      });
    }
  }

  selectAnswer(answerIndex: number): void {
    if (!this.currentQuestion) return;

    this.answers.set(this.currentQuestion._id, answerIndex);
    this.answerForm.patchValue({ selectedAnswer: answerIndex });
  }

  clearAnswer(): void {
    if (!this.currentQuestion) return;

    this.answers.delete(this.currentQuestion._id);
    this.answerForm.patchValue({ selectedAnswer: null });
  }

  goToQuestion(index: number): void {
    if (index >= 0 && index < this.questions.length) {
      this.currentQuestionIndex = index;
      this.loadCurrentQuestion();
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.goToQuestion(this.currentQuestionIndex - 1);
    }
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.goToQuestion(this.currentQuestionIndex + 1);
    }
  }

  isQuestionAttempted(index: number): boolean {
    const question = this.questions[index];
    return question ? this.answers.has(question._id) : false;
  }

  getAttemptedCount(): number {
    return this.answers.size;
  }

  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index); // A, B, C, D...
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs
        .toString()
        .padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  showSubmitConfirmation(): void {
    this.showSubmitModal = true;
  }

  hideSubmitConfirmation(): void {
    this.showSubmitModal = false;
  }

  dismissWarning(): void {
    this.showWarning = false;
  }

  forceSubmitTest(): void {
    this.submitTest(true);
  }

  submitTest(forced = false): void {
    if (this.timer) {
      clearInterval(this.timer);
    }

    const endTime = new Date();
    const answersArray = Array.from(this.answers.entries()).map(
      ([questionId, selectedAnswer]) => ({
        questionId,
        selectedAnswer,
      })
    );

    const submitData = {
      testConfigId: this.testConfig!._id,
      answers: answersArray,
      startTime: this.startTime,
      endTime,
      cheatingDetected: this.warningCount > 0,
      warningsGiven: this.warningCount,
    };

    this.testService.submitTest(submitData).subscribe({
      next: (response) => {
        this.router.navigate(['/dashboard/test-completion'], {
          state: { testResult: response.testResult },
        });
      },
      error: (error) => {
        console.error('Failed to submit test:', error);
      },
    });
  }
}
