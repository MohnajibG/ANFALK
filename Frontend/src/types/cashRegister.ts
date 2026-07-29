export type CashRegisterStatus = "open" | "closed";

export interface CashRegisterCashier {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface CashRegisterTotals {
  cash: number;
  card: number;
  transfer: number;
  ticketsCount: number;
}

export interface CashRegister {
  _id: string;
  cashier: string | CashRegisterCashier;
  date: string;
  openedAt: string;
  closedAt?: string;
  openingAmount: number;
  closingAmount?: number;
  expectedAmount?: number;
  difference?: number;
  status: CashRegisterStatus;
  totals: CashRegisterTotals;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OpenCashRegisterPayload {
  openingAmount: number;
}

export interface CloseCashRegisterPayload {
  closingAmount: number;
  notes?: string;
}
