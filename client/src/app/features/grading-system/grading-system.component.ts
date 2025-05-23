import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { GradeListComponent } from './components/grade-list/grade-list.component';
import { Grade } from '../../shared/models/grade.model';
import { GradeDetailComponent } from './components/grade-detail/grade-detail.component';
import { GradeService } from '../../core/services/grade.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { calculateGradeBoundaries } from '../../shared/utils/grading-utils';

@Component({
  selector: 'grading-system',
  standalone: true,
  imports: [GradeListComponent, GradeDetailComponent, MatSnackBarModule],
  templateUrl: './grading-system.component.html',
  styleUrl: './grading-system.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GradingSystemComponent implements OnInit {
  public grades: Grade[] = [];
  public editingGradeId: string | null | undefined = undefined;

  private readonly gradeService = inject(GradeService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.loadGrades();
  }

  public onSelectGrade(gradeId: string): void {
    this.editingGradeId = gradeId;
  }

  public onAddGrade(): void {
    this.editingGradeId = null;
  }

  public onCancel(): void {
    this.editingGradeId = undefined;
  }

  public onSave(): void {
    this.editingGradeId = undefined;
    this.loadGrades();
  }

  public onDeleteGrade(gradeId: string): void {
    this.gradeService
      .deleteGrade(gradeId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.handleDeleteSuccess(),
        error: (err) => this.handleDeleteError(err),
      });
  }

  private loadGrades(): void {
    this.gradeService
      .getGrades()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((grades: Grade[]) => {
        this.grades = [...calculateGradeBoundaries(grades)];
      });
  }

  private handleDeleteSuccess(): void {
    this.snackBar.open('Grade deleted successfully.', 'Ok', {
      duration: 1500,
    });
    this.editingGradeId = undefined;
    this.loadGrades();
  }

  private handleDeleteError(err: any): void {
    const message =
      err?.status === 404
        ? 'The grade was not found.'
        : 'An unexpected error occurred.';
    this.snackBar.open(message, 'Ok');
  }
}
