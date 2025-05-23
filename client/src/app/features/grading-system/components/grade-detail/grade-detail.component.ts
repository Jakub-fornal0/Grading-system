import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import {
  Grade,
  GradeCreate,
  GradeModify,
} from '../../../../shared/models/grade.model';
import {
  FormBuilder,
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
import { GradeErrorCode } from '../../../../shared/constants/grade-error-codes';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GradeDetailComponent {
  @Input() set selectedGradeId(gradeId: string | null) {
    this._selectedGradeId = gradeId;
    if (gradeId) {
      this.loadGrade(gradeId);
    } else {
      this.resetForm();
    }
  }
  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  public form: FormGroup;
  private _selectedGradeId: string | null = null;
  private readonly formBuilder = inject(FormBuilder);
  private readonly gradeService = inject(GradeService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly snackBar = inject(MatSnackBar);

  constructor() {
    this.form = this.formBuilder.group({
      minPercentage: [
        0,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      symbolicGrade: ['', Validators.required],
      descriptiveGrade: [{ value: '', disabled: true }],
    });
  }

  public get formHeader(): string {
    return this._selectedGradeId ? 'Edit grade' : 'Add new grade';
  }

  public onSubmit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const grade: GradeModify = this.form.getRawValue();

    if (this._selectedGradeId) {
      this.saveGrade(() =>
        this.gradeService.updateGrade(this._selectedGradeId!, grade)
      );
    } else {
      const gradeCreate: GradeCreate = {
        minPercentage: grade.minPercentage ?? 0,
        symbolicGrade: grade.symbolicGrade ?? '',
      };

      this.saveGrade(() => this.gradeService.addGrade(gradeCreate));
    }
  }

  private saveGrade(requestFn: () => any): void {
    requestFn()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.snackBar.open('Grade saved successfully.', 'OK', {
            duration: 2000,
          });
          this.save.emit();
        },
        error: (err: any) => this.handleError(err),
      });
  }

  private handleError(err: any): void {
    const conflictCode = err?.errorCode;
    const status = err?.status;

    if (status === 404) {
      this.snackBar.open('The grade was not found.', 'OK');
    } else if (conflictCode === GradeErrorCode.ConflictingPercentage) {
      this.form.get('minPercentage')?.setErrors({ conflict: true });
    } else {
      this.snackBar.open('An unexpected error occurred.', 'OK');
    }
  }

  private loadGrade(gradeId: string): void {
    this.gradeService
      .getGrade(gradeId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((grade: Grade) => {
        this.form.reset();
        this.form.patchValue(grade);
        this.form.get('descriptiveGrade')?.enable();
      });
  }

  private resetForm(): void {
    this.form.reset();
    this.form.get('descriptiveGrade')?.disable();
  }

  public onCancel(): void {
    this.cancel.emit();
  }
}
