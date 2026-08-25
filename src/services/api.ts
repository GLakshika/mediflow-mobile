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

const api = axios.create({
  baseURL: "http://10.187.26.19:5000/api",
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