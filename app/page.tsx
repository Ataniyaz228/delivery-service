"use client";
import Link from "next/link";
import Image from "next/image";
import { Zap, ArrowRight, Clock, ShieldCheck, MapPin, Star, Package, Truck, CheckCircle, Utensils, Pizza, Cookie, Coffee, Apple, Milk, ShoppingCart, Plus } from "lucide-react";

const FEATURES = [
  { icon: <Clock size={20} />, title: "30 мин жеткізу", text: "Астананың кез-келген ауданына жарты сағаттан аз уақытта" },
  { icon: <ShieldCheck size={20} />, title: "Кепілдік", text: "Тапсырыс алмасаңыз — толық ақша қайтарамыз, ешбір сұрақсыз" },
  { icon: <MapPin size={20} />, title: "GPS қадағалау", text: "Тапсырысыңыздың қайда екенін нақты уақытта бақылаңыз" },
  { icon: <Star size={20} />, title: "Тек сапа", text: "Барлық серіктес мейрамхана мен дүкен сапа тексеруінен өтеді" },
];

const SHOWCASE = [
  { name: "Пепперони пицца", cat: "Dodo Pizza", price: "2 890", time: "25 мин", img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&auto=format&fit=crop&q=80" },
  { name: "Воппер", cat: "Burger King", price: "1 890", time: "15 мин", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80" },
  { name: "Филадельфия", cat: "Sushi Master", price: "2 490", time: "20 мин", img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80" },
  { name: "Баурсаки", cat: "Казахская кухня", price: "890", time: "15 мин", img: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&auto=format&fit=crop&q=80" },
];

export default function HomePage() {
  return (
    <main>
      {/* ═══ HERO ═══ */}
      <section className="hero">
        <div className="hero__noise" />
        <div className="hero__glow-l" />
        <div className="hero__glow-r" />

        <div className="container">
          <div className="hero__left">
            <div className="hero__eyebrow rise d1">
              <span className="hero__dot" />
              <span className="hero__eyebrow-txt">Астана #1 жеткізу сервисі</span>
            </div>

            <h1 className="hero__h1 rise d2">
              Тамақ <span className="accent">тез</span><br />
              жеткізіледі<span className="dim">.</span>
            </h1>

            <p className="hero__p rise d3">
              30 минут ішінде сүйікті тағамыңыз есігіңізде.
              Мыңдаған тауарлар, жүздеген мейрамхана — бір тапсырыспен.
            </p>

            <div className="hero__btns rise d4">
              <Link href="/catalog" className="btn btn-brand btn-lg">
                Тапсырыс беру <ArrowRight size={16} />
              </Link>
              <Link href="/auth/register" className="btn btn-stroke btn-lg">
                Тегін тіркелу
              </Link>
            </div>

            <div className="hero__stats rise d5">
              {[
                { n: "2 000+", l: "Тапсырыс" },
                { n: "30 мин", l: "Орташа жеткізу" },
                { n: "98%", l: "Қанағаттану" },
              ].map(s => (
                <div key={s.n}>
                  <div className="hero__stat-n">{s.n}</div>
                  <div className="hero__stat-l">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side food image */}
        <div className="hero__right">
          <Image
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000&q=80&auto=format&fit=crop&v=2"
            alt="Тамақ"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
            className="hero__img-main"
          />
          <div className="hero__img-overlay" />

          {/* Floating chips */}
          <div className="hero__chip hero__chip-2">
            <div className="hero__chip-icon" style={{ background: "var(--green-dim)", color: "var(--green)" }}>
              <CheckCircle size={16} />
            </div>
            <div>
              <div className="hero__chip-title">Нур-Айым Р.</div>
              <div className="hero__chip-sub">Тапсырыс берілді — 2 мин</div>
            </div>
          </div>

          <div className="hero__chip hero__chip-1">
            <div className="hero__chip-icon" style={{ background: "var(--brand-dim)", color: "var(--brand)" }}>
              <Truck size={16} />
            </div>
            <div>
              <div className="hero__chip-title">Жеткізілуде</div>
              <div className="hero__chip-sub">≈ 12 минут қалды</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section style={{ padding: "3rem 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--bg-card)" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "2rem" }}>
            <div style={{ fontFamily: "var(--font-d)", fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)", fontWeight: 800, color: "var(--txt)", lineHeight: 1.2, minWidth: 240 }}>
              Тапсырыс беру<br/>өте <span style={{ color: "var(--brand)" }}>оңай</span>
            </div>
            
            <div style={{ display: "flex", gap: "2rem", flex: 1, flexWrap: "wrap" }}>
              {[
                { i: "1", t: "Таңдау", d: "Мәзірден ең дәмдісін табыңыз", c: <Pizza size={20} /> },
                { i: "2", t: "Себетке қосу", d: "Мекенжайды енгізіп растаңыз", c: <ShoppingCart size={20} /> },
                { i: "3", t: "Күту", d: "Курьер 30 минутта жеткізеді", c: <Truck size={20} /> },
              ].map(item => (
                <div key={item.i} style={{ display: "flex", alignItems: "flex-start", gap: "1rem", flex: 1, minWidth: 200 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "var(--r-sm)", background: "var(--brand-dim)", color: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {item.c}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--txt)", marginBottom: "2px" }}>{item.i}. {item.t}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--txt-2)", lineHeight: 1.5 }}>{item.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SHOWCASE ═══ */}
      <section className="sec">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
            <div className="sec-head" style={{ marginBottom: 0 }}>
              <div className="sec-eyebrow">Танымал тауарлар</div>
              <h2 className="sec-title">Бүгін не жейміз?</h2>
            </div>
            <Link href="/catalog" className="btn btn-stroke">
              Барлық тауарлар <ArrowRight size={14} />
            </Link>
          </div>

          <div className="food-grid">
            {SHOWCASE.map((item, i) => (
              <Link href="/catalog" key={i} className="food-card rise" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="food-card__img-wrap">
                  <Image src={item.img} alt={item.name} width={400} height={300} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div className="food-card__time">
                    <Clock size={10} /> {item.time}
                  </div>
                </div>
                <div className="food-card__body">
                  <div className="food-card__cat">{item.cat}</div>
                  <div className="food-card__name">{item.name}</div>
                  <div className="food-card__foot">
                    <div className="food-card__price">{item.price} <sup>₸</sup></div>
                    <button className="food-card__add" onClick={e => e.preventDefault()}>
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="sec sec-alt">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="sec-eyebrow" style={{ justifyContent: "center", display: "flex" }}>Неге JetDelivery?</div>
            <h2 className="sec-title">Біздің артықшылықтарымыз</h2>
          </div>
          <div className="feat-strip">
            {FEATURES.map((f, i) => (
              <div className="feat-item" key={i}>
                <div className="feat-icon">{f.icon}</div>
                <div className="feat-title">{f.title}</div>
                <div className="feat-text">{f.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="sec">
        <div className="container">
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 380px", gap: "3rem", alignItems: "center",
            background: "var(--bg-card)", border: "1px solid var(--border-hi)",
            borderRadius: "var(--r-xl)", padding: "3.5rem", position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: -120, left: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,190,0,0.05), transparent 65%)", pointerEvents: "none" }} />
            <div>
              <div className="pill pill-live" style={{ marginBottom: "1.5rem" }}>Белсенді ұсыныс</div>
              <h2 style={{ fontFamily: "var(--font-d)", fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--txt)", marginBottom: "1rem" }}>
                Алғашқы тапсырысқа — <span style={{ color: "var(--brand)" }}>тегін жеткізу</span>
              </h2>
              <p style={{ fontSize: "0.93rem", color: "var(--txt-2)", lineHeight: 1.75, marginBottom: "2rem", maxWidth: 440 }}>
                Тіркеліп, кез-келген тауарды тапсырыс беріңіз. Алғашқы жеткізу ақысы біздің есебімізде.
              </p>
              <Link href="/auth/register" className="btn btn-brand btn-lg">
                Тіркелу — тегін <ArrowRight size={16} />
              </Link>
            </div>
            <div style={{ borderRadius: "var(--r-xl)", overflow: "hidden", border: "1px solid var(--border)" }}>
              <Image
                src="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80&auto=format&fit=crop&v=2"
                alt="Тамақ"
                width={380} height={280}
                style={{ display: "block", width: "100%", height: 260, objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer__in">
            <div>
              <div className="footer__brand">
                <div style={{ width: 28, height: 28, background: "var(--brand)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Zap size={15} color="#000" />
                </div>
                JetDelivery
              </div>
              <div className="footer__copy">© 2024 · Астана</div>
            </div>
            <div className="footer__links">
              <Link href="/catalog" className="footer__link">Каталог</Link>
              <Link href="/orders" className="footer__link">Тапсырыстарым</Link>
              <Link href="/auth/login" className="footer__link">Кіру</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
