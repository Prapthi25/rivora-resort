// "use client";
// import { useMemo } from "react";
// import { D } from "../lib/constants";
// import { sec, crd, ctit, badge } from "../lib/ui";
// import { nights, getRoomIds, calcBalance } from "../lib/helpers";

// export default function Analytics({bookings}:any) {
//   const active = useMemo(()=>bookings.filter((b:any)=>b.status!=="Cancelled"),[bookings]);
//   const now    = new Date();
//   const months = useMemo(()=>Array.from({length:6},(_,i)=>{
//     const d=new Date(now.getFullYear(),now.getMonth()-5+i,1);
//     return {label:d.toLocaleDateString("en-IN",{month:"short",year:"2-digit"}),year:d.getFullYear(),month:d.getMonth()};
//   }),[]);
//   const monthRev = useMemo(()=>months.map(m=>
//     active.filter((b:any)=>{ const d=new Date(b.checkIn); return d.getFullYear()===m.year&&d.getMonth()===m.month; })
//       .reduce((s:number,b:any)=>s+Number(b.total||0),0)
//   ),[months,active]);
//   const maxRev = useMemo(()=>Math.max(...monthRev,1),[monthRev]);

//   const daysInMonth = new Date(now.getFullYear(),now.getMonth()+1,0).getDate();
//   const monthStr    = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
//   const bookedNights= useMemo(()=>
//     active.filter((b:any)=>b.checkIn?.startsWith(monthStr)||b.checkOut?.startsWith(monthStr))
//       .reduce((s:number,b:any)=>s+nights(b.checkIn,b.checkOut)*getRoomIds(b).length,0)
//   ,[active,monthStr]);
//   const occupancy = Math.min(100,Math.round(bookedNights/(16*daysInMonth)*100));

//   const checkedOut = useMemo(()=>active.filter((b:any)=>b.status==="Checked Out"&&b.total>0),[active]);
//   const adr = useMemo(()=>checkedOut.length>0
//     ? Math.round(checkedOut.reduce((s:number,b:any)=>s+Number(b.total||0)/Math.max(nights(b.checkIn,b.checkOut),1),0)/checkedOut.length)
//     : 0,[checkedOut]);

//   const totalRev = useMemo(()=>active.reduce((s:number,b:any)=>s+Number(b.total||0),0),[active]);
//   const famRev   = useMemo(()=>active.filter((b:any)=>b.roomType==="Family").reduce((s:number,b:any)=>s+Number(b.total||0),0),[active]);
//   const couRev   = useMemo(()=>active.filter((b:any)=>b.roomType==="Couple").reduce((s:number,b:any)=>s+Number(b.total||0),0),[active]);
//   const pending  = useMemo(()=>active.reduce((s:number,b:any)=>s+calcBalance(b),0),[active]);

//   return (
//     <div>
//       <h2 style={sec}>Analytics</h2>
//       <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10,marginBottom:20}}>
//         {[[`${occupancy}%`,"Occupancy","This month",D.success],
//           [`₹${adr.toLocaleString("en-IN")}`,"Avg Daily Rate","Per room",D.gold],
//           [`₹${totalRev.toLocaleString("en-IN")}`,"Total Revenue","All bookings",D.blue],
//           [`₹${pending.toLocaleString("en-IN")}`,"Pending","Not collected",D.warning],
//           [`${active.length}`,"Active Bookings","","#9BD3A8"]]
//           .map(([v,l,s,c])=>(
//             <div key={l as string} style={{...crd,textAlign:"center"}}>
//               <div style={{fontSize:22,fontWeight:"800",color:c as string,letterSpacing:"-0.03em"}}>{v}</div>
//               <div style={{fontSize:12,fontWeight:"600",color:D.text,marginTop:6}}>{l}</div>
//               {s&&<div style={{fontSize:10,color:D.sub,marginTop:2}}>{s}</div>}
//             </div>
//           ))}
//       </div>

//       <div style={{...crd,marginBottom:14}}>
//         <div style={ctit}>Revenue — Last 6 Months</div>
//         <div style={{display:"flex",alignItems:"flex-end",gap:6,height:120,paddingTop:8}}>
//           {months.map((m,i)=>(
//             <div key={m.label} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
//               <div style={{fontSize:9,color:D.sub,fontWeight:"600"}}>{monthRev[i]>0?`₹${Math.round(monthRev[i]/1000)}k`:"—"}</div>
//               <div style={{width:"100%",background:monthRev[i]>0?"#7FA88A":D.surface,borderRadius:"4px 4px 0 0",height:`${Math.round(monthRev[i]/maxRev*90)+4}px`,minHeight:4}}/>
//               <div style={{fontSize:9,color:D.sub}}>{m.label}</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
//         <div style={crd}>
//           <div style={ctit}>Revenue by Room Type</div>
//           {[["Family",famRev,"#7FA88A"],["Couple",couRev,D.blue]].map(([l,r,c])=>(
//             <div key={l as string} style={{marginBottom:14}}>
//               <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5}}>
//                 <span style={{color:D.sub}}>{l} Rooms</span>
//                 <span style={{fontWeight:"700",color:c as string}}>{totalRev>0?Math.round((r as number)/totalRev*100):0}%</span>
//               </div>
//               <div style={{background:D.surface,borderRadius:4,height:6,overflow:"hidden"}}>
//                 <div style={{width:totalRev>0?`${Math.round((r as number)/totalRev*100)}%`:"0%",height:"100%",background:c as string,borderRadius:4}}/>
//               </div>
//               <div style={{fontSize:10,color:D.sub,marginTop:3}}>₹{(r as number).toLocaleString("en-IN")}</div>
//             </div>
//           ))}
//         </div>
//         <div style={crd}>
//           <div style={ctit}>Booking Status</div>
//           {["Confirmed","Checked In","Checked Out","Cancelled"].map(s=>(
//             <div key={s} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:`1px solid rgba(255,255,255,0.04)`}}>
//               <span style={badge(s)}>{s}</span>
//               <span style={{fontWeight:"800",color:D.text,fontSize:16}}>{bookings.filter((b:any)=>b.status===s).length}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {active.length>0&&(
//         <div style={crd}>
//           <div style={ctit}>Top Guests by Revenue</div>
//           {Object.values(active.reduce((acc:any,b:any)=>{
//             const k=b.phone||b.guestName;
//             if(!acc[k])acc[k]={name:b.guestName,phone:b.phone,total:0,stays:0};
//             acc[k].total+=Number(b.total||0); acc[k].stays+=1; return acc;
//           },{})).sort((a:any,b:any)=>b.total-a.total).slice(0,5).map((g:any,i)=>(
//             <div key={g.phone||i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid rgba(255,255,255,0.04)`}}>
//               <div style={{display:"flex",gap:10,alignItems:"center"}}>
//                 <span style={{color:D.sub,fontSize:11,fontWeight:"600",minWidth:20}}>#{i+1}</span>
//                 <div>
//                   <div style={{fontWeight:"600",color:D.text,fontSize:13}}>{g.name}</div>
//                   <div style={{color:D.sub,fontSize:10}}>{g.stays} stay{g.stays!==1?"s":""}</div>
//                 </div>
//               </div>
//               <span style={{color:D.gold,fontWeight:"800",fontSize:14}}>₹{g.total.toLocaleString("en-IN")}</span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


"use client";
import { useMemo } from "react";
import {
  TrendingUp, Percent, DollarSign, AlertCircle,
  BookOpen, BarChart2, Users,
} from "lucide-react";
import { nights, getRoomIds, calcBalance } from "../lib/helpers";

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function fmt(n: number): string {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000)   return `₹${(n / 1000).toFixed(0)}k`;
  return `₹${n}`;
}

/* ─── Stat card (matches Dashboard StatCard) ─────────────────────────────── */
function StatCard({ label, value, note, icon, accent }: {
  label: string; value: string | number; note: string;
  icon: React.ReactNode; accent: string;
}) {
  return (
    <div style={{
      background: "var(--card)", border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)", padding: "18px 16px",
      position: "relative", overflow: "hidden",
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
      {/* Accent bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: accent, borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
      }}/>
      {/* Icon */}
      <div style={{
        position: "absolute", top: 14, right: 14,
        width: 30, height: 30, borderRadius: "var(--radius-md)",
        background: `${accent}18`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: accent,
      }}>{icon}</div>
      {/* Value */}
      <div style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 700,
        color: accent, lineHeight: 1, marginTop: 6, letterSpacing: "-0.02em",
      }}>{value}</div>
      {/* Label */}
      <div style={{
        fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
        fontWeight: 700, color: "var(--text)", marginTop: 8,
      }}>{label}</div>
      {/* Note */}
      <div style={{
        fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
        color: "var(--text-muted)", marginTop: 3,
      }}>{note}</div>
    </div>
  );
}

/* ─── Section card ───────────────────────────────────────────────────────── */
function Section({ title, icon, accent = "var(--gold)", children }: {
  title: string; icon?: React.ReactNode; accent?: string; children: React.ReactNode;
}) {
  return (
    <div style={{
      background: "var(--card)", border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)", overflow: "hidden", marginBottom: 14,
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10, padding: "14px 18px",
        borderBottom: "1px solid var(--border-light)",
        background: "var(--card-deep)",
      }}>
        <div style={{ width: 3, height: 16, background: accent, borderRadius: 2, flexShrink: 0 }}/>
        {icon && <span style={{ color: accent, display: "flex", alignItems: "center" }}>{icon}</span>}
        <span style={{
          fontFamily: "var(--font-display)", fontSize: "var(--text-lg)",
          fontWeight: 600, color: "var(--text)", flex: 1,
        }}>{title}</span>
      </div>
      <div style={{ padding: "16px 18px" }}>{children}</div>
    </div>
  );
}

/* ─── Status badge ───────────────────────────────────────────────────────── */
const STATUS_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  "Confirmed":   { color: "var(--gold)",    bg: "var(--gold-muted)",           border: "rgba(200,150,62,0.35)" },
  "Checked In":  { color: "var(--success)", bg: "rgba(91,173,122,0.12)",       border: "rgba(91,173,122,0.35)" },
  "Checked Out": { color: "var(--info)",    bg: "rgba(74,154,191,0.12)",       border: "rgba(74,154,191,0.35)" },
  "Cancelled":   { color: "var(--danger)",  bg: "rgba(212,97,74,0.10)",        border: "rgba(212,97,74,0.3)"   },
};
function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE["Confirmed"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "3px 11px", borderRadius: 100,
      fontSize: "var(--text-xs)", fontWeight: 800,
      fontFamily: "var(--font-body)",
      color: s.color, background: s.bg, border: `1px solid ${s.border}`,
      letterSpacing: "0.04em",
    }}>{status}</span>
  );
}

/* ─── Revenue bar chart ──────────────────────────────────────────────────── */
function RevenueChart({ months, values, max }: {
  months: string[]; values: number[]; max: number;
}) {
  const now = new Date();
  const thisMonth = `${now.toLocaleDateString("en-IN", { month: "short" })}'${String(now.getFullYear()).slice(2)}`;

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 130, paddingTop: 8 }}>
      {months.map((m, i) => {
        const h = Math.round((values[i] / max) * 100) + 4;
        const isCurrent = m === thisMonth;
        return (
          <div key={m} style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", gap: 6,
          }}>
            <div style={{
              fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
              color: values[i] > 0 ? (isCurrent ? "var(--gold)" : "var(--text-muted)") : "var(--text-faint)",
              fontWeight: isCurrent ? 800 : 600,
            }}>
              {values[i] > 0 ? `₹${Math.round(values[i] / 1000)}k` : "—"}
            </div>
            <div style={{
              width: "100%", minHeight: 4, height: `${h}px`,
              background: isCurrent ? "var(--gold)" : values[i] > 0 ? "rgba(127,168,138,0.7)" : "var(--card-deep)",
              borderRadius: "4px 4px 0 0",
              border: isCurrent ? "1px solid rgba(200,150,62,0.4)" : "none",
              transition: "height 0.5s ease",
              position: "relative",
            }}>
              {isCurrent && (
                <div style={{
                  position: "absolute", top: -1, left: 0, right: 0, height: 2,
                  background: "var(--gold)", borderRadius: 2,
                }}/>
              )}
            </div>
            <div style={{
              fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
              color: isCurrent ? "var(--gold)" : "var(--text-muted)",
              fontWeight: isCurrent ? 800 : 400,
            }}>{m}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Progress bar ───────────────────────────────────────────────────────── */
function ProgressBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{
      background: "var(--card-deep)", borderRadius: 99, height: 7, overflow: "hidden",
    }}>
      <div style={{
        width: `${pct}%`, height: "100%",
        background: color, borderRadius: 99,
        transition: "width 0.6s ease",
      }}/>
    </div>
  );
}

/* ─── Analytics ──────────────────────────────────────────────────────────── */
export default function Analytics({ bookings }: any) {
  const active = useMemo(() => bookings.filter((b: any) => b.status !== "Cancelled"), [bookings]);
  const now    = new Date();

  const months = useMemo(() => Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    return {
      label: d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }),
      year: d.getFullYear(), month: d.getMonth(),
    };
  }), []);

  const monthRev = useMemo(() => months.map(m =>
    active.filter((b: any) => {
      const d = new Date(b.checkIn);
      return d.getFullYear() === m.year && d.getMonth() === m.month;
    }).reduce((s: number, b: any) => s + Number(b.total || 0), 0)
  ), [months, active]);

  const maxRev = useMemo(() => Math.max(...monthRev, 1), [monthRev]);

  const daysInMonth  = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const monthStr     = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const bookedNights = useMemo(() =>
    active.filter((b: any) => b.checkIn?.startsWith(monthStr) || b.checkOut?.startsWith(monthStr))
      .reduce((s: number, b: any) => s + nights(b.checkIn, b.checkOut) * getRoomIds(b).length, 0)
  , [active, monthStr]);
  const occupancy = Math.min(100, Math.round(bookedNights / (16 * daysInMonth) * 100));

  const checkedOut = useMemo(() => active.filter((b: any) => b.status === "Checked Out" && b.total > 0), [active]);
  const adr = useMemo(() =>
    checkedOut.length > 0
      ? Math.round(checkedOut.reduce((s: number, b: any) =>
          s + Number(b.total || 0) / Math.max(nights(b.checkIn, b.checkOut), 1), 0) / checkedOut.length)
      : 0
  , [checkedOut]);

  const totalRev = useMemo(() => active.reduce((s: number, b: any) => s + Number(b.total || 0), 0), [active]);
  const famRev   = useMemo(() => active.filter((b: any) => b.roomType === "Family").reduce((s: number, b: any) => s + Number(b.total || 0), 0), [active]);
  const couRev   = useMemo(() => active.filter((b: any) => b.roomType === "Couple").reduce((s: number, b: any) => s + Number(b.total || 0), 0), [active]);
  const pending  = useMemo(() => active.reduce((s: number, b: any) => s + calcBalance(b), 0), [active]);

  const topGuests = useMemo(() =>
    Object.values(active.reduce((acc: any, b: any) => {
      const k = b.phone || b.guestName;
      if (!acc[k]) acc[k] = { name: b.guestName, phone: b.phone, total: 0, stays: 0 };
      acc[k].total += Number(b.total || 0);
      acc[k].stays += 1;
      return acc;
    }, {})).sort((a: any, b: any) => b.total - a.total).slice(0, 5) as any[]
  , [active]);

  const statCards = [
    { label: "Occupancy",     value: `${occupancy}%`,                  note: "This month",            icon: <Percent size={14}/>,       accent: "var(--success)" },
    { label: "Avg Daily Rate",value: `₹${adr.toLocaleString("en-IN")}`,note: "Per room (checked out)", icon: <BarChart2 size={14}/>,      accent: "var(--gold)"    },
    { label: "Total Revenue", value: fmt(totalRev),                    note: "All active bookings",   icon: <TrendingUp size={14}/>,    accent: "var(--info)"    },
    { label: "Outstanding",   value: fmt(pending),                     note: "Not yet collected",      icon: <AlertCircle size={14}/>,   accent: pending > 0 ? "var(--danger)" : "var(--success)" },
    { label: "Active Bookings",value: active.length,                   note: "Excluding cancellations",icon: <BookOpen size={14}/>,     accent: "var(--fern, #A8C4AA)" },
  ];

  return (
    <div>
      {/* ── Page header ────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{
          fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)",
          fontWeight: 700, color: "var(--text)", margin: 0, letterSpacing: "0.01em",
        }}>Analytics</h1>
        <div style={{
          fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
          color: "var(--text-muted)", marginTop: 4,
        }}>Performance overview</div>
      </div>

      {/* ── Stat cards ─────────────────────────────────────────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: 12, marginBottom: 22,
      }}>
        {statCards.map(s => <StatCard key={s.label} {...s}/>)}
      </div>

      {/* ── Revenue chart ─────────────────────────────────────────────── */}
      <Section title="Revenue — Last 6 Months" icon={<TrendingUp size={14}/>} accent="var(--gold)">
        <RevenueChart
          months={months.map(m => m.label)}
          values={monthRev}
          max={maxRev}
        />
      </Section>

      {/* ── Room type + Status grid ────────────────────────────────────── */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 14, marginBottom: 14,
      }}>
        {/* Revenue by room type */}
        <Section title="Revenue by Room Type" accent="var(--info)">
          {[
            ["Family Rooms",  famRev, "var(--success)"],
            ["Couple Rooms",  couRev, "var(--info)"],
          ].map(([label, rev, color]) => (
            <div key={label as string} style={{ marginBottom: 16 }}>
              <div style={{
                display: "flex", justifyContent: "space-between",
                fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
                marginBottom: 6,
              }}>
                <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>{label}</span>
                <span style={{
                  fontWeight: 800, color: color as string,
                  fontFamily: "var(--font-display)",
                }}>
                  {totalRev > 0 ? Math.round((rev as number) / totalRev * 100) : 0}%
                </span>
              </div>
              <ProgressBar
                pct={totalRev > 0 ? Math.round((rev as number) / totalRev * 100) : 0}
                color={color as string}
              />
              <div style={{
                fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
                color: "var(--text-muted)", marginTop: 5,
              }}>₹{(rev as number).toLocaleString("en-IN")}</div>
            </div>
          ))}
        </Section>

        {/* Booking status breakdown */}
        <Section title="Booking Status" accent="var(--success)">
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {["Confirmed","Checked In","Checked Out","Cancelled"].map(s => {
              const count = bookings.filter((b: any) => b.status === s).length;
              return (
                <div key={s} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--border-light)",
                }}>
                  <StatusBadge status={s}/>
                  <span style={{
                    fontFamily: "var(--font-display)", fontSize: "var(--text-xl)",
                    fontWeight: 700, color: "var(--text)",
                  }}>{count}</span>
                </div>
              );
            })}
          </div>
        </Section>
      </div>

      {/* ── Top guests ─────────────────────────────────────────────────── */}
      {active.length > 0 && (
        <Section title="Top Guests by Revenue" icon={<Users size={14}/>} accent="var(--gold)">
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {topGuests.map((g: any, i: number) => (
              <div key={g.phone || i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "11px 0",
                borderBottom: "1px solid var(--border-light)",
              }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  {/* Rank badge */}
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: i === 0 ? "var(--gold-muted)" : "var(--card-deep)",
                    border: `1px solid ${i === 0 ? "rgba(200,150,62,0.4)" : "var(--border)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
                    fontWeight: 800, color: i === 0 ? "var(--gold)" : "var(--text-muted)",
                    flexShrink: 0,
                  }}>
                    {i + 1}
                  </div>
                  <div>
                    <div style={{
                      fontFamily: "var(--font-display)", fontWeight: 700,
                      color: "var(--text)", fontSize: "var(--text-sm)",
                    }}>{g.name}</div>
                    <div style={{
                      fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
                      color: "var(--text-muted)", marginTop: 2,
                    }}>
                      {g.stays} stay{g.stays !== 1 ? "s" : ""}
                      {g.phone && <span style={{ marginLeft: 6, color: "var(--text-faint)" }}>· {g.phone}</span>}
                    </div>
                  </div>
                </div>
                <span style={{
                  fontFamily: "var(--font-display)", fontSize: "var(--text-lg)",
                  fontWeight: 700, color: "var(--gold)",
                }}>
                  ₹{g.total.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}