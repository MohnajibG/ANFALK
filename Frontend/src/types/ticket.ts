export type PaymentMethod = "cash" | "card" | "transfer";

export type TicketStatus = "paid" | "cancelled";

export interface TicketUser {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface TicketItem {
  service: string;
  name: string;
  originalPrice: number;
  finalPrice: number;
  duration: number;
}

export interface TicketClient {
  _id: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface TicketEmployee {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface TicketAppointment {
  _id: string;
  date?: string;
  status?: string;
}

export interface Ticket {
  _id: string;
  ticketNumber: string;

  client: string | TicketClient;

  employee: string | TicketEmployee;

  appointment?: string | TicketAppointment;

  items: TicketItem[];

  subtotal: number;

  discount: number;

  total: number;

  paymentMethod: PaymentMethod;

  status: TicketStatus;

  notes?: string;

  createdBy: string | TicketUser;

  cancelledBy?: string | TicketUser;

  cancelledAt?: string;

  createdAt: string;

  updatedAt: string;
}

export interface CreateTicketService {
  service: string;
  finalPrice: number;
}

export interface CreateTicketPayload {
  client: string;
  employee: string;
  appointment?: string;
  services: CreateTicketService[];
  discount?: number;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface CompleteAppointmentPayload {
  client: string;
  employee: string;
  services: CreateTicketService[];
  discount?: number;
  paymentMethod: PaymentMethod;
  notes?: string;
}
