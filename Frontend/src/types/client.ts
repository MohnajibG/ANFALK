export type ClientGender = "female" | "male";

export interface Client {
  _id: string;

  firstName: string;

  lastName: string;

  phone?: string;

  email?: string;

  gender?: ClientGender;

  loyaltyPoints: number;

  totalSpent: number;

  visitCount: number;

  lastVisit?: string;

  isActive: boolean;

  isDeleted: boolean;

  createdAt?: string;

  updatedAt?: string;
}
