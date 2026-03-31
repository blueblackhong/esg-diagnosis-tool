import { UserData, Answer, DiagnosisMode } from "@/types";

const STORAGE_KEY = "esg_diagnosis_data";
const AUTH_KEY = "esg_auth";

export function getAuth(): { user: string; role: string } | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(AUTH_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setAuth(user: string, role: string) {
  localStorage.setItem(AUTH_KEY, JSON.stringify({ user, role }));
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
}

export function getUserData(): UserData | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function saveUserData(data: UserData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function initUserData(user: string, mode: DiagnosisMode = "full"): UserData {
  const existing = getUserData();
  if (existing && existing.user === user && existing.status === "in_progress" && existing.mode === mode) {
    return existing;
  }
  const data: UserData = {
    user,
    companyName: "",
    mode,
    startedAt: new Date().toISOString(),
    answers: {},
    status: "in_progress",
    submittedAt: null,
  };
  saveUserData(data);
  return data;
}

export function saveAnswer(questionId: number, answer: Answer) {
  const data = getUserData();
  if (!data) return;
  data.answers[questionId] = answer;
  saveUserData(data);
}

export function clearUserData() {
  localStorage.removeItem(STORAGE_KEY);
}
