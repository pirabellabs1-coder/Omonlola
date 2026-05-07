"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

type ConfirmFn = (opts: { title: string; message?: string; danger?: boolean; confirmText?: string }) => Promise<boolean>;

const ConfirmCtx = createContext<ConfirmFn>(async () => false);

export function useConfirm() {
  return useContext(ConfirmCtx);
}

type State =
  | { open: false }
  | {
      open: true;
      title: string;
      message?: string;
      danger?: boolean;
      confirmText?: string;
      resolve: (v: boolean) => void;
    };

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({ open: false });

  const ask = useCallback<ConfirmFn>(
    (opts) =>
      new Promise<boolean>((resolve) => {
        setState({ open: true, ...opts, resolve });
      }),
    []
  );

  const close = (v: boolean) => {
    if (state.open) state.resolve(v);
    setState({ open: false });
  };

  return (
    <ConfirmCtx.Provider value={ask}>
      {children}
      {state.open && (
        <div className="confirm-overlay" onClick={() => close(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-panel max-w-md w-[92%] p-6 toast-anim"
          >
            <div className="flex items-start gap-4 mb-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  state.danger ? "bg-red-500/15 text-red-400" : "bg-brand/15 text-brand"
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">{state.title}</h3>
                {state.message && <p className="text-sm text-text-muted mt-1">{state.message}</p>}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => close(false)}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-text-muted hover:bg-white/5"
              >
                Annuler
              </button>
              <button
                onClick={() => close(true)}
                className={`px-4 py-2 rounded-lg text-sm font-bold ${
                  state.danger
                    ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                    : "bg-brand text-white hover:bg-brand-light"
                }`}
              >
                {state.confirmText ?? "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmCtx.Provider>
  );
}
