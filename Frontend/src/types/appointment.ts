export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "waiting_payment"
  | "paid"
  | "cancelled"
  | "no_show";

export type AppointmentSource = "admin" | "cashier" | "online";

export type EmployeeSpeciality =
  | "Hair"
  | "Nails"
  | "Makeup"
  | "Massage"
  | "Reception";

export interface AppointmentClient {
  _id: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AppointmentEmployee {
  _id: string;
  firstName: string;
  lastName: string;
  speciality?: EmployeeSpeciality;
}

export interface AppointmentService {
  service: string;
  employee: string | AppointmentEmployee;
  name: string;
  price: number;
  duration: number;
}

export interface Appointment {
  _id: string;

  client: string | AppointmentClient;

  services: AppointmentService[];

  date: string;

  startTime: string;

  endTime: string;

  totalDuration: number;

  estimatedPrice: number;

  status: AppointmentStatus;

  source: AppointmentSource;

  notes?: string;

  createdBy?: string | AppointmentEmployee;

  createdAt: string;

  updatedAt: string;
}

/*
=========================
CREATE
=========================
*/

export interface CreateAppointmentService {
  service: string;

  employee: string;

  name: string;

  price: number;

  duration: number;
}

export interface CreateAppointmentPayload {
  client: string;

  services: CreateAppointmentService[];

  date: string;

  startTime: string;

  endTime: string;

  totalDuration: number;

  estimatedPrice: number;

  source?: AppointmentSource;

  notes?: string;
}

/*
=========================
UPDATE
=========================
*/

export interface UpdateAppointmentPayload {
  client?: string;

  services?: AppointmentService[];

  date?: string;

  startTime?: string;

  endTime?: string;

  totalDuration?: number;

  estimatedPrice?: number;

  status?: AppointmentStatus;

  source?: AppointmentSource;

  notes?: string;
}
