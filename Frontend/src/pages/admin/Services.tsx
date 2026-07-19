import { useEffect, useMemo, useState, type ComponentType } from "react";
import { motion } from "framer-motion";
import { Clock, Euro, Layers, Plus, Scissors, Search } from "lucide-react";

import {
  deleteService,
  getServices,
  toggleServiceStatus,
} from "../../api/service.api";
import { getCategories } from "../../api/category.api";

import type { Service } from "../../types/service";
import type { Category } from "../../types/category";

import ServiceTable from "../../components/tables/ServiceTable";
import AddServiceModal from "../../components/service/AddServiceModal";
import EditServiceModal from "../../components/service/EditServiceModal";
import ViewServiceModal from "../../components/service/ViewServiceModal";
import DeleteServiceModal from "../../components/service/DeleteServiceModal";

type ModalType = "add" | "edit" | "view" | "delete" | null;

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const [modal, setModal] = useState<ModalType>(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      try {
        const [servicesData, categoriesData] = await Promise.all([
          getServices(),
          getCategories(),
        ]);

        if (!active) return;

        setServices(Array.isArray(servicesData) ? servicesData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (err) {
        if (!active) return;

        console.error("[Services] loadData:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Impossible de charger les services",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, []);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const searchMatch = service.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const categoryMatch =
        category === "all" || service.category?.name === category;

      return searchMatch && categoryMatch;
    });
  }, [services, search, category]);

  const totalPrice = useMemo(() => {
    return services.reduce((total, service) => total + service.price, 0);
  }, [services]);

  const handleDelete = async () => {
    if (!selectedService) return;

    try {
      setDeleteLoading(true);

      await deleteService(selectedService._id);

      setServices((current) =>
        current.filter((item) => item._id !== selectedService._id),
      );

      setSelectedService(null);
      setModal(null);
    } catch (err) {
      console.error("[Services] delete:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggle = async (service: Service) => {
    try {
      const updated = await toggleServiceStatus(service._id);

      setServices((current) =>
        current.map((item) => (item._id === service._id ? updated : item)),
      );
    } catch (err) {
      console.error("[Services] toggle:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center text-gray-500">
        Chargement des services...
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <section className="flex flex-col gap-5 rounded-3xl border border-[#eadfce] bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[#8b7560]">
            Administration
          </p>

          <h1 className="mt-3 font-serif text-3xl font-bold text-[#111]">
            Gestion des services
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Gérez les prestations de l'institut.
          </p>
        </div>

        <button
          onClick={() => setModal("add")}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#3E2C23] px-5 py-3 text-[#fff4d6] transition hover:bg-[#5a3a1e]"
        >
          <Plus size={18} />
          Ajouter un service
        </button>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Scissors} title="Services" value={services.length} />
        <StatCard icon={Layers} title="Catégories" value={categories.length} />
        <StatCard
          icon={Euro}
          title="Valeur totale"
          value={`${totalPrice} DA`}
        />
        <StatCard
          icon={Clock}
          title="Actifs"
          value={services.filter((item) => item.isActive).length}
        />
      </div>

      <div className="flex flex-col gap-3 rounded-3xl border border-[#eadfce] bg-white p-5 md:flex-row">
        <div className="flex flex-1 items-center gap-3">
          <Search size={20} />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un service..."
            className="w-full bg-transparent outline-none"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-[#eadfce] px-4 py-2"
        >
          <option value="all">Toutes les catégories</option>

          {categories.map((item) => (
            <option key={item._id} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-red-600">{error}</div>
      )}

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
          onCreated={(service) => {
            setServices((current) => [...current, service]);
            setModal(null);
          }}
          onClose={() => setModal(null)}
        />
      )}

      {modal === "edit" && selectedService && (
        <EditServiceModal
          service={selectedService}
          categories={categories}
          onUpdated={(service) => {
            setServices((current) =>
              current.map((item) =>
                item._id === service._id ? service : item,
              ),
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

function StatCard({
  icon: Icon,
  title,
  value,
}: {
  icon: ComponentType<{ size?: number }>;
  title: string;
  value: string | number;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-3xl border border-[#eadfce] bg-white p-6"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{title}</p>
        <Icon size={22} />
      </div>

      <h3 className="mt-4 text-3xl font-bold">{value}</h3>
    </motion.div>
  );
}

export default Services;
