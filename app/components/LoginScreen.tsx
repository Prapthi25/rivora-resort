// "use client";

// import { useState } from "react";
// import { AlertCircle } from "lucide-react";
// import { D } from "../lib/constants";
// import { btn, inp, lbl, crd } from "../lib/ui";

// type User = {
//   username: string;
//   password: string;
//   role?: string;
//   name?: string;
// };

// type LoginScreenProps = {
//   users: User[];
//   onLogin: (user: User) => void;
// };

// export default function LoginScreen({
//   users,
//   onLogin,
// }: LoginScreenProps) {
//   const [u, setU] = useState("");
//   const [p, setP] = useState("");
//   const [err, setErr] = useState("");
//   const [show, setShow] = useState(false);

//   const go = () => {
//     const f = users.find(
//       (x) => x.username === u.trim() && x.password === p
//     );

//     f ? onLogin(f) : setErr("Incorrect credentials");
//   };

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: D.bg,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         padding: 20,
//       }}
//     >
//       <div style={{ width: "100%", maxWidth: 360 }}>
//         <div style={{ textAlign: "center", marginBottom: 28 }}>
//           <div
//             style={{
//               width: 60,
//               height: 60,
//               borderRadius: "50%",
//               background:
//                 "linear-gradient(135deg,#1a3520,#080e0a)",
//               border: `2px solid ${D.gold}`,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               margin: "0 auto 16px",
//               fontSize: 24,
//             }}
//           >
//             🌿
//           </div>

//           <div
//             style={{
//               fontSize: 24,
//               fontWeight: "800",
//               color: D.text,
//             }}
//           >
//             RIVORA
//           </div>
//         </div>

//         <div style={{ ...crd, padding: 28 }}>
//           {err && (
//             <div
//               style={{
//                 background: D.dangerDim,
//                 color: D.danger,
//                 padding: 10,
//                 marginBottom: 10,
//               }}
//             >
//               <AlertCircle size={13} /> {err}
//             </div>
//           )}

//           <label style={lbl}>Username</label>

//           <input
//             value={u}
//             onChange={(e) => {
//               setU(e.target.value);
//               setErr("");
//             }}
//             style={inp}
//           />

//           <label style={lbl}>Password</label>

//           <input
//             type={show ? "text" : "password"}
//             value={p}
//             onChange={(e) => {
//               setP(e.target.value);
//               setErr("");
//             }}
//             style={inp}
//           />

//           <button
//             onClick={() => setShow(!show)}
//             style={btn("ghost")}
//           >
//             {show ? "🙈" : "👁"}
//           </button>

//           <button
//             onClick={go}
//             style={{
//               ...btn("primary"),
//               width: "100%",
//               marginTop: 20,
//             }}
//           >
//             Sign In
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, AlertCircle, Leaf } from "lucide-react";

type User = { username: string; password: string; role?: string; name?: string };
type Props = { users: User[]; onLogin: (u: User) => void };

/* ─── Floating particle (decorative leaf dot) ───────────────────────────── */
function Particle({ delay, x }: { delay: number; x: number }) {
  return (
    <div style={{
      position: "absolute",
      left: `${x}%`,
      bottom: -12,
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: "var(--gold)",
      opacity: 0,
      animation: `rv-rise 6s ease-in ${delay}s infinite`,
      pointerEvents: "none",
    }}/>
  );
}

export default function LoginScreen({ users, onLogin }: Props) {
  const [u,    setU]    = useState("");
  const [p,    setP]    = useState("");
  const [err,  setErr]  = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const go = async () => {
    if (!u.trim() || !p) { setErr("Please enter your credentials"); return; }
    setBusy(true);
    /* small delay for UX feedback */
    await new Promise(r => setTimeout(r, 420));
    const found = users.find(x => x.username === u.trim() && x.password === p);
    if (found) { onLogin(found); }
    else { setErr("Incorrect username or password"); setBusy(false); }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") go();
  };

  const particles = [8, 18, 30, 42, 55, 67, 78, 88];

  return (
    <div style={{
      minHeight: "100dvh",
      background: "var(--bg)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px 16px",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Ambient glow — forest canopy */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: [
          "radial-gradient(ellipse 60% 50% at 20% 10%, rgba(45,106,63,0.18) 0%, transparent 60%)",
          "radial-gradient(ellipse 50% 40% at 80% 90%, rgba(200,150,62,0.1) 0%, transparent 60%)",
          "radial-gradient(ellipse 40% 60% at 50% 50%, rgba(11,26,13,0) 0%, transparent 100%)",
        ].join(", "),
      }}/>

      {/* Floating particles */}
      {mounted && particles.map((x, i) => (
        <Particle key={i} x={x} delay={i * 0.8}/>
      ))}

      {/* Login card */}
      <div style={{
        width: "100%",
        maxWidth: 400,
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}>

        {/* Brand mark */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          {/* Logo circle */}
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "linear-gradient(145deg,#1C3A20,#0A1A0D)",
            border: "2px solid var(--gold)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 18px",
            boxShadow: "0 0 32px rgba(200,150,62,0.25), 0 8px 32px rgba(0,0,0,0.5)",
          }}>
            <svg viewBox="0 0 34 34" width="48" height="48" aria-hidden="true">
              <circle cx="17" cy="17" r="17" fill="url(#lg-bg)"/>
              <defs>
                <radialGradient id="lg-bg" cx="50%" cy="40%">
                  <stop offset="0%" stopColor="#1a4020"/>
                  <stop offset="100%" stopColor="#080e0a"/>
                </radialGradient>
              </defs>
              <polygon points="5,26 11,11 17,21 23,7 29,26" fill="#7FA88A" opacity="0.9"/>
              <ellipse cx="17" cy="21" rx="4" ry="3" fill="#D4A373" opacity="0.8"/>
              <path d="M5,29 Q11,25 17,29 Q23,33 29,29"
                stroke="#38BDF8" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
            </svg>
          </div>

          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-3xl)",
            fontWeight: 700,
            color: "var(--gold)",
            letterSpacing: "0.2em",
            margin: 0,
            lineHeight: 1,
          }}>
            RIVORA
          </h1>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-xs)",
            color: "var(--text-muted)",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            marginTop: 6,
          }}>
            COORG · RESORT MANAGEMENT
          </p>
        </div>

        {/* Form card */}
        <div style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          padding: "clamp(24px,5vw,36px)",
          boxShadow: "var(--shadow-lg), 0 0 0 1px rgba(200,150,62,0.06) inset",
        }}>

          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-xl)",
            fontWeight: 600,
            color: "var(--text)",
            marginBottom: 6,
          }}>
            Welcome back
          </h2>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-sm)",
            color: "var(--text-muted)",
            marginBottom: 24,
          }}>
            Sign in to manage your resort
          </p>

          {/* Error alert */}
          {err && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "var(--danger-bg, rgba(212,97,74,0.1))",
              border: "1px solid var(--danger-border, rgba(212,97,74,0.35))",
              color: "var(--danger)",
              padding: "10px 14px",
              borderRadius: "var(--radius-md)",
              marginBottom: 18,
              fontSize: "var(--text-sm)",
              fontWeight: 500,
              animation: "rv-shake 0.3s ease",
            }}>
              <AlertCircle size={15} style={{ flexShrink: 0 }}/>
              {err}
            </div>
          )}

          {/* Username */}
          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: "block",
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-xs)",
              fontWeight: 700,
              color: "var(--text-muted)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 7,
            }}>
              Username
            </label>
            <input
              type="text"
              autoComplete="username"
              value={u}
              onChange={e => { setU(e.target.value); setErr(""); }}
              onKeyDown={handleKey}
              placeholder="Enter your username"
              style={{
                display: "block",
                width: "100%",
                padding: "12px 16px",
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-base)",
                background: "var(--card-deep)",
                color: "var(--text)",
                border: `1px solid ${err ? "var(--danger-border, rgba(212,97,74,0.5))" : "var(--border)"}`,
                borderRadius: "var(--radius-md)",
                outline: "none",
                transition: "all var(--ease)",
              }}
              onFocus={e => {
                e.target.style.borderColor = "var(--gold)";
                e.target.style.boxShadow = "0 0 0 3px rgba(200,150,62,0.15)";
              }}
              onBlur={e => {
                e.target.style.borderColor = "var(--border)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: "block",
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-xs)",
              fontWeight: 700,
              color: "var(--text-muted)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 7,
            }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={show ? "text" : "password"}
                autoComplete="current-password"
                value={p}
                onChange={e => { setP(e.target.value); setErr(""); }}
                onKeyDown={handleKey}
                placeholder="Enter your password"
                style={{
                  display: "block",
                  width: "100%",
                  padding: "12px 46px 12px 16px",
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-base)",
                  background: "var(--card-deep)",
                  color: "var(--text)",
                  border: `1px solid ${err ? "var(--danger-border, rgba(212,97,74,0.5))" : "var(--border)"}`,
                  borderRadius: "var(--radius-md)",
                  outline: "none",
                  transition: "all var(--ease)",
                }}
                onFocus={e => {
                  e.target.style.borderColor = "var(--gold)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(200,150,62,0.15)";
                }}
                onBlur={e => {
                  e.target.style.borderColor = "var(--border)";
                  e.target.style.boxShadow = "none";
                }}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                aria-label={show ? "Hide password" : "Show password"}
                style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer",
                  color: "var(--text-muted)", padding: 4, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  transition: "color var(--ease)",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--gold)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"}
              >
                {show ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div>
          </div>

          {/* Sign in button */}
          <button
            onClick={go}
            disabled={busy}
            style={{
              width: "100%",
              padding: "14px 20px",
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-base)",
              fontWeight: 700,
              background: busy
                ? "rgba(200,150,62,0.4)"
                : "linear-gradient(135deg,#C8963E,#A87830)",
              color: busy ? "rgba(237,232,220,0.5)" : "#0B1A0D",
              border: "1px solid rgba(200,150,62,0.5)",
              borderRadius: "var(--radius-md)",
              cursor: busy ? "not-allowed" : "pointer",
              transition: "all var(--ease)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              letterSpacing: "0.02em",
            }}
            onMouseEnter={e => {
              if (!busy) {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(200,150,62,0.35)";
              }
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            {busy ? (
              <>
                <span style={{ animation: "rv-spin 0.8s linear infinite", display: "inline-block" }}>⟳</span>
                Signing in…
              </>
            ) : (
              <>
                <Leaf size={15}/>
                Sign In
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <p style={{
          textAlign: "center",
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-xs)",
          color: "var(--text-faint)",
          marginTop: 20,
        }}>
          Rivora Coorg © {new Date().getFullYear()} · Resort Management Console
        </p>
      </div>

      <style>{`
        @keyframes rv-rise {
          0%   { opacity:0; transform:translateY(0) scale(0.6); }
          20%  { opacity:0.5; }
          80%  { opacity:0.3; }
          100% { opacity:0; transform:translateY(-80vh) scale(1.2); }
        }
        @keyframes rv-shake {
          0%,100% { transform:translateX(0); }
          20%     { transform:translateX(-6px); }
          40%     { transform:translateX(5px); }
          60%     { transform:translateX(-3px); }
          80%     { transform:translateX(2px); }
        }
        @keyframes rv-spin { to { transform:rotate(360deg); } }
      `}</style>
    </div>
  );
}