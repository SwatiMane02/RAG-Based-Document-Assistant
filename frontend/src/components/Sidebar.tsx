import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, FileText, Plus, MessageSquare, Settings, Download, Trash2 } from "lucide-react";
import { UploadBox } from "./UploadBox";
import type { UploadedFile, ChatSession } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  onNewChat: () => void;
  onExport: () => void;
  chatSessions: ChatSession[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
}

export const Sidebar = ({
  files,
  onFilesChange,
  onNewChat,
  onExport,
  chatSessions,
  activeChatId,
  onSelectChat,
  onDeleteChat,
}: SidebarProps) => {
  return (
    <aside className="hidden md:flex w-80 flex-col h-full glass-strong border-r border-border/40">
      {/* Logo */}
      <div className="p-5 border-b border-border/40">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="p-2.5 rounded-xl bg-muted/60 border border-border/60">
            <Sparkles className="w-5 h-5 text-foreground/80" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg leading-none">DocuMind</h1>
            <p className="text-[11px] text-muted-foreground mt-1">RAG Document Assistant</p>
          </div>
        </motion.div>
      </div>

      {/* New chat */}
      <div className="p-4">
        <Button
          onClick={onNewChat}
          className="w-full bg-gradient-primary hover:opacity-90 transition-all shadow-glow text-primary-foreground font-medium rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" /> New conversation
        </Button>
      </div>

      {/* Scroll area */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-6">
        <section>
          <h2 className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 px-1">
            Documents
          </h2>
          <UploadBox files={files} onFilesChange={onFilesChange} />
        </section>

        <section>
          <h2 className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 px-1">
            Chat history
          </h2>
          <div className="space-y-1.5">
            {chatSessions.length === 0 && (
              <p className="text-xs text-muted-foreground/60 px-1 py-2">
                No conversations yet. Start one above!
              </p>
            )}
            <AnimatePresence initial={false}>
              {chatSessions.map((session) => (
                <motion.div
                  key={session.chat_id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="relative group"
                >
                  <button
                    onClick={() => onSelectChat(session.chat_id)}
                    className={cn(
                      "w-full text-left flex items-center gap-2 p-2.5 rounded-lg text-sm transition-colors",
                      activeChatId === session.chat_id
                        ? "bg-muted/60 text-foreground border border-border/60"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    )}
                  >
                    <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate flex-1">{session.title}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(session.chat_id);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
                    title="Delete chat"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/40 space-y-2">
        <Button
          variant="ghost"
          onClick={onExport}
          className="w-full justify-start text-sm text-muted-foreground hover:text-foreground"
        >
          <Download className="w-4 h-4 mr-2" /> Export chat
        </Button>
        <Button variant="ghost" className="w-full justify-start text-sm text-muted-foreground hover:text-foreground">
          <Settings className="w-4 h-4 mr-2" /> Settings
        </Button>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/40 text-[11px] text-muted-foreground">
          <FileText className="w-3 h-3" />
          {files.filter((f) => f.status === "ready").length} document(s) indexed
        </div>
      </div>
    </aside>
  );
};
