import { Schema, model, Document, Types } from "mongoose";

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export type AppointmentSource = "admin" | "cashier" | "online";

export interface IAppointment extends Document {
  client: Types.ObjectId;

  employee: Types.ObjectId;

  services: {
    service: Types.ObjectId;

    name: string;

    price: number;

    duration: number;
  }[];

  date: Date;

  startTime: string;

  endTime: string;

  totalDuration: number;

  estimatedPrice: number;

  status: AppointmentStatus;

  source: AppointmentSource;

  notes?: string;

  createdBy: Types.ObjectId;

  updatedBy?: Types.ObjectId;

  cancelledBy?: Types.ObjectId;

  cancelledAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    employee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    services: [
      {
        service: {
          type: Schema.Types.ObjectId,
          ref: "Service",
          required: true,
        },

        name: {
          type: String,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },

        duration: {
          type: Number,
          required: true,
        },
      },
    ],

    date: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    totalDuration: {
      type: Number,
      required: true,
    },

    estimatedPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled", "no_show"],
      default: "pending",
    },

    source: {
      type: String,
      enum: ["admin", "cashier", "online"],
      default: "admin",
    },

    notes: {
      type: String,
      default: "",
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    cancelledBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    cancelledAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Recherche planning rapide
appointmentSchema.index({
  date: 1,
  employee: 1,
});

// Recherche rendez-vous client
appointmentSchema.index({
  client: 1,
  date: -1,
});

export default model<IAppointment>("Appointment", appointmentSchema);
