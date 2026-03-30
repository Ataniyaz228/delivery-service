"use client";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/lib/cart-context";
import { ToastProvider } from "@/lib/toast-context";
import FloatingCart from "@/components/FloatingCart";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <CartProvider>
          {children}
          <FloatingCart />
        </CartProvider>
      </ToastProvider>
    </SessionProvider>
  );
}
