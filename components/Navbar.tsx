"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Zap, LayoutGrid, ClipboardList, Shield, User, LogOut, Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [solid, setSolid] = useState(false);
  const [drop, setDrop] = useState(false);
  const [mob, setMob] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === "admin";

  useEffect(() => {
    const h = () => setSolid(window.scrollY > 10);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  useEffect(() => { setMob(false); setDrop(false); }, [pathname]);

  const on = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  const links = [
    { href: "/", label: "Басты бет" },
    { href: "/catalog", label: "Каталог", icon: <LayoutGrid size={13} /> },
    ...(session ? [{ href: "/orders", label: "Тапсырыстар", icon: <ClipboardList size={13} /> }] : []),
    ...(isAdmin ? [{ href: "/admin", label: "Әкімші", icon: <Shield size={13} /> }] : []),
  ];

  return (
    <nav className={`topbar${solid ? " solid" : ""}`}>
      <div className="topbar__inner">
        <Link href="/" className="topbar__brand">
          <div className="topbar__brand-icon"><Zap size={17} /></div>
          JetDelivery
        </Link>

        <ul className="topbar__nav">
          {links.map(l => (
            <li key={l.href}>
              <Link href={l.href} className={`topbar__link${on(l.href) ? " on" : ""}`}>{l.label}</Link>
            </li>
          ))}
        </ul>

        <div className="topbar__right">
          {session ? (
            <div className="topbar__user" onClick={() => setDrop(o => !o)}>
              <User size={13} />
              <span>{session.user?.name?.split(" ")[0]}</span>
              {isAdmin && <Shield size={11} style={{ color: "var(--brand)" }} />}
              <ChevronDown size={12} />
              {drop && (
                <div className="topbar__dropdown">
                  <Link href="/orders" className="topbar__drop-item" onClick={() => setDrop(false)}>
                    <ClipboardList size={14} /> Тапсырыстарым
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" className="topbar__drop-item" onClick={() => setDrop(false)}>
                      <Shield size={14} /> Әкімші панелі
                    </Link>
                  )}
                  <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "4px 6px" }} />
                  <button className="topbar__drop-item" onClick={() => signOut()}>
                    <LogOut size={14} /> Шығу
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/login" className="btn btn-ghost btn-sm">Кіру</Link>
              <Link href="/auth/register" className="btn btn-brand btn-sm">Тіркелу</Link>
            </>
          )}
          <button className="topbar__ham" onClick={() => setMob(o => !o)} aria-label="Мәзір">
            {mob ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mob && (
        <div className="topbar__mobile">
          {links.map(l => (
            <Link key={l.href} href={l.href} className={`topbar__mob-link${on(l.href) ? " on" : ""}`}>
              {(l as any).icon} {l.label}
            </Link>
          ))}
          <div className="topbar__mob-div" />
          {session ? (
            <button className="topbar__mob-link" onClick={() => signOut()}>
              <LogOut size={14} /> Шығу ({session.user?.name?.split(" ")[0]})
            </button>
          ) : (
            <div style={{ display: "flex", gap: "0.5rem", padding: "0 4px" }}>
              <Link href="/auth/login" className="btn btn-ghost btn-sm btn-full">Кіру</Link>
              <Link href="/auth/register" className="btn btn-brand btn-sm btn-full">Тіркелу</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
