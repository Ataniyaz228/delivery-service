"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle, Zap, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const go = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.ok) { router.push("/"); router.refresh(); }
    else { setError("Email немесе пароль дұрыс емес"); setLoading(false); }
  };

  return (
    <div className="auth-layout">
      <div className="auth-vis">
        <Image
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80&auto=format&fit=crop"
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
          <div className="auth-vis__title">Сүйікті тамақ<br />30 минутта!</div>
          <div className="auth-vis__sub">Тіркеліп, дәмді тапсырыс беріңіз. Жеткізу тез, сапа жоғары.</div>
        </div>
      </div>

      <div className="auth-form-wrap">
        <div className="auth-form">
          <h1 className="auth-form__title">Кіру</h1>
          <p className="auth-form__sub">Аккаунтыңызға кіріңіз</p>

          {error && <div className="alert alert-err"><AlertCircle size={14} /> {error}</div>}

          <form onSubmit={go}>
            <div className="fgroup">
              <label className="flabel">Email</label>
              <input className="finput" type="email" placeholder="email@example.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="fgroup" style={{ marginBottom: "1.5rem" }}>
              <label className="flabel">Пароль</label>
              <input className="finput" type="password" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-brand btn-full btn-lg" disabled={loading}>
              {loading ? "Кіру..." : <><ArrowRight size={16} /> Кіру</>}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "0.84rem", color: "var(--txt-2)", marginTop: "1.5rem" }}>
            Аккаунт жоқ па? <Link href="/auth/register" style={{ color: "var(--brand)", fontWeight: 700 }}>Тіркелу</Link>
          </p>

          <hr className="hr" />
          <div className="hint">
            <strong>Тест аккаунттары:</strong><br />
            Әкімші: admin@delivery.kz / admin123<br />
            Клиент: customer@delivery.kz / customer123
          </div>
        </div>
      </div>
    </div>
  );
}
