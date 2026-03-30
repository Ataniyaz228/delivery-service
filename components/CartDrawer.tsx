"use client";
import Image from "next/image";
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import Link from "next/link";

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, remove, change, total, clear } = useCart();

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          onClick={onClose}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 500, backdropFilter: "blur(4px)" }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: "min(420px, 95vw)",
        background: "var(--bg-card)", borderLeft: "1px solid var(--border-hi)",
        zIndex: 501, display: "flex", flexDirection: "column",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s var(--ease-out)",
        boxShadow: "-16px 0 48px rgba(0,0,0,0.5)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <ShoppingBag size={18} style={{ color: "var(--brand)" }} />
            <span style={{ fontFamily: "var(--font-d)", fontWeight: 800, fontSize: "1.1rem", color: "var(--txt)" }}>Себет</span>
            {items.length > 0 && (
              <span style={{ background: "var(--brand)", color: "#000", borderRadius: "99px", padding: "2px 8px", fontSize: "0.72rem", fontWeight: 800 }}>
                {items.length}
              </span>
            )}
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            {items.length > 0 && (
              <button onClick={clear} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--txt-3)", display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem", font: "inherit" }}>
                <Trash2 size={12} /> Тазалау
              </button>
            )}
            <button onClick={onClose} style={{ background: "var(--bg-raised)", border: "none", borderRadius: "8px", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--txt-2)" }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.5rem" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
              <ShoppingBag size={52} style={{ color: "var(--txt-3)", marginBottom: "1rem" }} />
              <div style={{ fontFamily: "var(--font-d)", fontWeight: 700, color: "var(--txt)", marginBottom: "0.5rem" }}>Себет бос</div>
              <div style={{ fontSize: "0.84rem", color: "var(--txt-2)" }}>Каталогтан тауар таңдаңыз</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {items.map(item => (
                <div key={item.id} style={{
                  display: "flex", gap: "0.85rem", alignItems: "center",
                  background: "var(--bg-raised)", borderRadius: "var(--r)", padding: "0.85rem",
                  border: "1px solid var(--border)",
                }}>
                  {item.imageUrl ? (
                    <div style={{ width: 56, height: 56, borderRadius: "var(--r-sm)", overflow: "hidden", flexShrink: 0 }}>
                      <Image src={item.imageUrl} alt={item.nameKz} width={56} height={56} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    </div>
                  ) : (
                    <div style={{ width: 56, height: 56, borderRadius: "var(--r-sm)", background: "var(--bg-hover)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "var(--txt-3)", fontSize: "1.4rem" }}>🍽</div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--font-d)", fontWeight: 700, fontSize: "0.88rem", color: "var(--txt)", marginBottom: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.nameKz}</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--brand)", fontWeight: 800, fontFamily: "var(--font-d)" }}>{(item.price * item.quantity).toLocaleString()} ₸</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                    <button onClick={() => change(item.id, item.quantity - 1)} style={{ width: 28, height: 28, border: "1px solid var(--border-hi)", borderRadius: "6px", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--txt-2)" }}>
                      <Minus size={12} />
                    </button>
                    <span style={{ fontFamily: "var(--font-d)", fontWeight: 800, fontSize: "0.9rem", minWidth: 22, textAlign: "center", color: "var(--txt)" }}>{item.quantity}</span>
                    <button onClick={() => change(item.id, item.quantity + 1)} style={{ width: 28, height: 28, border: "1px solid var(--border-hi)", borderRadius: "6px", background: "var(--brand)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontWeight: 800 }}>
                      <Plus size={12} />
                    </button>
                    <button onClick={() => remove(item.id)} style={{ width: 28, height: 28, border: "none", borderRadius: "6px", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--txt-3)", marginLeft: "2px" }}>
                      <X size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: "1.25rem 1.5rem", borderTop: "1px solid var(--border)", background: "var(--bg)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--txt-2)" }}>Жалпы сома</span>
              <span style={{ fontFamily: "var(--font-d)", fontSize: "1.5rem", fontWeight: 800, color: "var(--txt)" }}>{total.toLocaleString()} ₸</span>
            </div>
            <Link href="/checkout" className="btn btn-brand btn-full btn-lg" onClick={onClose} style={{ justifyContent: "center" }}>
              Тапсырыс беру <ArrowRight size={16} />
            </Link>
            <div style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--txt-3)", marginTop: "0.75rem" }}>
              Жеткізу ақысы кейін есептеледі
            </div>
          </div>
        )}
      </div>
    </>
  );
}
