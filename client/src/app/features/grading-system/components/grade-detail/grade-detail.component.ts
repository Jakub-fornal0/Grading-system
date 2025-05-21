import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { Grade } from '../../../../shared/models/grade.model';
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

@Component({
  selector: 'grade-detail',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './grade-detail.component.html',
  styleUrl: './grade-detail.component.scss',
})
export class GradeDetailComponent {
  @Input() set selectedGradeId(gradeId: string | null) {
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
        });
    } else {
      this.formHeader = 'Add new grade';
      this.form.reset();
    }
  }

  @Output() cancel = new EventEmitter<void>();

  public formHeader: string = '';
  public form: FormGroup = new FormGroup({
    minPercentage: new FormControl<number>(0, [
      Validators.min(0),
      Validators.max(100),
      Validators.required,
    ]),
    symbolicGrade: new FormControl<string>('', [Validators.required]),
    descriptiveGrade: new FormControl<string>(''),
  });

  private readonly gradeService = inject(GradeService);
  private readonly destroyRef = inject(DestroyRef);

  public onSubmit(): void {
    if (this.form.valid) {
      // this.save.emit(this.form.value);
    }
  }

  public onCancel(): void {
    this.cancel.emit();
  }
}
