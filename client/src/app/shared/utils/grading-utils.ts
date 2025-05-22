import { Grade } from '../models/grade.model';

export function calculateGradeBoundaries(grades: Grade[]): Grade[] {
  return grades
    .sort((a: Grade, b: Grade) => a.minPercentage - b.minPercentage)
    .map((grade, index, array) => {
      const nextMinPercentage: number = array[index + 1]?.minPercentage;
      return {
        ...grade,
        maxPercentage: nextMinPercentage ? nextMinPercentage - 1 : 100,
      };
    });
}
