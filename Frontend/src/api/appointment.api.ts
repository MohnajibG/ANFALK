import api from "./axios";

import type {
  Appointment,
  CreateAppointmentPayload,
  UpdateAppointmentPayload,
} from "../types/appointment";

const API_URL = "/appointments";

export const getAppointments = async (
  params?: Record<string, string | number | boolean>,
): Promise<Appointment[]> => {
  try {
    const { data } = await api.get(API_URL, { params });
    return data.appointments ?? [];
  } catch (error) {
    console.error("[Appointments] getAppointments:", error);
    throw error;
  }
};

export const getAppointment = async (id: string): Promise<Appointment> => {
  try {
    const { data } = await api.get(`${API_URL}/${id}`);
    return data.appointment;
  } catch (error) {
    console.error("[Appointments] getAppointment:", error);
    throw error;
  }
};

export const createAppointment = async (
  payload: CreateAppointmentPayload,
): Promise<Appointment> => {
  try {
    const { data } = await api.post(API_URL, payload);
    return data.appointment;
  } catch (error) {
    console.error("[Appointments] createAppointment:", error);
    throw error;
  }
};

export const updateAppointment = async (
  id: string,
  payload: UpdateAppointmentPayload,
): Promise<Appointment> => {
  try {
    const { data } = await api.patch(`${API_URL}/${id}`, payload);
    return data.appointment;
  } catch (error) {
    console.error("[Appointments] updateAppointment:", error);
    throw error;
  }
};

export const cancelAppointment = async (id: string): Promise<Appointment> => {
  try {
    const { data } = await api.patch(`${API_URL}/${id}/cancel`);
    return data.appointment;
  } catch (error) {
    console.error("[Appointments] cancelAppointment:", error);
    throw error;
  }
};

export const completeAppointment = async (id: string): Promise<Appointment> => {
  try {
    const { data } = await api.patch(`${API_URL}/${id}/complete`);
    return data.appointment;
  } catch (error) {
    console.error("[Appointments] completeAppointment:", error);
    throw error;
  }
};

export const deleteAppointment = async (id: string): Promise<void> => {
  try {
    await api.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("[Appointments] deleteAppointment:", error);
    throw error;
  }
};

export const getWaitingPaymentAppointments = async (): Promise<
  Appointment[]
> => {
  try {
    const { data } = await api.get(`${API_URL}/waiting-payment`);
    return data.appointments ?? [];
  } catch (error) {
    console.error("[Appointments] getWaitingPaymentAppointments:", error);
    throw error;
  }
};
