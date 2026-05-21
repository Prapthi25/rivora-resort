
// "use client";

// import { useState, useMemo, useCallback } from "react";
// import { Search } from "lucide-react";

// import { D, ROOMS } from "../lib/constants";

// import {
//   sec,
//   inp,
//   dateInp,
//   lbl,
//   crd,
//   ctit,
//   btn
// } from "../lib/ui";

// import {
//   todayStr,
//   fmtDate,
//   getRoomIds,
//   getHol,
//   isWknd,
//   nights
// } from "../lib/helpers";

// export default function Availability({ bookings }) {
//   const active = useMemo(()=>bookings.filter(b=>b.status!=="Cancelled"),[bookings]);

//   // ── Date-range availability search ──────────────────────────────────────────
//   const [ci,setCi] = useState("");
//   const [co,setCo] = useState("");

//   // A room is free for [ci,co) if no active booking overlaps that window.
//   // Same-day turnover works automatically: a booking ending exactly on `ci`
//   // (checkOut===ci) does NOT overlap because checkOut > ci is false.
//   const searchResult = useMemo(()=>{
//     if(!ci||!co||co<=ci) return null;
//     const isFree = (rid)=>!active.some(b=>
//       getRoomIds(b).includes(rid) && b.checkIn < co && b.checkOut > ci
//     );
//     const family = ROOMS.filter(r=>r.type==="Family"&&isFree(r.id)).map(r=>r.id);
//     const couple = ROOMS.filter(r=>r.type==="Couple"&&isFree(r.id)).map(r=>r.id);
//     return { family, couple, nights:nights(ci,co) };
//   },[ci,co,active]);

//   // ── 14-day grid ─────────────────────────────────────────────────────────────
//   const [start,setStart] = useState(todayStr);
//   const days = useMemo(()=>Array.from({length:14},(_,i)=>{
//     const d = new Date(start); d.setDate(d.getDate()+i);
//     return d.toISOString().split("T")[0];
//   }),[start]);

//   // For a room+date returns the three relevant bookings.
//   const cellInfo = useCallback((rid,d)=>{
//     const owns = active.filter(b=>getRoomIds(b).includes(rid));
//     return {
//       out: owns.find(b=>b.checkOut===d),                       // departs that morning
//       inb: owns.find(b=>b.checkIn===d),                        // arrives that afternoon
//       mid: owns.find(b=>b.checkIn<d&&b.checkOut>d),             // mid-stay
//     };
//   },[active]);

//   return (
//     <div>
//       <h2 style={sec}>Room Availability</h2>

//       {/* ── Quick availability check ── */}
//       <div style={{...crd,marginBottom:16,borderLeft:`2px solid ${D.goldBorder}`}}>
//         <div style={ctit}><Search size={11} style={{verticalAlign:-1,marginRight:5}}/>Check availability for dates</div>
//         <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"flex-end"}}>
//           <div style={{minWidth:150}}>
//             <div style={{...lbl,marginTop:0}}>Check-In</div>
//             <input type="date" value={ci} onChange={e=>setCi(e.target.value)} style={dateInp}/>
//           </div>
//           <div style={{minWidth:150}}>
//             <div style={{...lbl,marginTop:0}}>Check-Out</div>
//             <input type="date" value={co} onChange={e=>setCo(e.target.value)} style={dateInp}/>
//           </div>
//           {(ci||co) && (
//             <button onClick={()=>{setCi("");setCo("");}} style={btn("ghost","sm")}>Clear</button>
//           )}
//         </div>

//         {ci&&co&&co<=ci && (
//           <div style={{marginTop:10,fontSize:12,color:D.danger}}>Check-out must be after check-in.</div>
//         )}

//         {searchResult && (
//           <div style={{marginTop:14}}>
//             <div style={{fontSize:11,color:D.sub,marginBottom:10}}>
//               {fmtDate(ci)} → {fmtDate(co)} · {searchResult.nights} night{searchResult.nights!==1?"s":""}
//             </div>
//             <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:10}}>
//               {[
//                 ["Family Rooms",searchResult.family,8,D.green,"3+ sharing — extra mattresses"],
//                 ["Couple Rooms",searchResult.couple,8,D.blue,"2 sharing"],
//               ].map(([label,list,total,color,note])=>(
//                 <div key={label} style={{background:D.surface,border:`1px solid ${D.border}`,
//                   borderRadius:12,padding:"14px 16px"}}>
//                   <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
//                     <span style={{fontSize:12,fontWeight:"700",color:D.text}}>{label}</span>
//                     <span style={{fontSize:20,fontWeight:"800",color:list.length?color:D.danger}}>
//                       {list.length}<span style={{fontSize:12,color:D.muted}}>/{total}</span>
//                     </span>
//                   </div>
//                   <div style={{fontSize:10,color:D.muted,marginTop:2}}>{note}</div>
//                   <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:10}}>
//                     {list.length===0
//                       ? <span style={{fontSize:11,color:D.danger}}>None available — fully booked</span>
//                       : list.map(id=>(
//                           <span key={id} style={{background:D.card,border:`1px solid ${D.border}`,
//                             color:D.sub,fontSize:10,fontWeight:"700",padding:"3px 8px",borderRadius:6}}>{id}</span>
//                         ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ── 14-day grid ── */}
//       <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,
//         flexWrap:"wrap",gap:8}}>
//         <div style={{fontSize:13,fontWeight:"700",color:D.text}}>14-day calendar</div>
//         <input type="date" value={start} onChange={e=>setStart(e.target.value)}
//           style={{...dateInp,width:160,fontSize:12}}/>
//       </div>

//       <div style={{overflowX:"auto",borderRadius:14,border:`1px solid ${D.border}`}}>
//         <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
//           <thead><tr>
//             <th style={{background:"#0B1220",color:D.sub,padding:"10px 14px",minWidth:80,textAlign:"left",
//               fontWeight:"700",fontSize:10,letterSpacing:"0.06em",whiteSpace:"nowrap"}}>ROOM</th>
//             {days.map(d=>{
//               const hol=getHol(d); const wknd=isWknd(d); const isToday=d===todayStr;
//               return (
//                 <th key={d} style={{background:isToday?D.goldDim:hol?D.warningDim:wknd?D.blueDim:"#0B1220",
//                   color:isToday?D.gold:hol?D.warning:wknd?D.blue:D.sub,padding:"8px 2px",minWidth:48,
//                   textAlign:"center",fontWeight:"600"}}>
//                   <div style={{fontSize:9}}>{new Date(d).toLocaleDateString("en-IN",{weekday:"short"})}</div>
//                   <div style={{fontSize:11,fontWeight:"800"}}>{new Date(d).getDate()}</div>
//                   {isToday && <div style={{fontSize:8,fontWeight:"800",color:D.gold}}>NOW</div>}
//                   {hol&&!isToday && <div style={{fontSize:8,color:D.warning}}>HOL</div>}
//                 </th>
//               );
//             })}
//           </tr></thead>
//           <tbody>
//             {["Family","Couple"].map(type=>(
//               <RoomTypeRows key={type} type={type} days={days} cellInfo={cellInfo}/>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div style={{display:"flex",flexWrap:"wrap",gap:14,marginTop:12,fontSize:11}}>
//         {[
//           [D.success,"Check-In (arriving)"],
//           [D.gold,"Check-Out (room frees that night)"],
//           [D.danger,"Occupied"],
//           [D.blue,"Same-day turnover (out → in)"],
//           [D.muted,"Available"],
//         ].map(([c,l])=>(
//           <span key={l} style={{display:"flex",alignItems:"center",gap:6,color:D.sub}}>
//             <span style={{width:9,height:9,background:c,borderRadius:2,opacity:0.85,display:"inline-block"}}/>
//             {l}
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// }

// // Renders the section header + room rows for one room type.
// function RoomTypeRows({ type, days, cellInfo }) {
//   return (
//     <>
//       <tr>
//         <td colSpan={days.length+1} style={{background:D.greenDim,color:"#9BD3A8",
//           padding:"6px 14px",fontWeight:"700",fontSize:9,letterSpacing:"0.08em"}}>
//           {type==="Family"?"FAMILY ROOMS · spacious (3+ sharing)":"COUPLE ROOMS · cosy (2 sharing)"}
//         </td>
//       </tr>
//       {ROOMS.filter(r=>r.type===type).map((room,ri)=>(
//         <tr key={room.id} style={{background:ri%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
//           <td style={{padding:"7px 14px",color:D.text,fontWeight:"700",fontSize:11,
//             borderBottom:`1px solid ${D.borderSoft}`,borderRight:`1px solid ${D.border}`}}>{room.id}</td>
//           {days.map(d=>(
//             <GridCell key={d} info={cellInfo(room.id,d)} date={d}/>
//           ))}
//         </tr>
//       ))}
//     </>
//   );
// }

// // One day-cell. Handles same-day turnover (12:30 PM check-in / 11:30 AM check-out).
// function GridCell({ info, date }) {
//   const { out, inb, mid } = info;
//   const td = (children, extra={}) => (
//     <td style={{border:`1px solid ${D.borderSoft}`,padding:0,height:34,textAlign:"center",
//       verticalAlign:"middle",overflow:"hidden",...extra}}>{children}</td>
//   );
//   const initials = (b)=>b.guestName.slice(0,5);

//   // Same-day turnover: one guest leaves, another arrives in the same room.
//   if (out && inb) {
//     return (
//       <td title={`OUT 11:30 AM: ${out.guestName}  →  IN 12:30 PM: ${inb.guestName}`}
//         style={{border:`1px solid ${D.borderSoft}`,padding:0,height:34,overflow:"hidden"}}>
//         <div style={{display:"flex",flexDirection:"column",height:34}}>
//           <div style={{flex:"0 0 12px",background:D.warningDim,color:D.warning,fontSize:8,
//             fontWeight:"800",lineHeight:"12px",letterSpacing:"0.03em"}}>↩ OUT</div>
//           <div style={{flex:1,background:D.blueDim,color:D.blue,fontSize:8,fontWeight:"800",
//             display:"flex",alignItems:"center",justifyContent:"center"}}>IN {initials(inb)}</div>
//         </div>
//       </td>
//     );
//   }
//   // Arriving today (occupies tonight).
//   if (inb) {
//     return td(
//       <div style={{fontSize:8,fontWeight:"800",color:D.success}}>
//         <div>▸ IN</div><div style={{fontSize:8,color:D.text}}>{initials(inb)}</div>
//       </div>,
//       {background:D.successDim}
//     );
//   }
//   // Mid-stay — occupied tonight.
//   if (mid) {
//     return td(
//       <span title={`${mid.guestName} · ${fmtDate(mid.checkIn)} → ${fmtDate(mid.checkOut)}`}
//         style={{fontSize:9,fontWeight:"700",color:D.danger}}>{initials(mid)}</span>,
//       {background:D.dangerDim}
//     );
//   }
//   // Someone checked out this morning, no new arrival — room is FREE tonight.
//   if (out) {
//     return td(
//       <span title={`${out.guestName} checked out · room available tonight`}
//         style={{fontSize:8,fontWeight:"800",color:D.gold}}>OUT ▸ free</span>,
//       {background:"rgba(212,163,115,0.06)"}
//     );
//   }
//   // Available.
//   return td(<span style={{fontSize:11,color:D.muted}}>·</span>);
// }

"use client";

import { useState, useMemo, useCallback } from "react";
import { Search, X, ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { ROOMS } from "../lib/constants";
import { todayStr, fmtDate, getRoomIds, getHol, isWknd, nights } from "../lib/helpers";

/* ─── Shared input style ─────────────────────────────────────────────────── */
const inputStyle: React.CSSProperties = {
  display: "block", width: "100%", padding: "9px 12px",
  fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
  background: "var(--card-deep)", color: "var(--text)",
  border: "1px solid var(--border)", borderRadius: "var(--radius-md)",
  outline: "none", transition: "border-color var(--ease)",
  colorScheme: "dark",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
  fontWeight: 700, color: "var(--text-muted)",
  textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 5,
};

/* ─── Room tag chip ──────────────────────────────────────────────────────── */
function RoomChip({ id, available }: { id: string; available: boolean }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "3px 10px", borderRadius: 100,
      fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", fontWeight: 700,
      background: available ? "rgba(91,173,122,0.12)" : "rgba(212,97,74,0.08)",
      color: available ? "var(--success)" : "var(--text-faint)",
      border: `1px solid ${available ? "rgba(91,173,122,0.35)" : "var(--border-light)"}`,
    }}>
      {id}
    </span>
  );
}

/* ─── Availability result card ───────────────────────────────────────────── */
function AvailCard({ label, list, total, color, note }: {
  label: string; list: string[]; total: number; color: string; note: string;
}) {
  return (
    <div style={{
      background: "var(--card-deep)",
      border: `1px solid ${list.length > 0 ? `${color.replace("var(--","rgba(").replace(")",",0.25)")}` : "var(--border)"}`,
      borderRadius: "var(--radius-lg)", padding: "14px 16px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <span style={{
          fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
          fontWeight: 700, color: "var(--text)",
        }}>{label}</span>
        <span style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
          <span style={{
            fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)",
            fontWeight: 700, color: list.length ? color : "var(--danger)",
          }}>{list.length}</span>
          <span style={{
            fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
            color: "var(--text-muted)",
          }}>/{total}</span>
        </span>
      </div>
      <div style={{
        fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
        color: "var(--text-muted)", marginBottom: 10,
      }}>{note}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {list.length === 0
          ? <span style={{
              fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
              color: "var(--danger)", fontWeight: 700,
            }}>None available — fully booked</span>
          : list.map(id => <RoomChip key={id} id={id} available/>)
        }
      </div>
    </div>
  );
}

/* ─── Legend item ────────────────────────────────────────────────────────── */
function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span style={{
      display: "flex", alignItems: "center", gap: 6,
      fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
      color: "var(--text-muted)",
    }}>
      <span style={{
        width: 9, height: 9, background: color,
        borderRadius: 2, display: "inline-block", opacity: 0.85, flexShrink: 0,
      }}/>
      {label}
    </span>
  );
}

/* ─── GridCell ───────────────────────────────────────────────────────────── */
function GridCell({ info, date }: { info: any; date: string }) {
  const { out, inb, mid } = info;
  const initials = (b: any) => b.guestName.slice(0, 5);

  const cellBase: React.CSSProperties = {
    border: "1px solid rgba(255,255,255,0.05)",
    padding: 0, height: 34, textAlign: "center",
    verticalAlign: "middle", overflow: "hidden",
  };

  if (out && inb) {
    return (
      <td title={`OUT 11:30 AM: ${out.guestName}  →  IN 12:30 PM: ${inb.guestName}`}
        style={{ ...cellBase }}>
        <div style={{ display: "flex", flexDirection: "column", height: 34 }}>
          <div style={{
            flex: "0 0 12px",
            background: "rgba(212,160,58,0.18)", color: "var(--warn)",
            fontSize: 8, fontWeight: 800, lineHeight: "12px", letterSpacing: "0.03em",
          }}>↩ OUT</div>
          <div style={{
            flex: 1, background: "rgba(74,154,191,0.15)", color: "var(--info)",
            fontSize: 8, fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>IN {initials(inb)}</div>
        </div>
      </td>
    );
  }
  if (inb) {
    return (
      <td style={{ ...cellBase, background: "rgba(91,173,122,0.13)" }}
        title={`${inb.guestName} arriving`}>
        <div style={{ fontSize: 8, fontWeight: 800, color: "var(--success)" }}>
          <div>▸ IN</div>
          <div style={{ fontSize: 8, color: "var(--text)" }}>{initials(inb)}</div>
        </div>
      </td>
    );
  }
  if (mid) {
    return (
      <td style={{ ...cellBase, background: "rgba(212,97,74,0.12)" }}
        title={`${mid.guestName} · ${fmtDate(mid.checkIn)} → ${fmtDate(mid.checkOut)}`}>
        <span style={{ fontSize: 9, fontWeight: 700, color: "var(--danger)" }}>{initials(mid)}</span>
      </td>
    );
  }
  if (out) {
    return (
      <td style={{ ...cellBase, background: "rgba(200,150,62,0.06)" }}
        title={`${out.guestName} checked out · room free tonight`}>
        <span style={{ fontSize: 8, fontWeight: 800, color: "var(--gold)" }}>OUT ▸</span>
      </td>
    );
  }
  return (
    <td style={cellBase}>
      <span style={{ fontSize: 11, color: "var(--text-faint)", opacity: 0.4 }}>·</span>
    </td>
  );
}

/* ─── RoomTypeRows ───────────────────────────────────────────────────────── */
function RoomTypeRows({ type, days, cellInfo }: { type: string; days: string[]; cellInfo: any }) {
  return (
    <>
      <tr>
        <td colSpan={days.length + 1} style={{
          background: "rgba(127,168,138,0.07)",
          color: "rgba(155,211,168,0.8)",
          padding: "6px 14px",
          fontFamily: "var(--font-body)",
          fontWeight: 800, fontSize: 9, letterSpacing: "0.1em",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}>
          {type === "Family"
            ? "FAMILY ROOMS · spacious (3+ sharing)"
            : "COUPLE ROOMS · cosy (2 sharing)"}
        </td>
      </tr>
      {ROOMS.filter(r => r.type === type).map((room: any, ri: number) => (
        <tr key={room.id} style={{ background: ri % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)" }}>
          <td style={{
            padding: "7px 14px",
            fontFamily: "var(--font-body)",
            color: "var(--text)", fontWeight: 700, fontSize: 11,
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            borderRight: "1px solid rgba(255,255,255,0.07)",
            whiteSpace: "nowrap",
          }}>
            {room.id}
          </td>
          {days.map((d: string) => (
            <GridCell key={d} info={cellInfo(room.id, d)} date={d}/>
          ))}
        </tr>
      ))}
    </>
  );
}

/* ─── Availability ───────────────────────────────────────────────────────── */
export default function Availability({ bookings }: any) {
  const active = useMemo(() => bookings.filter((b: any) => b.status !== "Cancelled"), [bookings]);

  const [ci, setCi] = useState("");
  const [co, setCo] = useState("");

  const searchResult = useMemo(() => {
    if (!ci || !co || co <= ci) return null;
    const isFree = (rid: string) => !active.some((b: any) =>
      getRoomIds(b).includes(rid) && b.checkIn < co && b.checkOut > ci
    );
    const family = ROOMS.filter((r: any) => r.type === "Family" && isFree(r.id)).map((r: any) => r.id);
    const couple = ROOMS.filter((r: any) => r.type === "Couple" && isFree(r.id)).map((r: any) => r.id);
    return { family, couple, nights: nights(ci, co) };
  }, [ci, co, active]);

  const [start, setStart] = useState(todayStr);
  const days = useMemo(() => Array.from({ length: 14 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  }), [start]);

  const shiftDays = (n: number) => {
    const d = new Date(start);
    d.setDate(d.getDate() + n);
    setStart(d.toISOString().split("T")[0]);
  };

  const cellInfo = useCallback((rid: string, d: string) => {
    const owns = active.filter((b: any) => getRoomIds(b).includes(rid));
    return {
      out: owns.find((b: any) => b.checkOut === d),
      inb: owns.find((b: any) => b.checkIn === d),
      mid: owns.find((b: any) => b.checkIn < d && b.checkOut > d),
    };
  }, [active]);

  return (
    <div>
      {/* ── Page header ────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{
          fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)",
          fontWeight: 700, color: "var(--text)", margin: 0, letterSpacing: "0.01em",
        }}>Room Availability</h1>
        <div style={{
          fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
          color: "var(--text-muted)", marginTop: 4,
        }}>Live calendar &amp; date search</div>
      </div>

      {/* ── Quick availability check ──────────────────────────────────── */}
      <div style={{
        background: "var(--card)",
        border: "1px solid var(--border-gold)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden", marginBottom: 16,
      }}>
        {/* Card header */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "14px 18px",
          borderBottom: "1px solid var(--border-light)",
          background: "var(--card-deep)",
        }}>
          <div style={{ width: 3, height: 16, background: "var(--gold)", borderRadius: 2 }}/>
          <Search size={13} style={{ color: "var(--gold)" }}/>
          <span style={{
            fontFamily: "var(--font-display)", fontSize: "var(--text-lg)",
            fontWeight: 600, color: "var(--text)",
          }}>Check availability for dates</span>
        </div>

        <div style={{ padding: "16px 18px" }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ minWidth: 150 }}>
              <div style={labelStyle}>Check-In</div>
              <input type="date" value={ci} onChange={e => setCi(e.target.value)}
                style={inputStyle}
                onFocus={e => (e.target as HTMLElement).style.borderColor = "var(--gold)"}
                onBlur={e => (e.target as HTMLElement).style.borderColor = "var(--border)"}
              />
            </div>
            <div style={{ minWidth: 150 }}>
              <div style={labelStyle}>Check-Out</div>
              <input type="date" value={co} onChange={e => setCo(e.target.value)}
                style={inputStyle}
                onFocus={e => (e.target as HTMLElement).style.borderColor = "var(--gold)"}
                onBlur={e => (e.target as HTMLElement).style.borderColor = "var(--border)"}
              />
            </div>
            {(ci || co) && (
              <button onClick={() => { setCi(""); setCo(""); }} style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "8px 14px",
                background: "var(--card-deep)", border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                color: "var(--text-muted)", fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)", fontWeight: 700, cursor: "pointer",
                transition: "background var(--ease)",
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--card-hover)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "var(--card-deep)"}
              >
                <X size={12}/> Clear
              </button>
            )}
          </div>

          {ci && co && co <= ci && (
            <div style={{
              marginTop: 12,
              fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
              color: "var(--danger)", fontWeight: 600,
            }}>
              ⚠ Check-out must be after check-in.
            </div>
          )}

          {searchResult && (
            <div style={{ marginTop: 16 }}>
              <div style={{
                fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
                color: "var(--text-muted)", marginBottom: 12,
              }}>
                <span style={{ color: "var(--text)", fontWeight: 700 }}>{fmtDate(ci)}</span>
                {" → "}
                <span style={{ color: "var(--text)", fontWeight: 700 }}>{fmtDate(co)}</span>
                {" · "}
                <span style={{ color: "var(--gold)", fontWeight: 700 }}>
                  {searchResult.nights} night{searchResult.nights !== 1 ? "s" : ""}
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
                <AvailCard label="Family Rooms" list={searchResult.family} total={8}
                  color="var(--success)" note="3+ sharing — extra mattresses available"/>
                <AvailCard label="Couple Rooms" list={searchResult.couple} total={8}
                  color="var(--info)" note="2 sharing — private &amp; cosy"/>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── 14-day grid ─────────────────────────────────────────────────── */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 12, flexWrap: "wrap", gap: 8,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <CalendarDays size={14} style={{ color: "var(--gold)" }}/>
          <span style={{
            fontFamily: "var(--font-display)", fontSize: "var(--text-lg)",
            fontWeight: 600, color: "var(--text)",
          }}>14-day calendar</span>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <button onClick={() => shiftDays(-7)} style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 32, height: 32,
            background: "var(--card-deep)", border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)", color: "var(--text-muted)",
            cursor: "pointer", transition: "background var(--ease)",
          }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--card-hover)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "var(--card-deep)"}
          >
            <ChevronLeft size={14}/>
          </button>
          <input type="date" value={start} onChange={e => setStart(e.target.value)}
            style={{ ...inputStyle, width: 160, padding: "7px 10px" }}
            onFocus={e => (e.target as HTMLElement).style.borderColor = "var(--gold)"}
            onBlur={e => (e.target as HTMLElement).style.borderColor = "var(--border)"}
          />
          <button onClick={() => shiftDays(7)} style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 32, height: 32,
            background: "var(--card-deep)", border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)", color: "var(--text-muted)",
            cursor: "pointer", transition: "background var(--ease)",
          }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--card-hover)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "var(--card-deep)"}
          >
            <ChevronRight size={14}/>
          </button>
        </div>
      </div>

      <div style={{
        overflowX: "auto",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border)",
        background: "var(--card)",
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead>
            <tr>
              <th style={{
                background: "var(--card-deep)", color: "var(--text-muted)",
                padding: "10px 14px", minWidth: 80, textAlign: "left",
                fontFamily: "var(--font-body)",
                fontWeight: 700, fontSize: 9, letterSpacing: "0.1em",
                whiteSpace: "nowrap", borderBottom: "1px solid var(--border)",
              }}>ROOM</th>
              {days.map(d => {
                const hol = getHol(d);
                const wknd = isWknd(d);
                const isToday = d === todayStr;
                return (
                  <th key={d} style={{
                    background: isToday
                      ? "var(--gold-muted)"
                      : hol ? "rgba(212,160,58,0.10)"
                      : wknd ? "rgba(74,154,191,0.08)"
                      : "var(--card-deep)",
                    color: isToday ? "var(--gold)"
                      : hol ? "var(--warn)"
                      : wknd ? "var(--info)"
                      : "var(--text-muted)",
                    padding: "8px 2px", minWidth: 48,
                    textAlign: "center",
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    borderBottom: "1px solid var(--border)",
                  }}>
                    <div style={{ fontSize: 9 }}>
                      {new Date(d).toLocaleDateString("en-IN", { weekday: "short" })}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 800 }}>{new Date(d).getDate()}</div>
                    {isToday && <div style={{ fontSize: 8, fontWeight: 800, color: "var(--gold)" }}>NOW</div>}
                    {hol && !isToday && <div style={{ fontSize: 8, color: "var(--warn)" }}>HOL</div>}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {["Family", "Couple"].map(type => (
              <RoomTypeRows key={type} type={type} days={days} cellInfo={cellInfo}/>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Legend ──────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 12 }}>
        <LegendItem color="var(--success)"  label="Check-In (arriving)"/>
        <LegendItem color="var(--gold)"     label="Check-Out (room free tonight)"/>
        <LegendItem color="var(--danger)"   label="Occupied (mid-stay)"/>
        <LegendItem color="var(--info)"     label="Same-day turnover"/>
        <LegendItem color="var(--text-faint)" label="Available"/>
      </div>
    </div>
  );
}