import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Sparkles, User, ChevronDown, FileText, Copy, Check } from "lucide-react";
import type { ChatMessage } from "@/types/chat";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === "user";
  const [showSources, setShowSources] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn("flex gap-3 w-full group", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && (
        <div className="shrink-0 w-9 h-9 rounded-xl bg-gradient-aurora flex items-center justify-center shadow-glow">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
      )}

      <div className={cn("flex flex-col gap-2 max-w-[85%] md:max-w-[75%]", isUser && "items-end")}>
        <div
          className={cn(
            "relative px-4 py-3 rounded-2xl text-sm leading-relaxed",
            isUser ? "bubble-user rounded-tr-sm" : "bubble-ai rounded-tl-sm text-foreground"
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose-chat">
              <ReactMarkdown>{message.content || "\u200B"}</ReactMarkdown>
              {message.isStreaming && (
                <motion.span
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="inline-block w-2 h-4 bg-foreground/70 ml-0.5 rounded-sm align-middle"
                />
              )}
            </div>
          )}
        </div>

        {/* Sources / actions */}
        {!isUser && !message.isStreaming && message.content && (
          <div className="flex items-center gap-2 px-1">
            {message.sources && message.sources.length > 0 && (
              <button
                onClick={() => setShowSources((v) => !v)}
                className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors outline-none rounded focus-visible:ring-2 focus-visible:ring-ring/60"
              >
                <FileText className="w-3 h-3" />
                {message.sources.length} source{message.sources.length > 1 ? "s" : ""}
                <ChevronDown className={cn("w-3 h-3 transition-transform", showSources && "rotate-180")} />
              </button>
            )}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100 focus-visible:opacity-100 outline-none rounded focus-visible:ring-2 focus-visible:ring-ring/60"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        )}

        <AnimatePresence>
          {showSources && message.sources && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full space-y-2 overflow-hidden"
            >
              {message.sources.map((s, i) => (
                <div key={i} className="p-3 rounded-xl glass border border-border/40 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2 mb-1.5 text-foreground/80 font-medium">
                    <FileText className="w-3 h-3" />
                    <span>{s.source || `Snippet ${i + 1}`}</span>
                    {s.page !== undefined && <span className="text-muted-foreground">· p.{s.page}</span>}
                  </div>
                  <p className="leading-relaxed line-clamp-4">{s.content}</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isUser && (
        <div className="shrink-0 w-9 h-9 rounded-xl glass-strong flex items-center justify-center">
          <User className="w-4 h-4 text-foreground" />
        </div>
      )}
    </motion.div>
  );
};
