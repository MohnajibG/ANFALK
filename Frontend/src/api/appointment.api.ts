import axios from "axios";

import type {
  Appointment,
  CreateAppointmentPayload,
  UpdateAppointmentPayload,
} from "../types/appointment";

const API_URL = "https://site--ankelk--dnxhn8mdblq5.code.run/api/appointments";

export const getAppointments = async (
  params?: Record<string, string | number | boolean>,
): Promise<Appointment[]> => {
  try {
    const { data } = await axios.get(API_URL, { params });

    return data.appointments ?? [];
  } catch (error) {
    console.error("[Appointments] getAppointments:", error);
    throw error;
  }
};

export const getAppointment = async (id: string): Promise<Appointment> => {
  try {
    const { data } = await axios.get(`${API_URL}/${id}`);

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
    const { data } = await axios.post(API_URL, payload);

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
    const { data } = await axios.patch(`${API_URL}/${id}`, payload);

    return data.appointment;
  } catch (error) {
    console.error("[Appointments] updateAppointment:", error);
    throw error;
  }
};

export const cancelAppointment = async (id: string): Promise<Appointment> => {
  try {
    const { data } = await axios.patch(`${API_URL}/${id}/cancel`);

    return data.appointment;
  } catch (error) {
    console.error("[Appointments] cancelAppointment:", error);
    throw error;
  }
};
