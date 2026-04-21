import axios from "axios";

const SESSION_KEY = "medical-report-session";

function getStoredSession() {
  try {
    const value = localStorage.getItem(SESSION_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export function setStoredSession(user) {
  if (!user) {
    localStorage.removeItem(SESSION_KEY);
    return;
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

api.interceptors.request.use((config) => {
  const storedUser = getStoredSession();

  if (storedUser?.id) {
    config.headers["x-user-id"] = storedUser.id;
  }

  return config;
});

export async function analyzeReport(payload) {
  const response = await api.post("/reports/analyze", payload);
  return response.data;
}

export const analyzeHemoglobin = analyzeReport;

export async function fetchReports() {
  const response = await api.get("/reports");
  return response.data;
}

export async function registerUser(payload) {
  const response = await api.post("/auth/register", payload);
  return response.data;
}

export async function loginUser(payload) {
  const response = await api.post("/auth/login", payload);
  return response.data;
}

export async function logoutUser() {
  const response = await api.post("/auth/logout");
  return response.data;
}

export async function fetchCurrentUser() {
  const response = await api.get("/auth/me");
  return response.data;
}

export async function sendChatMessage(payload) {
  const response = await api.post("/chat", payload);
  return response.data;
}

export default api;
