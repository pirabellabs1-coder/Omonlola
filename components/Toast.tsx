"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CheckCircle2, Send, AlertCircle, type LucideIcon } from "lucide-react";

type ToastIcon = "check" | "send" | "error";
type ToastItem = { id: number; msg: string; icon: ToastIcon };

const iconMap: Record<ToastIcon, LucideIcon> = {
  check: CheckCircle2,
  send: Send,
  error: AlertCircle
};

const ToastCtx = createContext<(msg: string, icon?: ToastIcon) => void>(() => {});

export function useToast() {
  return useContext(ToastCtx);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const show = useCallback((msg: string, icon: ToastIcon = "check") => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, msg, icon }]);
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        {items.map((t) => {
          const Icon = iconMap[t.icon];
          return (
            <div
              key={t.id}
              className="bg-brand text-white px-6 py-4 rounded-xl text-sm font-bold flex items-center gap-3 shadow-[0_10px_30px_rgba(0,102,255,0.4)] toast-anim"
            >
              <Icon className="w-5 h-5" />
              <span>{t.msg}</span>
            </div>
          );
        })}
      </div>
    </ToastCtx.Provider>
  );
}
