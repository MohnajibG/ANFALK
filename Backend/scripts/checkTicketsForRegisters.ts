import mongoose from "mongoose";
import { env } from "../src/config/env";
import Ticket from "../src/models/Ticket";

const run = async () => {
  await mongoose.connect(env.MONGO_URI);
  for (const id of ["6a6a8029e1e8c05e58251f24", "6a6d127865a2906f416a57bf"]) {
    const tickets = await Ticket.find({ cashRegister: id });
    console.log(id, "->", tickets.length, "tickets:", tickets.map(t => ({ status: t.status, total: t.total, paymentMethod: t.paymentMethod })));
  }
  await mongoose.disconnect();
};

run();
