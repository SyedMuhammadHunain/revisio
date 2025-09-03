import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

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

@Component({
  selector: 'app-assessment',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './assessment.component.html',
  styleUrl: './assessment.component.css',
})
export class AssessmentComponent {
  categories = ['DSA', 'OOP', 'PF'];

  private questionService = inject(QuestionService);
  private messageService = inject(MessageService);

  assessmentForm = new FormGroup({
    testName: new FormControl('', { validators: [Validators.required] }),
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
  }

  private addCategoryCheckboxes() {
    this.categories.forEach(() => {
      const control = new FormControl(false);
      (this.assessmentForm.controls.categories as FormArray).push(control);
    });
  }

  get categoriesFormArray() {
    return this.assessmentForm.get('categories') as FormArray<
      FormControl<boolean>
    >;
  }

  onSubmitAssessmentForm() {
    if (this.assessmentForm.invalid) {
      this.messageService.setMessage(
        'The form is Invalid. Please try again',
        'error'
      );
      return;
    }

    const selectedCategories = this.categoriesFormArray.value
      .map((checked: boolean, i: number) =>
        checked ? this.categories[i] : null
      )
      .filter((v: string | null) => v !== null);

    console.log('Selected Categories:', selectedCategories);

    // Your Fetching Logic
  }
}
