import axios from "axios";

export type LoginCredentials = {
  email: string;
  password: string;
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

const api = axios.create({
  baseURL: "http://10.187.26.19:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

export async function login(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login", credentials);
  return response.data;
}