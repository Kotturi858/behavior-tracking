export type MoneyStatus = 'paid' | 'unpaid';

export interface MoneyRecord {
  id: string;
  personName: string;
  amount: number;
  date: string;
  status: MoneyStatus;
  notes?: string;
}
