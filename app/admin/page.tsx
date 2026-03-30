"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Plus, Package, RefreshCw, CheckCircle, AlertCircle,
  LayoutDashboard, ShoppingBag, BarChart3, Users, TrendingUp,
  Clock, Edit3, Save, X, Eye, Trash2, Image as ImgIcon,
} from "lucide-react";

const ST_OPT: Record<string, string> = {
  pending: "Өңделуде", confirmed: "Расталды",
  delivering: "Жеткізілуде", delivered: "Жеткізілді", cancelled: "Бас тартылды",
};
const ST_CLS: Record<string, string> = {
  pending: "st-pending", confirmed: "st-confirmed",
  delivering: "st-delivering", delivered: "st-delivered", cancelled: "st-cancelled",
};

type AdminTab = "dashboard" | "orders" | "products" | "users";

function KpiCard({ icon, label, value, sub, color }: { icon: any; label: string; value: string; sub?: string; color: string }) {
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "1.5rem", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: color }} />
      <div style={{ width: 40, height: 40, borderRadius: "var(--r-sm)", background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem", color }}>
        {icon}
      </div>
      <div style={{ fontFamily: "var(--font-d)", fontSize: "1.9rem", fontWeight: 800, color: "var(--txt)", letterSpacing: "-0.03em", marginBottom: "4px" }}>{value}</div>
      <div style={{ fontSize: "0.78rem", color: "var(--txt-2)", fontWeight: 600 }}>{label}</div>
      {sub && <div style={{ fontSize: "0.72rem", color: "var(--txt-3)", marginTop: "4px" }}>{sub}</div>}
    </div>
  );
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [cats, setCats] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Product form
  const [form, setForm] = useState({ nameKz: "", descriptionKz: "", categoryId: "", price: "", stock: "10", imageUrl: "" });
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState(""); const [err, setErr] = useState("");
  const [imgPreview, setImgPreview] = useState(false);

  // Inline edit for products
  const [editId, setEditId] = useState<number | null>(null);
  const [editVals, setEditVals] = useState<any>({});

  // Order search
  const [orderQ, setOrderQ] = useState("");
  const [orderModal, setOrderModal] = useState<any>(null);

  const isAdmin = (session?.user as any)?.role === "admin";

  useEffect(() => {
    if (status === "loading") return;
    if (!session || !isAdmin) { router.push("/"); return; }
    Promise.all([
      fetch("/api/categories").then(r => r.json()),
      fetch("/api/orders?all=true").then(r => r.json()),
      fetch("/api/products?limit=100").then(r => r.json()),
      fetch("/api/admin/users").then(r => r.json()).catch(() => []),
    ]).then(([c, o, p, u]) => {
      setCats(Array.isArray(c) ? c : []);
      setOrders(Array.isArray(o) ? o : []);
      setProducts(Array.isArray(p.products) ? p.products : Array.isArray(p) ? p : []);
      setUsers(Array.isArray(u) ? u : []);
      setLoading(false);
    });
  }, [session, status]);

  const setF = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault(); setAdding(true); setMsg(""); setErr("");
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      setMsg("Тауар сәтті қосылды!");
      setForm({ nameKz: "", descriptionKz: "", categoryId: "", price: "", stock: "10", imageUrl: "" });
      fetch("/api/products?limit=100").then(r => r.json()).then(p =>
        setProducts(Array.isArray(p.products) ? p.products : Array.isArray(p) ? p : [])
      );
    } catch (e: any) { setErr(e.message); }
    finally { setAdding(false); }
  };

  const changeStatus = async (orderId: number, s: string) => {
    await fetch(`/api/orders/${orderId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: s }) });
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: s } : o));
    if (orderModal?.id === orderId) setOrderModal((m: any) => ({ ...m, status: s }));
  };

  const saveEdit = async (id: number) => {
    await fetch(`/api/admin/products/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editVals) });
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...editVals } : p));
    setEditId(null);
  };

  const deleteProduct = async (id: number, name: string) => {
    if (!confirm(`"${name}" тауарын жою? Бұл әрекетті қайтару мүмкін емес.`)) return;
    const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    if (res.ok) setProducts(prev => prev.filter(p => p.id !== id));
  };

  const changeRole = async (userId: number, role: string) => {
    await fetch(`/api/admin/users/${userId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role }) });
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
  };

  if (status === "loading" || loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", paddingTop: 58 }}>
      <div style={{ width: 32, height: 32, border: "3px solid var(--bg-raised)", borderTopColor: "var(--brand)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );

  const revenue = orders.filter(o => o.status === "delivered").reduce((s, o) => s + Number(o.totalPrice), 0);
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length;
  const filteredOrders = orders.filter(o =>
    !orderQ || String(o.id).includes(orderQ) || o.deliveryAddress?.toLowerCase().includes(orderQ.toLowerCase())
  );

  const TABS: { key: AdminTab; label: string; icon: any }[] = [
    { key: "dashboard", label: "Аналитика", icon: <LayoutDashboard size={15} /> },
    { key: "orders", label: "Тапсырыстар", icon: <ShoppingBag size={15} /> },
    { key: "products", label: "Тауарлар", icon: <Package size={15} /> },
    { key: "users", label: "Клиенттер", icon: <Users size={15} /> },
  ];

  return (
    <main>
      <div className="pg-head">
        <div className="container">
          <div className="pg-head__eyebrow">Тек Әкімші</div>
          <h1 className="pg-head__title">Әкімші панелі</h1>
          <p className="pg-head__sub">Барлық тапсырыстар мен тауарларды осы жерден басқарыңыз</p>
        </div>
      </div>

      <section className="sec" style={{ paddingTop: "2rem" }}>
        <div className="container">
          {/* Tab nav */}
          <div style={{ display: "flex", gap: "4px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--r)", padding: "5px", marginBottom: "2rem", flexWrap: "wrap" }}>
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "9px 18px", border: "none", borderRadius: "var(--r-sm)",
                fontFamily: "var(--font)", fontWeight: 600, fontSize: "0.84rem",
                cursor: "pointer", transition: "all 0.2s",
                background: tab === t.key ? "var(--brand)" : "none",
                color: tab === t.key ? "#000" : "var(--txt-2)",
              }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* ── Tab: Dashboard ── */}
          {tab === "dashboard" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
                <KpiCard icon={<ShoppingBag size={18} />} label="Жалпы тапсырыс" value={String(orders.length)} sub="Барлық уақытта" color="var(--brand)" />
                <KpiCard icon={<TrendingUp size={18} />} label="Жалпы кіріс" value={`${revenue.toLocaleString()} ₸`} sub="Жеткізілген тапсырыстардан" color="var(--green)" />
                <KpiCard icon={<BarChart3 size={18} />} label="Бүгін тапсырыс" value={String(todayOrders)} sub="Бүгінгі тапсырыстар саны" color="var(--blue)" />
                <KpiCard icon={<Users size={18} />} label="Клиенттер" value={String(users.length)} sub="Тіркелген пайдаланушылар" color="var(--amber)" />
              </div>

              {/* Status distribution */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "1.5rem" }}>
                  <div className="adm-title" style={{ marginBottom: "1.25rem" }}><BarChart3 size={15} /> Статус бойынша</div>
                  {Object.entries(ST_OPT).map(([k, v]) => {
                    const cnt = orders.filter(o => o.status === k).length;
                    const pct = orders.length ? Math.round((cnt / orders.length) * 100) : 0;
                    return (
                      <div key={k} style={{ marginBottom: "0.75rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "4px" }}>
                          <span className={`stbadge ${ST_CLS[k]}`} style={{ fontSize: "0.67rem" }}>{v}</span>
                          <span style={{ color: "var(--txt-2)", fontWeight: 700 }}>{cnt} ({pct}%)</span>
                        </div>
                        <div style={{ height: 4, background: "var(--bg-raised)", borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: "var(--brand)", borderRadius: 2, transition: "width 1s var(--ease-out)" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "1.5rem" }}>
                  <div className="adm-title" style={{ marginBottom: "1.25rem" }}><Clock size={15} /> Соңғы тапсырыстар</div>
                  {orders.slice(0, 5).map((o: any) => (
                    <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0", borderBottom: "1px solid var(--border)" }}>
                      <div>
                        <div style={{ fontSize: "0.84rem", fontWeight: 700, color: "var(--txt)" }}>#{o.id}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--txt-3)" }}>{o.deliveryAddress?.slice(0, 30)}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--brand)", fontFamily: "var(--font-d)" }}>{Number(o.totalPrice).toLocaleString()} ₸</div>
                        <span className={`stbadge ${ST_CLS[o.status]}`} style={{ fontSize: "0.62rem" }}>{ST_OPT[o.status]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Tab: Orders ── */}
          {tab === "orders" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                <div className="sbar" style={{ maxWidth: 340 }}>
                  <input type="text" placeholder="ID немесе мекенжай бойынша іздеу..." value={orderQ} onChange={e => setOrderQ(e.target.value)} />
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => fetch("/api/orders?all=true").then(r => r.json()).then(d => { if (Array.isArray(d)) setOrders(d); })}>
                  <RefreshCw size={13} />
                </button>
                <span style={{ fontSize: "0.79rem", color: "var(--txt-2)", marginLeft: "auto" }}>{filteredOrders.length} тапсырыс</span>
              </div>

              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border)" }}>
                      {["ID", "Мекенжай", "Сомасы", "Статус", "Күні", "Әрекет"].map(h => (
                        <th key={h} style={{ padding: "1rem 1.25rem", textAlign: "left", fontSize: "0.72rem", fontWeight: 700, color: "var(--txt-3)", textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((o: any) => (
                      <tr key={o.id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "")}>
                        <td style={{ padding: "1rem 1.25rem", fontFamily: "var(--font-d)", fontWeight: 700, color: "var(--txt)", fontSize: "0.88rem" }}>#{o.id}</td>
                        <td style={{ padding: "1rem 1.25rem", fontSize: "0.82rem", color: "var(--txt-2)", maxWidth: 220 }}>
                          <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{o.deliveryAddress}</div>
                        </td>
                        <td style={{ padding: "1rem 1.25rem", fontFamily: "var(--font-d)", fontWeight: 800, color: "var(--brand)", fontSize: "0.9rem" }}>{Number(o.totalPrice).toLocaleString()} ₸</td>
                        <td style={{ padding: "1rem 1.25rem" }}>
                          <select className="adm-select" value={o.status} onChange={e => changeStatus(o.id, e.target.value)}>
                            {Object.entries(ST_OPT).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                          </select>
                        </td>
                        <td style={{ padding: "1rem 1.25rem", fontSize: "0.78rem", color: "var(--txt-3)" }}>
                          {new Date(o.createdAt).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}
                        </td>
                        <td style={{ padding: "1rem 1.25rem" }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => setOrderModal(o)}><Eye size={13} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Order detail modal */}
              {orderModal && (
                <>
                  <div onClick={() => setOrderModal(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 600, backdropFilter: "blur(4px)" }} />
                  <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "var(--bg-card)", border: "1px solid var(--border-hi)", borderRadius: "var(--r-xl)", padding: "2rem", zIndex: 601, width: "min(520px, 90vw)", maxHeight: "80vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(0,0,0,0.7)", animation: "pop 0.2s var(--ease-out)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                      <div style={{ fontFamily: "var(--font-d)", fontWeight: 800, fontSize: "1.1rem", color: "var(--txt)" }}>Тапсырыс #{orderModal.id}</div>
                      <button onClick={() => setOrderModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--txt-3)" }}><X size={18} /></button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.5rem" }}>
                      {[
                        { l: "Мекенжай", v: orderModal.deliveryAddress },
                        { l: "Сомасы", v: `${Number(orderModal.totalPrice).toLocaleString()} ₸` },
                        { l: "Статус", v: ST_OPT[orderModal.status] },
                        { l: "Күні", v: new Date(orderModal.createdAt).toLocaleDateString("ru-RU") },
                      ].map(item => (
                        <div key={item.l} style={{ padding: "0.85rem", background: "var(--bg-raised)", borderRadius: "var(--r-sm)" }}>
                          <div style={{ fontSize: "0.7rem", color: "var(--txt-3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "4px" }}>{item.l}</div>
                          <div style={{ fontSize: "0.87rem", color: "var(--txt)", fontWeight: 600 }}>{item.v}</div>
                        </div>
                      ))}
                    </div>
                    {orderModal.note && (
                      <div style={{ padding: "0.85rem", background: "var(--bg-raised)", borderRadius: "var(--r-sm)", fontSize: "0.84rem", color: "var(--txt-2)", marginBottom: "1.25rem" }}>
                        <strong style={{ color: "var(--txt)" }}>Ескертпе:</strong> {orderModal.note}
                      </div>
                    )}
                    <div className="flabel" style={{ marginBottom: "0.5rem" }}>Статусты өзгерту</div>
                    <select className="finput" value={orderModal.status} onChange={e => { changeStatus(orderModal.id, e.target.value); }}>
                      {Object.entries(ST_OPT).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── Tab: Products ── */}
          {tab === "products" && (
            <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: "1.5rem", alignItems: "start" }}>
              {/* Add form */}
              <div className="adm-panel" style={{ position: "sticky", top: 80 }}>
                <div className="adm-title"><Plus size={15} /> Тауар қосу</div>
                {msg && <div className="alert alert-ok"><CheckCircle size={13} /> {msg}</div>}
                {err && <div className="alert alert-err"><AlertCircle size={13} /> {err}</div>}
                <form onSubmit={handleAdd}>
                  <div className="fgroup">
                    <label className="flabel">Атауы *</label>
                    <input className="finput" type="text" placeholder="Тауар атауы" value={form.nameKz} onChange={setF("nameKz")} required />
                  </div>
                  <div className="fgroup">
                    <label className="flabel">Сипаттама</label>
                    <textarea className="finput ftextarea" style={{ minHeight: 60 }} value={form.descriptionKz} onChange={setF("descriptionKz")} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <div className="fgroup">
                      <label className="flabel">Санат</label>
                      <select className="finput" value={form.categoryId} onChange={setF("categoryId")}>
                        <option value="">—</option>
                        {cats.map((c: any) => <option key={c.id} value={c.id}>{c.nameKz}</option>)}
                      </select>
                    </div>
                    <div className="fgroup">
                      <label className="flabel">Баға ₸ *</label>
                      <input className="finput" type="number" min={0} placeholder="1500" value={form.price} onChange={setF("price")} required />
                    </div>
                  </div>
                  <div className="fgroup">
                    <label className="flabel">Саны</label>
                    <input className="finput" type="number" min={0} value={form.stock} onChange={setF("stock")} />
                  </div>
                  <div className="fgroup">
                    <label className="flabel" style={{ display: "flex", justifyContent: "space-between" }}>
                      Сурет URL
                      {form.imageUrl && <button type="button" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--brand)", fontSize: "0.7rem", font: "inherit" }} onClick={() => setImgPreview(p => !p)}><Eye size={11} /> {imgPreview ? "Жасыру" : "Алдын-ала"}</button>}
                    </label>
                    <input className="finput" type="url" placeholder="https://..." value={form.imageUrl} onChange={setF("imageUrl")} />
                    {imgPreview && form.imageUrl && (
                      <img src={form.imageUrl} alt="" style={{ width: "100%", height: 130, objectFit: "cover", borderRadius: "var(--r-sm)", marginTop: 6, border: "1px solid var(--border)" }} />
                    )}
                  </div>
                  <button type="submit" className="btn btn-brand btn-full" disabled={adding}>
                    <Plus size={14} /> {adding ? "Қосылуда..." : "Тауар қосу"}
                  </button>
                </form>
              </div>

              {/* Products table */}
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", overflow: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border)" }}>
                      {["Тауар", "Санат", "Баға", "Саны", "Сурет URL", ""].map((h, i) => (
                        <th key={i} style={{ padding: "0.9rem 1rem", textAlign: "left", fontSize: "0.71rem", fontWeight: 700, color: "var(--txt-3)", textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p: any) => {
                      const inEdit = editId === p.id;
                      const previewUrl = inEdit ? (editVals.imageUrl ?? p.imageUrl) : p.imageUrl;
                      return (
                        <tr key={p.id} style={{ borderBottom: "1px solid var(--border)" }}>
                          {/* Name + thumbnail */}
                          <td style={{ padding: "0.85rem 1rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                              {previewUrl
                                ? <img src={previewUrl} alt="" style={{ width: 42, height: 42, borderRadius: "var(--r-sm)", objectFit: "cover", flexShrink: 0, border: "1px solid var(--border)" }} />
                                : <div style={{ width: 42, height: 42, background: "var(--bg-raised)", borderRadius: "var(--r-sm)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--txt-3)", flexShrink: 0 }}><Package size={18} /></div>
                              }
                              <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--txt)" }}>{p.nameKz}</span>
                            </div>
                          </td>
                          {/* Category */}
                          <td style={{ padding: "0.85rem 1rem", fontSize: "0.78rem", color: "var(--txt-2)", whiteSpace: "nowrap" }}>{p.categoryName || "—"}</td>
                          {/* Price */}
                          <td style={{ padding: "0.85rem 1rem" }}>
                            {inEdit
                              ? <input type="number" value={editVals.price ?? p.price} onChange={e => setEditVals((v: any) => ({ ...v, price: e.target.value }))} style={{ width: 80, background: "var(--bg-raised)", border: "1px solid var(--brand)", borderRadius: 6, color: "var(--txt)", padding: "4px 8px", fontSize: "0.83rem", outline: "none" }} />
                              : <span style={{ fontFamily: "var(--font-d)", fontWeight: 800, color: "var(--brand)", fontSize: "0.9rem" }}>{Number(p.price).toLocaleString()} ₸</span>
                            }
                          </td>
                          {/* Stock */}
                          <td style={{ padding: "0.85rem 1rem" }}>
                            {inEdit
                              ? <input type="number" value={editVals.stock ?? p.stock} onChange={e => setEditVals((v: any) => ({ ...v, stock: e.target.value }))} style={{ width: 64, background: "var(--bg-raised)", border: "1px solid var(--brand)", borderRadius: 6, color: "var(--txt)", padding: "4px 8px", fontSize: "0.83rem", outline: "none" }} />
                              : <span style={{ fontSize: "0.82rem", color: p.stock > 0 ? "var(--green)" : "var(--red)", fontWeight: 700 }}>{p.stock}</span>
                            }
                          </td>
                          {/* Image URL */}
                          <td style={{ padding: "0.85rem 1rem", maxWidth: 200 }}>
                            {inEdit ? (
                              <input
                                type="url"
                                placeholder="https://..."
                                value={editVals.imageUrl ?? p.imageUrl ?? ""}
                                onChange={e => setEditVals((v: any) => ({ ...v, imageUrl: e.target.value }))}
                                style={{ width: "100%", background: "var(--bg-raised)", border: "1px solid var(--brand)", borderRadius: 6, color: "var(--txt)", padding: "4px 8px", fontSize: "0.78rem", outline: "none" }}
                              />
                            ) : (
                              <span style={{ fontSize: "0.72rem", color: "var(--txt-3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block", maxWidth: 160 }}>
                                {p.imageUrl ? p.imageUrl.slice(0, 40) + (p.imageUrl.length > 40 ? "…" : "") : "—"}
                              </span>
                            )}
                          </td>
                          {/* Actions */}
                          <td style={{ padding: "0.85rem 1rem" }}>
                            {inEdit ? (
                              <div style={{ display: "flex", gap: 4 }}>
                                <button className="btn btn-brand btn-sm" onClick={() => saveEdit(p.id)}><Save size={12} /></button>
                                <button className="btn btn-ghost btn-sm" onClick={() => setEditId(null)}><X size={12} /></button>
                              </div>
                            ) : (
                              <div style={{ display: "flex", gap: 4 }}>
                                <button className="btn btn-ghost btn-sm" title="Өзгерту" onClick={() => { setEditId(p.id); setEditVals({ price: p.price, stock: p.stock, imageUrl: p.imageUrl ?? "" }); }}><Edit3 size={13} /></button>
                                <button className="btn btn-ghost btn-sm" title="Жою" style={{ color: "var(--red)" }} onClick={() => deleteProduct(p.id, p.nameKz)}><Trash2 size={13} /></button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Tab: Users ── */}
          {tab === "users" && (
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    {["Пайдаланушы", "Email", "Телефон", "Рөл", "Өзгерту"].map(h => (
                      <th key={h} style={{ padding: "1rem 1.25rem", textAlign: "left", fontSize: "0.71rem", fontWeight: 700, color: "var(--txt-3)", textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: "center", padding: "3rem", color: "var(--txt-3)", fontSize: "0.85rem" }}>Пайдаланушылар жоқ немесе API жоқ</td></tr>
                  ) : users.map((u: any) => (
                    <tr key={u.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "0.9rem 1.25rem" }}>
                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--brand-dim)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand)", fontFamily: "var(--font-d)", fontWeight: 800, fontSize: "1rem", float: "left", marginRight: 10 }}>
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ paddingLeft: 44 }}>
                          <div style={{ fontSize: "0.87rem", fontWeight: 700, color: "var(--txt)" }}>{u.name}</div>
                          <div style={{ fontSize: "0.72rem", color: "var(--txt-3)" }}>#ID {u.id}</div>
                        </div>
                      </td>
                      <td style={{ padding: "0.9rem 1.25rem", fontSize: "0.82rem", color: "var(--txt-2)" }}>{u.email}</td>
                      <td style={{ padding: "0.9rem 1.25rem", fontSize: "0.82rem", color: "var(--txt-2)" }}>{u.phone || "—"}</td>
                      <td style={{ padding: "0.9rem 1.25rem" }}>
                        <span className={`stbadge ${u.role === "admin" ? "st-confirmed" : "st-delivering"}`} style={{ fontSize: "0.67rem" }}>
                          {u.role === "admin" ? "Әкімші" : "Клиент"}
                        </span>
                      </td>
                      <td style={{ padding: "0.9rem 1.25rem" }}>
                        <select className="adm-select" value={u.role} onChange={e => changeRole(u.id, e.target.value)}>
                          <option value="customer">Клиент</option>
                          <option value="admin">Әкімші</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
