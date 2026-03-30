"use client";
import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import CartDrawer from "@/components/CartDrawer";

export default function FloatingCart() {
  const [open, setOpen] = useState(false);
  const { count, total } = useCart();

  return (
    <>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
      {count > 0 && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 400,
            display: "flex", alignItems: "center", gap: "0.65rem",
            background: "var(--brand)", color: "#000",
            border: "none", borderRadius: "var(--r-full)",
            padding: "12px 20px 12px 14px",
            fontFamily: "var(--font)", fontWeight: 700, fontSize: "0.88rem",
            cursor: "pointer", boxShadow: "0 8px 32px rgba(255,190,0,0.4)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 14px 40px rgba(255,190,0,0.5)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ""; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 32px rgba(255,190,0,0.4)"; }}
        >
          <div style={{ position: "relative" }}>
            <ShoppingBag size={19} />
            <span style={{
              position: "absolute", top: -8, right: -8,
              background: "#000", color: "var(--brand)",
              borderRadius: "99px", width: 17, height: 17,
              fontSize: "0.65rem", fontWeight: 900,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{count}</span>
          </div>
          <span>{total.toLocaleString()} ₸</span>
        </button>
      )}
    </>
  );
}
