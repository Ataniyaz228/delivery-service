"use client";
import { createContext, useContext, useCallback, useState, useRef } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";
interface Toast { id: number; msg: string; type: ToastType; }

interface ToastCtx { toast: (msg: string, type?: ToastType) => void; }
const Ctx = createContext<ToastCtx>({ toast: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const toast = useCallback((msg: string, type: ToastType = "success") => {
    const id = ++counter.current;
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  const dismiss = (id: number) => setToasts(p => p.filter(t => t.id !== id));

  const icons = { success: <CheckCircle size={15} />, error: <AlertCircle size={15} />, info: <Info size={15} /> };
  const colors = { success: "#1DB954", error: "#FF4757", info: "#4F8EF7" };

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div style={{ position: "fixed", bottom: "5rem", right: "1.5rem", zIndex: 9999, display: "flex", flexDirection: "column", gap: "0.5rem", pointerEvents: "none" }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            display: "flex", alignItems: "center", gap: "0.75rem",
            padding: "12px 16px", background: "#1E1E1E",
            border: `1px solid rgba(${colors[t.type] === "#1DB954" ? "29,185,84" : colors[t.type] === "#FF4757" ? "255,71,87" : "79,142,247"},0.3)`,
            borderRadius: 12, color: "#EFEFEF", fontSize: "0.85rem", fontWeight: 500,
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            animation: "rise 0.25s ease both", maxWidth: 320,
            pointerEvents: "all",
          }}>
            <span style={{ color: colors[t.type], flexShrink: 0 }}>{icons[t.type]}</span>
            <span style={{ flex: 1 }}>{t.msg}</span>
            <button onClick={() => dismiss(t.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#555", padding: 2, display: "flex" }}>
              <X size={13} />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export const useToast = () => useContext(Ctx);
