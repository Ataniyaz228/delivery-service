"use client";
import { useState, useEffect } from "react";
import { Package, MapPin, Clock, RefreshCw, ShoppingBag, CheckCircle, Truck, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/lib/toast-context";

type Tab = "active" | "history" | "cancelled";

const ST_MAP: Record<string, { label: string; cls: string }> = {
  pending:    { label: "Өңделуде",     cls: "st-pending" },
  confirmed:  { label: "Расталды",     cls: "st-confirmed" },
  delivering: { label: "Жеткізілуде", cls: "st-delivering" },
  delivered:  { label: "Жеткізілді",  cls: "st-delivered" },
  cancelled:  { label: "Бас тартылды",cls: "st-cancelled" },
};

const STEPS = ["Қабылданды", "Дайындалуда", "Жолда", "Жеткізілді"];
const stepIdx = (s: string) =>
  s === "confirmed" ? 1 : s === "delivering" ? 2 : s === "delivered" ? 3 : 0;

function TrackerBar({ status }: { status: string }) {
  const cur = stepIdx(status);
  return (
    <div style={{ marginBottom: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
        {STEPS.map((step, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
              {i > 0 && <div style={{ flex: 1, height: 2, background: i <= cur ? "var(--brand)" : "var(--border-hi)", transition: "background 0.3s" }} />}
              <div style={{
                width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                background: i <= cur ? "var(--brand)" : "var(--bg-raised)",
                border: i <= cur ? "none" : "2px solid var(--border-hi)",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.3s",
              }}>
                {i <= cur ? <CheckCircle size={14} color="#000" /> : <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--txt-3)", display: "block" }} />}
              </div>
              {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: i < cur ? "var(--brand)" : "var(--border-hi)", transition: "background 0.3s" }} />}
            </div>
            <span style={{ fontSize: "0.67rem", color: i <= cur ? "var(--brand)" : "var(--txt-3)", fontWeight: i === cur ? 700 : 400, whiteSpace: "nowrap" }}>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("active");
  const [expanded, setExpanded] = useState<number | null>(null);
  const { add } = useCart();
  const { toast } = useToast();

  const load = () => {
    setLoading(true);
    fetch("/api/orders")
      .then(r => { if (r.status === 401) { window.location.href = "/auth/login"; return null; } return r.json(); })
      .then(d => { if (Array.isArray(d)) setOrders(d); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = orders.filter(o => {
    if (tab === "active") return ["pending", "confirmed", "delivering"].includes(o.status);
    if (tab === "cancelled") return o.status === "cancelled";
    return o.status === "delivered";
  });

  const TABS: { key: Tab; label: string; count: number }[] = [
    { key: "active", label: "Активті", count: orders.filter(o => ["pending","confirmed","delivering"].includes(o.status)).length },
    { key: "history", label: "Тарих", count: orders.filter(o => o.status === "delivered").length },
    { key: "cancelled", label: "Бас тартылды", count: orders.filter(o => o.status === "cancelled").length },
  ];

  return (
    <main>
      <div className="pg-head">
        <div className="container">
          <div className="pg-head__eyebrow">Жеке кабинет</div>
          <h1 className="pg-head__title">Тапсырыстар</h1>
          <p className="pg-head__sub">Барлық тапсырыстарыңыздың күйін осы жерде қадағалаңыз</p>
        </div>
      </div>

      <section className="sec">
        <div className="container" style={{ maxWidth: 820 }}>


          {/* Tabs */}
          <div style={{ display: "flex", gap: "0.25rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--r)", padding: "4px", marginBottom: "1.5rem" }}>
            {TABS.map(t => (
              <button key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  flex: 1, padding: "9px 16px", border: "none", borderRadius: "var(--r-sm)",
                  fontFamily: "var(--font)", fontWeight: 600, fontSize: "0.84rem",
                  cursor: "pointer", transition: "all 0.2s",
                  background: tab === t.key ? "var(--brand)" : "none",
                  color: tab === t.key ? "#000" : "var(--txt-2)",
                }}
              >
                {t.label}
                {t.count > 0 && (
                  <span style={{ marginLeft: 6, background: tab === t.key ? "rgba(0,0,0,0.2)" : "var(--bg-raised)", color: tab === t.key ? "#000" : "var(--txt-3)", borderRadius: "99px", padding: "1px 7px", fontSize: "0.7rem" }}>
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.25rem" }}>
            <button className="btn btn-ghost btn-sm" onClick={load}><RefreshCw size={13} /> Жаңарту</button>
          </div>

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skel-card" style={{ height: 110 }} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty">
              <div className="empty__icon"><Package size={50} /></div>
              <div className="empty__title">Тапсырыстар жоқ</div>
              <div className="empty__sub">{tab === "active" ? "Активті тапсырыстар жоқ" : "Тарих бос"}</div>
              <Link href="/catalog" className="btn btn-brand" style={{ marginTop: "1.5rem", display: "inline-flex" }}>
                <ShoppingBag size={15} /> Тапсырыс беру
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {filtered.map((o: any) => {
                const s = ST_MAP[o.status] || { label: o.status, cls: "" };
                const isExp = expanded === o.id;
                return (
                  <div key={o.id} className="ocard">
                    <div className="ocard__top">
                      <div>
                        <div className="ocard__id">Тапсырыс #{o.id}</div>
                        <div className="ocard__date"><Clock size={11} />{new Date(o.createdAt).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
                      </div>
                      <span className={`stbadge ${s.cls}`}>{s.label}</span>
                    </div>

                    {tab === "active" && <TrackerBar status={o.status} />}

                    <div className="ocard__addr"><MapPin size={14} style={{ color: "var(--brand)", flexShrink: 0 }} />{o.deliveryAddress}</div>
                    <div className="ocard__total">{Number(o.totalPrice).toLocaleString()} ₸</div>

                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
                      <button
                        onClick={() => setExpanded(isExp ? null : o.id)}
                        className="btn btn-ghost btn-sm"
                        style={{ display: "flex", alignItems: "center", gap: 5 }}
                      >
                        {isExp ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        {isExp ? "Жабу" : "Толығырақ"}
                      </button>
                      {o.status === "delivered" && (
                        <button className="btn btn-brand btn-sm" style={{ display: "flex", alignItems: "center", gap: 5 }}
                          onClick={() => { toast("Тауарлар себетке қосылды!", "info"); }}>
                          <RotateCcw size={13} /> Қайта тапсырыс
                        </button>
                      )}
                    </div>

                    {isExp && o.note && (
                      <div style={{ marginTop: "0.75rem", padding: "0.75rem 1rem", background: "var(--bg-raised)", borderRadius: "var(--r-sm)", fontSize: "0.82rem", color: "var(--txt-2)" }}>
                        <strong style={{ color: "var(--txt)" }}>Ескертпе:</strong> {o.note}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <footer className="footer"><div className="container"><div className="footer__in">
        <span className="footer__copy">© 2024 JetDelivery</span>
        <Link href="/catalog" className="footer__link">Каталог</Link>
      </div></div></footer>
    </main>
  );
}
