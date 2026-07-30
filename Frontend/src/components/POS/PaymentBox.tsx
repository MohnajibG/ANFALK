import { Banknote, CreditCard, WalletCards } from "lucide-react";

import type { PaymentMethod } from "../../hooks/usePOS";

type Props = {
  total: number;

  paymentMethod: PaymentMethod;

  setPaymentMethod: (method: PaymentMethod) => void;

  saving: boolean;

  checkout: () => void;
};

const PaymentBox = ({
  total,
  paymentMethod,
  setPaymentMethod,
  saving,
  checkout,
}: Props) => {
  const buttonClass = (active: boolean) =>
    `rounded-xl p-3 ${active ? "bg-(--black) text-(--cream)" : "bg-(--surface)"}`;

  return (
    <section className="mt-5 rounded-3xl border border-(--border) bg-white p-6">
      <div className="border-t border-(--border) pt-5">
        <div className="flex justify-between text-xl">
          <span>Total</span>

          <strong>{total} DA</strong>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <button
            onClick={() => setPaymentMethod("cash")}
            className={buttonClass(paymentMethod === "cash")}
          >
            <Banknote size={18} className="mx-auto" />
          </button>

          <button
            onClick={() => setPaymentMethod("card")}
            className={buttonClass(paymentMethod === "card")}
          >
            <CreditCard size={18} className="mx-auto" />
          </button>

          <button
            onClick={() => setPaymentMethod("transfer")}
            className={buttonClass(paymentMethod === "transfer")}
          >
            <WalletCards size={18} className="mx-auto" />
          </button>
        </div>

        <button
          disabled={saving}
          onClick={checkout}
          className="mt-5 w-full rounded-xl bg-(--black) py-4 font-bold text-(--cream) transition hover:bg-(--brown-dark) disabled:opacity-50"
        >
          {saving ? "Création..." : "Valider le paiement"}
        </button>
      </div>
    </section>
  );
};

export default PaymentBox;
