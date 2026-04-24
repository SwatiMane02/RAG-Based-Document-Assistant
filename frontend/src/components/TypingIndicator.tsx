import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex gap-3 items-end"
  >
    <div className="shrink-0 w-9 h-9 rounded-xl bg-gradient-aurora flex items-center justify-center shadow-glow">
      <Sparkles className="w-4 h-4 text-primary-foreground" />
    </div>
    <div className="bubble-ai rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
      <span className="dot-typing inline-flex">
        <span /> <span /> <span />
      </span>
      <span className="text-xs text-muted-foreground ml-1">AI is thinking…</span>
    </div>
  </motion.div>
);
