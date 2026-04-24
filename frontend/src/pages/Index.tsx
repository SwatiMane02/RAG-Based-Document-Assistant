import { useCallback, useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { ChatWindow } from "@/components/ChatWindow";
import { InputBar } from "@/components/InputBar";
import { toast } from "sonner";
import { queryAI, getHistory, extractAnswer, extractSources } from "@/services/api";
import type { ChatMessage, ChatSession, UploadedFile } from "@/types/chat";

// ── localStorage helpers ───────────────────────────────────────────
const STORAGE_KEY = "documind-chat-sessions";

function loadSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSessions(sessions: ChatSession[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

// ── Component ──────────────────────────────────────────────────────
const Index = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [input, setInput] = useState("");
  const [model, setModel] = useState("groq-llama");
  const [status, setStatus] = useState<"connected" | "processing" | "offline">("connected");

  // Chat session state
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(loadSessions);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Persist sessions to localStorage whenever they change
  useEffect(() => {
    saveSessions(chatSessions);
  }, [chatSessions]);

  // ── Word-by-word streaming animation ─────────────────────────────
  const streamWords = (id: string, fullText: string) => {
    const words = fullText.split(/(\s+)/);
    let i = 0;
    const tick = () => {
      i += 1;
      const partial = words.slice(0, i).join("");
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, content: partial } : m))
      );
      if (i < words.length) {
        setTimeout(tick, 18);
      } else {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, isStreaming: false } : m))
        );
      }
    };
    tick();
  };

  // ── Send a message ───────────────────────────────────────────────
  const handleSend = useCallback(
    async (text: string) => {
      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
        createdAt: Date.now(),
      };
      setMessages((p) => [...p, userMsg]);
      setIsThinking(true);
      setStatus("processing");

      try {
        // Pass activeChatId so the backend continues the same session
        const data = await queryAI(text, activeChatId);
        const answer = extractAnswer(data);
        const sources = extractSources(data);
        const returnedChatId = data.chat_id || null;

        // If this was the first message (no activeChatId), register the new session
        if (!activeChatId && returnedChatId) {
          const newSession: ChatSession = {
            chat_id: returnedChatId,
            title: text.length > 40 ? text.slice(0, 40) + "…" : text,
            createdAt: Date.now(),
          };
          setChatSessions((prev) => [newSession, ...prev]);
          setActiveChatId(returnedChatId);
        }

        const aiId = crypto.randomUUID();
        const aiMsg: ChatMessage = {
          id: aiId,
          role: "ai",
          content: "",
          sources,
          isStreaming: true,
          createdAt: Date.now(),
        };
        setIsThinking(false);
        setMessages((p) => [...p, aiMsg]);
        streamWords(aiId, answer);
      } catch (err) {
        setIsThinking(false);
        const msg = err instanceof Error ? err.message : "Request failed";
        toast.error("Could not reach the assistant", { description: msg });
        setMessages((p) => [
          ...p,
          {
            id: crypto.randomUUID(),
            role: "ai",
            content: `⚠️ **Error:** ${msg}\n\nMake sure the FastAPI backend is running on \`http://127.0.0.1:8000\`.`,
            createdAt: Date.now(),
          },
        ]);
      } finally {
        setStatus("connected");
      }
    },
    [activeChatId]
  );

  // ── New chat ─────────────────────────────────────────────────────
  const handleNewChat = () => {
    setMessages([]);
    setInput("");
    setActiveChatId(null);
    toast("New conversation started");
  };

  // ── Select an existing chat ──────────────────────────────────────
  const handleSelectChat = useCallback(
    async (chatId: string) => {
      if (chatId === activeChatId) return;

      setActiveChatId(chatId);
      setMessages([]);
      setInput("");
      setIsLoadingHistory(true);

      try {
        const history = await getHistory(chatId);
        const loaded: ChatMessage[] = history.map((m) => ({
          id: String(m.id),
          role: m.role as "user" | "ai",
          content: m.content,
          createdAt: new Date(m.created_at).getTime(),
        }));
        setMessages(loaded);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to load history";
        toast.error("Could not load chat history", { description: msg });
      } finally {
        setIsLoadingHistory(false);
      }
    },
    [activeChatId]
  );

  // ── Delete a chat ────────────────────────────────────────────────
  const handleDeleteChat = useCallback(
    (chatId: string) => {
      setChatSessions((prev) => prev.filter((s) => s.chat_id !== chatId));
      if (activeChatId === chatId) {
        setActiveChatId(null);
        setMessages([]);
      }
      toast("Chat deleted");
    },
    [activeChatId]
  );

  // ── Export ────────────────────────────────────────────────────────
  const handleExport = () => {
    if (messages.length === 0) {
      toast.error("Nothing to export yet");
      return;
    }
    const text = messages
      .map((m) => `${m.role === "user" ? "You" : "DocuMind"}:\n${m.content}\n`)
      .join("\n---\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `documind-chat-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Chat exported");
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar
        files={files}
        onFilesChange={setFiles}
        onNewChat={handleNewChat}
        onExport={handleExport}
        chatSessions={chatSessions}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
      />
      <main className="flex-1 flex flex-col min-w-0">
        <TopBar status={status} model={model} onModelChange={setModel} />
        <ChatWindow
          messages={messages}
          isThinking={isThinking || isLoadingHistory}
          onSuggestion={(t) => setInput(t)}
        />
        <InputBar
          onSend={handleSend}
          disabled={isThinking || isLoadingHistory}
          value={input}
          onValueChange={setInput}
        />
      </main>
    </div>
  );
};

export default Index;
