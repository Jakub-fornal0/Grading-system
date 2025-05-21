import { Injectable } from '@angular/core';
import { Grade } from '../../shared/models/grade.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GradeService {
  private grades: Grade[] = [
    {
      id: 'ungr-0e0668e7-e907-4c7d-8af9-a0a4a37f6d82',
      minPercentage: 0,
      symbolicGrade: 'Good',
      descriptiveGrade: `Sed ut perspiciatis unde omnis iste natus error sit voluptatem
        accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
        veritatis et quasi architecto beatae vitae dicta sunt explicabo.`,
    },
    {
      id: 'ungr-2ebf3a08-6246-4005-a2b4-6d8b3d9349c2',
      minPercentage: 50,
      symbolicGrade: 'Very Good',
      descriptiveGrade: '',
    },
  ];

  public getGrades(): Observable<Grade[]> {
    return of(this.grades);
  }

  public getGrade(gradeId: string): Observable<Grade> {
    const grade = this.grades.find((grade: Grade) => grade.id === gradeId);

    if (!grade) {
      return of({} as Grade);
    }

    return of(grade);
  }

  public deleteGrade(gradeId: string): Observable<void> {
    const index: number = this.grades.findIndex(
      (grade: Grade) => grade.id === gradeId
    );

    if (index === -1) {
      return new Observable<void>((observer) => {
        observer.error({ status: 404, message: 'Not found' });
      });
    }

    this.grades.splice(index, 1);

    return of(void 0);
  }
}
