import { useEffect, useRef, useState, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { Send, Paperclip, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputBarProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  value?: string;
  onValueChange?: (v: string) => void;
}

export const InputBar = ({ onSend, disabled, value, onValueChange }: InputBarProps) => {
  const [internal, setInternal] = useState("");
  const text = value !== undefined ? value : internal;
  const setText = (v: string) => {
    onValueChange ? onValueChange(v) : setInternal(v);
  };
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = Math.min(ref.current.scrollHeight, 200) + "px";
    }
  }, [text]);

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText("");
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="px-4 md:px-8 pb-5 pt-2">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative max-w-3xl mx-auto"
      >
        <div className="relative glass-strong rounded-2xl border border-border/60 flex items-end gap-2 p-2 pr-2.5 shadow-elegant transition-colors focus-within:border-foreground/40 focus-within:ring-2 focus-within:ring-ring/40 focus-within:ring-offset-2 focus-within:ring-offset-background">
          <button
            className="shrink-0 p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            title="Attach file"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <textarea
            ref={ref}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask anything about your documents…"
            className="flex-1 bg-transparent outline-none resize-none py-2.5 text-sm placeholder:text-muted-foreground max-h-[200px]"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || disabled}
            aria-label="Send message"
            className={cn(
              "shrink-0 p-2.5 rounded-xl transition-all outline-none",
              "focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              text.trim() && !disabled
                ? "bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
                : "bg-muted/50 text-muted-foreground cursor-not-allowed"
            )}
          >
            {disabled ? (
              <Sparkles className="w-4 h-4 animate-pulse" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          DocuMind can make mistakes. Verify important information.
        </p>
      </motion.div>
    </div>
  );
};
