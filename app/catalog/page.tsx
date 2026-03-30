"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, Package, Utensils, Pizza, Cookie, Coffee, Apple, Milk, ShoppingCart, Clock, Plus, ChevronDown, X, SlidersVertical, ArrowDownUp } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/lib/toast-context";
import { getProductsByCategory, searchProducts, ASTANA_MENU_DATA } from "@/lib/real-data";

const CAT_ICO: Record<string, any> = {
  "pizza": <Pizza size={13} />,
  "burgers": <Utensils size={13} />,
  "sushi": <Utensils size={13} />,
  "kazakh": <Cookie size={13} />,
  "coffee": <Coffee size={13} />,
};

const SORT_OPTIONS = [
  { value: "default", label: "Ең танымал" },
  { value: "price_asc", label: "Арзанынан қымбатқа" },
  { value: "price_desc", label: "Қымбаттан арзанға" },
  { value: "name_asc", label: "Атауы бойынша А-Я" },
];

function CatalogContent() {
  const searchParams = useSearchParams();
  const { add } = useCart();
  const { toast } = useToast();

  const [q, setQ] = useState(searchParams.get("q") || "");
  const [catId, setCatId] = useState(searchParams.get("category") || "");
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cats, setCats] = useState<any[]>(ASTANA_MENU_DATA.categories);
  const [sort, setSort] = useState("default");
  const [priceMax, setPriceMax] = useState(10000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const limit = 12;

  // Load products from local real data
  useEffect(() => {
    setLoading(true);
    let prods = getProductsByCategory(catId || undefined);
    
    // Search filter
    if (q) {
      prods = searchProducts(q);
    }
    
    // Stock filter (simulate - all items in stock for demo)
    if (inStockOnly) {
      prods = prods.filter((p: any) => p.popular || true);
    }
    
    // Price filter
    if (priceMax < 10000) {
      prods = prods.filter((p: any) => p.price <= priceMax);
    }
    
    // Sort
    if (sort === "price_asc") prods.sort((a: any, b: any) => a.price - b.price);
    if (sort === "price_desc") prods.sort((a: any, b: any) => b.price - a.price);
    if (sort === "name_asc") prods.sort((a: any, b: any) => a.name.localeCompare(b.name));
    
    setProducts(prods);
    setTotal(prods.length);
    setLoading(false);
  }, [q, catId, page, sort, priceMax, inStockOnly]);

  const pages = Math.ceil(total / limit);

  const handleAddToCart = (e: React.MouseEvent, prod: any) => {
    e.preventDefault();
    add({ id: prod.id, nameKz: prod.name, price: prod.price, imageUrl: prod.image, categoryName: prod.category });
    toast(`"${prod.name}" себетке қосылды`, "success");
  };

  const activeFilters = (catId ? 1 : 0) + (inStockOnly ? 1 : 0) + (priceMax < 10000 ? 1 : 0);

  return (
    <main>
      <div className="pg-head">
        <div className="container">
          <div className="pg-head__eyebrow">Барлық тауарлар</div>
          <h1 className="pg-head__title">Каталог</h1>
          <p className="pg-head__sub">Тамақ, сусындар, бакалея — жылдам жеткізу кепілімен</p>
        </div>
      </div>

      <section className="sec" style={{ paddingTop: "2rem" }}>
        <div className="container">
          {/* Top toolbar */}
          <div className="toolbar" style={{ marginBottom: "1.5rem" }}>
            <div className="sbar">
              <Search size={15} />
              <input type="text" placeholder="Тамақ немесе тауар іздеу..."
                value={q} onChange={e => { setQ(e.target.value); setPage(1); }} />
            </div>

            {/* Sort */}
            <div style={{ position: "relative" }}>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                style={{ appearance: "none", padding: "10px 36px 10px 14px", background: "var(--bg-raised)", border: "1px solid var(--border-hi)", borderRadius: "var(--r-sm)", fontFamily: "var(--font)", fontSize: "0.83rem", color: "var(--txt-2)", cursor: "pointer", outline: "none" }}
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ArrowDownUp size={13} style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", color: "var(--txt-3)", pointerEvents: "none" }} />
            </div>

            {/* Filter toggle (mobile) */}
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setSidebarOpen(o => !o)}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <SlidersVertical size={14} />
              Сүзгі
              {activeFilters > 0 && (
                <span style={{ background: "var(--brand)", color: "#000", borderRadius: "99px", padding: "1px 7px", fontSize: "0.68rem", fontWeight: 800 }}>
                  {activeFilters}
                </span>
              )}
            </button>

            <div style={{ fontSize: "0.79rem", color: "var(--txt-2)", marginLeft: "auto" }}>
              {loading ? "Іздеу..." : `${total} нәтиже`}
            </div>
          </div>

          {/* Content: sidebar + grid */}
          <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "2rem", alignItems: "start" }}>
            {/* SIDEBAR */}
            <div style={{
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: "var(--r-lg)", padding: "1.5rem", position: "sticky", top: "80px",
            }}>
              <div style={{ fontFamily: "var(--font-d)", fontWeight: 700, fontSize: "0.9rem", color: "var(--txt)", marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                Сүзгілер
                {activeFilters > 0 && (
                  <button
                    onClick={() => { setCatId(""); setInStockOnly(false); setPriceMax(10000); }}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--txt-3)", fontSize: "0.72rem", font: "inherit", display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <X size={11} /> Тазалау
                  </button>
                )}
              </div>

              {/* Stock toggle */}
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "0.74rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--txt-3)", marginBottom: "0.75rem" }}>Қор</div>
                <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer" }}>
                  <div
                    onClick={() => setInStockOnly(o => !o)}
                    style={{
                      width: 36, height: 20, borderRadius: 10, position: "relative", cursor: "pointer",
                      background: inStockOnly ? "var(--brand)" : "var(--bg-hover)",
                      border: "1px solid var(--border-hi)", transition: "background 0.2s",
                    }}
                  >
                    <div style={{
                      position: "absolute", top: 2, left: inStockOnly ? 18 : 2,
                      width: 14, height: 14, borderRadius: "50%",
                      background: inStockOnly ? "#000" : "var(--txt-3)",
                      transition: "left 0.2s",
                    }} />
                  </div>
                  <span style={{ fontSize: "0.83rem", color: "var(--txt-2)" }}>Тек қолда бар</span>
                </label>
              </div>

              {/* Price range */}
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "0.74rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--txt-3)", marginBottom: "0.75rem", display: "flex", justifyContent: "space-between" }}>
                  <span>Баға</span>
                  <span style={{ color: "var(--txt-2)", textTransform: "none", letterSpacing: 0 }}>≤ {priceMax.toLocaleString()} ₸</span>
                </div>
                <input
                  type="range" min={500} max={10000} step={500}
                  value={priceMax}
                  onChange={e => setPriceMax(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--brand)", cursor: "pointer" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--txt-3)", marginTop: "4px" }}>
                  <span>500 ₸</span><span>10 000 ₸</span>
                </div>
              </div>

              {/* Categories */}
              <div>
                <div style={{ fontSize: "0.74rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--txt-3)", marginBottom: "0.75rem" }}>Санаттар</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <button
                    className={catId === "" ? "cat-pill on" : "cat-pill"}
                    style={{ justifyContent: "flex-start", borderRadius: "var(--r-sm)", border: "none", background: catId === "" ? "var(--brand-dim)" : "none", width: "100%", textAlign: "left" }}
                    onClick={() => { setCatId(""); setPage(1); }}
                  >
                    <Package size={13} /> Барлығы
                  </button>
                  {cats.map((c: any) => (
                    <button
                      key={c.id}
                      className={catId === String(c.id) ? "cat-pill on" : "cat-pill"}
                      style={{ justifyContent: "flex-start", borderRadius: "var(--r-sm)", border: "none", background: catId === String(c.id) ? "var(--brand-dim)" : "none", width: "100%", textAlign: "left", color: catId === String(c.id) ? "var(--brand)" : "var(--txt-2)" }}
                      onClick={() => { setCatId(String(c.id)); setPage(1); }}
                    >
                      {CAT_ICO[c.id] || <Package size={13} />} {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* GRID */}
            <div>
              {loading ? (
                <div className="food-grid">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="skel-card">
                      <div className="skel-img" />
                      <div className="skel-body">
                        <div className="skel-line" style={{ width: "30%" }} />
                        <div className="skel-line" style={{ width: "70%" }} />
                        <div className="skel-line" style={{ width: "45%" }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="empty">
                  <div className="empty__icon"><Search size={50} /></div>
                  <div className="empty__title">Тауар табылмады</div>
                  <div className="empty__sub">Сүзгі параметрлерін өзгертіп көріңіз</div>
                </div>
              ) : (
                <div className="food-grid">
                  {products.map((prod: any) => (
                    <Link href={`/products/${prod.id}`} key={prod.id} className="food-card">
                      <div className="food-card__img-wrap">
                        {prod.image
                          ? <Image src={prod.image} alt={prod.name} width={400} height={300} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                          : <div className="food-card__ph"><Package size={42} /></div>
                        }
                        <div className="food-card__time"><Clock size={10} /> {prod.prepTime} мин</div>
                      </div>
                      <div className="food-card__body">
                        <div className="food-card__cat">{CAT_ICO[prod.category] || <Package size={10} />} {ASTANA_MENU_DATA.categories.find(c => c.id === prod.category)?.name || "Тауар"}</div>
                        <div className="food-card__name">{prod.name}</div>
                        {prod.description && (
                          <div className="food-card__desc">{prod.description.slice(0, 75)}{prod.description.length > 75 ? "…" : ""}</div>
                        )}
                        <div className="food-card__foot">
                          <div className="food-card__price">{prod.price.toLocaleString()} <sup>₸</sup></div>
                          <button className="food-card__add" onClick={e => handleAddToCart(e, prod)}>
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {pages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: "0.4rem", marginTop: "2.5rem" }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => p - 1)} disabled={page === 1}><ChevronLeft size={15} /></button>
                  {Array.from({ length: pages }, (_, i) => i + 1).map(n => (
                    <button key={n} className={`btn btn-sm${page === n ? " btn-brand" : " btn-ghost"}`} onClick={() => setPage(n)}>{n}</button>
                  ))}
                  <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => p + 1)} disabled={page === pages}><ChevronRight size={15} /></button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container"><div className="footer__in">
          <span className="footer__copy">© 2024 JetDelivery</span>
          <div className="footer__links">
            <Link href="/catalog" className="footer__link">Каталог</Link>
            <Link href="/orders" className="footer__link">Тапсырыстар</Link>
          </div>
        </div></div>
      </footer>
    </main>
  );
}

export default function CatalogPage() {
  return <Suspense><CatalogContent /></Suspense>;
}
