import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Grade } from '../../../../shared/models/grade.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { take } from 'rxjs';

@Component({
  selector: 'grade-list',
  standalone: true,
  imports: [MatListModule, MatIconModule, MatButtonModule],
  templateUrl: './grade-list.component.html',
  styleUrl: './grade-list.component.scss',
})
export class GradeListComponent {
  @Input() grades: Grade[] = [];
  @Input() selectedGradeId: string | null | undefined = undefined;

  @Output() selectGrade = new EventEmitter<string>();
  @Output() addGrade = new EventEmitter<void>();
  @Output() deleteGrade = new EventEmitter<string>();

  private readonly dialog = inject(MatDialog);

  public emitSelectGrade(gradeId: string): void {
    this.selectGrade.emit(gradeId);
  }

  public emitAddGrade(): void {
    this.addGrade.emit();
  }

  public confirmAndEmitDeleteGrade(gradeId: string, event: MouseEvent): void {
    event.stopPropagation();

    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'Deleting grade',
          content: 'Are you sure you want to delete the grade?',
        },
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.deleteGrade.emit(gradeId);
        }
      });
  }
}
