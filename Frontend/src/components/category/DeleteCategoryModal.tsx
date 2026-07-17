import { X, Trash2 } from "lucide-react";
import type { Category } from "../../types/category";

interface Props {
  category: Category;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const DeleteCategoryModal = ({
  category,
  loading = false,
  onConfirm,
  onClose,
}: Props) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="w-full max-w-md rounded-3xl bg-white p-8">
      <div className="flex justify-between">
        <h2 className="font-serif text-2xl font-bold">Delete Category</h2>

        <button onClick={onClose}>
          <X />
        </button>
      </div>

      <div className="mt-6 rounded-2xl bg-red-50 p-5">
        <Trash2 className="text-red-600" />

        <p className="mt-3">Delete:</p>

        <b>{category.name}</b>
      </div>

      <div className="mt-6 flex gap-3">
        <button onClick={onClose} className="flex-1 rounded-xl border py-3">
          Cancel
        </button>

        <button
          disabled={loading}
          onClick={onConfirm}
          className="flex-1 rounded-xl bg-red-600 py-3 text-white"
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  </div>
);

export default DeleteCategoryModal;
