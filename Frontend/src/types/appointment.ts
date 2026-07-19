/*
====================================
ENUM TYPES
====================================
*/

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export type AppointmentSource = "admin" | "cashier" | "online";

export type EmployeeSpeciality =
  | "Hair"
  | "Nails"
  | "Makeup"
  | "Massage"
  | "Reception";
/*
====================================
RELATIONS
====================================
*/

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
  speciality: EmployeeSpeciality;
}

export interface AppointmentService {
  service: string;
  name: string;
  price: number;
  duration: number;
}

/*
====================================
APPOINTMENT
====================================
*/

export interface Appointment {
  _id: string;

  client: AppointmentClient;
  employee: AppointmentEmployee;

  services: AppointmentService[];

  date: string;
  startTime: string;
  endTime: string;

  totalDuration: number;
  estimatedPrice: number;

  status: AppointmentStatus;
  source: AppointmentSource;

  notes?: string;

  createdAt: string;
  updatedAt: string;
}

/*
====================================
CREATE
====================================
*/

export interface CreateAppointmentPayload {
  client: string;
  employee: string;
  services: string[];

  date: string;
  startTime: string;

  source?: AppointmentSource;
  notes?: string;
}

/*
====================================
UPDATE
====================================
*/

export interface UpdateAppointmentPayload {
  client?: string;
  employee?: string;

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
