// "use client";
// import { useMemo } from "react";
// import { LogIn, LogOut, Users, BookOpen, CreditCard, AlertCircle } from "lucide-react";
// import { D } from "../lib/constants";
// import { crd, ctit } from "../lib/ui";
// import { todayStr, TODAY, fmtDate, fmtFull, nights, getRoomIds, calcBalance,
//   isOverdueCheckIn, isOverdueCheckOut, totalPax } from "../lib/helpers";
// import { GuestRow } from "./common";

// export default function Dashboard({ bookings, onView }) {
//   const active     = useMemo(()=>bookings.filter(b=>b.status!=="Cancelled"),[bookings]);
//   const arriving   = useMemo(()=>active.filter(b=>b.checkIn===todayStr),[active]);
//   const departing  = useMemo(()=>active.filter(b=>b.checkOut===todayStr),[active]);
//   const occupied   = useMemo(()=>active.filter(b=>b.checkIn<=todayStr&&b.checkOut>todayStr),[active]);
//   const overdueIn  = useMemo(()=>active.filter(isOverdueCheckIn),[active]);
//   const overdueOut = useMemo(()=>active.filter(isOverdueCheckOut),[active]);

//   const rev          = useMemo(()=>active.reduce((s,b)=>s+Number(b.total||0),0),[active]);
//   const totalPending = useMemo(()=>active.reduce((s,b)=>s+calcBalance(b),0),[active]);
//   const pendingCount = useMemo(()=>active.filter(b=>calcBalance(b)>0&&b.status!=="Checked Out").length,[active]);

//   const todayGuests = useMemo(()=>[
//     ...occupied,
//     ...arriving.filter(b=>!occupied.find(o=>o.id===b.id)),
//   ],[occupied,arriving]);
//   const totalVeg    = useMemo(()=>todayGuests.reduce((s,b)=>s+Number(b.vegCount||0),0),[todayGuests]);
//   const totalNonVeg = useMemo(()=>todayGuests.reduce((s,b)=>s+Number(b.nonVegCount||0),0),[todayGuests]);
//   const totalPaxIn  = useMemo(()=>todayGuests.reduce((s,b)=>s+totalPax(b),0),[todayGuests]);
//   const occPct = Math.round(occupied.length/16*100);

//   const statCards = [
//     {label:"Check-Ins", value:arriving.length, note:"arriving today", icon:<LogIn size={14}/>, color:D.success},
//     {label:"Check-Outs",value:departing.length,note:"departing today",icon:<LogOut size={14}/>,color:D.warning},
//     {label:"Occupied",  value:`${occupied.length}/16`,note:"rooms in-house",icon:<Users size={14}/>,color:D.blue},
//     {label:"Bookings",  value:active.length,   note:"active reservations",icon:<BookOpen size={14}/>,color:"#9BD3A8"},
//     {label:"Revenue",   value:`₹${rev>=100000?(rev/100000).toFixed(1)+"L":(rev/1000).toFixed(0)+"k"}`,
//       note:"total booked",icon:<CreditCard size={14}/>,color:D.gold},
//     {label:"Pending",   value:`₹${totalPending>=100000?(totalPending/100000).toFixed(1)+"L":(totalPending/1000).toFixed(0)+"k"}`,
//       note:`${pendingCount} unpaid booking${pendingCount!==1?"s":""}`,icon:<AlertCircle size={14}/>,
//       color:pendingCount>0?D.danger:D.success},
//   ];

//   return (
//     <div>
//       <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,
//         flexWrap:"wrap",gap:10}}>
//         <div>
//           <h1 style={{fontSize:20,fontWeight:"800",color:D.text,margin:0,letterSpacing:"-0.02em"}}>Dashboard</h1>
//           <div style={{color:D.sub,fontSize:12,marginTop:3}}>{fmtFull(TODAY)}</div>
//         </div>
//         <div style={{background:D.card,border:`1px solid ${occPct>70?D.goldBorder:D.border}`,
//           borderRadius:12,padding:"8px 16px",textAlign:"center"}}>
//           <div style={{fontSize:20,fontWeight:"800",color:occPct>70?D.gold:occPct>40?D.success:D.sub}}>{occPct}%</div>
//           <div style={{fontSize:9,color:D.muted,letterSpacing:"0.06em",marginTop:1}}>OCCUPANCY</div>
//         </div>
//       </div>

//       {(overdueIn.length>0||overdueOut.length>0) && (
//         <div style={{background:"rgba(251,191,36,0.06)",border:`1px solid rgba(251,191,36,0.3)`,
//           borderRadius:12,padding:"12px 16px",marginBottom:16}}>
//           <div style={{fontSize:10,fontWeight:"700",color:D.warning,letterSpacing:"0.08em",marginBottom:8}}>
//             ⚠ ATTENTION REQUIRED
//           </div>
//           {overdueIn.map(b=>(
//             <div key={b.id} onClick={()=>onView(b)} style={{display:"flex",justifyContent:"space-between",
//               alignItems:"center",padding:"6px 10px",background:"rgba(251,191,36,0.08)",borderRadius:8,
//               marginBottom:4,cursor:"pointer"}}>
//               <span style={{fontSize:12,color:D.text,fontWeight:"600"}}>{b.guestName}</span>
//               <span style={{fontSize:11,color:D.warning}}>No-show risk · Was due {fmtDate(b.checkIn)} · {getRoomIds(b).join(", ")}</span>
//             </div>
//           ))}
//           {overdueOut.map(b=>(
//             <div key={b.id} onClick={()=>onView(b)} style={{display:"flex",justifyContent:"space-between",
//               alignItems:"center",padding:"6px 10px",background:"rgba(248,113,113,0.08)",borderRadius:8,
//               marginBottom:4,cursor:"pointer"}}>
//               <span style={{fontSize:12,color:D.text,fontWeight:"600"}}>{b.guestName}</span>
//               <span style={{fontSize:11,color:D.danger}}>Overdue checkout · Was due {fmtDate(b.checkOut)} · {getRoomIds(b).join(", ")}</span>
//             </div>
//           ))}
//         </div>
//       )}

//       <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10,marginBottom:20}}>
//         {statCards.map(s=>(
//           <div key={s.label} style={{background:D.card,border:`1px solid ${D.border}`,borderRadius:14,
//             padding:"16px 14px",position:"relative",overflow:"hidden"}}>
//             <div style={{position:"absolute",top:12,right:12,color:s.color,opacity:0.75}}>{s.icon}</div>
//             <div style={{fontSize:22,fontWeight:"800",color:s.color,letterSpacing:"-0.04em",lineHeight:1}}>{s.value}</div>
//             <div style={{fontSize:11,fontWeight:"600",color:D.text,marginTop:6}}>{s.label}</div>
//             <div style={{fontSize:10,color:D.muted,marginTop:2}}>{s.note}</div>
//           </div>
//         ))}
//       </div>

//       {totalPaxIn>0 && (
//         <div style={{...crd,marginBottom:16}}>
//           <div style={ctit}>Kitchen — Today · {totalPaxIn} pax in-house</div>
//           <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-start"}}>
//             {[["VEG",totalVeg,D.success,D.successDim],["NON-VEG",totalNonVeg,D.gold,D.goldDim],
//               ...(totalVeg+totalNonVeg<totalPaxIn
//                 ? [["UNSPECIFIED",totalPaxIn-totalVeg-totalNonVeg,D.sub,"rgba(148,163,184,0.1)"]] : [])]
//               .map(([label,count,color,bg])=>(
//                 <div key={label} style={{background:bg,border:`1px solid rgba(255,255,255,0.06)`,
//                   borderRadius:12,padding:"12px 18px",textAlign:"center",minWidth:80}}>
//                   <div style={{fontSize:10,color,fontWeight:"700",letterSpacing:"0.06em",marginBottom:6}}>{label}</div>
//                   <div style={{fontSize:26,fontWeight:"800",color:D.text}}>{count}</div>
//                   <div style={{fontSize:9,color:D.muted,marginTop:2}}>pax</div>
//                 </div>
//               ))}
//             <div style={{flex:1,minWidth:160,display:"flex",flexDirection:"column",gap:6,justifyContent:"center"}}>
//               {todayGuests.map(b=>(
//                 <div key={b.id} style={{display:"flex",alignItems:"center",gap:8,background:D.surface,
//                   borderRadius:8,padding:"6px 10px"}}>
//                   <span style={{fontWeight:"600",color:D.text,fontSize:12}}>{b.guestName}</span>
//                   <span style={{color:D.muted,fontSize:10}}>{getRoomIds(b).join(", ")}</span>
//                   {Number(b.vegCount||0)>0 && <span style={{color:D.success,fontSize:11}}>V:{b.vegCount}</span>}
//                   {Number(b.nonVegCount||0)>0 && <span style={{color:D.gold,fontSize:11}}>NV:{b.nonVegCount}</span>}
//                   {!Number(b.vegCount||0)&&!Number(b.nonVegCount||0) &&
//                     <span style={{color:D.muted,fontSize:10}}>unspecified</span>}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {[
//         ["Arrivals Today",arriving,"#4ADE80","Rooms not yet assigned"],
//         ["Departures Today",departing,"#FBBF24","Rooms free after 11:30 AM"],
//         ["Currently In-House",occupied,"#60A5FA","Active stays"],
//       ].map(([title,list,accent,subtext])=>
//         list.length>0 && (
//           <div key={title} style={{...crd,marginBottom:12}}>
//             <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
//               <div style={{width:3,height:14,background:accent,borderRadius:2}}/>
//               <div style={ctit}>{title} · {list.length}</div>
//               <span style={{marginLeft:"auto",fontSize:10,color:D.muted}}>{subtext}</span>
//             </div>
//             {list.map(b=>(
//               <GuestRow key={b.id} b={b} onView={()=>onView(b)} context={
//                 title==="Currently In-House"
//                   ? `${nights(todayStr,b.checkOut)} night${nights(todayStr,b.checkOut)!==1?"s":""} left · out ${fmtDate(b.checkOut)}`
//                   : title==="Departures Today"
//                   ? `${getRoomIds(b).join(", ")} frees up`
//                   : `${totalPax(b)}p arriving`
//               }/>
//             ))}
//           </div>
//         )
//       )}

//       {arriving.length===0&&departing.length===0&&occupied.length===0 && (
//         <div style={{textAlign:"center",padding:"60px 20px"}}>
//           <div style={{fontSize:36,marginBottom:12,opacity:0.4}}>🌿</div>
//           <div style={{fontSize:14,fontWeight:"600",color:D.sub}}>No activity today</div>
//           <div style={{fontSize:12,color:D.muted,marginTop:6}}>A quiet day at Rivora</div>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import { useMemo } from "react";
import {
  LogIn, LogOut, Users, BookOpen, CreditCard,
  AlertCircle, TrendingUp, Utensils,
} from "lucide-react";
import {
  todayStr, TODAY, fmtDate, fmtFull, nights, getRoomIds,
  calcBalance, isOverdueCheckIn, isOverdueCheckOut, totalPax,
} from "../lib/helpers";
import { GuestRow } from "./common";

/* ─── Helpers ───────────────────────────────────────────────────────────── */

function fmt(n: number): string {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000)   return `₹${(n / 1000).toFixed(0)}k`;
  return `₹${n}`;
}

/* ─── Stat Card ─────────────────────────────────────────────────────────── */

interface StatCardProps {
  label:  string;
  value:  string | number;
  note:   string;
  icon:   React.ReactNode;
  accent: string;
}

function StatCard({ label, value, note, icon, accent }: StatCardProps) {
  return (
    <div style={{
      background: "var(--card)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      padding: "18px 16px",
      position: "relative",
      overflow: "hidden",
      transition: "border-color var(--ease), transform var(--ease)",
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = `${accent}55`;
        (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      {/* Accent top bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: 2, background: accent, borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
      }}/>

      {/* Icon badge */}
      <div style={{
        position: "absolute", top: 14, right: 14,
        width: 30, height: 30, borderRadius: "var(--radius-md)",
        background: `${accent}18`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: accent,
      }}>
        {icon}
      </div>

      {/* Value */}
      <div style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(22px,3vw,28px)",
        fontWeight: 700,
        color: accent,
        lineHeight: 1,
        marginTop: 6,
        letterSpacing: "-0.02em",
      }}>
        {value}
      </div>

      {/* Label */}
      <div style={{
        fontFamily: "var(--font-body)",
        fontSize: "var(--text-sm)",
        fontWeight: 700,
        color: "var(--text)",
        marginTop: 8,
      }}>
        {label}
      </div>

      {/* Note */}
      <div style={{
        fontFamily: "var(--font-body)",
        fontSize: "var(--text-xs)",
        color: "var(--text-muted)",
        marginTop: 3,
      }}>
        {note}
      </div>
    </div>
  );
}

/* ─── Occupancy ring ─────────────────────────────────────────────────────── */

function OccupancyRing({ pct }: { pct: number }) {
  const r   = 22;
  const c   = 2 * Math.PI * r;
  const fill = (pct / 100) * c;
  const color = pct > 70 ? "var(--gold)" : pct > 40 ? "var(--success)" : "var(--text-muted)";

  return (
    <div style={{
      background: "var(--card)",
      border: `1px solid ${pct > 70 ? "var(--border-gold)" : "var(--border)"}`,
      borderRadius: "var(--radius-lg)",
      padding: "12px 20px",
      display: "flex", alignItems: "center", gap: 14,
    }}>
      <svg width={60} height={60} viewBox="0 0 60 60" aria-hidden="true">
        {/* Track */}
        <circle cx={30} cy={30} r={r} fill="none"
          stroke="var(--border)" strokeWidth={5}/>
        {/* Fill */}
        <circle cx={30} cy={30} r={r} fill="none"
          stroke={color} strokeWidth={5}
          strokeDasharray={`${fill} ${c - fill}`}
          strokeDashoffset={c / 4}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
        <text x={30} y={35} textAnchor="middle"
          fontSize={13} fontWeight={700}
          fontFamily="var(--font-body)"
          fill={color}>
          {pct}%
        </text>
      </svg>
      <div>
        <div style={{
          fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
          fontWeight: 700, color: "var(--text)",
        }}>
          Occupancy
        </div>
        <div style={{
          fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
          color: "var(--text-muted)", marginTop: 3,
        }}>
          Today's rate
        </div>
      </div>
    </div>
  );
}

/* ─── Alert banner ──────────────────────────────────────────────────────── */

function AlertRow({ b, type, label, onView }: {
  b: any; type: "warn" | "danger"; label: string; onView: () => void;
}) {
  const c = type === "warn" ? "var(--warn)" : "var(--danger)";
  return (
    <div onClick={onView} style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "9px 12px",
      background: type === "warn" ? "rgba(212,160,58,0.08)" : "rgba(212,97,74,0.08)",
      borderRadius: "var(--radius-md)",
      marginBottom: 6,
      cursor: "pointer",
      border: `1px solid ${type === "warn" ? "rgba(212,160,58,0.2)" : "rgba(212,97,74,0.2)"}`,
      transition: "background var(--ease)",
    }}
      onMouseEnter={e =>
        (e.currentTarget as HTMLElement).style.background =
          type === "warn" ? "rgba(212,160,58,0.14)" : "rgba(212,97,74,0.14)"
      }
      onMouseLeave={e =>
        (e.currentTarget as HTMLElement).style.background =
          type === "warn" ? "rgba(212,160,58,0.08)" : "rgba(212,97,74,0.08)"
      }
    >
      <span style={{
        fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
        fontWeight: 700, color: "var(--text)",
      }}>
        {b.guestName}
      </span>
      <span style={{
        fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
        color: c, textAlign: "right",
      }}>
        {label}
      </span>
    </div>
  );
}

/* ─── Section card wrapper ──────────────────────────────────────────────── */

function Section({ title, count, accent, subtext, children }: {
  title: string; count: number; accent: string;
  subtext?: string; children: React.ReactNode;
}) {
  return (
    <div style={{
      background: "var(--card)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      marginBottom: 14,
    }}>
      {/* Section header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "14px 18px",
        borderBottom: "1px solid var(--border-light)",
        background: "var(--card-deep)",
      }}>
        <div style={{ width: 3, height: 16, background: accent, borderRadius: 2, flexShrink: 0 }}/>
        <span style={{
          fontFamily: "var(--font-display)", fontSize: "var(--text-lg)",
          fontWeight: 600, color: "var(--text)", flex: 1,
        }}>
          {title}
        </span>
        <span style={{
          fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
          fontWeight: 700, color: accent,
          background: `${accent}18`, padding: "2px 9px",
          borderRadius: 100,
        }}>
          {count}
        </span>
        {subtext && (
          <span style={{
            fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
            color: "var(--text-faint)",
          }}>
            {subtext}
          </span>
        )}
      </div>
      <div style={{ padding: "12px 14px" }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Dashboard ─────────────────────────────────────────────────────────── */

export default function Dashboard({ bookings, onView }: {
  bookings: any[]; onView: (b: any) => void;
}) {
  const active     = useMemo(() => bookings.filter(b => b.status !== "Cancelled"),  [bookings]);
  const arriving   = useMemo(() => active.filter(b => b.checkIn === todayStr),       [active]);
  const departing  = useMemo(() => active.filter(b => b.checkOut === todayStr),      [active]);
  const occupied   = useMemo(() =>
    active.filter(b => b.checkIn <= todayStr && b.checkOut > todayStr), [active]);
  const overdueIn  = useMemo(() => active.filter(isOverdueCheckIn),                  [active]);
  const overdueOut = useMemo(() => active.filter(isOverdueCheckOut),                 [active]);

  const rev          = useMemo(() => active.reduce((s, b) => s + Number(b.total || 0), 0),    [active]);
  const totalPending = useMemo(() => active.reduce((s, b) => s + calcBalance(b), 0),           [active]);
  const pendingCount = useMemo(() =>
    active.filter(b => calcBalance(b) > 0 && b.status !== "Checked Out").length, [active]);

  const todayGuests = useMemo(() => [
    ...occupied,
    ...arriving.filter(b => !occupied.find(o => o.id === b.id)),
  ], [occupied, arriving]);

  const totalVeg    = useMemo(() => todayGuests.reduce((s, b) => s + Number(b.vegCount || 0), 0),    [todayGuests]);
  const totalNonVeg = useMemo(() => todayGuests.reduce((s, b) => s + Number(b.nonVegCount || 0), 0), [todayGuests]);
  const totalPaxIn  = useMemo(() => todayGuests.reduce((s, b) => s + totalPax(b), 0),                [todayGuests]);
  const occPct      = Math.round(occupied.length / 16 * 100);

  const statCards: StatCardProps[] = [
    {
      label: "Check-Ins",   value: arriving.length,
      note: "arriving today",
      icon: <LogIn size={14}/>, accent: "var(--success)",
    },
    {
      label: "Check-Outs",  value: departing.length,
      note: "departing today",
      icon: <LogOut size={14}/>, accent: "var(--warn)",
    },
    {
      label: "Occupied",    value: `${occupied.length}/16`,
      note: "rooms in-house",
      icon: <Users size={14}/>, accent: "var(--moss)",
    },
    {
      label: "Bookings",    value: active.length,
      note: "active reservations",
      icon: <BookOpen size={14}/>, accent: "var(--fern, #A8C4AA)",
    },
    {
      label: "Revenue",     value: fmt(rev),
      note: "total booked",
      icon: <TrendingUp size={14}/>, accent: "var(--gold)",
    },
    {
      label: "Outstanding", value: fmt(totalPending),
      note: `${pendingCount} unpaid booking${pendingCount !== 1 ? "s" : ""}`,
      icon: <AlertCircle size={14}/>,
      accent: pendingCount > 0 ? "var(--danger)" : "var(--success)",
    },
  ];

  return (
    <div>
      {/* ── Page header ────────────────────────────────────────────────── */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        marginBottom: 22, flexWrap: "wrap", gap: 14,
      }}>
        <div>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-2xl)", fontWeight: 700,
            color: "var(--text)", margin: 0, letterSpacing: "0.01em",
          }}>
            Dashboard
          </h1>
          <div style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-sm)", color: "var(--text-muted)", marginTop: 4,
          }}>
            {fmtFull(TODAY)}
          </div>
        </div>
        <OccupancyRing pct={occPct}/>
      </div>

      {/* ── Attention alerts ───────────────────────────────────────────── */}
      {(overdueIn.length > 0 || overdueOut.length > 0) && (
        <div style={{
          background: "rgba(212,160,58,0.06)",
          border: "1px solid rgba(212,160,58,0.25)",
          borderRadius: "var(--radius-lg)", padding: "14px 18px", marginBottom: 18,
        }}>
          <div style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-xs)", fontWeight: 800,
            color: "var(--warn)", letterSpacing: "0.1em",
            textTransform: "uppercase", marginBottom: 10,
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <AlertCircle size={12}/> Attention Required
          </div>
          {overdueIn.map(b => (
            <AlertRow key={b.id} b={b} type="warn" onView={() => onView(b)}
              label={`No-show risk · Was due ${fmtDate(b.checkIn)} · ${getRoomIds(b).join(", ")}`}/>
          ))}
          {overdueOut.map(b => (
            <AlertRow key={b.id} b={b} type="danger" onView={() => onView(b)}
              label={`Overdue checkout · Was due ${fmtDate(b.checkOut)} · ${getRoomIds(b).join(", ")}`}/>
          ))}
        </div>
      )}

      {/* ── Stat cards ─────────────────────────────────────────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: 12, marginBottom: 22,
      }}>
        {statCards.map(s => <StatCard key={s.label} {...s}/>)}
      </div>

      {/* ── Kitchen summary ────────────────────────────────────────────── */}
      {totalPaxIn > 0 && (
        <div style={{
          background: "var(--card)", border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)", overflow: "hidden", marginBottom: 14,
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "14px 18px", borderBottom: "1px solid var(--border-light)",
            background: "var(--card-deep)",
          }}>
            <Utensils size={14} style={{ color: "var(--gold)" }}/>
            <span style={{
              fontFamily: "var(--font-display)", fontSize: "var(--text-lg)",
              fontWeight: 600, color: "var(--text)",
            }}>
              Kitchen — Today
            </span>
            <span style={{
              fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
              color: "var(--text-muted)", marginLeft: 4,
            }}>
              {totalPaxIn} pax in-house
            </span>
          </div>

          <div style={{ padding: "16px 18px" }}>
            {/* Meal count pills */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
              {[
                ["Vegetarian",   totalVeg,    "var(--success)", "rgba(91,173,122,0.12)"],
                ["Non-Veg",      totalNonVeg, "var(--gold)",    "var(--gold-muted)"],
                ...((totalVeg + totalNonVeg < totalPaxIn)
                  ? [["Unspecified", totalPaxIn - totalVeg - totalNonVeg,
                       "var(--text-muted)", "rgba(127,168,138,0.08)"]] as any[]
                  : []),
              ].map(([label, count, color, bg]) => (
                <div key={label as string} style={{
                  background: bg as string,
                  border: `1px solid rgba(255,255,255,0.07)`,
                  borderRadius: "var(--radius-lg)", padding: "12px 20px",
                  textAlign: "center", minWidth: 90,
                }}>
                  <div style={{
                    fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
                    color: color as string, fontWeight: 800,
                    letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6,
                  }}>
                    {label}
                  </div>
                  <div style={{
                    fontFamily: "var(--font-display)", fontSize: "var(--text-3xl)",
                    fontWeight: 700, color: "var(--text)",
                  }}>
                    {count}
                  </div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--text-faint)", marginTop: 2 }}>
                    pax
                  </div>
                </div>
              ))}
            </div>

            {/* Guest meal breakdown */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {todayGuests.map(b => (
                <div key={b.id} style={{
                  display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
                  background: "var(--card-deep)", borderRadius: "var(--radius-md)",
                  padding: "8px 12px",
                }}>
                  <span style={{
                    fontFamily: "var(--font-body)", fontWeight: 700,
                    color: "var(--text)", fontSize: "var(--text-sm)", flex: 1, minWidth: 120,
                  }}>
                    {b.guestName}
                  </span>
                  <span style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)", fontSize: "var(--text-xs)" }}>
                    {getRoomIds(b).join(", ")}
                  </span>
                  {Number(b.vegCount || 0) > 0 && (
                    <span style={{
                      background: "rgba(91,173,122,0.15)", color: "var(--success)",
                      padding: "2px 8px", borderRadius: 100, fontSize: "var(--text-xs)", fontWeight: 700,
                    }}>
                      Veg: {b.vegCount}
                    </span>
                  )}
                  {Number(b.nonVegCount || 0) > 0 && (
                    <span style={{
                      background: "var(--gold-muted)", color: "var(--gold)",
                      padding: "2px 8px", borderRadius: 100, fontSize: "var(--text-xs)", fontWeight: 700,
                    }}>
                      NV: {b.nonVegCount}
                    </span>
                  )}
                  {!Number(b.vegCount || 0) && !Number(b.nonVegCount || 0) && (
                    <span style={{ fontFamily: "var(--font-body)", color: "var(--text-faint)", fontSize: "var(--text-xs)" }}>
                      unspecified
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Arrivals / Departures / In-house ───────────────────────────── */}
      {[
        { title: "Arrivals Today",      list: arriving,  accent: "var(--success)",
          subtext: "Rooms not yet assigned" },
        { title: "Departures Today",    list: departing, accent: "var(--warn)",
          subtext: "Rooms free after 11:30 AM" },
        { title: "Currently In-House",  list: occupied,  accent: "var(--moss)",
          subtext: "Active stays" },
      ].map(({ title, list, accent, subtext }) =>
        list.length > 0 && (
          <Section key={title} title={title} count={list.length} accent={accent} subtext={subtext}>
            {list.map(b => (
              <GuestRow
                key={b.id} b={b}
                onView={() => onView(b)}
                context={
                  title === "Currently In-House"
                    ? `${nights(todayStr, b.checkOut)} night${nights(todayStr, b.checkOut) !== 1 ? "s" : ""} left · out ${fmtDate(b.checkOut)}`
                    : title === "Departures Today"
                    ? `${getRoomIds(b).join(", ")} frees up`
                    : `${totalPax(b)} pax arriving`
                }
              />
            ))}
          </Section>
        )
      )}

      {/* ── Empty state ────────────────────────────────────────────────── */}
      {arriving.length === 0 && departing.length === 0 && occupied.length === 0 && (
        <div style={{
          textAlign: "center", padding: "70px 20px",
          background: "var(--card)", border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
        }}>
          <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.4 }}>🌿</div>
          <h2 style={{
            fontFamily: "var(--font-display)", fontSize: "var(--text-xl)",
            fontWeight: 600, color: "var(--text-soft)", margin: 0,
          }}>
            A quiet day at Rivora
          </h2>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
            color: "var(--text-muted)", marginTop: 8,
          }}>
            No arrivals, departures, or in-house guests today.
          </p>
        </div>
      )}
    </div>
  );
}