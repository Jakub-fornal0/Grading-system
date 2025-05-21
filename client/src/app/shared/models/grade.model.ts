export interface Grade {
  id: string;
  minPercentage: number;
  maxPercentage?: number;
  symbolicGrade: string;
  descriptiveGrade?: string;
}
