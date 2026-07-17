import { useState } from "react";
import { X } from "lucide-react";
import { updateCategory } from "../../api/category.api";
import type { Category } from "../../types/category";

interface Props {
  category: Category;
  onUpdated: (category: Category) => void;
  onClose: () => void;
}

const EditCategoryModal = ({ category, onUpdated, onClose }: Props) => {
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description ?? "");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const updated = await updateCategory(category._id, {
        name,
        description,
      });

      onUpdated(updated);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-3xl bg-white p-8"
      >
        <div className="mb-6 flex justify-between">
          <h2 className="font-serif text-2xl font-bold">Edit Category</h2>

          <button type="button" onClick={onClose}>
            <X />
          </button>
        </div>

        <input
          className="input mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="input mb-4 min-h-24"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          disabled={loading}
          className="w-full rounded-xl bg-[#111] py-3 text-white"
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default EditCategoryModal;
