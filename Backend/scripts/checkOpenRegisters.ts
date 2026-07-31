import mongoose from "mongoose";
import { env } from "../src/config/env";
import CashRegister from "../src/models/CashRegister";
import "../src/models/User";

const run = async () => {
  await mongoose.connect(env.MONGO_URI);
  const openRegisters = await CashRegister.find({ status: "open" }).populate(
    "cashier",
    "firstName lastName",
  );
  console.log(
    JSON.stringify(
      openRegisters.map((r) => ({
        id: r._id.toString(),
        cashier: r.cashier,
        date: r.date,
        totals: r.totals,
      })),
      null,
      2,
    ),
  );
  await mongoose.disconnect();
};

run();
