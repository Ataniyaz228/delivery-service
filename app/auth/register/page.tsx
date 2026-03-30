"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, AlertCircle, Zap, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", address: "" });
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  const go = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      setOk(true);
      setTimeout(() => router.push("/auth/login"), 1800);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-layout">
      <div className="auth-vis">
        <Image
          src="https://images.unsplash.com/photo-1601050690597-df0568f70950?w=900&q=80&auto=format&fit=crop"
          alt="" fill style={{ objectFit: "cover" }} priority
        />
        <div className="auth-vis__grad" />
        <div className="auth-vis__body">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.75rem" }}>
            <div style={{ width: 34, height: 34, background: "var(--brand)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={18} color="#000" />
            </div>
            <span style={{ fontFamily: "var(--font-d)", color: "#fff", fontWeight: 700, fontSize: "1.1rem" }}>JetDelivery</span>
          </div>
          <div className="auth-vis__title">Тіркеліп,<br />тапсырыс беріңіз!</div>
          <div className="auth-vis__sub">Бір рет тіркеліп, барлық мүмкіндікті пайдаланыңыз</div>
        </div>
      </div>

      <div className="auth-form-wrap">
        <div className="auth-form">
          <h1 className="auth-form__title">Тіркелу</h1>
          <p className="auth-form__sub">Жаңа аккаунт жасаңыз</p>

          {ok && <div className="alert alert-ok"><CheckCircle size={14} /> Тіркелдіңіз! Бетке өту...</div>}
          {error && <div className="alert alert-err"><AlertCircle size={14} /> {error}</div>}

          <form onSubmit={go}>
            <div className="fgroup">
              <label className="flabel">Атыңыз *</label>
              <input className="finput" type="text" placeholder="Аты-жөніңіз" value={form.name} onChange={set("name")} required minLength={2} />
            </div>
            <div className="fgroup">
              <label className="flabel">Email *</label>
              <input className="finput" type="email" placeholder="email@example.com" value={form.email} onChange={set("email")} required />
            </div>
            <div className="fgroup">
              <label className="flabel">Пароль * (≥ 6 таңба)</label>
              <input className="finput" type="password" placeholder="••••••••" value={form.password} onChange={set("password")} required minLength={6} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div className="fgroup">
                <label className="flabel">Телефон</label>
                <input className="finput" type="tel" placeholder="+7 701 000 0000" value={form.phone} onChange={set("phone")} />
              </div>
              <div className="fgroup">
                <label className="flabel">Мекенжай</label>
                <input className="finput" type="text" placeholder="Алматы, Абай 44" value={form.address} onChange={set("address")} />
              </div>
            </div>
            <button type="submit" className="btn btn-brand btn-full btn-lg" style={{ marginTop: "0.5rem" }} disabled={loading || ok}>
              {loading ? "Тіркелуде..." : <><ArrowRight size={16} /> Тіркелу</>}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "0.84rem", color: "var(--txt-2)", marginTop: "1.5rem" }}>
            Аккаунт бар ма? <Link href="/auth/login" style={{ color: "var(--brand)", fontWeight: 700 }}>Кіру</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
