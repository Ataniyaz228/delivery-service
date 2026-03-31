"use client";
import { use, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Package, CheckCircle, AlertCircle, Minus, Plus, Clock, Truck, MapPin, ShoppingBag, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/lib/toast-context";

export default function ProductPage({ params: pp }: { params: Promise<{ id: string }> }) {
  const { id } = use(pp);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [ordering, setOrdering] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [related, setRelated] = useState<any[]>([]);
  const { data: session } = useSession();
  const router = useRouter();
  const { add } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(r => r.json())
      .then(d => {
        setProduct(d);
        setLoading(false);
        // Load related products from same category
        if (d.categoryId) {
          fetch(`/api/products?category=${d.categoryId}&limit=4`)
            .then(r => r.json())
            .then(rd => setRelated((rd.products || []).filter((p: any) => String(p.id) !== String(id)).slice(0, 3)));
        }
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < qty; i++) {
      add({ id: product.id, nameKz: product.nameKz, price: Number(product.price), imageUrl: product.imageUrl, categoryName: product.categoryName });
    }
    toast(`${qty}× "${product.nameKz}" себетке қосылды`, "success");
  };

  const handleOrder = async () => {
    if (!session) { router.push("/auth/login"); return; }
    if (!address.trim()) { setError("Жеткізу мекенжайын енгізіңіз"); return; }
    setOrdering(true); setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [{ productId: product.id, quantity: qty }], deliveryAddress: address, note }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      setSuccess(true);
      toast("Тапсырыс сәтті берілді!", "success");
    } catch (e: any) { setError(e.message || "Қате"); }
    finally { setOrdering(false); }
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", paddingTop: 58 }}>
      <div style={{ width: 30, height: 30, border: "3px solid var(--bg-raised)", borderTopColor: "var(--brand)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );
  if (!product || product.error) return (
    <div style={{ textAlign: "center", padding: "6rem 2rem" }}>
      <Package size={52} style={{ color: "var(--txt-3)", marginBottom: "1rem" }} />
      <h1 style={{ fontFamily: "var(--font-d)", fontSize: "1.4rem", color: "var(--txt)", marginBottom: "1rem" }}>Тауар табылмады</h1>
      <Link href="/catalog" className="btn btn-stroke"><ArrowLeft size={14} /> Каталог</Link>
    </div>
  );

  const totalPrice = (Number(product.price) * qty).toLocaleString();

  return (
    <main style={{ paddingTop: 58 }}>
      {/* Fullwidth hero image */}
      <div style={{ position: "relative", height: "45vh", minHeight: 280, background: "var(--bg-raised)", overflow: "hidden" }}>
        {product.imageUrl
          ? <Image
              src={product.imageUrl}
              alt={product.nameKz}
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
              priority
              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--txt-3)" }}><Package size={80} /></div>
        }
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "2rem" }}>
          <div className="container" style={{ maxWidth: 1260 }}>
            <div className="crumb" style={{ color: "rgba(255,255,255,0.6)", marginBottom: "0.5rem" }}>
              <Link href="/" style={{ color: "rgba(255,255,255,0.6)" }}>Басты бет</Link>
              <span>/</span>
              <Link href="/catalog" style={{ color: "rgba(255,255,255,0.6)" }}>Каталог</Link>
              <span>/</span>
              <span style={{ color: "#fff" }}>{product.nameKz}</span>
            </div>
            <h1 style={{ fontFamily: "var(--font-d)", fontWeight: 800, fontSize: "clamp(1.8rem, 4vw, 3rem)", color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.1 }}>{product.nameKz}</h1>
          </div>
        </div>
        <Link href="/catalog" style={{ position: "absolute", top: "1.5rem", left: "1.5rem", background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "var(--r-full)", padding: "8px 16px", display: "flex", alignItems: "center", gap: 7, fontSize: "0.82rem", fontWeight: 600 }}>
          <ArrowLeft size={14} /> Каталог
        </Link>
      </div>

      <section className="sec" style={{ paddingTop: "3rem" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "3rem", alignItems: "start" }}>
            {/* LEFT: info */}
            <div>
              {product.categoryName && (
                <div className="pd__tag" style={{ marginBottom: "1.5rem" }}><Package size={11} /> {product.categoryName}</div>
              )}

              {/* Delivery badges row */}
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "2rem" }}>
                <div className="d-badge"><Clock size={14} /> 25–40 мин</div>
                <div className="d-badge"><Truck size={14} /> Жеткізу 590 ₸</div>
                <div className="d-badge"><MapPin size={14} /> Алматы</div>
              </div>

              {product.descriptionKz && (
                <>
                  <h2 style={{ fontFamily: "var(--font-d)", fontWeight: 700, fontSize: "1rem", color: "var(--txt)", marginBottom: "0.75rem" }}>Сипаттама</h2>
                  <p style={{ fontSize: "0.95rem", color: "var(--txt-2)", lineHeight: 1.8, marginBottom: "2.5rem" }}>{product.descriptionKz}</p>
                </>
              )}

              {/* Composition section */}
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "1.5rem", marginBottom: "2rem" }}>
                <h3 style={{ fontFamily: "var(--font-d)", fontWeight: 700, fontSize: "0.95rem", color: "var(--txt)", marginBottom: "1rem" }}>Құрамы</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {["Табиғи ингредиенттер", "Ешбір консервант жоқ", "Тез дайындалады", "Жоғары сапа"].map(tag => (
                    <span key={tag} style={{ padding: "5px 12px", background: "var(--bg-raised)", border: "1px solid var(--border)", borderRadius: "var(--r-full)", fontSize: "0.78rem", color: "var(--txt-2)" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Related products */}
              {related.length > 0 && (
                <div>
                  <h2 style={{ fontFamily: "var(--font-d)", fontWeight: 700, fontSize: "1.05rem", color: "var(--txt)", marginBottom: "1rem" }}>Ұқсас тауарлар</h2>
                  <div style={{ display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
                    {related.map((r: any) => (
                      <Link href={`/products/${r.id}`} key={r.id} style={{ flexShrink: 0, width: 180, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--r)", overflow: "hidden", transition: "border-color 0.2s" }}>
                        {r.imageUrl
                          ? <Image
                              src={r.imageUrl}
                              alt={r.nameKz}
                              width={180} height={120}
                              style={{ display: "block", width: "100%", height: 110, objectFit: "cover" }}
                              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                            />
                          : <div style={{ height: 110, background: "var(--bg-raised)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--txt-3)" }}><Package size={28} /></div>
                        }
                        <div style={{ padding: "0.75rem" }}>
                          <div style={{ fontFamily: "var(--font-d)", fontWeight: 700, fontSize: "0.82rem", color: "var(--txt)", marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.nameKz}</div>
                          <div style={{ fontFamily: "var(--font-d)", fontWeight: 800, fontSize: "0.9rem", color: "var(--brand)" }}>{Number(r.price).toLocaleString()} ₸</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: sticky order panel */}
            <div style={{ position: "sticky", top: "80px", background: "var(--bg-card)", border: "1px solid var(--border-hi)", borderRadius: "var(--r-xl)", padding: "1.75rem" }}>
              <div className="pd__price" style={{ marginBottom: "0.5rem" }}>{Number(product.price).toLocaleString()} <sub>₸</sub></div>
              <div className={`pd__avail${product.stock > 0 ? " in" : " out"}`} style={{ marginBottom: "1.5rem" }}>
                {product.stock > 0 ? <><CheckCircle size={14} /> Қолда бар ({product.stock} дана)</> : <><AlertCircle size={14} /> Таусылды</>}
              </div>

              {product.stock > 0 && (
                <>
                  {success ? (
                    <div className="alert alert-ok"><CheckCircle size={14} /> Тапсырыс берілді! Жеткізу 30–60 мин.</div>
                  ) : (
                    <>
                      {/* Qty */}
                      <div style={{ marginBottom: "1.25rem" }}>
                        <div className="flabel" style={{ marginBottom: "0.6rem" }}>Саны</div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <div className="qty">
                            <button className="qty__btn" onClick={() => setQty(q => Math.max(1, q - 1))}><Minus size={13} /></button>
                            <span className="qty__n">{qty}</span>
                            <button className="qty__btn" onClick={() => setQty(q => Math.min(product.stock, q + 1))}><Plus size={13} /></button>
                          </div>
                          <span style={{ fontFamily: "var(--font-d)", fontWeight: 800, fontSize: "1.15rem", color: "var(--brand)" }}>{totalPrice} ₸</span>
                        </div>
                      </div>

                      {/* Add to cart button */}
                      <button className="btn btn-brand btn-full btn-lg" style={{ marginBottom: "0.75rem", justifyContent: "center" }} onClick={handleAddToCart}>
                        <ShoppingCart size={16} /> Себетке қосу
                      </button>

                      {/* Direct order */}
                      <div style={{ background: "var(--bg-raised)", border: "1px solid var(--border)", borderRadius: "var(--r)", padding: "1rem", marginBottom: "0.75rem" }}>
                        <div className="flabel" style={{ marginBottom: "0.5rem" }}>Тікелей тапсырыс</div>
                        <input className="finput" type="text" placeholder="Жеткізу мекенжайы *"
                          value={address} onChange={e => setAddress(e.target.value)} style={{ marginBottom: "0.5rem" }} />
                        <input className="finput" type="text" placeholder="Ескертпе (опционал)"
                          value={note} onChange={e => setNote(e.target.value)} />
                      </div>

                      {error && <div className="alert alert-err" style={{ marginBottom: "0.5rem" }}><AlertCircle size={14} /> {error}</div>}

                      <button className="btn btn-stroke btn-full" onClick={handleOrder} disabled={ordering}>
                        <ShoppingBag size={15} />
                        {ordering ? "..." : `Тікелей тапсырыс — ${totalPrice} ₸`}
                      </button>

                      {!session && (
                        <p style={{ textAlign: "center", fontSize: "0.78rem", color: "var(--txt-2)", marginTop: "0.75rem" }}>
                          <Link href="/auth/login" style={{ color: "var(--brand)", fontWeight: 700 }}>Кіріңіз</Link> немесе <Link href="/auth/register" style={{ color: "var(--brand)", fontWeight: 700 }}>тіркеліңіз</Link>
                        </p>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="footer"><div className="container"><div className="footer__in">
        <span className="footer__copy">© 2024 JetDelivery</span>
      </div></div></footer>
    </main>
  );
}
