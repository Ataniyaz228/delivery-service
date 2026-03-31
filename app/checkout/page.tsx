"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, CheckCircle, Package, MapPin, FileText, ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/lib/toast-context";
import { useSession } from "next-auth/react";

type Step = 0 | 1 | 2;

const STEP_LABELS = ["Себет", "Жеткізу", "Растау"];

export default function CheckoutPage() {
  const { items, total, change, remove, clear } = useCart();
  const { toast } = useToast();
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [placing, setPlacing] = useState(false);
  const [done, setDone] = useState(false);

  const handleOrder = async () => {
    if (!session) { router.push("/auth/login"); return; }
    if (!address.trim()) { toast("Мекенжайды енгізіңіз", "error"); return; }
    setPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
          deliveryAddress: address,
          note,
        }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      clear();
      setDone(true);
    } catch (e: any) {
      toast(e.message || "Қате орын алды", "error");
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0 && !done) return (
    <main style={{ paddingTop: 58, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <ShoppingBag size={64} style={{ color: "var(--txt-3)", marginBottom: "1.5rem" }} />
        <h1 style={{ fontFamily: "var(--font-d)", fontSize: "1.5rem", fontWeight: 800, color: "var(--txt)", marginBottom: "0.75rem" }}>Себет бос</h1>
        <p style={{ color: "var(--txt-2)", marginBottom: "1.5rem" }}>Тапсырыс беру үшін тауар таңдаңыз</p>
        <Link href="/catalog" className="btn btn-brand btn-lg">Каталогқа өту <ArrowRight size={16} /></Link>
      </div>
    </main>
  );

  if (done) return (
    <main style={{ paddingTop: 58, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", padding: "2rem", animation: "pop 0.4s var(--ease-spring) both" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--green-dim)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", border: "3px solid var(--green)" }}>
          <CheckCircle size={36} style={{ color: "var(--green)" }} />
        </div>
        <h1 style={{ fontFamily: "var(--font-d)", fontSize: "2rem", fontWeight: 800, color: "var(--txt)", marginBottom: "0.75rem", letterSpacing: "-0.03em" }}>Тапсырыс берілді!</h1>
        <p style={{ color: "var(--txt-2)", marginBottom: "0.5rem" }}>Жеткізу 30–60 минут ішінде</p>
        <p style={{ fontSize: "0.85rem", color: "var(--txt-3)", marginBottom: "2rem" }}>Мекенжай: <strong style={{ color: "var(--txt)" }}>{address}</strong></p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
          <Link href="/orders" className="btn btn-brand btn-lg">Тапсырыстарым <ArrowRight size={16} /></Link>
          <Link href="/catalog" className="btn btn-stroke btn-lg">Каталог</Link>
        </div>
      </div>
    </main>
  );

  return (
    <main style={{ paddingTop: 58, minHeight: "100vh", background: "var(--bg)" }}>
      <div className="container" style={{ maxWidth: 900, paddingTop: "3rem", paddingBottom: "4rem" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.5rem" }}>
          <Link href="/catalog" style={{ color: "var(--txt-3)", display: "flex", alignItems: "center" }}><ArrowLeft size={18} /></Link>
          <h1 style={{ fontFamily: "var(--font-d)", fontSize: "1.5rem", fontWeight: 800, color: "var(--txt)", letterSpacing: "-0.02em" }}>Тапсырыс беру</h1>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "2.5rem" }}>
          {STEP_LABELS.map((label, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: i < step ? "var(--green)" : i === step ? "var(--brand)" : "var(--bg-raised)",
                  border: i < step ? "none" : i === step ? "none" : "2px solid var(--border-hi)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-d)", fontWeight: 800, fontSize: "0.9rem",
                  color: i <= step ? "#000" : "var(--txt-3)",
                  transition: "all 0.3s",
                }}>
                  {i < step ? <CheckCircle size={17} /> : i + 1}
                </div>
                <span style={{ fontSize: "0.73rem", fontWeight: 700, color: i <= step ? "var(--txt)" : "var(--txt-3)", whiteSpace: "nowrap" }}>{label}</span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div style={{ flex: 1, height: 2, background: i < step ? "var(--green)" : "var(--border-hi)", margin: "0 0.5rem", marginBottom: 22, transition: "background 0.3s" }} />
              )}
            </div>
          ))}
        </div>

        <div className="checkout-layout">
          {/* Main content */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "2rem" }}>
            {/* Step 0: Cart review */}
            {step === 0 && (
              <div>
                <h2 style={{ fontFamily: "var(--font-d)", fontWeight: 800, fontSize: "1.1rem", color: "var(--txt)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: 8 }}>
                  <ShoppingBag size={17} style={{ color: "var(--brand)" }} /> Себеттегі тауарлар
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {items.map(item => (
                    <div key={item.id} style={{ display: "flex", gap: "1rem", alignItems: "center", padding: "0.85rem", background: "var(--bg-raised)", borderRadius: "var(--r)", border: "1px solid var(--border)" }}>
                      {item.imageUrl && (
                        <div style={{ width: 52, height: 52, borderRadius: "var(--r-sm)", overflow: "hidden", flexShrink: 0 }}>
                          <Image src={item.imageUrl} alt={item.nameKz} width={52} height={52} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "var(--font-d)", fontWeight: 700, fontSize: "0.9rem", color: "var(--txt)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.nameKz}</div>
                        <div style={{ fontSize: "0.82rem", color: "var(--brand)", fontWeight: 800, fontFamily: "var(--font-d)" }}>{(item.price * item.quantity).toLocaleString()} ₸</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div className="qty" style={{ padding: 3 }}>
                          <button className="qty__btn" style={{ width: 28, height: 28 }} onClick={() => change(item.id, item.quantity - 1)}><Minus size={12} /></button>
                          <span className="qty__n" style={{ minWidth: 20 }}>{item.quantity}</span>
                          <button className="qty__btn" style={{ width: 28, height: 28 }} onClick={() => change(item.id, item.quantity + 1)}><Plus size={12} /></button>
                        </div>
                        <button onClick={() => remove(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--txt-3)", padding: 4 }}><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn btn-brand btn-full btn-lg" style={{ marginTop: "1.5rem", justifyContent: "center" }} onClick={() => setStep(1)}>
                  Жалғастыру <ArrowRight size={16} />
                </button>
              </div>
            )}

            {/* Step 1: Delivery address */}
            {step === 1 && (
              <div>
                <h2 style={{ fontFamily: "var(--font-d)", fontWeight: 800, fontSize: "1.1rem", color: "var(--txt)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: 8 }}>
                  <MapPin size={17} style={{ color: "var(--brand)" }} /> Жеткізу мекенжайы
                </h2>
                <div className="fgroup">
                  <label className="flabel">Мекенжай *</label>
                  <input className="finput" type="text" placeholder="Алматы, Абай даңғылы 44, пәтер 12"
                    value={address} onChange={e => setAddress(e.target.value)} autoFocus />
                </div>
                <div className="fgroup" style={{ marginBottom: "1.5rem" }}>
                  <label className="flabel">Ескертпе (опционал)</label>
                  <textarea className="finput ftextarea" placeholder="Курьерге арнайы сұраныстар..."
                    value={note} onChange={e => setNote(e.target.value)} style={{ minHeight: 80 }} />
                </div>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button className="btn btn-ghost btn-lg" style={{ flex: 0 }} onClick={() => setStep(0)}><ArrowLeft size={15} /></button>
                  <button className="btn btn-brand btn-full btn-lg" onClick={() => {
                    if (!address.trim()) { toast("Мекенжайды енгізіңіз", "error"); return; }
                    setStep(2);
                  }}>
                    Растауға өту <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Confirm */}
            {step === 2 && (
              <div>
                <h2 style={{ fontFamily: "var(--font-d)", fontWeight: 800, fontSize: "1.1rem", color: "var(--txt)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: 8 }}>
                  <FileText size={17} style={{ color: "var(--brand)" }} /> Тапсырысты растау
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                  {[
                    { icon: <MapPin size={15} />, label: "Мекенжай", val: address },
                    { icon: <Package size={15} />, label: "Тауарлар", val: `${items.length} тауар, ${items.reduce((s, i) => s + i.quantity, 0)} дана` },
                    ...(note ? [{ icon: <FileText size={15} />, label: "Ескертпе", val: note }] : []),
                  ].map(r => (
                    <div key={r.label} style={{ display: "flex", gap: "0.85rem", padding: "1rem", background: "var(--bg-raised)", borderRadius: "var(--r)", border: "1px solid var(--border)", alignItems: "flex-start" }}>
                      <span style={{ color: "var(--brand)", flexShrink: 0, marginTop: 2 }}>{r.icon}</span>
                      <div>
                        <div style={{ fontSize: "0.73rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--txt-3)", marginBottom: "3px" }}>{r.label}</div>
                        <div style={{ fontSize: "0.88rem", color: "var(--txt)", fontWeight: 600 }}>{r.val}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button className="btn btn-ghost btn-lg" style={{ flex: 0 }} onClick={() => setStep(1)}><ArrowLeft size={15} /></button>
                  <button className="btn btn-brand btn-full btn-lg" onClick={handleOrder} disabled={placing}>
                    {placing ? "Жіберілуде..." : <><CheckCircle size={16} /> Тапсырыс беру — {total.toLocaleString()} ₸</>}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "1.5rem", position: "sticky", top: 80 }}>
            <div style={{ fontFamily: "var(--font-d)", fontWeight: 800, fontSize: "0.95rem", color: "var(--txt)", marginBottom: "1.25rem" }}>Тапсырыс қорытындысы</div>
            {items.map(item => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", marginBottom: "0.6rem" }}>
                <span style={{ color: "var(--txt-2)" }}>{item.nameKz} × {item.quantity}</span>
                <span style={{ color: "var(--txt)", fontWeight: 700 }}>{(item.price * item.quantity).toLocaleString()} ₸</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid var(--border)", margin: "1rem 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.83rem" }}>
              <span style={{ color: "var(--txt-2)" }}>Тауарлар</span>
              <span style={{ color: "var(--txt)", fontWeight: 700 }}>{total.toLocaleString()} ₸</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", fontSize: "0.83rem" }}>
              <span style={{ color: "var(--txt-2)" }}>Жеткізу</span>
              <span style={{ color: "var(--green)", fontWeight: 700 }}>590 ₸</span>
            </div>
            <div style={{ borderTop: "1px solid var(--border)", marginBottom: "1rem" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--txt)" }}>Жалпы</span>
              <span style={{ fontFamily: "var(--font-d)", fontSize: "1.4rem", fontWeight: 800, color: "var(--brand)" }}>{(total + 590).toLocaleString()} ₸</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
