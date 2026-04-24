import { motion } from "framer-motion";
import { FileQuestion, Sparkles, Search, BookOpen } from "lucide-react";

interface EmptyStateProps {
  onSuggestion: (text: string) => void;
}

const suggestions = [
  { icon: Search, title: "Summarize the key points", desc: "Get a concise overview of your document" },
  { icon: BookOpen, title: "Explain this concept", desc: "Ask the AI to clarify any topic" },
  { icon: FileQuestion, title: "Find specific information", desc: "Locate facts, figures, and dates" },
];

export const EmptyState = ({ onSuggestion }: EmptyStateProps) => (
  <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="relative mb-6"
    >
      <div className="relative w-16 h-16 rounded-2xl glass-strong border border-border/60 flex items-center justify-center">
        <Sparkles className="w-7 h-7 text-foreground/80" />
      </div>
    </motion.div>
    <motion.h2
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="font-display text-3xl md:text-4xl font-bold mb-3"
    >
      How can I help you <span className="text-gradient">today?</span>
    </motion.h2>
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="text-muted-foreground max-w-md mb-10"
    >
      Upload a document on the left and start asking questions. I'll deliver sourced, instant answers.
    </motion.p>

    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="grid sm:grid-cols-3 gap-3 w-full max-w-3xl"
    >
      {suggestions.map((s, i) => (
        <button
          key={i}
          onClick={() => onSuggestion(s.title)}
          className="group text-left p-4 rounded-2xl glass border border-border/50 hover:border-border hover:bg-muted/30 transition-all"
        >
          <div className="w-9 h-9 rounded-lg bg-muted/60 flex items-center justify-center mb-3">
            <s.icon className="w-4 h-4 text-foreground/70" />
          </div>
          <p className="text-sm font-semibold mb-1">{s.title}</p>
          <p className="text-xs text-muted-foreground">{s.desc}</p>
        </button>
      ))}
    </motion.div>
  </div>
);
