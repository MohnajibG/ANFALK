import mongoose, { Schema } from "mongoose";

const ticketSchema = new Schema(
  {
    ticketNumber: {
      type: String,
      unique: true,
      required: true,
    },

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

    appointment: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
    },

    items: [
      {
        service: {
          type: Schema.Types.ObjectId,
          ref: "Service",
        },

        name: {
          type: String,
          required: true,
        },

        originalPrice: {
          type: Number,
          required: true,
        },

        finalPrice: {
          type: Number,
          required: true,
        },

        duration: {
          type: Number,
        },
      },
    ],

    subtotal: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,

      enum: ["cash", "card", "transfer"],

      required: true,
    },

    status: {
      type: String,

      enum: ["paid", "cancelled"],

      default: "paid",
    },

    notes: String,

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    cancelledBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    cancelledAt: Date,
  },

  {
    timestamps: true,
  },
);

export default mongoose.model("Ticket", ticketSchema);
