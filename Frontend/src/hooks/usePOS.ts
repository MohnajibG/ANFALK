import { useEffect, useMemo, useState } from "react";

import { getServices } from "../api/service.api";
import { getEmployees } from "../api/employee.api";
import { getWaitingPaymentAppointments } from "../api/appointment.api";
import { createTicket } from "../api/ticket.api";

import type { Service } from "../types/service";
import type { Employee } from "../types/employee";
import type { Appointment, AppointmentClient } from "../types/appointment";
import type { Client } from "../types/client";
import type { CreateTicketPayload } from "../types/ticket";

export type PaymentMethod = "cash" | "card" | "transfer";

export type CartItem = {
  service: Service;
  employee: Employee | null;
  originalPrice: number;
  finalPrice: number;
  duration: number;
};

const usePOS = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [waitingAppointments, setWaitingAppointments] = useState<Appointment[]>(
    [],
  );

  const [selectedClient, setSelectedClient] = useState<
    Client | AppointmentClient | null
  >(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [searchService, setSearchService] = useState("");
  const [searchClient, setSearchClient] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [servicesData, employeesData, appointmentsData] =
          await Promise.all([
            getServices(),
            getEmployees(),
            getWaitingPaymentAppointments(),
          ]);
        console.log("appointmentsData", appointmentsData);
        setServices(Array.isArray(servicesData) ? servicesData : []);
        setEmployees(
          Array.isArray(employeesData)
            ? employeesData.filter((e) => e.role === "employee")
            : [],
        );
        setWaitingAppointments(
          Array.isArray(appointmentsData) ? appointmentsData : [],
        );
      } catch (err) {
        console.error("[POS]", err);
        setError("Impossible de charger la caisse");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filteredServices = useMemo(
    () =>
      services.filter((service) =>
        service.name.toLowerCase().includes(searchService.toLowerCase()),
      ),
    [services, searchService],
  );

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.finalPrice, 0),
    [cart],
  );

  const addService = (service: Service) =>
    setCart((cart) => [
      ...cart,
      {
        service,
        employee: null,
        originalPrice: service.price,
        finalPrice: service.price,
        duration: service.duration,
      },
    ]);

  const removeItem = (index: number) =>
    setCart((cart) => cart.filter((_, i) => i !== index));

  const updateEmployee = (index: number, employee: Employee) =>
    setCart((cart) =>
      cart.map((item, i) => (i === index ? { ...item, employee } : item)),
    );

  const updatePrice = (index: number, price: number) =>
    setCart((cart) =>
      cart.map((item, i) =>
        i === index ? { ...item, finalPrice: price } : item,
      ),
    );
  const selectAppointment = (appointment: Appointment) => {
    loadAppointmentToCart(appointment);
  };
  const loadAppointmentToCart = (appointment: Appointment) => {
    if (typeof appointment.client === "object") {
      setSelectedClient(appointment.client);
    }

    setCart(
      appointment.services.map((item) => ({
        service: {
          _id: item.service,
          name: item.name,
          price: item.price,
          duration: item.duration,
          category: { _id: "", name: "" },
          speciality: "Reception",
          isActive: true,
        },
        employee:
          typeof item.employee === "object"
            ? ({
                _id: item.employee._id,
                firstName: item.employee.firstName,
                lastName: item.employee.lastName,
                speciality: item.employee.speciality,
                email: "",
                role: "employee",
                isActive: true,
              } as Employee)
            : null,
        originalPrice: item.price,
        finalPrice: item.price,
        duration: item.duration,
      })),
    );
  };
  const checkout = async () => {
    if (!selectedClient) {
      setError("Veuillez sélectionner un client");
      return;
    }

    if (cart.length === 0) {
      setError("Panier vide");
      return;
    }

    if (cart.some((item) => !item.employee)) {
      setError("Choisir un employé pour chaque prestation");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload: CreateTicketPayload = {
        client: selectedClient._id,
        items: cart.map((item) => ({
          service: item.service._id,
          name: item.service.name,
          employee: item.employee!._id,
          originalPrice: item.originalPrice,
          finalPrice: item.finalPrice,
          duration: item.duration,
        })),
        paymentMethod,
      };

      await createTicket(payload);

      setCart([]);
      setSelectedClient(null);
      setSearchClient("");
    } catch (err) {
      console.error("[POS checkout]", err);
      setError("Erreur création ticket");
    } finally {
      setSaving(false);
    }
  };

  return {
    services,
    employees,
    waitingAppointments,

    filteredServices,

    selectedClient,
    setSelectedClient,

    cart,

    searchService,
    setSearchService,

    searchClient,
    setSearchClient,

    paymentMethod,
    setPaymentMethod,

    total,

    loading,
    saving,
    error,

    addService,
    removeItem,
    updateEmployee,
    updatePrice,

    loadAppointmentToCart,
    selectAppointment,

    checkout,
  };
};

export default usePOS;
