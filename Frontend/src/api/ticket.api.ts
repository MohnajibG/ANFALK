import api from "./axios";

import type {
  Ticket,
  CreateTicketPayload,
  CompleteAppointmentPayload,
} from "../types/ticket";

const API_URL = "/tickets";

export const getTickets = async (
  params?: Record<string, string | number | boolean>,
): Promise<Ticket[]> => {
  try {
    const { data } = await api.get(API_URL, { params });

    return data.tickets ?? [];
  } catch (error) {
    console.error("[Tickets] getTickets:", error);
    throw error;
  }
};

export const getTicket = async (id: string): Promise<Ticket> => {
  try {
    const { data } = await api.get(`${API_URL}/${id}`);

    return data.ticket;
  } catch (error) {
    console.error("[Tickets] getTicket:", error);
    throw error;
  }
};

export const createTicket = async (
  payload: CreateTicketPayload,
): Promise<Ticket> => {
  try {
    const { data } = await api.post(API_URL, payload);

    return data.ticket;
  } catch (error) {
    console.error("[Tickets] createTicket:", error);
    throw error;
  }
};

export const cancelTicket = async (id: string): Promise<Ticket> => {
  try {
    const { data } = await api.patch(`${API_URL}/${id}/cancel`);

    return data.ticket;
  } catch (error) {
    console.error("[Tickets] cancelTicket:", error);
    throw error;
  }
};

export const completeAppointment = async (
  appointmentId: string,
  payload: CompleteAppointmentPayload,
): Promise<Ticket> => {
  try {
    const { data } = await api.post(
      `${API_URL}/appointment/${appointmentId}/complete`,
      payload,
    );

    return data.ticket;
  } catch (error) {
    console.error("[Tickets] completeAppointment:", error);
    throw error;
  }
};
