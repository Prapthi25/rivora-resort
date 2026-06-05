

// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { LogOut } from "lucide-react";

// import * as DB from "../lib/db";

// import {
//   D,
//   F,
//   DEFAULT_USERS,
//   DEFAULT_SETTINGS,
// } from "../lib/constants";

// import {
//   fmtDate,
//   nights,
//   getRoomIds,
//   calcCollected,
//   calcBalance,
// } from "../lib/helpers";

// import { btn, roleColor } from "../lib/ui";

// import LoginScreen from "./LoginScreen";
// import MainApp from "./MainApp";

// export default function App() {
//   const [session,setSession]   = useState(null);
//   const [bookings,setBookings] = useState([]);
//   const [settings,setSettings] = useState(DEFAULT_SETTINGS);
//   const [users,setUsers]       = useState(DEFAULT_USERS);
//   const [auditLog,setAuditLog] = useState([]);
//   const [toast,setToast]       = useState(null);
//   const [loaded,setLoaded]     = useState(false);

//   // Restore session from localStorage (client-side identity only).
//   useEffect(()=>{
//     try { const s = localStorage.getItem("rv_session"); if(s) setSession(JSON.parse(s)); } catch {}
//   },[]);

//   // Live Firestore subscriptions.
//   useEffect(()=>{
//     DB.seedIfEmpty(DEFAULT_USERS, DEFAULT_SETTINGS);
//     const subs = [
//       DB.subscribeBookings(d=>{ setBookings(d); setLoaded(true); }),
//       DB.subscribeSettings(s=>{ if(s) setSettings({...DEFAULT_SETTINGS,...s}); }),
//       DB.subscribeUsers(u=>{ if(u.length) setUsers(u); }),
//       DB.subscribeAudit(a=>setAuditLog(a)),
//     ];
//     return ()=>subs.forEach(unsub=>unsub&&unsub());
//   },[]);

//   const notify = useCallback((msg,type="ok")=>{
//     setToast({msg,type}); setTimeout(()=>setToast(null),3200);
//   },[]);

//   const log = useCallback((action,detail,bookingId)=>{
//     DB.addAudit({ ts:new Date().toISOString(), user:session?.name||"?", action, detail, bookingId:bookingId||"" });
//   },[session]);

//   // ── Booking operations (Firestore-backed) ──────────────────────────────────
//   const addB = useCallback(async (b)=>{
//     await DB.saveBooking(b);
//     log("Created",`New booking for ${b.guestName}`,b.id);
//   },[log]);

//   const patchB = useCallback(async (id,u)=>{
//     await DB.saveBooking({ id, ...u });
//     log("Updated", u.status?`Status → ${u.status}`:"Details updated", id);
//   },[log]);

//   const delB = useCallback(async (id)=>{
//     await DB.deleteBooking(id);
//     log("Deleted",`Booking ${id} deleted`,id);
//   },[log]);

//   const clearAudit = useCallback(async ()=>{
//     await DB.clearAudit();
//     notify("Audit log cleared");
//   },[notify]);

//   const exportCSV = useCallback(()=>{
//     const h = ["ID","Guest","Phone","Rooms","CheckIn","CheckOut","Nights","Adults","Kids","Total","Collected","Balance","Status","BookedBy"];
//     const rows = bookings.map(b=>[
//       b.id,b.guestName,b.phone,getRoomIds(b).join(" / "),
//       fmtDate(b.checkIn),fmtDate(b.checkOut),nights(b.checkIn,b.checkOut),
//       b.adults||0,(Number(b.kidsFree||0)+Number(b.kidsHalf||0)+Number(b.kidsFull||0)),
//       b.total,calcCollected(b),calcBalance(b),b.status,b.bookedBy,
//     ]);
//     const csv = [h,...rows].map(r=>r.map(x=>`"${String(x??"").replace(/"/g,'""')}"`).join(",")).join("\n");
//     const a = document.createElement("a");
//     a.href = "data:text/csv;charset=utf-8,"+encodeURIComponent(csv);
//     a.download = "rivora_bookings.csv";
//     a.click();
//   },[bookings]);

//   const doLogin = (u)=>{
//     setSession(u);
//     try { localStorage.setItem("rv_session",JSON.stringify(u)); } catch {}
//     notify(`Welcome back, ${u.name}`);
//   };
//   const doLogout = ()=>{
//     setSession(null);
//     try { localStorage.removeItem("rv_session"); } catch {}
//   };

//   if (!session) return <LoginScreen users={users} onLogin={doLogin}/>;

//   const can = {
//     admin: session.role==="admin",
//     staff: session.role!=="viewer",
//     viewer: session.role==="viewer",
//   };

//   return (
//     <div style={{fontFamily:F,background:D.bg,minHeight:"100vh",color:D.text}}>
//       {/* Header */}
//       <header style={{background:D.card,borderBottom:`1px solid ${D.border}`,padding:"0 20px",
//         display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",
//         top:0,zIndex:400,height:58}}>
//         <div style={{display:"flex",alignItems:"center",gap:10}}>
//           <div style={{width:34,height:34,borderRadius:"50%",
//             background:"linear-gradient(135deg,#1a3520,#0a1a0e)",border:`1.5px solid ${D.gold}`,
//             display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
//             <svg viewBox="0 0 34 34" width="34" height="34">
//               <circle cx="17" cy="17" r="17" fill="url(#rg)"/>
//               <defs><radialGradient id="rg" cx="50%" cy="40%">
//                 <stop offset="0%" stopColor="#1a4020"/><stop offset="100%" stopColor="#080e0a"/>
//               </radialGradient></defs>
//               <polygon points="5,26 11,11 17,21 23,7 29,26" fill="#7FA88A" opacity="0.9"/>
//               <ellipse cx="17" cy="21" rx="4" ry="3" fill="#D4A373" opacity="0.8"/>
//               <path d="M5,29 Q11,25 17,29 Q23,33 29,29" stroke="#38BDF8" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
//             </svg>
//           </div>
//           <div>
//             <div style={{fontSize:13,fontWeight:"800",color:D.gold,letterSpacing:"0.1em"}}>RIVORA</div>
//             <div style={{fontSize:8,color:D.muted,letterSpacing:"0.25em",marginTop:0}}>COORG</div>
//           </div>
//         </div>
//         <div style={{display:"flex",alignItems:"center",gap:12}}>
//           <div style={{textAlign:"right",display:"flex",flexDirection:"column",alignItems:"flex-end",gap:2}}>
//             <span style={{fontSize:12,fontWeight:"600",color:D.text}}>{session.name}</span>
//             <span style={{fontSize:9,color:roleColor(session.role),textTransform:"uppercase",
//               letterSpacing:"0.08em",fontWeight:"700"}}>{session.role}</span>
//           </div>
//           <button onClick={doLogout} style={{...btn("danger","sm"),gap:4}}>
//             <LogOut size={11}/> Out
//           </button>
//         </div>
//       </header>

//       {!loaded
//         ? <div style={{textAlign:"center",padding:"80px 20px",color:D.muted}}>Connecting to Firestore…</div>
//         : <MainApp bookings={bookings} settings={settings} users={users} session={session} can={can}
//             addB={addB} patchB={patchB} delB={delB} setSettings={DB.saveSettings} notify={notify}
//             exportCSV={exportCSV} auditLog={auditLog} clearAudit={clearAudit}/>}

//       {toast && (
//         <div style={{position:"fixed",bottom:20,right:20,background:D.card,
//           border:`1px solid ${toast.type==="err"?D.dangerBorder:D.successBorder}`,
//           color:toast.type==="err"?D.danger:D.success,padding:"11px 18px",borderRadius:12,
//           zIndex:9999,fontSize:13,fontWeight:"500",fontFamily:F,boxShadow:"0 8px 32px rgba(0,0,0,0.5)"}}>
//           {toast.type==="err"?"✕ ":"✓ "}{toast.msg}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useCallback } from "react";
import { LogOut } from "lucide-react";

import * as DB from "../lib/db";
import { D, F, DEFAULT_USERS, DEFAULT_SETTINGS } from "../lib/constants";
import { fmtDate, nights, getRoomIds, calcCollected, calcBalance } from "../lib/helpers";
import { btn, roleColor } from "../lib/ui";

import LoginScreen from "./LoginScreen";
import MainApp from "./MainApp";

/* ─── Design Tokens (nature resort palette) ─────────────────────────────── */

const C = {
  bg:             "var(--bg)",
  card:           "var(--card)",
  border:         "var(--border)",
  gold:           "var(--gold)",
  goldLight:      "var(--gold-light)",
  goldMuted:      "var(--gold-muted)",
  text:           "var(--text)",
  textSoft:       "var(--text-soft)",
  textMuted:      "var(--text-muted)",
  success:        "var(--success)",
  successBg:      "var(--success-bg)",
  successBorder:  "var(--success-border)",
  danger:         "var(--danger)",
  dangerBg:       "var(--danger-bg)",
  dangerBorder:   "var(--danger-border)",
  forest:         "var(--forest)",
  sage:           "var(--sage)",
} as const;

/* ─── Role badge colours ────────────────────────────────────────────────── */

const ROLE_STYLE: Record<string, { color: string; bg: string }> = {
  admin:  { color: "#C8963E", bg: "rgba(200,150,62,0.15)"  },
  staff:  { color: "#5BAD7A", bg: "rgba(91,173,122,0.15)"  },
  viewer: { color: "#7FA88A", bg: "rgba(127,168,138,0.12)" },
};

function RoleBadge({ role }: { role: string }) {
  const s = ROLE_STYLE[role] ?? ROLE_STYLE.viewer;
  return (
    <span style={{
      fontSize: "var(--text-xs)",
      fontWeight: 700,
      fontFamily: "var(--font-body)",
      color: s.color,
      background: s.bg,
      border: `1px solid ${s.color}40`,
      padding: "2px 9px",
      borderRadius: 100,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
    }}>
      {role}
    </span>
  );
}

/* ─── Rivora Logo mark ──────────────────────────────────────────────────── */

function RivoraLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
      {/* Badge */}
      <div style={{
        width: 38, height: 38, borderRadius: "50%",
        background: "linear-gradient(145deg,#1C3A20,#0A1A0D)",
        border: `1.5px solid ${C.gold}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, boxShadow: "var(--shadow-gold)",
      }}>
        <svg viewBox="0 0 34 34" width="34" height="34" aria-hidden="true">
          <circle cx="17" cy="17" r="17" fill="url(#rv-bg)"/>
          <defs>
            <radialGradient id="rv-bg" cx="50%" cy="40%">
              <stop offset="0%" stopColor="#1a4020"/>
              <stop offset="100%" stopColor="#080e0a"/>
            </radialGradient>
          </defs>
          {/* Mountain silhouette */}
          <polygon points="5,26 11,11 17,21 23,7 29,26" fill="#7FA88A" opacity="0.9"/>
          {/* Sun / mist orb */}
          <ellipse cx="17" cy="21" rx="4" ry="3" fill="#D4A373" opacity="0.8"/>
          {/* River */}
          <path
            d="M5,29 Q11,25 17,29 Q23,33 29,29"
            stroke="#38BDF8" strokeWidth="1.4"
            fill="none" strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Wordmark */}
      <div>
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-xl)",
          fontWeight: 700,
          color: C.gold,
          letterSpacing: "0.18em",
          lineHeight: 1,
        }}>
          RIVORA
        </div>
        <div style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-xs)",
          color: C.textMuted,
          letterSpacing: "0.3em",
          marginTop: 2,
          textTransform: "uppercase",
        }}>
          COORG
        </div>
      </div>
    </div>
  );
}

/* ─── Loading Skeleton ──────────────────────────────────────────────────── */

function LoadingState() {
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      minHeight: "60vh", gap: 16,
    }}>
      {/* Animated leaf dots */}
      <div style={{ display: "flex", gap: 8 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 10, height: 10, borderRadius: "50%",
            background: C.gold,
            opacity: 0.7,
            animation: `rv-pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}/>
        ))}
      </div>
      <div style={{
        fontFamily: "var(--font-body)",
        fontSize: "var(--text-sm)",
        color: C.textMuted,
        letterSpacing: "0.05em",
      }}>
        Connecting to Firestore…
      </div>
      <style>{`
        @keyframes rv-pulse {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50%       { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ─── Toast Notification ────────────────────────────────────────────────── */

function Toast({ msg, type }: { msg: string; type: string }) {
  const isErr = type === "err";
  return (
    <div style={{
      position: "fixed",
      bottom: 24, right: 20,
      maxWidth: "calc(100vw - 40px)",
      background: "var(--card)",
      border: `1px solid ${isErr ? C.dangerBorder : C.successBorder}`,
      color: isErr ? C.danger : C.success,
      padding: "13px 20px",
      borderRadius: "var(--radius-lg)",
      zIndex: 9999,
      fontSize: "var(--text-sm)",
      fontWeight: 600,
      fontFamily: "var(--font-body)",
      boxShadow: "var(--shadow-lg)",
      display: "flex", alignItems: "center", gap: 8,
      animation: "rv-toast-in 0.24s cubic-bezier(0.34,1.56,0.64,1)",
    }}>
      <span style={{ fontSize: 16 }}>{isErr ? "✕" : "✓"}</span>
      {msg}
      <style>{`
        @keyframes rv-toast-in {
          from { opacity: 0; transform: translateY(12px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

/* ─── App ───────────────────────────────────────────────────────────────── */

export default function App() {
  const [session,          setSession]          = useState<any>(null);
  const [bookings,         setBookings]         = useState<any[]>([]);
  const [settings,         setSettings]         = useState(DEFAULT_SETTINGS);
  const [users,            setUsers]            = useState(DEFAULT_USERS);
  const [auditLog,         setAuditLog]         = useState<any[]>([]);
  const [expenses,         setExpenses]         = useState<any[]>([]);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [toast,            setToast]            = useState<{msg:string; type:string}|null>(null);
  const [loaded,           setLoaded]           = useState(false);

  /* Restore session */
  useEffect(() => {
    try {
      const s = localStorage.getItem("rv_session");
      if (s) setSession(JSON.parse(s));
    } catch {}
  }, []);

  /* Live Firestore subscriptions */
  useEffect(() => {
    DB.seedIfEmpty(DEFAULT_USERS, DEFAULT_SETTINGS);
    const subs = [
      DB.subscribeBookings((d: any[]) => { setBookings(d); setLoaded(true); }),
      DB.subscribeSettings((s: any) => { if (s) setSettings({ ...DEFAULT_SETTINGS, ...s }); }),
      DB.subscribeUsers((u: any[]) => { if (u.length) setUsers(u); }),
      DB.subscribeAudit((a: any[]) => setAuditLog(a)),
      DB.subscribeExpenses((e: any[]) => setExpenses(e)),
      DB.subscribeExpenseCategories((c: string[]) => setCustomCategories(c)),
    ];
    return () => subs.forEach(u => u?.());
  }, []);

  const notify = useCallback((msg: string, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  }, []);

  const log = useCallback((action: string, detail: string, bookingId?: string) => {
    DB.addAudit({
      ts: new Date().toISOString(),
      user: session?.name || "?",
      action, detail,
      bookingId: bookingId || "",
    });
  }, [session]);

  /* Booking operations */
  const addB = useCallback(async (b: any) => {
    await DB.saveBooking(b);
    log("Created", `New booking for ${b.guestName}`, b.id);
  }, [log]);

  const patchB = useCallback(async (id: string, u: any) => {
    await DB.saveBooking({ id, ...u });
    log("Updated", u.status ? `Status → ${u.status}` : "Details updated", id);
  }, [log]);

  const delB = useCallback(async (id: string) => {
    await DB.deleteBooking(id);
    log("Deleted", `Booking ${id} deleted`, id);
  }, [log]);

  const clearAudit = useCallback(async () => {
    await DB.clearAudit();
    notify("Audit log cleared");
  }, [notify]);

  /* Expense operations */
  const addExpense = useCallback(async (e: any) => {
    await DB.saveExpense(e);
  }, []);

  const deleteExpenseItem = useCallback(async (id: string) => {
    await DB.deleteExpense(id);
  }, []);

  const saveExpenseCategories = useCallback(async (cats: string[]) => {
    await DB.saveExpenseCategories(cats);
  }, []);

  const exportCSV = useCallback(() => {
    const h = ["ID","Guest","Phone","Rooms","CheckIn","CheckOut","Nights","Adults","Kids","Total","Collected","Balance","Status","BookedBy"];
    const rows = bookings.map(b => [
      b.id, b.guestName, b.phone, getRoomIds(b).join(" / "),
      fmtDate(b.checkIn), fmtDate(b.checkOut),
      nights(b.checkIn, b.checkOut),
      b.adults || 0,
      (Number(b.kidsFree||0) + Number(b.kidsHalf||0) + Number(b.kidsFull||0)),
      b.total, calcCollected(b), calcBalance(b), b.status, b.bookedBy,
    ]);
    const csv = [h, ...rows]
      .map(r => r.map(x => `"${String(x ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "rivora_bookings.csv";
    a.click();
  }, [bookings]);

  const doLogin = (u: any) => {
    setSession(u);
    try { localStorage.setItem("rv_session", JSON.stringify(u)); } catch {}
    notify(`Welcome back, ${u.name}`);
  };

  const doLogout = () => {
    setSession(null);
    try { localStorage.removeItem("rv_session"); } catch {}
  };

  if (!session) return <LoginScreen users={users} onLogin={doLogin}/>;

  const can = {
    admin:  session.role === "admin",
    staff:  session.role !== "viewer",
    viewer: session.role === "viewer",
  };

  return (
    <div style={{
      fontFamily: "var(--font-body)",
      background: C.bg,
      minHeight: "100dvh",
      color: C.text,
    }}>

      {/* ── Sticky Header ──────────────────────────────────────────────── */}
      <header style={{
        background: "var(--card)",
        borderBottom: `1px solid ${C.border}`,
        padding: "0 clamp(14px, 4vw, 28px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 400,
        height: 62,
        gap: 12,
        boxShadow: "0 2px 16px rgba(0,0,0,0.45)",
      }}>

        <RivoraLogo />

        {/* Right section: user info + logout */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          {/* Hide name on very small screens */}
          <div style={{
            textAlign: "right",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 4,
          }}>
            <span style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              color: C.text,
              /* Hide on screens < 400px */
              maxWidth: "clamp(0px, 30vw, 180px)",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}>
              {session.name}
            </span>
            <RoleBadge role={session.role} />
          </div>

          <button
            onClick={doLogout}
            title="Sign out"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "7px 13px",
              background: "var(--danger-bg, rgba(212,97,74,0.12))",
              border: `1px solid ${C.dangerBorder}`,
              borderRadius: "var(--radius-md)",
              color: C.danger,
              fontSize: "var(--text-sm)",
              fontWeight: 700,
              fontFamily: "var(--font-body)",
              cursor: "pointer",
              transition: "all var(--ease)",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(212,97,74,0.22)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(212,97,74,0.12)";
            }}
          >
            <LogOut size={13} />
            <span className="hide-mobile">Sign out</span>
          </button>
        </div>
      </header>

      {/* ── Main content ────────────────────────────────────────────────── */}
      {!loaded
        ? <LoadingState />
        : (
          <MainApp
            bookings={bookings}
            settings={settings}
            users={users}
            session={session}
            can={can}
            addB={addB}
            patchB={patchB}
            delB={delB}
            setSettings={DB.saveSettings}
            notify={notify}
            exportCSV={exportCSV}
            auditLog={auditLog}
            clearAudit={clearAudit}
            expenses={expenses}
            customCategories={customCategories}
            addExpense={addExpense}
            deleteExpense={deleteExpenseItem}
            saveExpenseCategories={saveExpenseCategories}
          />
        )
      }

      {/* ── Toast ───────────────────────────────────────────────────────── */}
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* ── Responsive helpers ──────────────────────────────────────────── */}
      <style>{`
        @media (max-width: 440px) {
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}