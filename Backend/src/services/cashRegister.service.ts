import CashRegister from "../models/CashRegister";
import Ticket from "../models/Ticket";

const getTodayString = () => new Date().toISOString().slice(0, 10);

export const openCashRegister = async (
  cashierId: string,
  openingAmount: number,
) => {
  if (Number.isNaN(openingAmount) || openingAmount < 0) {
    throw new Error("Le montant d'ouverture est invalide");
  }

  const date = getTodayString();

  const existing = await CashRegister.findOne({ cashier: cashierId, date });

  if (existing) {
    throw new Error(
      existing.status === "open"
        ? "Une caisse est déjà ouverte aujourd'hui"
        : "La caisse d'aujourd'hui a déjà été ouverte et fermée",
    );
  }

  return CashRegister.create({
    cashier: cashierId,
    date,
    openingAmount,
    status: "open",
  });
};

export const getCurrentCashRegister = async (cashierId: string) => {
  const date = getTodayString();

  return CashRegister.findOne({ cashier: cashierId, date, status: "open" });
};

export const getCashRegisterById = async (id: string) => {
  const register = await CashRegister.findById(id).populate(
    "cashier",
    "firstName lastName",
  );

  if (!register) {
    throw new Error("Session de caisse introuvable");
  }

  return register;
};

export const recalculateTotals = async (registerId: string) => {
  const tickets = await Ticket.find({
    cashRegister: registerId,
    status: "paid",
  });

  const totals = tickets.reduce(
    (acc, ticket) => {
      acc.ticketsCount += 1;

      if (ticket.paymentMethod === "cash") acc.cash += ticket.total;
      if (ticket.paymentMethod === "card") acc.card += ticket.total;
      if (ticket.paymentMethod === "transfer") acc.transfer += ticket.total;

      return acc;
    },
    { cash: 0, card: 0, transfer: 0, ticketsCount: 0 },
  );

  await CashRegister.findByIdAndUpdate(registerId, { totals });

  return totals;
};

export const closeCashRegister = async (
  cashierId: string,
  closingAmount: number,
  notes?: string,
) => {
  const date = getTodayString();

  const register = await CashRegister.findOne({
    cashier: cashierId,
    date,
    status: "open",
  });

  if (!register) {
    throw new Error("Aucune caisse ouverte à fermer");
  }

  const totals = await recalculateTotals(register._id.toString());

  const expectedAmount = register.openingAmount + totals.cash;
  const difference = closingAmount - expectedAmount;

  register.closingAmount = closingAmount;
  register.expectedAmount = expectedAmount;
  register.difference = difference;
  register.closedAt = new Date();
  register.status = "closed";
  register.notes = notes ?? register.notes;
  register.totals = totals;

  await register.save();

  return register;
};

export const getCashRegisterHistory = async (filters: {
  cashier?: string;
  from?: string;
  to?: string;
  status?: "open" | "closed";
}) => {
  const query: any = {};

  if (filters.cashier) query.cashier = filters.cashier;
  if (filters.status) query.status = filters.status;

  if (filters.from || filters.to) {
    query.date = {};
    if (filters.from) query.date.$gte = filters.from;
    if (filters.to) query.date.$lte = filters.to;
  }

  return CashRegister.find(query)
    .populate("cashier", "firstName lastName")
    .sort({ date: -1, openedAt: -1 });
};
