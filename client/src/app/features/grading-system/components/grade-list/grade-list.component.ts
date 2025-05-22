import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Grade } from '../../../../shared/models/grade.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'grade-list',
  standalone: true,
  imports: [MatListModule, MatIconModule, MatButtonModule],
  templateUrl: './grade-list.component.html',
  styleUrl: './grade-list.component.scss',
})
export class GradeListComponent {
  @Input() grades: Grade[] = [];
  @Input() selectedGradeId: string | null = null;

  @Output() selectGrade = new EventEmitter<string>();
  @Output() addGrade = new EventEmitter<void>();
  @Output() deleteGrade = new EventEmitter<string>();

  private readonly dialog = inject(MatDialog);

  public onSelectGrade(gradeId: string): void {
    this.selectGrade.emit(gradeId);
  }

  public onDeleteGrade(gradeId: string, event: Event): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Deleting grade',
        content: 'Are you sure you want to delete the grade?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.deleteGrade.emit(gradeId);
      }
    });
  }

  public onAddGrade(): void {
    this.addGrade.emit();
  }
}
