import { Decimal } from '@prisma/client/runtime/library';

export class SubcribtionApi {
  name: string;
  price: Decimal;
  durationDays: number;
  priorityNumber: number;
}

export class ChangeSubcribtion {
  id: number;
  name: string;
  price: Decimal;
  durationDays: number;
  priorityNumber: number;
}
