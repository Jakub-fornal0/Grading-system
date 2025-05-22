import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import {
  ConflictResponse,
  Grade,
  GradeCreate,
} from '../../../../shared/models/grade.model';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GradeService } from '../../../../core/services/grade.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'grade-detail',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CdkTextareaAutosize,
    MatSnackBarModule,
  ],
  templateUrl: './grade-detail.component.html',
  styleUrl: './grade-detail.component.scss',
})
export class GradeDetailComponent {
  @Input() set selectedGradeId(gradeId: string | null) {
    this._selectedGradeId = gradeId;
    if (gradeId) {
      this.gradeService
        .getGrade(gradeId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((grade: Grade) => {
          this.formHeader = 'Edit grade';
          this.form.reset();
          this.form.patchValue({
            ...grade,
          });
          this.form.get('descriptiveGrade')?.enable();
        });
    } else {
      this.formHeader = 'Add new grade';
      this.form.reset();
      this.form.get('descriptiveGrade')?.disable();
    }
  }

  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  public formHeader: string = '';
  public minPercentageError: string = '';
  public form: FormGroup = new FormGroup({
    minPercentage: new FormControl<number>(0, [
      Validators.min(0),
      Validators.max(100),
      Validators.required,
    ]),
    symbolicGrade: new FormControl<string>('', [Validators.required]),
    descriptiveGrade: new FormControl<string>(''),
  });

  private _selectedGradeId: string | null = null;
  private readonly gradeService = inject(GradeService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly snackBar = inject(MatSnackBar);

  public onSubmit(): void {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      const grade: GradeCreate = this.form.value as GradeCreate;

      if (this._selectedGradeId) {
        this.gradeService
          .updateGrade(this._selectedGradeId, grade)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.snackBar.open('Grade updated successfully.', 'OK', {
                duration: 2000,
              });
              this.save.emit();
            },
            error: (err) => {
              if (err.status === 404) {
                this.snackBar.open('The grade not found.', 'Ok');
              } else {
                this.snackBar.open('An unexpected error occurred.', 'Ok');
              }
            },
          });
      } else {
        this.gradeService
          .addGrade(grade)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.snackBar.open('Grade added successfully.', 'OK', {
                duration: 2000,
              });
              this.save.emit();
            },
            error: (err: ConflictResponse) => {
              if (err.errorCode === 'AS014') {
                this.minPercentageError = err.errorMessage;
                this.form.get('minPercentage')?.setErrors({});
              } else {
                this.snackBar.open('Unexpected error occurred.', 'OK');
              }
            },
          });
      }
    }
  }

  public onCancel(): void {
    this.cancel.emit();
  }
}
