import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 120000,
});

export interface QueryResponse {
  answer?: string;
  response?: string;
  result?: string;
  chat_id?: string;
  sources?: Array<{ content?: string; source?: string; page?: number } | string>;
  [k: string]: unknown;
}

export interface HistoryMessage {
  id: number;
  chat_id: string;
  role: "user" | "ai";
  content: string;
  created_at: string;
}

export async function uploadFile(file: File): Promise<{ message?: string; filename?: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function queryAI(question: string, chatId?: string | null): Promise<QueryResponse> {
  const payload: { question: string; chat_id?: string } = { question };
  if (chatId) {
    payload.chat_id = chatId;
  }
  const { data } = await api.post<QueryResponse>("/query", payload);
  return data;
}

export async function getHistory(chatId: string): Promise<HistoryMessage[]> {
  const { data } = await api.get<HistoryMessage[]>(`/history/${chatId}`);
  return data;
}

export function extractAnswer(data: QueryResponse): string {
  return (
    data.answer ||
    data.response ||
    data.result ||
    (typeof data === "string" ? data : JSON.stringify(data, null, 2))
  );
}

export function extractSources(data: QueryResponse): Array<{ content: string; source?: string; page?: number }> {
  if (!data.sources) return [];
  return data.sources.map((s) =>
    typeof s === "string" ? { content: s } : { content: s.content || "", source: s.source, page: s.page }
  );
}
