import { useEffect, useState } from "react";
import { Edit2, Layers, Plus, Trash2 } from "lucide-react";

import { deleteCategory, getCategories } from "../../api/category.api";

import type { Category } from "../../types/category";

import AddCategoryModal from "../../components/category/AddCategoryModal";
import EditCategoryModal from "../../components/category/EditCategoryModal";
import DeleteCategoryModal from "../../components/category/DeleteCategoryModal";

type ModalType = "add" | "edit" | "delete" | null;

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [modal, setModal] = useState<ModalType>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);

        const data = await getCategories();

        setCategories(data);
      } catch (error) {
        console.error("Load categories error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleDelete = async () => {
    if (!selectedCategory) return;

    try {
      setDeleteLoading(true);

      await deleteCategory(selectedCategory._id);

      setCategories((prev) =>
        prev.filter((category) => category._id !== selectedCategory._id),
      );

      setSelectedCategory(null);
      setModal(null);
    } catch (error) {
      console.error("Delete category error:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Categories</h1>

          <p className="text-gray-500">Manage service categories</p>
        </div>

        <button
          onClick={() => setModal("add")}
          className="flex items-center gap-2 rounded-xl bg-[#111] px-5 py-3 text-white transition hover:bg-[#3E2C23]"
        >
          <Plus size={18} />
          Add Category
        </button>
      </header>

      <section className="rounded-3xl bg-white p-6 shadow">
        {loading ? (
          <div className="py-12 text-center text-gray-500">Loading...</div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-gray-500">
            <Layers size={40} />
            <p className="mt-3">No categories found.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <article
                key={category._id}
                className="rounded-2xl border p-5 transition hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{category.name}</h3>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      category.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {category.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="mt-3 text-sm text-gray-500">
                  {category.description || "No description"}
                </p>

                <div className="mt-5 flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedCategory(category);
                      setModal("edit");
                    }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border py-2 hover:bg-gray-50"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      setSelectedCategory(category);
                      setModal("delete");
                    }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 py-2 text-red-600 hover:bg-red-100"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {modal === "add" && (
        <AddCategoryModal
          onCreated={(category) => {
            setCategories((prev) => [...prev, category]);
          }}
          onClose={() => setModal(null)}
        />
      )}

      {modal === "edit" && selectedCategory && (
        <EditCategoryModal
          category={selectedCategory}
          onUpdated={(category) => {
            setCategories((prev) =>
              prev.map((item) => (item._id === category._id ? category : item)),
            );

            setModal(null);
          }}
          onClose={() => setModal(null)}
        />
      )}

      {modal === "delete" && selectedCategory && (
        <DeleteCategoryModal
          category={selectedCategory}
          loading={deleteLoading}
          onConfirm={handleDelete}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
};

export default Categories;
