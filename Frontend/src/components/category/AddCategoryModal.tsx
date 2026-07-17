import { useState } from "react";
import { X } from "lucide-react";
import { createCategory } from "../../api/category.api";
import type { Category } from "../../types/category";

interface Props {
  onCreated: (category: Category) => void;
  onClose: () => void;
}

const AddCategoryModal = ({ onCreated, onClose }: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const category = await createCategory({
        name,
        description,
      });

      onCreated(category);
      onClose();
    } catch {
      setError("Unable to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-xl"
      >
        <div className="mb-6 flex justify-between">
          <h2 className="font-serif text-2xl font-bold">Add Category</h2>

          <button type="button" onClick={onClose}>
            <X />
          </button>
        </div>

        {error && (
          <p className="mb-4 rounded-xl bg-red-50 p-3 text-red-600">{error}</p>
        )}

        <input
          className="input mb-4"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="input mb-4 min-h-24"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          disabled={loading}
          className="w-full rounded-xl bg-[#111] py-3 text-white disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
};

export default AddCategoryModal;
