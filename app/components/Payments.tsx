// "use client";
// import { useState, useMemo } from "react";
// import { D } from "../lib/constants";
// import { sec, inp, lbl, crd, btn } from "../lib/ui";
// import { nights, getRoomIds, calcCollected, calcBalance, fmtDate } from "../lib/helpers";
// import { EmptyState } from "./common";
// import { DateInput } from "./DateInput";

// export default function Payments({ bookings, settings, patchB, can }: any) {
//   const [search,      setSearch]      = useState("");
//   const [statusFilter,setStatusFilter]= useState("All");
//   const [collectorFilter,setCollector]= useState("All");

//   // Build collector list from all payment entries
//   const collectors = useMemo(() => {
//     const set = new Set<string>();
//     bookings.forEach((b: any) => {
//       ["advance","fullStay","extras"].forEach(k => {
//         const by = b.payments?.[k]?.by;
//         if (by) set.add(by);
//       });
//     });
//     return ["All", ...Array.from(set).sort()];
//   }, [bookings]);

//   const active = useMemo(() => bookings.filter((b: any) => {
//     if (b.status === "Cancelled") return false;
//     if (statusFilter === "Unpaid"  && calcBalance(b) === 0) return false;
//     if (statusFilter === "Paid"    && calcBalance(b) > 0)  return false;
//     if (statusFilter === "Active"  && b.status === "Checked Out") return false;
//     if (collectorFilter !== "All") {
//       const collected = ["advance","fullStay","extras"].some(
//         k => b.payments?.[k]?.by === collectorFilter && Number(b.payments[k].amount||0) > 0
//       );
//       if (!collected) return false;
//     }
//     if (search) {
//       const s = search.toLowerCase();
//       return b.guestName?.toLowerCase().includes(s) || b.phone?.includes(search) || b.id?.toLowerCase().includes(s);
//     }
//     return true;
//   }), [bookings, search, statusFilter, collectorFilter]);

//   const totalOutstanding = useMemo(() => active.reduce((s: number, b: any) => s + calcBalance(b), 0), [active]);

//   // Collector summary
//   const collectorSummary = useMemo(() => {
//     const map: Record<string,number> = {};
//     bookings.forEach((b: any) => {
//       if (b.status === "Cancelled") return;
//       ["advance","fullStay","extras"].forEach(k => {
//         const p = b.payments?.[k];
//         if (p?.by && Number(p.amount||0) > 0) {
//           map[p.by] = (map[p.by] || 0) + Number(p.amount);
//         }
//       });
//     });
//     return map;
//   }, [bookings]);

//   const saveP = (b: any, key: string, field: string, val: any) => {
//     patchB(b.id, { payments: { ...b.payments, [key]: { ...(b.payments?.[key]||{}), [field]: val } } });
//   };

//   const stages = [
//     { key:"advance",  label:"Advance · Pre Check-In",    accent: D.success },
//     { key:"fullStay", label:"Full Stay · At Check-In",   accent: D.blue },
//     { key:"extras",   label:"Extras · At Check-Out",     accent: D.gold },
//   ];

//   return (
//     <div>
//       <div style={{display:"flex",gap:10,marginBottom:14,alignItems:"center",flexWrap:"wrap"}}>
//         <h2 style={{...sec,margin:0,flex:1}}>Payments</h2>
//         <input placeholder="Search guest / phone / ID…" value={search}
//           onChange={e=>setSearch(e.target.value)} style={{...inp,width:200,fontSize:12}}/>
//         <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} style={{...inp,width:120,fontSize:12}}>
//           {["All","Unpaid","Paid","Active"].map(o=><option key={o}>{o}</option>)}
//         </select>
//         <select value={collectorFilter} onChange={e=>setCollector(e.target.value)} style={{...inp,width:140,fontSize:12}}>
//           {collectors.map(c=><option key={c}>{c}</option>)}
//         </select>
//       </div>

//       {/* Collector summary strip */}
//       {Object.keys(collectorSummary).length > 0 && (
//         <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14}}>
//           {Object.entries(collectorSummary).sort((a,b)=>b[1]-a[1]).map(([name,amt])=>(
//             <div key={name} onClick={()=>setCollector(collectorFilter===name?"All":name)}
//               style={{background:collectorFilter===name?D.goldDim:D.surface,
//                 border:`1px solid ${collectorFilter===name?D.goldBorder:D.border}`,
//                 borderRadius:10,padding:"8px 14px",cursor:"pointer"}}>
//               <div style={{fontSize:10,color:D.sub,fontWeight:"600"}}>{name}</div>
//               <div style={{fontSize:16,fontWeight:"800",color:collectorFilter===name?D.gold:D.text}}>
//                 ₹{amt.toLocaleString("en-IN")}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {totalOutstanding > 0 && (
//         <div style={{background:"rgba(248,113,113,0.07)",border:"1px solid rgba(248,113,113,0.2)",
//           borderRadius:10,padding:"10px 16px",marginBottom:14,
//           display:"flex",justifyContent:"space-between",alignItems:"center"}}>
//           <span style={{fontSize:12,color:D.sub}}>
//             Outstanding across {active.filter((b:any)=>calcBalance(b)>0).length} bookings
//           </span>
//           <span style={{fontWeight:"800",color:D.danger,fontSize:16}}>₹{totalOutstanding.toLocaleString("en-IN")}</span>
//         </div>
//       )}

//       {active.length === 0 && <EmptyState icon="💰" title="No payment records" sub={search?"No results":"All bookings appear here"}/>}

//       {active.map((b: any) => {
//         const adv   = Number(b.payments?.advance?.amount  || 0);
//         const full  = Number(b.payments?.fullStay?.amount || 0);
//         const extra = Number(b.payments?.extras?.amount   || 0);
//         const collected = adv + full + extra;
//         const total = Number(b.total || 0);
//         const balance = calcBalance(b);
//         const pct = total > 0 ? Math.min(100, Math.round(collected / total * 100)) : 0;

//         return (
//           <div key={b.id} style={{...crd,marginBottom:14,
//             border:`1px solid ${balance>0&&b.status!=="Checked Out"?D.dangerBorder:D.border}`}}>
//             <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:12}}>
//               <div>
//                 <div style={{fontSize:10,color:D.sub,marginBottom:2,fontFamily:"monospace"}}>{b.id} · {b.status}</div>
//                 <div style={{fontSize:14,fontWeight:"700",color:D.text}}>{b.guestName} · {getRoomIds(b).join(", ")}</div>
//                 <div style={{fontSize:11,color:D.sub,marginTop:2}}>{fmtDate(b.checkIn)} → {fmtDate(b.checkOut)} · {nights(b.checkIn,b.checkOut)}N</div>
//               </div>
//               <div style={{textAlign:"right"}}>
//                 <div style={{fontSize:11,color:D.sub}}>Booking Total</div>
//                 <div style={{fontSize:20,fontWeight:"800",color:D.gold}}>₹{total.toLocaleString("en-IN")}</div>
//                 <div style={{fontSize:11,fontWeight:"700",color:pct>=100?D.success:D.danger,marginTop:2}}>
//                   {pct>=100?"✓ Fully Collected":`₹${balance.toLocaleString("en-IN")} outstanding`}
//                 </div>
//               </div>
//             </div>

//             <div style={{background:D.surface,borderRadius:4,height:5,marginBottom:14,overflow:"hidden"}}>
//               <div style={{width:`${pct}%`,height:"100%",background:pct>=100?D.success:pct>=30?D.warning:D.danger,borderRadius:4}}/>
//             </div>

//             {stages.map(({key,label,accent}) => {
//               const p = b.payments?.[key] || {};
//               const stageAmt = Number(p.amount || 0);
//               return (
//                 <div key={key} style={{background:D.surface,borderRadius:10,padding:"11px 14px",
//                   marginBottom:8,borderLeft:`2px solid ${stageAmt>0?accent:"rgba(255,255,255,0.1)"}`}}>
//                   <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
//                     <div style={{fontSize:10,fontWeight:"700",color:stageAmt>0?accent:D.sub,letterSpacing:"0.06em"}}>
//                       {label.toUpperCase()}
//                     </div>
//                     {stageAmt > 0 && <span style={{fontSize:11,fontWeight:"700",color:accent}}>₹{stageAmt.toLocaleString("en-IN")} collected</span>}
//                   </div>
//                   <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
//                     <div style={{minWidth:90}}>
//                       <div style={lbl}>Amount ₹</div>
//                       <input type="number" disabled={!can.staff} value={p.amount||""}
//                         onChange={e=>saveP(b,key,"amount",e.target.value)}
//                         style={{...inp,fontSize:12}} placeholder="0" min="0"/>
//                     </div>
//                     <div style={{minWidth:130}}>
//                       <div style={lbl}>Collected By</div>
//                       <select disabled={!can.staff} value={p.by||""} onChange={e=>saveP(b,key,"by",e.target.value)} style={{...inp,fontSize:12}}>
//                         <option value="">Select…</option>
//                         {(settings.staffList||["Agnish","Deekshith","Mahindra"]).map((s:string)=><option key={s}>{s}</option>)}
//                         <option>Agent</option><option>Cash</option>
//                       </select>
//                     </div>
//                     <div style={{minWidth:100}}>
//                       <div style={lbl}>Mode</div>
//                       <select disabled={!can.staff} value={p.mode||""} onChange={e=>saveP(b,key,"mode",e.target.value)} style={{...inp,fontSize:12}}>
//                         <option value="">Select…</option>
//                         <option>UPI</option><option>Bank Transfer</option><option>Cash</option><option>Card</option>
//                       </select>
//                     </div>
//                     <div style={{minWidth:130}}>
//                       <div style={lbl}>Date</div>
//                       <DateInput value={p.date||""} onChange={(e:any)=>saveP(b,key,"date",e.target.value)} style={{...inp,fontSize:12}}/>
//                     </div>
//                     {key === "extras" && (
//                       <div style={{flex:1,minWidth:150}}>
//                         <div style={lbl}>Notes</div>
//                         <input disabled={!can.staff} value={p.notes||""} onChange={e=>saveP(b,key,"notes",e.target.value)}
//                           style={{...inp,fontSize:12}} placeholder="Extra food, transport…"/>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}

//             <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:D.sub,marginTop:6,flexWrap:"wrap",gap:8}}>
//               <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
//                 <span>Advance: <b style={{color:D.success}}>₹{adv.toLocaleString("en-IN")}</b></span>
//                 <span>Full Stay: <b style={{color:D.success}}>₹{full.toLocaleString("en-IN")}</b></span>
//                 <span>Extras: <b style={{color:D.gold}}>₹{extra.toLocaleString("en-IN")}</b></span>
//               </div>
//               <span style={{fontWeight:"700",color:balance>0?D.danger:D.success}}>
//                 {balance>0?`Balance Due: ₹${balance.toLocaleString("en-IN")}`:"Fully Paid ✓"}
//               </span>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

"use client";
import { useState, useMemo } from "react";
import { Search, X, SlidersHorizontal, CreditCard, AlertCircle, CheckCircle, ChevronDown } from "lucide-react";
import { nights, getRoomIds, calcCollected, calcBalance, fmtDate } from "../lib/helpers";
import { EmptyState } from "./common";
import { DateInput } from "./DateInput";

/* ─── Shared input style ─────────────────────────────────────────────────── */
const inputStyle: React.CSSProperties = {
  display: "block", width: "100%", padding: "8px 10px",
  fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
  background: "var(--card-deep)", color: "var(--text)",
  border: "1px solid var(--border)", borderRadius: "var(--radius-md)",
  outline: "none", transition: "border-color var(--ease)",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
  fontWeight: 700, color: "var(--text-muted)",
  textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 5,
};

/* ─── Filter Select ──────────────────────────────────────────────────────── */
function FilterSelect({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void;
}) {
  return (
    <div style={{ minWidth: 110 }}>
      <div style={labelStyle}>{label}</div>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{
          ...inputStyle,
          border: `1px solid ${value !== "All" && value !== "" ? "var(--border-gold)" : "var(--border)"}`,
          appearance: "none",
        }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

/* ─── Stage badge ────────────────────────────────────────────────────────── */
function StageBadge({ collected, accent }: { collected: boolean; accent: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 9px", borderRadius: 100,
      fontSize: "var(--text-xs)", fontWeight: 800,
      fontFamily: "var(--font-body)",
      color: collected ? accent : "var(--text-muted)",
      background: collected ? `${accent}18` : "transparent",
      border: `1px solid ${collected ? `${accent}55` : "var(--border)"}`,
    }}>
      {collected ? <CheckCircle size={9}/> : <span style={{ width: 9, height: 9, borderRadius: "50%", border: "1.5px solid currentColor", display: "inline-block" }}/>}
      {collected ? "Collected" : "Pending"}
    </span>
  );
}

/* ─── Collector pill ─────────────────────────────────────────────────────── */
function CollectorPill({ name, amount, active, onClick }: {
  name: string; amount: number; active: boolean; onClick: () => void;
}) {
  return (
    <button onClick={onClick} style={{
      background: active ? "var(--gold-muted)" : "var(--card-deep)",
      border: `1px solid ${active ? "rgba(200,150,62,0.4)" : "var(--border)"}`,
      borderRadius: "var(--radius-md)", padding: "10px 16px",
      cursor: "pointer", textAlign: "left",
      transition: "all var(--ease)",
    }}>
      <div style={{
        fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
        fontWeight: 700, color: active ? "var(--gold)" : "var(--text-muted)",
        textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4,
      }}>{name}</div>
      <div style={{
        fontFamily: "var(--font-display)", fontSize: "var(--text-xl)",
        fontWeight: 700, color: active ? "var(--gold)" : "var(--text)",
      }}>₹{amount.toLocaleString("en-IN")}</div>
    </button>
  );
}

/* ─── Progress bar ───────────────────────────────────────────────────────── */
function PaymentBar({ pct }: { pct: number }) {
  const color = pct >= 100 ? "var(--success)" : pct >= 50 ? "var(--warn)" : "var(--danger)";
  return (
    <div style={{
      background: "var(--card-deep)", borderRadius: 99, height: 6,
      overflow: "hidden", margin: "12px 0",
    }}>
      <div style={{
        width: `${pct}%`, height: "100%",
        background: color, borderRadius: 99,
        transition: "width 0.6s ease",
      }}/>
    </div>
  );
}

/* ─── Payments ───────────────────────────────────────────────────────────── */
export default function Payments({ bookings, settings, patchB, can }: any) {
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatus]     = useState("All");
  const [collectorFilter, setCollector] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const collectors = useMemo(() => {
    const set = new Set<string>();
    bookings.forEach((b: any) => {
      ["advance","fullStay","extras"].forEach(k => {
        const by = b.payments?.[k]?.by;
        if (by) set.add(by);
      });
    });
    return ["All", ...Array.from(set).sort()];
  }, [bookings]);

  const active = useMemo(() => bookings.filter((b: any) => {
    if (b.status === "Cancelled") return false;
    if (statusFilter === "Unpaid"  && calcBalance(b) === 0) return false;
    if (statusFilter === "Paid"    && calcBalance(b) > 0)  return false;
    if (statusFilter === "Active"  && b.status === "Checked Out") return false;
    if (collectorFilter !== "All") {
      const collected = ["advance","fullStay","extras"].some(
        k => b.payments?.[k]?.by === collectorFilter && Number(b.payments[k].amount||0) > 0
      );
      if (!collected) return false;
    }
    if (search) {
      const s = search.toLowerCase();
      return b.guestName?.toLowerCase().includes(s) || b.phone?.includes(search) || b.id?.toLowerCase().includes(s);
    }
    return true;
  }), [bookings, search, statusFilter, collectorFilter]);

  const totalOutstanding = useMemo(() => active.reduce((s: number, b: any) => s + calcBalance(b), 0), [active]);

  const collectorSummary = useMemo(() => {
    const map: Record<string, number> = {};
    bookings.forEach((b: any) => {
      if (b.status === "Cancelled") return;
      ["advance","fullStay","extras"].forEach(k => {
        const p = b.payments?.[k];
        if (p?.by && Number(p.amount||0) > 0) {
          map[p.by] = (map[p.by] || 0) + Number(p.amount);
        }
      });
    });
    return map;
  }, [bookings]);

  const saveP = (b: any, key: string, field: string, val: any) => {
    patchB(b.id, { payments: { ...b.payments, [key]: { ...(b.payments?.[key]||{}), [field]: val } } });
  };

  const stages = [
    { key: "advance",  label: "Advance",  sub: "Pre Check-In",  accent: "var(--success)" },
    { key: "fullStay", label: "Full Stay", sub: "At Check-In",   accent: "var(--info)"    },
    { key: "extras",   label: "Extras",    sub: "At Check-Out",  accent: "var(--gold)"    },
  ];

  const activeFilters = [statusFilter !== "All", collectorFilter !== "All"].filter(Boolean).length;

  return (
    <div>
      {/* ── Header ───────────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
        <h2 style={{
          fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)",
          fontWeight: 700, color: "var(--text)", margin: 0, flex: 1,
          letterSpacing: "0.01em",
        }}>
          Payments
          <span style={{
            fontFamily: "var(--font-body)", fontWeight: 400,
            fontSize: "var(--text-sm)", color: "var(--text-muted)", marginLeft: 8,
          }}>
            {active.length}/{bookings.filter((b:any) => b.status !== "Cancelled").length}
          </span>
        </h2>

        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 180px", maxWidth: 260 }}>
          <Search size={13} style={{
            position: "absolute", left: 11, top: "50%",
            transform: "translateY(-50%)", color: "var(--text-faint)", pointerEvents: "none",
          }}/>
          <input placeholder="Name, phone or ID…" value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, padding: "9px 12px 9px 34px" }}
            onFocus={e => (e.target as HTMLElement).style.borderColor = "var(--gold)"}
            onBlur={e => (e.target as HTMLElement).style.borderColor = "var(--border)"}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{
              position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-muted)", display: "flex", padding: 2,
            }}>
              <X size={12}/>
            </button>
          )}
        </div>

        {/* Filter toggle */}
        <button onClick={() => setShowFilters(!showFilters)} style={{
          display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
          background: showFilters ? "var(--gold-muted)" : "var(--card-deep)",
          border: `1px solid ${showFilters ? "rgba(200,150,62,0.4)" : "var(--border)"}`,
          borderRadius: "var(--radius-md)",
          color: showFilters ? "var(--gold)" : "var(--text-muted)",
          fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", fontWeight: 700,
          cursor: "pointer", transition: "all var(--ease)", flexShrink: 0,
        }}>
          <SlidersHorizontal size={13}/>
          Filters
          {activeFilters > 0 && (
            <span style={{
              background: "var(--gold)", color: "#0B1A0D",
              borderRadius: "50%", width: 17, height: 17,
              fontSize: 9, fontWeight: 900,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}>{activeFilters}</span>
          )}
          <ChevronDown size={11} style={{
            transform: showFilters ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}/>
        </button>
      </div>

      {/* ── Filter panel ──────────────────────────────────────────────── */}
      {showFilters && (
        <div style={{
          background: "var(--card)", border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)", padding: "16px 18px", marginBottom: 16,
          display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end",
        }}>
          <FilterSelect label="Status" value={statusFilter}
            options={["All","Unpaid","Paid","Active"]} onChange={setStatus}/>
          <FilterSelect label="Collector" value={collectorFilter}
            options={collectors} onChange={setCollector}/>
          {activeFilters > 0 && (
            <button onClick={() => { setStatus("All"); setCollector("All"); }} style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "8px 14px", marginTop: "auto",
              background: "rgba(212,97,74,0.1)", border: "1px solid rgba(212,97,74,0.35)",
              borderRadius: "var(--radius-md)", color: "var(--danger)",
              fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", fontWeight: 700,
              cursor: "pointer",
            }}>
              <X size={12}/> Clear all
            </button>
          )}
        </div>
      )}

      {/* ── Collector summary ─────────────────────────────────────────── */}
      {Object.keys(collectorSummary).length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          {Object.entries(collectorSummary).sort((a, b) => b[1] - a[1]).map(([name, amt]) => (
            <CollectorPill key={name} name={name} amount={amt}
              active={collectorFilter === name}
              onClick={() => setCollector(collectorFilter === name ? "All" : name)}
            />
          ))}
        </div>
      )}

      {/* ── Outstanding banner ────────────────────────────────────────── */}
      {totalOutstanding > 0 && (
        <div style={{
          background: "rgba(212,97,74,0.06)",
          border: "1px solid rgba(212,97,74,0.2)",
          borderRadius: "var(--radius-lg)", padding: "12px 18px", marginBottom: 16,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <AlertCircle size={14} style={{ color: "var(--danger)", flexShrink: 0 }}/>
            <span style={{
              fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
              color: "var(--text-muted)",
            }}>
              Outstanding across {active.filter((b: any) => calcBalance(b) > 0).length} bookings
            </span>
          </div>
          <span style={{
            fontFamily: "var(--font-display)", fontSize: "var(--text-xl)",
            fontWeight: 700, color: "var(--danger)",
          }}>
            ₹{totalOutstanding.toLocaleString("en-IN")}
          </span>
        </div>
      )}

      {/* ── Empty state ───────────────────────────────────────────────── */}
      {active.length === 0 && (
        <EmptyState icon="💰" title="No payment records"
          sub={search ? "No results for your search" : "All active bookings appear here"}/>
      )}

      {/* ── Payment cards ─────────────────────────────────────────────── */}
      {active.map((b: any) => {
        const adv   = Number(b.payments?.advance?.amount  || 0);
        const full  = Number(b.payments?.fullStay?.amount || 0);
        const extra = Number(b.payments?.extras?.amount   || 0);
        const collected = adv + full + extra;
        const total   = Number(b.total || 0);
        const balance = calcBalance(b);
        const pct = total > 0 ? Math.min(100, Math.round(collected / total * 100)) : 0;
        const paid = balance === 0;

        return (
          <div key={b.id} style={{
            background: "var(--card)",
            border: `1px solid ${balance > 0 && b.status !== "Checked Out" ? "rgba(212,97,74,0.25)" : paid ? "rgba(91,173,122,0.2)" : "var(--border)"}`,
            borderRadius: "var(--radius-lg)", marginBottom: 12, overflow: "hidden",
            transition: "border-color var(--ease)",
          }}>
            <div style={{ padding: "16px 18px" }}>
              {/* Top row */}
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 4 }}>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{
                    fontFamily: "monospace", fontSize: "var(--text-xs)",
                    color: "var(--text-faint)", marginBottom: 4,
                    display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap",
                  }}>
                    <span>{b.id}</span>
                    <span style={{
                      padding: "1px 7px", borderRadius: 100,
                      background: "var(--card-deep)", color: "var(--text-muted)",
                      fontSize: "var(--text-xs)", fontWeight: 700,
                    }}>{b.status}</span>
                  </div>
                  <div style={{
                    fontFamily: "var(--font-display)", fontSize: "var(--text-xl)",
                    fontWeight: 700, color: "var(--text)", lineHeight: 1.2,
                  }}>{b.guestName}</div>
                  <div style={{
                    fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
                    color: "var(--text-muted)", marginTop: 4,
                  }}>
                    🛏 {getRoomIds(b).join(", ")} &nbsp;·&nbsp; 📅 {fmtDate(b.checkIn)} → {fmtDate(b.checkOut)} · {nights(b.checkIn, b.checkOut)}N
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{
                    fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
                    color: "var(--text-muted)", marginBottom: 4,
                  }}>Booking Total</div>
                  <div style={{
                    fontFamily: "var(--font-display)", fontSize: "clamp(20px,3vw,26px)",
                    fontWeight: 700, color: "var(--gold)", lineHeight: 1,
                  }}>₹{total.toLocaleString("en-IN")}</div>
                  {balance > 0 ? (
                    <div style={{
                      fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
                      fontWeight: 700, color: "var(--danger)", marginTop: 4,
                    }}>₹{balance.toLocaleString("en-IN")} outstanding</div>
                  ) : (
                    <div style={{
                      fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
                      fontWeight: 700, color: "var(--success)", marginTop: 4,
                    }}>✓ Fully Collected</div>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <PaymentBar pct={pct}/>

              {/* Stages */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {stages.map(({ key, label, sub, accent }) => {
                  const p = b.payments?.[key] || {};
                  const stageAmt = Number(p.amount || 0);
                  return (
                    <div key={key} style={{
                      background: "var(--card-deep)",
                      border: `1px solid ${stageAmt > 0 ? `${accent.replace("var(--","rgba(").replace(")",",0.25)")}` : "var(--border-light)"}`,
                      borderRadius: "var(--radius-md)",
                      borderLeft: `3px solid ${stageAmt > 0 ? accent : "var(--border)"}`,
                      padding: "12px 14px",
                    }}>
                      <div style={{
                        display: "flex", justifyContent: "space-between",
                        alignItems: "center", marginBottom: 10,
                      }}>
                        <div>
                          <span style={{
                            fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
                            fontWeight: 800, color: stageAmt > 0 ? accent : "var(--text-muted)",
                            letterSpacing: "0.08em", textTransform: "uppercase",
                          }}>{label}</span>
                          <span style={{
                            fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
                            color: "var(--text-faint)", marginLeft: 8,
                          }}>{sub}</span>
                        </div>
                        <StageBadge collected={stageAmt > 0} accent={accent}/>
                      </div>

                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
                        gap: 8,
                      }}>
                        <div>
                          <div style={labelStyle}>Amount ₹</div>
                          <input type="number" disabled={!can.staff} value={p.amount || ""}
                            onChange={e => saveP(b, key, "amount", e.target.value)}
                            style={inputStyle} placeholder="0" min="0"
                            onFocus={e => (e.target as HTMLElement).style.borderColor = accent}
                            onBlur={e => (e.target as HTMLElement).style.borderColor = "var(--border)"}
                          />
                        </div>
                        <div>
                          <div style={labelStyle}>Collected By</div>
                          <select disabled={!can.staff} value={p.by || ""}
                            onChange={e => saveP(b, key, "by", e.target.value)}
                            style={{ ...inputStyle, appearance: "none" }}>
                            <option value="">Select…</option>
                            {(settings.staffList || ["Agnish","Deekshith","Mahindra"]).map((s: string) => (
                              <option key={s}>{s}</option>
                            ))}
                            <option>Agent</option>
                            <option>Cash</option>
                          </select>
                        </div>
                        <div>
                          <div style={labelStyle}>Mode</div>
                          <select disabled={!can.staff} value={p.mode || ""}
                            onChange={e => saveP(b, key, "mode", e.target.value)}
                            style={{ ...inputStyle, appearance: "none" }}>
                            <option value="">Select…</option>
                            <option>UPI</option>
                            <option>Bank Transfer</option>
                            <option>Cash</option>
                            <option>Card</option>
                          </select>
                        </div>
                        <div>
                          <div style={labelStyle}>Date</div>
                          <DateInput value={p.date || ""} onChange={(e: any) => saveP(b, key, "date", e.target.value)} style={inputStyle}/>
                        </div>
                        {key === "extras" && (
                          <div style={{ gridColumn: "1 / -1" }}>
                            <div style={labelStyle}>Notes</div>
                            <input disabled={!can.staff} value={p.notes || ""}
                              onChange={e => saveP(b, key, "notes", e.target.value)}
                              style={inputStyle} placeholder="Extra food, transport…"/>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer summary */}
              <div style={{
                display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8,
                marginTop: 12, paddingTop: 12,
                borderTop: "1px solid var(--border-light)",
              }}>
                <div style={{
                  display: "flex", gap: 16, flexWrap: "wrap",
                  fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
                  color: "var(--text-muted)",
                }}>
                  <span>Advance: <b style={{ color: "var(--success)" }}>₹{adv.toLocaleString("en-IN")}</b></span>
                  <span>Full Stay: <b style={{ color: "var(--info)" }}>₹{full.toLocaleString("en-IN")}</b></span>
                  <span>Extras: <b style={{ color: "var(--gold)" }}>₹{extra.toLocaleString("en-IN")}</b></span>
                </div>
                <span style={{
                  fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
                  fontWeight: 800, color: balance > 0 ? "var(--danger)" : "var(--success)",
                }}>
                  {balance > 0 ? `Balance Due: ₹${balance.toLocaleString("en-IN")}` : "Fully Paid ✓"}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}