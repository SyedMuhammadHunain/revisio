import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';

import {
  atLeastOneSelected,
  minQuestionsValidator,
} from '../../auth/sign-up/validators';

import { QuestionService } from '../../services/question.service';
import { MessageService } from '../../services/message.service';
import { TestService } from '../../services/test.service';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-assessment',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './assessment.component.html',
  styleUrl: './assessment.component.css',
})
export class AssessmentComponent {
  categories = ['DSA', 'OOP', 'PF'];

  private testService = inject(TestService);
  private messageService = inject(MessageService);
  private localStorageService = inject(LocalStorageService);
  private router = inject(Router);

  isSubmitting = false;

  assessmentForm = new FormGroup({
    testName: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ],
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    numOfQuestions: new FormControl('', {
      validators: [Validators.required, minQuestionsValidator],
    }),
    categories: new FormArray<FormControl<boolean>>([], {
      validators: [atLeastOneSelected],
    }),
  });

  get testnameInvalid() {
    return (
      this.assessmentForm.controls.testName.touched &&
      this.assessmentForm.controls.testName.invalid &&
      this.assessmentForm.controls.testName.dirty
    );
  }

  get emailInvalid() {
    return (
      this.assessmentForm.controls.email.touched &&
      this.assessmentForm.controls.email.invalid &&
      this.assessmentForm.controls.email.dirty
    );
  }

  get numberQuestionsInvalid() {
    return (
      this.assessmentForm.controls.numOfQuestions.touched &&
      this.assessmentForm.controls.numOfQuestions.invalid &&
      this.assessmentForm.controls.numOfQuestions.dirty
    );
  }

  ngOnInit() {
    this.addCategoryCheckboxes();
    this.prefillUserEmail();
  }

  private addCategoryCheckboxes() {
    this.categories.forEach(() => {
      const control = new FormControl(false);
      (this.assessmentForm.controls.categories as FormArray).push(control);
    });
  }

  private prefillUserEmail() {
    // Get user email from token or user info if available
    const token = this.localStorageService.getAccessToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.email) {
          this.assessmentForm.patchValue({ email: payload.email });
        }
      } catch (error) {
        console.log('Could not parse token for email');
      }
    }
  }

  get categoriesFormArray() {
    return this.assessmentForm.get('categories') as FormArray<
      FormControl<boolean>
    >;
  }

  getCategoryDescription(category: string): string {
    const descriptions = {
      DSA: 'Data Structures & Algorithms - Arrays, Trees, Sorting, Searching, Time Complexity',
      OOP: 'Object-Oriented Programming - Classes, Inheritance, Polymorphism, Encapsulation',
      PF: 'Programming Fundamentals - Functions, Loops, Conditionals, Recursion',
    };
    return descriptions[category as keyof typeof descriptions] || '';
  }

  onSubmitAssessmentForm() {
    if (this.assessmentForm.invalid) {
      this.messageService.setMessage(
        'Please fill in all required fields correctly.',
        'error'
      );
      this.markFormGroupTouched(this.assessmentForm);
      return;
    }

    this.isSubmitting = true;

    const selectedCategories = this.categoriesFormArray.value
      .map((checked: boolean, i: number) =>
        checked ? this.categories[i] : null
      )
      .filter((v: string | null) => v !== null) as string[];

    const testConfigData = {
      testName: this.assessmentForm.value.testName as string,
      email: this.assessmentForm.value.email as string,
      numOfQuestions: Number(this.assessmentForm.value.numOfQuestions),
      categories: selectedCategories,
    };

    this.testService.createTestConfig(testConfigData).subscribe({
      next: (response) => {
        console.log('Test configuration created:', response);
        // Navigate to test instructions
        this.router.navigate(['/test-instructions', response.testConfigId]);
      },
      error: (error) => {
        console.error('Test configuration failed:', error);
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach((ctrl) => {
          ctrl.markAsTouched();
        });
      }
    });
  }
}
