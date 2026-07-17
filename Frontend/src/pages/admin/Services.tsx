import { useEffect, useMemo, useState, type ComponentType } from "react";
import { motion } from "framer-motion";
import { Clock, Euro, Layers, Plus, Scissors, Search } from "lucide-react";

import {
  deleteService,
  getServices,
  toggleServiceStatus,
} from "../../api/service.api";

import type { Service } from "../../types/service";

import ServiceTable from "../../components/tables/ServiceTable";
import AddServiceModal from "../../components/service/AddServiceModal";
import EditServiceModal from "../../components/service/EditServiceModal";
import ViewServiceModal from "../../components/service/ViewServiceModal";
import DeleteServiceModal from "../../components/service/DeleteServiceModal";
import type { Category } from "../../types/category";

type ModalType = "add" | "edit" | "view" | "delete" | null;

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [modal, setModal] = useState<ModalType>(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getServices();

        setServices(data);

        setCategories(
          data.reduce<Category[]>((acc, item) => {
            const cat = item.category;

            if (cat && !acc.some((c) => c._id === cat._id)) {
              acc.push({
                _id: cat._id,
                name: cat.name,
                description: "",
                isActive: true,
              });
            }

            return acc;
          }, []),
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load services",
        );
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const handleDelete = async () => {
    if (!selectedService) return;

    try {
      setDeleteLoading(true);

      await deleteService(selectedService._id);

      setServices((prev) => prev.filter((s) => s._id !== selectedService._id));

      setSelectedService(null);
      setModal(null);
    } catch (err) {
      console.error("Delete service error:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggle = async (service: Service) => {
    try {
      const updated = await toggleServiceStatus(service._id);

      setServices((prev) =>
        prev.map((s) => (s._id === service._id ? updated : s)),
      );
    } catch (err) {
      console.error("Toggle service error:", err);
    }
  };

  const filteredServices = useMemo(
    () =>
      services.filter((service) => {
        const matchSearch = service.name
          .toLowerCase()
          .includes(search.toLowerCase());

        const matchCategory =
          category === "all" || service.category?.name === category;

        return matchSearch && matchCategory;
      }),
    [services, search, category],
  );

  const totalPrice = useMemo(
    () => services.reduce((sum, item) => sum + item.price, 0),
    [services],
  );

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading services...
      </div>
    );

  if (error)
    return (
      <div className="rounded-3xl bg-red-50 p-6 text-red-600">{error}</div>
    );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="flex flex-col gap-5 rounded-3xl border border-[#eadfce] bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[#8b7560]">
            Administration
          </p>

          <h1 className="mt-3 font-serif text-3xl font-bold">
            Services Management
          </h1>

          <p className="mt-2 text-gray-500">Manage institute services.</p>
        </div>

        <button
          onClick={() => setModal("add")}
          className="flex items-center gap-2 rounded-xl bg-[#111] px-5 py-3 text-white"
        >
          <Plus size={18} />
          Add Service
        </button>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Scissors} title="Services" value={services.length} />
        <StatCard icon={Layers} title="Categories" value={categories.length} />
        <StatCard icon={Euro} title="Total Price" value={`${totalPrice} DA`} />
        <StatCard
          icon={Clock}
          title="Active"
          value={services.filter((s) => s.isActive).length}
        />
      </div>

      <div className="flex gap-4 rounded-3xl border border-[#eadfce] bg-white p-5">
        <Search />

        <input
          className="flex-1 outline-none"
          placeholder="Search service..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="rounded-xl border px-4"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All Categories</option>

          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <ServiceTable
        services={filteredServices}
        onView={(service) => {
          setSelectedService(service);
          setModal("view");
        }}
        onEdit={(service) => {
          setSelectedService(service);
          setModal("edit");
        }}
        onDelete={(service) => {
          setSelectedService(service);
          setModal("delete");
        }}
        onToggle={handleToggle}
      />

      {modal === "add" && (
        <AddServiceModal
          categories={categories}
          onCreated={(service) => setServices((prev) => [...prev, service])}
          onClose={() => setModal(null)}
        />
      )}

      {modal === "edit" && selectedService && (
        <EditServiceModal
          service={selectedService}
          categories={categories}
          onUpdated={(service) => {
            setServices((prev) =>
              prev.map((s) => (s._id === service._id ? service : s)),
            );

            setModal(null);
          }}
          onClose={() => setModal(null)}
        />
      )}

      {modal === "view" && selectedService && (
        <ViewServiceModal
          service={selectedService}
          onClose={() => setModal(null)}
        />
      )}

      {modal === "delete" && selectedService && (
        <DeleteServiceModal
          service={selectedService}
          loading={deleteLoading}
          onConfirm={handleDelete}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
};

const StatCard = ({
  icon: Icon,
  title,
  value,
}: {
  icon: ComponentType<{ size?: number }>;
  title: string;
  value: string | number;
}) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="rounded-3xl border border-[#eadfce] bg-white p-6"
  >
    <div className="flex justify-between">
      <p className="text-gray-500">{title}</p>
      <Icon size={22} />
    </div>

    <h3 className="mt-4 text-3xl font-bold">{value}</h3>
  </motion.div>
);

export default Services;
