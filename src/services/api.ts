import axios from "axios";
import * as SecureStore from "expo-secure-store";

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = LoginCredentials & {
  name: string;
  role: "PATIENT" | "DOCTOR" | "HOSPITAL_ADMIN";
};

export type LoginResponse = {
  token?: string;
  accessToken?: string;
  user?: {
    id?: string;
    name?: string;
    email?: string;
  };
};

export type Hospital = {
  id: string;
  name: string;
  address: string;
  phone?: string;
  status?: string;
  available_beds?: number;
  emergency_queue?: number;
  doctors_available?: number;
  emergency_status?: string;
};

export type HospitalDepartment = {
  id: string;
  name: string;
  status?: string;
};

export type HospitalDoctor = {
  id: string;
  doctor_name: string;
  specialization?: string;
  available?: boolean;
  department_name?: string;
};

export type HospitalDetails = {
  hospital: Hospital;
  departments: HospitalDepartment[];
  doctors: HospitalDoctor[];
};

export type Appointment = {
  id: string;
  doctor_id: string;
  doctor_name: string;
  specialization?: string;
  hospital_id: string;
  hospital_name: string;
  appointment_date: string;
  appointment_time: string;
  status: "BOOKED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  reason?: string;
  notes?: string;
  department_name?: string;
  created_at?: string;
  updated_at?: string;
};

export type AppointmentRequest = {
  doctor_id: string;
  hospital_id: string;
  appointment_date: string;
  appointment_time: string;
  reason?: string;
};

export type CancelAppointmentResponse = {
  message: string;
  appointment: Appointment;
};

const api = axios.create({
  baseURL: "http://10.10.21.148:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("mediflow.authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

export async function login(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login", credentials);
  return response.data;
}

export async function register(
  credentials: RegisterCredentials,
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/register", credentials);
  return response.data;
}

export async function getHospitals(): Promise<Hospital[]> {
  const response = await api.get<{ hospitals: Hospital[] }>("/hospitals");
  return response.data.hospitals;
}

export async function getHospitalDetails(id: string): Promise<HospitalDetails> {
  const response = await api.get<HospitalDetails>(`/hospitals/${id}`);
  return response.data;
}

export async function getAppointments(): Promise<Appointment[]> {
  const response = await api.get<{ appointments: Appointment[] }>("/appointments/my");
  return response.data.appointments;
}

export async function createAppointment(request: AppointmentRequest): Promise<Appointment> {
  const response = await api.post<{ appointment: Appointment }>("/appointments", request);
  return response.data.appointment;
}

export async function cancelAppointment(id: string): Promise<CancelAppointmentResponse> {
  const response = await api.patch<CancelAppointmentResponse>(`/appointments/${id}/cancel`);
  return response.data;
}