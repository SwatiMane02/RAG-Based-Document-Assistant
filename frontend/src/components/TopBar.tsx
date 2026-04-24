import { motion } from "framer-motion";
import { Sparkles, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopBarProps {
  status: "connected" | "processing" | "offline";
  model: string;
  onModelChange: (m: string) => void;
}

const statusConfig = {
  connected: { label: "Connected", color: "bg-accent" },
  processing: { label: "Processing", color: "bg-primary" },
  offline: { label: "Offline", color: "bg-destructive" },
};

export const TopBar = ({ status, model, onModelChange }: TopBarProps) => {
  const cfg = statusConfig[status];
  return (
    <header className="h-16 px-5 md:px-8 flex items-center justify-between glass-strong border-b border-border/40 z-10">
      <div className="flex items-center gap-3">
        <div className="md:hidden p-2 rounded-lg bg-gradient-aurora">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-base md:text-lg">Document Assistant</h2>
          <p className="text-[11px] text-muted-foreground hidden md:block">Ask anything about your indexed documents</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Model selector */}
        <div className="relative">
          <select
            value={model}
            onChange={(e) => onModelChange(e.target.value)}
            className="appearance-none pl-3 pr-8 py-1.5 text-xs font-medium rounded-lg glass border border-border/60 hover:border-border transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <option value="groq-llama">Groq · Llama 3.1</option>
            <option value="groq-mixtral">Groq · Mixtral</option>
            <option value="openai-gpt4">OpenAI · GPT-4</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-border/60">
          <span className="relative flex h-2 w-2">
            <motion.span
              className={cn("absolute inline-flex h-full w-full rounded-full opacity-70", cfg.color)}
              animate={{ scale: [1, 2, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className={cn("relative inline-flex rounded-full h-2 w-2", cfg.color)} />
          </span>
          <span className="text-xs font-medium">{cfg.label}</span>
        </div>
      </div>
    </header>
  );
};
