export type PaymentMethod = "cash" | "card" | "transfer";

export type TicketStatus = "waiting_payment" | "paid" | "cancelled";

export interface TicketUser {
  _id: string;

  firstName: string;

  lastName: string;
}

export interface TicketEmployee {
  _id: string;

  firstName: string;

  lastName: string;

  speciality?: string;
}

export interface TicketClient {
  _id: string;

  firstName: string;

  lastName: string;

  phone?: string;
}

/**
 * Prestation dans un ticket
 *
 * Exemple:
 * Massage -> Sarah
 * Coupe -> Sophia
 */
export interface TicketItem {
  service?: string;

  name: string;

  employee?: string | TicketEmployee;

  originalPrice: number;

  finalPrice: number;

  duration?: number;
}

export interface TicketAppointment {
  _id: string;

  date?: string;

  startTime?: string;

  endTime?: string;

  status?: string;
}

export interface Ticket {
  _id: string;

  ticketNumber: string;

  client: string | TicketClient;

  appointment?: string | TicketAppointment;

  items: TicketItem[];

  subtotal: number;

  discount: number;

  total: number;

  paymentMethod?: PaymentMethod;

  status: TicketStatus;

  notes?: string;

  createdBy: string | TicketUser;

  cancelledBy?: string | TicketUser;

  cancelledAt?: string;

  createdAt: string;

  updatedAt: string;
}

/**
 * Création ticket manuel
 *
 * Vente sans réservation
 */
export interface CreateTicketItem {
  service?: string;

  name: string;

  employee?: string;

  originalPrice: number;

  finalPrice: number;

  duration?: number;
}

export interface CreateTicketPayload {
  client: string;

  appointment?: string;

  items: CreateTicketItem[];

  discount?: number;

  paymentMethod?: PaymentMethod;

  notes?: string;
}

/**
 * Modifier un ticket ouvert
 *
 * POS
 */
export interface UpdateTicketPayload {
  items?: CreateTicketItem[];

  discount?: number;

  notes?: string;
}

/**
 * Paiement
 */
export interface PayTicketPayload {
  paymentMethod: PaymentMethod;
}
