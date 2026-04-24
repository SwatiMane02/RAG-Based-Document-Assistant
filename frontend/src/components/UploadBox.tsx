import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { uploadFile } from "@/services/api";
import { toast } from "sonner";
import type { UploadedFile } from "@/types/chat";
import { cn } from "@/lib/utils";

interface UploadBoxProps {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
}

export const UploadBox = ({ files, onFilesChange }: UploadBoxProps) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleUpload = useCallback(
    async (accepted: File[]) => {
      for (const file of accepted) {
        const id = crypto.randomUUID();
        const entry: UploadedFile = {
          id,
          name: file.name,
          size: file.size,
          status: "uploading",
          uploadedAt: Date.now(),
        };
        onFilesChange([entry, ...files]);

        try {
          await uploadFile(file);
          onFilesChange([{ ...entry, status: "ready" }, ...files]);
          toast.success(`${file.name} indexed`, { description: "Ready to query." });
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Upload failed";
          onFilesChange([{ ...entry, status: "error" }, ...files]);
          toast.error("Upload failed", { description: msg });
        }
      }
    },
    [files, onFilesChange]
  );

  const dz = useDropzone({
    onDrop: handleUpload,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => setIsDragActive(false),
    accept: { "application/pdf": [".pdf"], "text/plain": [".txt"] },
    multiple: true,
  });

  return (
    <div className="space-y-3">
      <div
        {...dz.getRootProps()}
        tabIndex={0}
        className={cn(
          "relative cursor-pointer rounded-2xl p-5 text-center transition-all duration-300 group overflow-hidden",
          "border border-dashed outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:border-foreground/40",
          isDragActive || dz.isDragActive
            ? "border-foreground/40 bg-muted/50"
            : "border-border/60 hover:border-border hover:bg-muted/30"
        )}
      >
        <input {...dz.getInputProps()} />
        <motion.div
          initial={false}
          animate={{ y: isDragActive ? -4 : 0 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="p-3 rounded-xl bg-muted/60 border border-border/60">
            <Upload className="w-5 h-5 text-foreground/80" />
          </div>
          <p className="text-sm font-medium">Drop a PDF here</p>
          <p className="text-xs text-muted-foreground">or click to browse</p>
        </motion.div>
      </div>

      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {files.map((f) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-3 p-3 rounded-xl glass hover:bg-muted/40 transition-colors group"
            >
              <div className="p-2 rounded-lg bg-muted/60">
                <FileText className="w-4 h-4 text-foreground/70" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{f.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {(f.size / 1024).toFixed(1)} KB
                </p>
              </div>
              {f.status === "uploading" && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
              {f.status === "ready" && <CheckCircle2 className="w-4 h-4 text-foreground/70" />}
              {f.status === "error" && <AlertCircle className="w-4 h-4 text-destructive" />}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
