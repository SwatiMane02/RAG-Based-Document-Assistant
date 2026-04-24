export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: "uploading" | "ready" | "error";
  uploadedAt: number;
}

export interface ChatSource {
  content: string;
  source?: string;
  page?: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  sources?: ChatSource[];
  isStreaming?: boolean;
  createdAt: number;
}

export interface ChatSession {
  chat_id: string;
  title: string;
  createdAt: number;
}
