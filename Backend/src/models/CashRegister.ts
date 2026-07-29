import { Schema, model, Document, Types } from "mongoose";

export type CashRegisterStatus = "open" | "closed";

export interface ICashRegister extends Document {
  cashier: Types.ObjectId;
  date: string; // "YYYY-MM-DD" -> garantit 1 session/jour/caissier
  openedAt: Date;
  closedAt?: Date;
  openingAmount: number;
  closingAmount?: number;
  expectedAmount?: number;
  difference?: number;
  status: CashRegisterStatus;
  totals: {
    cash: number;
    card: number;
    transfer: number;
    ticketsCount: number;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const cashRegisterSchema = new Schema<ICashRegister>(
  {
    cashier: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },

    openedAt: { type: Date, required: true, default: Date.now },
    closedAt: { type: Date },

    openingAmount: { type: Number, required: true, min: 0 },
    closingAmount: { type: Number },
    expectedAmount: { type: Number },
    difference: { type: Number },

    status: { type: String, enum: ["open", "closed"], default: "open" },

    totals: {
      cash: { type: Number, default: 0 },
      card: { type: Number, default: 0 },
      transfer: { type: Number, default: 0 },
      ticketsCount: { type: Number, default: 0 },
    },

    notes: { type: String, default: "", trim: true },
  },
  { timestamps: true },
);

// Une seule session par jour et par caissier
cashRegisterSchema.index({ cashier: 1, date: 1 }, { unique: true });

export default model<ICashRegister>("CashRegister", cashRegisterSchema);
