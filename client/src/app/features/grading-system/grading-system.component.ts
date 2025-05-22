import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { GradeListComponent } from './components/grade-list/grade-list.component';
import { Grade } from '../../shared/models/grade.model';
import { GradeDetailComponent } from './components/grade-detail/grade-detail.component';
import { GradeService } from '../../core/services/grade.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'grading-system',
  standalone: true,
  imports: [GradeListComponent, GradeDetailComponent, MatSnackBarModule],
  templateUrl: './grading-system.component.html',
  styleUrl: './grading-system.component.scss',
})
export class GradingSystemComponent implements OnInit {
  public selectedGradeId: string | null = null;
  public isEditMode: boolean = false;
  public grades: Grade[] = [];

  private readonly gradeService = inject(GradeService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.getGrades();
  }

  public onGradeSelected(gradeId: string): void {
    this.selectedGradeId = gradeId;
    this.isEditMode = true;
  }

  public onAddGrade(): void {
    this.selectedGradeId = null;
    this.isEditMode = true;
  }

  public onCancel(): void {
    this.selectedGradeId = null;
    this.isEditMode = false;
  }

  public onSave(): void {
    this.selectedGradeId = null;
    this.isEditMode = false;
    this.getGrades();
  }

  public onDeleteGrade(gradeId: string): void {
    this.gradeService
      .deleteGrade(gradeId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.snackBar.open('Grade deleted successfully.', 'Ok', {
            duration: 1500,
          });
          this.getGrades();
          this.isEditMode = false;
        },
        error: (err) => {
          if (err.status === 404) {
            this.snackBar.open('The grade not found.', 'Ok');
          } else {
            this.snackBar.open('An unexpected error occurred.', 'Ok');
          }
        },
      });
  }

  private getGrades(): void {
    this.gradeService
      .getGrades()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((grades: Grade[]) => {
        const sortedGrades: Grade[] = grades.sort(
          (a: Grade, b: Grade) => a.minPercentage - b.minPercentage
        );

        const gradesWithMaxPercentage: Grade[] = sortedGrades.map(
          (grade, index, array) => {
            const nextMinPercentage: number = array[index + 1]?.minPercentage;
            return {
              ...grade,
              maxPercentage: nextMinPercentage ? nextMinPercentage - 1 : 100,
            };
          }
        );

        this.grades = gradesWithMaxPercentage;
      });
  }
}
