import { useState } from "react";
import { Lock, Loader2, Wallet } from "lucide-react";

type Props = {
  onOpen: (amount: number) => Promise<unknown>;
  loading: boolean;
  error: string;
};

const OpenRegisterModal = ({ onOpen, loading, error }: Props) => {
  const [amount, setAmount] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(amount);
    if (Number.isNaN(value) || value < 0) return;
    await onOpen(value).catch(() => {});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#151515] text-[#D8B98A]">
            <Lock size={28} />
          </div>

          <h2 className="mt-5 font-[Cinzel] text-2xl font-bold">
            Ouverture de caisse
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Saisissez le fond de caisse de départ pour commencer votre journée.
          </p>
        </div>

        <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
          <div className="flex items-center gap-3 rounded-2xl border border-[#D8B98A]/30 bg-[#FFFDF8] px-4 py-3">
            <Wallet size={20} className="text-[#D8B98A]" />
            <input
              autoFocus
              type="number"
              min={0}
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Montant en DA"
              className="w-full bg-transparent text-lg font-semibold outline-none"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            disabled={loading || amount === ""}
            className="flex items-center justify-center gap-2 rounded-2xl bg-[#151515] py-4 font-semibold text-[#FFF4D6] transition hover:bg-[#3E2C23] disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Ouverture...
              </>
            ) : (
              "Ouvrir la caisse"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OpenRegisterModal;
