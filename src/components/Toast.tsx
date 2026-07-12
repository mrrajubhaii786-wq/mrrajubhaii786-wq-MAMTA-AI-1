// src/components/Toast.tsx

import React, { useEffect } from "react";
import { AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import { motion } from "motion/react";

interface ToastProps {
  message: string;
  onClose: () => void;
  type?: "error" | "success" | "info";
}

export default function Toast({ message, onClose, type = "error" }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3.5 rounded-xl border shadow-xl max-w-md backdrop-blur-md ${
        type === "error"
          ? "bg-rose-950/85 border-rose-800/60 text-rose-200"
          : type === "success"
          ? "bg-emerald-950/85 border-emerald-800/60 text-emerald-200"
          : "bg-slate-900/85 border-slate-800/60 text-slate-200"
      }`}
    >
      {type === "error" && <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />}
      {type === "success" && <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />}
      {type === "info" && <Info className="w-4 h-4 shrink-0 text-sky-400" />}

      <span className="text-xs font-mono font-medium leading-normal flex-1">
        {message}
      </span>

      <button
        onClick={onClose}
        className="hover:bg-slate-800 p-1 rounded-md transition-colors text-slate-400 hover:text-slate-200"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}
