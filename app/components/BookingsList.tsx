

// "use client";

// import { useState, useMemo, useCallback } from "react";

// import {
//   Eye,
//   Pencil,
//   MessageSquare,
//   LogIn,
//   LogOut,
//   XCircle,
//   Trash2,
//   FileText,
//   ChevronDown
// } from "lucide-react";

// import { D } from "../lib/constants";
// import { sec, inp, lbl, crd, btn, badge } from "../lib/ui";

// import {
//   nights,
//   getRoomIds,
//   calcCollected,
//   calcBalance,
//   totalKids,
//   isOverdueCheckIn,
//   isOverdueCheckOut
// } from "../lib/helpers";

// import { EmptyState } from "./common";

// export default function BookingsList({ bookings,can,onView,patchB,delB,notify,setSel,setModal,onInvoice }) {
//   const [search,setSearch]         = useState("");
//   const [filter,setFilter]         = useState("All");
//   const [roomFilter,setRoomFilter] = useState("All");
//   const [payFilter,setPayFilter]   = useState("All");
//   const [dateFrom,setDateFrom]     = useState("");
//   const [dateTo,setDateTo]         = useState("");
//   const [showFilters,setShowFilters] = useState(false);
//   const [editId,setEditId]         = useState(null);
//   const [editForm,setEditForm]     = useState(null);

//   const list = useMemo(()=>bookings.filter(b=>{
//     if(search){
//       const s=search.toLowerCase();
//       if(!b.guestName?.toLowerCase().includes(s)&&!b.phone?.includes(search)&&!b.id?.toLowerCase().includes(s))
//         return false;
//     }
//     if(filter!=="All"&&b.status!==filter)return false;
//     if(roomFilter!=="All"&&!getRoomIds(b).some(r=>r.startsWith(roomFilter==="Family"?"FR":"CR")))return false;
//     if(payFilter==="Pending"&&(calcBalance(b)===0||b.status==="Cancelled"))return false;
//     if(payFilter==="Paid"&&calcBalance(b)>0)return false;
//     if(dateFrom&&b.checkIn<dateFrom)return false;
//     if(dateTo&&b.checkOut>dateTo)return false;
//     return true;
//   }).sort((a,b)=>(b.createdAt||"").localeCompare(a.createdAt||"")),
//   [bookings,search,filter,roomFilter,payFilter,dateFrom,dateTo]);

//   const activeFilters = useMemo(()=>
//     [filter!=="All",roomFilter!=="All",payFilter!=="All",dateFrom,dateTo].filter(Boolean).length,
//   [filter,roomFilter,payFilter,dateFrom,dateTo]);

//   const startEdit = useCallback((b)=>{
//     setEditId(b.id);
//     setEditForm({
//       guestName:b.guestName, phone:b.phone,
//       adults:b.adults??b.guests??"", kidsFree:b.kidsFree||"", kidsHalf:b.kidsHalf||"", kidsFull:b.kidsFull||"",
//       vegCount:b.vegCount||"", nonVegCount:b.nonVegCount||"",
//       bookedBy:b.bookedBy||"", notes:b.notes||"",
//     });
//   },[]);

//   const saveEdit = useCallback((b)=>{
//     const guests = Number(editForm.adults||0)+Number(editForm.kidsFree||0)
//       +Number(editForm.kidsHalf||0)+Number(editForm.kidsFull||0);
//     patchB(b.id,{...editForm,guests});
//     setEditId(null); setEditForm(null);
//     notify("Booking updated!");
//   },[patchB,editForm,notify]);

//   const cancelEdit = useCallback(()=>{ setEditId(null); setEditForm(null); },[]);

//   const num = (v)=>v.replace(/[^0-9]/g,"");

//   return (
//     <div>
//       <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
//         <h2 style={{...sec,margin:0,flex:1}}>Bookings
//           <span style={{color:D.muted,fontWeight:"400",fontSize:14}}> ({list.length}/{bookings.length})</span>
//         </h2>
//         <div style={{position:"relative",flex:"1 1 200px",maxWidth:240}}>
//           <input placeholder="Search name, phone, ID…" value={search} onChange={e=>setSearch(e.target.value)}
//             style={{...inp,paddingLeft:32,fontSize:12}}/>
//           <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",
//             color:D.muted,fontSize:12}}>🔍</span>
//         </div>
//         <button onClick={()=>setShowFilters(!showFilters)}
//           style={{...btn(showFilters?"surface":"ghost","sm"),color:showFilters?D.gold:D.sub}}>
//           Filters {activeFilters>0 && (
//             <span style={{background:D.gold,color:"#0F172A",borderRadius:"50%",width:15,height:15,
//               fontSize:8,display:"inline-flex",alignItems:"center",justifyContent:"center",
//               fontWeight:"800"}}>{activeFilters}</span>
//           )}
//           <ChevronDown size={10} style={{transform:showFilters?"rotate(180deg)":"none",transition:"transform .15s"}}/>
//         </button>
//       </div>

//       {showFilters && (
//         <div style={{background:D.card,border:`1px solid ${D.border}`,borderRadius:12,padding:"14px 16px",
//           marginBottom:14,display:"flex",flexWrap:"wrap",gap:10,alignItems:"flex-end"}}>
//           {[
//             ["Status",filter,setFilter,["All","Confirmed","Checked In","Checked Out","Cancelled"]],
//             ["Room Type",roomFilter,setRoomFilter,["All","Family","Couple"]],
//             ["Payment",payFilter,setPayFilter,["All","Pending","Paid"]],
//           ].map(([label,val,setter,opts])=>(
//             <div key={label} style={{minWidth:110}}>
//               <div style={{...lbl,marginTop:0}}>{label}</div>
//               <select value={val} onChange={e=>setter(e.target.value)} style={{...inp,fontSize:12}}>
//                 {opts.map(o=><option key={o}>{o}</option>)}
//               </select>
//             </div>
//           ))}
//           <div style={{minWidth:140}}><div style={{...lbl,marginTop:0}}>From</div>
//             <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)}
//               style={{...inp,fontSize:12,colorScheme:"dark"}}/></div>
//           <div style={{minWidth:140}}><div style={{...lbl,marginTop:0}}>To</div>
//             <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)}
//               style={{...inp,fontSize:12,colorScheme:"dark"}}/></div>
//           {activeFilters>0 && (
//             <button onClick={()=>{setFilter("All");setRoomFilter("All");setPayFilter("All");
//               setDateFrom("");setDateTo("");}} style={btn("danger","sm")}>Clear</button>
//           )}
//         </div>
//       )}

//       {list.length===0 && <EmptyState icon="📋" title="No bookings found" sub="Try adjusting your filters"/>}

//       {list.map(b=>{
//         const n        = nights(b.checkIn,b.checkOut);
//         const isEditing= editId===b.id;
//         const collected= calcCollected(b);
//         const balance  = calcBalance(b);
//         const kids     = totalKids(b);
//         const overdue  = isOverdueCheckIn(b)||isOverdueCheckOut(b);
//         return (
//           <div key={b.id} style={{...crd,marginBottom:10,
//             border:`1px solid ${overdue?"rgba(251,191,36,0.35)":D.border}`}}>
//             <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
//               <div>
//                 <div style={{fontSize:10,color:D.muted,marginBottom:3,fontWeight:"500",display:"flex",
//                   gap:8,alignItems:"center"}}>
//                   <span style={{fontFamily:"monospace"}}>{b.id}</span>
//                   <span>·</span><span>{b.bookedBy}</span>
//                   {isOverdueCheckIn(b)  && <span style={{color:D.warning,fontWeight:"700"}}>⚠ No-show risk</span>}
//                   {isOverdueCheckOut(b) && <span style={{color:D.danger,fontWeight:"700"}}>⚠ Overdue checkout</span>}
//                 </div>
//                 <div style={{fontSize:15,fontWeight:"700",color:D.text}}>{b.guestName}</div>
//                 <div style={{fontSize:12,color:D.sub,marginTop:2}}>📞 {b.phone}</div>
//               </div>
//               <div style={{textAlign:"right"}}>
//                 <span style={badge(b.status)}>{b.status}</span>
//                 <div style={{fontSize:18,fontWeight:"800",color:D.gold,marginTop:6}}>
//                   ₹{Number(b.total||0).toLocaleString("en-IN")}
//                 </div>
//                 {balance>0
//                   ? <div style={{fontSize:10,marginTop:3,color:D.danger,fontWeight:"600"}}>
//                       ₹{balance.toLocaleString("en-IN")} outstanding</div>
//                   : <div style={{fontSize:10,marginTop:3,color:D.success,fontWeight:"600"}}>✓ Fully paid</div>}
//               </div>
//             </div>
//             <div style={{display:"flex",flexWrap:"wrap",gap:10,marginTop:10,fontSize:11,color:D.sub}}>
//               <span>🛏 {getRoomIds(b).join(", ")}</span>
//               <span>👥 {b.adults??b.guests} adult{(b.adults??b.guests)!==1?"s":""}</span>
//               {kids>0 && <span>👶 {kids} kid{kids!==1?"s":""}</span>}
//               <span>📅 {fmtD(b.checkIn)} → {fmtD(b.checkOut)} · {n}N</span>
//               <span>🥗 V:{b.vegCount||0} / NV:{b.nonVegCount||0}</span>
//               {collected>0 && <span style={{color:D.success}}>Collected: ₹{collected.toLocaleString("en-IN")}</span>}
//             </div>

//             {isEditing && (
//               <div style={{marginTop:12,background:D.surface,borderRadius:10,padding:"14px",
//                 border:`1px solid ${D.border}`}}>
//                 <div style={{fontSize:11,fontWeight:"700",color:D.gold,marginBottom:10,
//                   letterSpacing:"0.04em"}}>EDIT BOOKING DETAILS</div>
//                 <div style={{background:"rgba(251,191,36,0.08)",border:"1px solid rgba(251,191,36,0.25)",
//                   borderRadius:8,padding:"7px 11px",marginBottom:10,fontSize:11,color:D.warning}}>
//                   ℹ Editing guests here does not recalculate the booking total. To change the amount,
//                   cancel this booking and create a new one.
//                 </div>
//                 <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:8}}>
//                   {[
//                     ["Guest Name","guestName","text"],["Phone","phone","text"],
//                     ["Adults","adults","num"],["Kids · under 5","kidsFree","num"],
//                     ["Kids · 5–9","kidsHalf","num"],["Kids · 10+","kidsFull","num"],
//                     ["Veg","vegCount","num"],["Non-Veg","nonVegCount","num"],
//                     ["Booked By","bookedBy","text"],
//                   ].map(([label,key,mode])=>(
//                     <div key={key}>
//                       <div style={lbl}>{label}</div>
//                       <input value={editForm[key]} onChange={e=>setEditForm(f=>({...f,
//                         [key]:mode==="num"?num(e.target.value):e.target.value}))}
//                         style={{...inp,fontSize:12}}/>
//                     </div>
//                   ))}
//                 </div>
//                 <div style={{marginTop:8}}>
//                   <div style={lbl}>Notes / Special Requests</div>
//                   <textarea value={editForm.notes} onChange={e=>setEditForm(f=>({...f,notes:e.target.value}))}
//                     style={{...inp,height:44,resize:"vertical",fontSize:12}}/>
//                 </div>
//                 <div style={{display:"flex",gap:7,marginTop:10}}>
//                   <button onClick={()=>saveEdit(b)} style={btn("primary","sm")}>Save Changes</button>
//                   <button onClick={cancelEdit} style={btn("ghost","sm")}>Cancel</button>
//                 </div>
//               </div>
//             )}

//             <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:12}}>
//               <button onClick={()=>onView(b)} style={btn("surface","sm")}><Eye size={11}/>View</button>
//               <button onClick={()=>{setSel(b);setModal("whatsapp");}} style={btn("green","sm")}>
//                 <MessageSquare size={11}/>WA</button>
//               <button onClick={()=>onInvoice(b)} style={btn("blue","sm")}><FileText size={11}/>Invoice</button>
//               {can.staff&&b.status!=="Checked Out"&&b.status!=="Cancelled" && (
//                 <button onClick={()=>isEditing?cancelEdit():startEdit(b)} style={btn("warning","sm")}>
//                   <Pencil size={11}/>{isEditing?"✕":"Edit"}</button>
//               )}
//               {can.staff&&b.status==="Confirmed" && (
//                 <button onClick={()=>{patchB(b.id,{status:"Checked In"});notify(`${b.guestName} checked in!`);}}
//                   style={btn("success","sm")}><LogIn size={11}/>Check-In</button>
//               )}
//               {can.staff&&b.status==="Checked In" && (
//                 <button onClick={()=>{if(window.confirm(`Check out ${b.guestName}? Cannot be undone.`)){
//                   patchB(b.id,{status:"Checked Out"});notify(`${b.guestName} checked out!`);}}}
//                   style={btn("warning","sm")}><LogOut size={11}/>Check-Out</button>
//               )}
//               {can.admin&&b.status!=="Checked Out"&&b.status!=="Cancelled" && (
//                 <button onClick={()=>{if(window.confirm("Cancel booking?"))patchB(b.id,{status:"Cancelled"});}}
//                   style={btn("danger","sm")}><XCircle size={11}/>Cancel</button>
//               )}
//               {can.admin && (
//                 <button onClick={async()=>{
//                   if(window.confirm(`Delete booking for ${b.guestName} permanently?`)){
//                     await delB(b.id); notify("Booking deleted","err");
//                   }
//                 }} style={btn("danger","sm")}><Trash2 size={11}/>Delete</button>
//               )}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// // local date formatter to avoid extra import noise
// function fmtD(d){
//   if(!d) return "—";
//   const dt=new Date(d);
//   return `${String(dt.getDate()).padStart(2,"0")}-${String(dt.getMonth()+1).padStart(2,"0")}-${dt.getFullYear()}`;
// }


"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Eye, Pencil, MessageSquare, LogIn, LogOut,
  XCircle, Trash2, FileText, ChevronDown,
  SlidersHorizontal, Search, X,
} from "lucide-react";
import { nights, getRoomIds, calcCollected, calcBalance, totalKids,
  isOverdueCheckIn, isOverdueCheckOut } from "../lib/helpers";
import { EmptyState } from "./common";

/* ─── Status badge config ───────────────────────────────────────────────── */

const STATUS_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  "Confirmed":    { color: "var(--gold)",    bg: "var(--gold-muted)",             border: "rgba(200,150,62,0.35)"  },
  "Checked In":   { color: "var(--success)", bg: "rgba(91,173,122,0.12)",         border: "rgba(91,173,122,0.35)"  },
  "Checked Out":  { color: "var(--info)",    bg: "rgba(74,154,191,0.12)",         border: "rgba(74,154,191,0.35)"  },
  "Cancelled":    { color: "var(--danger)",  bg: "rgba(212,97,74,0.10)",          border: "rgba(212,97,74,0.3)"    },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE["Confirmed"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "3px 11px", borderRadius: 100,
      fontSize: "var(--text-xs)", fontWeight: 800,
      fontFamily: "var(--font-body)",
      color: s.color, background: s.bg,
      border: `1px solid ${s.border}`,
      letterSpacing: "0.04em",
      whiteSpace: "nowrap",
    }}>
      {status}
    </span>
  );
}

/* ─── Action button ─────────────────────────────────────────────────────── */

type BtnVariant = "gold" | "success" | "danger" | "info" | "ghost" | "warn";

const BTN_STYLES: Record<BtnVariant, { color: string; bg: string; border: string; hoverBg: string }> = {
  gold:    { color: "var(--gold)",    bg: "var(--gold-muted)",             border: "rgba(200,150,62,0.4)",  hoverBg: "rgba(200,150,62,0.25)" },
  success: { color: "var(--success)", bg: "rgba(91,173,122,0.12)",         border: "rgba(91,173,122,0.4)",  hoverBg: "rgba(91,173,122,0.22)" },
  danger:  { color: "var(--danger)",  bg: "rgba(212,97,74,0.10)",          border: "rgba(212,97,74,0.4)",   hoverBg: "rgba(212,97,74,0.20)"  },
  info:    { color: "var(--info)",    bg: "rgba(74,154,191,0.10)",         border: "rgba(74,154,191,0.4)",  hoverBg: "rgba(74,154,191,0.20)" },
  ghost:   { color: "var(--text-muted)", bg: "transparent",               border: "var(--border)",         hoverBg: "var(--card-hover)"     },
  warn:    { color: "var(--warn)",    bg: "rgba(212,160,58,0.10)",         border: "rgba(212,160,58,0.4)",  hoverBg: "rgba(212,160,58,0.20)" },
};

function ActionBtn({
  variant = "ghost", icon, label, onClick, title,
}: {
  variant?: BtnVariant; icon: React.ReactNode;
  label?: string; onClick: () => void; title?: string;
}) {
  const s = BTN_STYLES[variant];
  return (
    <button
      onClick={onClick}
      title={title ?? label}
      style={{
        display: "flex", alignItems: "center", gap: 5,
        padding: label ? "6px 12px" : "6px 8px",
        background: s.bg, border: `1px solid ${s.border}`,
        borderRadius: "var(--radius-md)",
        color: s.color,
        fontFamily: "var(--font-body)",
        fontSize: "var(--text-xs)", fontWeight: 700,
        cursor: "pointer", whiteSpace: "nowrap",
        transition: "background var(--ease), transform var(--ease)",
      }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = s.hoverBg}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = s.bg}
    >
      {icon}
      {label && <span className="rv-action-label">{label}</span>}
    </button>
  );
}

/* ─── Filter pill (select wrapper) ─────────────────────────────────────── */

function FilterSelect({
  label, value, options, onChange,
}: {
  label: string; value: string;
  options: string[]; onChange: (v: string) => void;
}) {
  return (
    <div style={{ minWidth: 110 }}>
      <div style={{
        fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
        fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase",
        letterSpacing: "0.08em", marginBottom: 5,
      }}>
        {label}
      </div>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          display: "block", width: "100%",
          padding: "8px 12px",
          fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
          background: "var(--card-deep)", color: "var(--text)",
          border: `1px solid ${value !== "All" && value !== "" ? "var(--border-gold)" : "var(--border)"}`,
          borderRadius: "var(--radius-md)", outline: "none",
          appearance: "none",
          transition: "border-color var(--ease)",
        }}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

/* ─── Info chip ─────────────────────────────────────────────────────────── */

function Chip({ children, color = "var(--text-muted)" }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
      color,
    }}>
      {children}
    </span>
  );
}

/* ─── BookingsList ──────────────────────────────────────────────────────── */

export default function BookingsList({
  bookings, can, onView, patchB, delB, notify, setSel, setModal, onInvoice,
}: any) {
  const [search,      setSearch]      = useState("");
  const [filter,      setFilter]      = useState("All");
  const [roomFilter,  setRoomFilter]  = useState("All");
  const [payFilter,   setPayFilter]   = useState("All");
  const [dateFrom,    setDateFrom]    = useState("");
  const [dateTo,      setDateTo]      = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [editId,      setEditId]      = useState<string | null>(null);
  const [editForm,    setEditForm]    = useState<any>(null);

  const list = useMemo(() => bookings.filter((b: any) => {
    if (search) {
      const s = search.toLowerCase();
      if (!b.guestName?.toLowerCase().includes(s) &&
          !b.phone?.includes(search) &&
          !b.id?.toLowerCase().includes(s)) return false;
    }
    if (filter !== "All" && b.status !== filter) return false;
    if (roomFilter !== "All" && !getRoomIds(b).some((r: string) =>
      r.startsWith(roomFilter === "Family" ? "FR" : "CR"))) return false;
    if (payFilter === "Pending" && (calcBalance(b) === 0 || b.status === "Cancelled")) return false;
    if (payFilter === "Paid" && calcBalance(b) > 0) return false;
    if (dateFrom && b.checkIn < dateFrom) return false;
    if (dateTo && b.checkOut > dateTo) return false;
    return true;
  }).sort((a: any, b: any) => (b.createdAt || "").localeCompare(a.createdAt || "")),
    [bookings, search, filter, roomFilter, payFilter, dateFrom, dateTo]);

  const activeFilters = useMemo(() =>
    [filter !== "All", roomFilter !== "All", payFilter !== "All", dateFrom, dateTo].filter(Boolean).length,
    [filter, roomFilter, payFilter, dateFrom, dateTo]);

  const clearFilters = () => {
    setFilter("All"); setRoomFilter("All"); setPayFilter("All");
    setDateFrom(""); setDateTo("");
  };

  const startEdit = useCallback((b: any) => {
    setEditId(b.id);
    setEditForm({
      guestName: b.guestName, phone: b.phone,
      adults: b.adults ?? b.guests ?? "",
      kidsFree: b.kidsFree || "", kidsHalf: b.kidsHalf || "", kidsFull: b.kidsFull || "",
      vegCount: b.vegCount || "", nonVegCount: b.nonVegCount || "",
      bookedBy: b.bookedBy || "", notes: b.notes || "",
    });
  }, []);

  const saveEdit = useCallback((b: any) => {
    const guests = Number(editForm.adults || 0) + Number(editForm.kidsFree || 0)
      + Number(editForm.kidsHalf || 0) + Number(editForm.kidsFull || 0);
    patchB(b.id, { ...editForm, guests });
    setEditId(null); setEditForm(null);
    notify("Booking updated!");
  }, [patchB, editForm, notify]);

  const cancelEdit = useCallback(() => { setEditId(null); setEditForm(null); }, []);
  const numOnly = (v: string) => v.replace(/[^0-9]/g, "");

  return (
    <div>
      {/* ── Header row ─────────────────────────────────────────────────── */}
      <div style={{
        display: "flex", gap: 10, marginBottom: 14,
        flexWrap: "wrap", alignItems: "center",
      }}>
        <h2 style={{
          fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)",
          fontWeight: 700, color: "var(--text)", margin: 0, flex: 1,
          letterSpacing: "0.01em",
        }}>
          Bookings
          <span style={{
            fontFamily: "var(--font-body)", fontWeight: 400,
            fontSize: "var(--text-sm)", color: "var(--text-muted)", marginLeft: 8,
          }}>
            {list.length}/{bookings.length}
          </span>
        </h2>

        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 180px", maxWidth: 260 }}>
          <Search size={13} style={{
            position: "absolute", left: 11, top: "50%",
            transform: "translateY(-50%)", color: "var(--text-faint)", pointerEvents: "none",
          }}/>
          <input
            placeholder="Name, phone or ID…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              display: "block", width: "100%",
              padding: "9px 12px 9px 34px",
              fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
              background: "var(--card-deep)", color: "var(--text)",
              border: "1px solid var(--border)", borderRadius: "var(--radius-md)",
              outline: "none", transition: "border-color var(--ease)",
            }}
            onFocus={e => (e.target as HTMLElement).style.borderColor = "var(--gold)"}
            onBlur={e => (e.target as HTMLElement).style.borderColor = "var(--border)"}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{
              position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)",
              display: "flex", padding: 2,
            }}>
              <X size={12}/>
            </button>
          )}
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 14px",
            background: showFilters ? "var(--gold-muted)" : "var(--card-deep)",
            border: `1px solid ${showFilters ? "rgba(200,150,62,0.4)" : "var(--border)"}`,
            borderRadius: "var(--radius-md)",
            color: showFilters ? "var(--gold)" : "var(--text-muted)",
            fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", fontWeight: 700,
            cursor: "pointer", transition: "all var(--ease)",
            flexShrink: 0,
          }}
        >
          <SlidersHorizontal size={13}/>
          Filters
          {activeFilters > 0 && (
            <span style={{
              background: "var(--gold)", color: "#0B1A0D",
              borderRadius: "50%", width: 17, height: 17,
              fontSize: 9, fontWeight: 900,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}>
              {activeFilters}
            </span>
          )}
          <ChevronDown size={11} style={{
            transform: showFilters ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}/>
        </button>
      </div>

      {/* ── Filter panel ───────────────────────────────────────────────── */}
      {showFilters && (
        <div style={{
          background: "var(--card)", border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)", padding: "16px 18px",
          marginBottom: 16,
          display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end",
        }}>
          <FilterSelect label="Status"    value={filter}     options={["All","Confirmed","Checked In","Checked Out","Cancelled"]} onChange={setFilter}/>
          <FilterSelect label="Room Type" value={roomFilter}  options={["All","Family","Couple"]} onChange={setRoomFilter}/>
          <FilterSelect label="Payment"   value={payFilter}   options={["All","Pending","Paid"]} onChange={setPayFilter}/>

          {/* Date range */}
          {[["From", dateFrom, setDateFrom], ["To", dateTo, setDateTo]].map(([lbl, val, setter]: any) => (
            <div key={lbl as string} style={{ minWidth: 140 }}>
              <div style={{
                fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", fontWeight: 700,
                color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5,
              }}>
                {lbl}
              </div>
              <input
                type="date"
                value={val}
                onChange={e => setter(e.target.value)}
                style={{
                  display: "block", width: "100%", padding: "8px 10px",
                  fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
                  background: "var(--card-deep)", color: "var(--text)",
                  border: `1px solid ${val ? "var(--border-gold)" : "var(--border)"}`,
                  borderRadius: "var(--radius-md)", outline: "none", colorScheme: "dark",
                }}
              />
            </div>
          ))}

          {activeFilters > 0 && (
            <button
              onClick={clearFilters}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "8px 14px", marginTop: "auto",
                background: "rgba(212,97,74,0.1)", border: "1px solid rgba(212,97,74,0.35)",
                borderRadius: "var(--radius-md)", color: "var(--danger)",
                fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <X size={12}/> Clear all
            </button>
          )}
        </div>
      )}

      {/* ── Empty state ─────────────────────────────────────────────────── */}
      {list.length === 0 && (
        <EmptyState icon="📋" title="No bookings found" sub="Try adjusting your search or filters"/>
      )}

      {/* ── Booking cards ───────────────────────────────────────────────── */}
      {list.map((b: any) => {
        const n         = nights(b.checkIn, b.checkOut);
        const isEditing = editId === b.id;
        const collected = calcCollected(b);
        const balance   = calcBalance(b);
        const kids      = totalKids(b);
        const overdueIn = isOverdueCheckIn(b);
        const overdueOut= isOverdueCheckOut(b);
        const overdue   = overdueIn || overdueOut;
        const paid      = balance === 0;

        return (
          <div
            key={b.id}
            style={{
              background: "var(--card)",
              border: `1px solid ${overdue ? "rgba(212,160,58,0.4)" : paid ? "rgba(91,173,122,0.2)" : "var(--border)"}`,
              borderRadius: "var(--radius-lg)",
              marginBottom: 12,
              overflow: "hidden",
              transition: "border-color var(--ease)",
            }}
          >
            {/* Overdue banner */}
            {overdue && (
              <div style={{
                background: "rgba(212,160,58,0.1)",
                borderBottom: "1px solid rgba(212,160,58,0.2)",
                padding: "6px 16px",
                display: "flex", alignItems: "center", gap: 8,
                fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", fontWeight: 800,
                color: "var(--warn)", letterSpacing: "0.06em",
              }}>
                ⚠&nbsp;
                {overdueIn  && "No-show risk — was due to arrive"}
                {overdueOut && "Overdue checkout — was due to depart"}
                &nbsp;{overdueIn ? fmtD(b.checkIn) : fmtD(b.checkOut)}
              </div>
            )}

            <div style={{ padding: "16px 18px" }}>
              {/* Top row */}
              <div style={{
                display: "flex", justifyContent: "space-between",
                flexWrap: "wrap", gap: 10, marginBottom: 12,
              }}>
                <div style={{ flex: 1, minWidth: 180 }}>
                  {/* ID + booked by */}
                  <div style={{
                    fontFamily: "monospace", fontSize: "var(--text-xs)",
                    color: "var(--text-faint)", marginBottom: 4,
                    display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap",
                  }}>
                    <span>{b.id}</span>
                    {b.bookedBy && <span>· {b.bookedBy}</span>}
                  </div>

                  {/* Guest name */}
                  <div style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-xl)", fontWeight: 700,
                    color: "var(--text)", lineHeight: 1.2,
                  }}>
                    {b.guestName}
                  </div>

                  <div style={{
                    fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
                    color: "var(--text-muted)", marginTop: 4,
                  }}>
                    📞 {b.phone}
                  </div>
                </div>

                {/* Right: status + amount */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <StatusBadge status={b.status}/>
                  <div style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(20px,3vw,26px)", fontWeight: 700,
                    color: "var(--gold)", marginTop: 8, lineHeight: 1,
                  }}>
                    ₹{Number(b.total || 0).toLocaleString("en-IN")}
                  </div>
                  {balance > 0 ? (
                    <div style={{
                      fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
                      fontWeight: 700, color: "var(--danger)", marginTop: 3,
                    }}>
                      ₹{balance.toLocaleString("en-IN")} outstanding
                    </div>
                  ) : (
                    <div style={{
                      fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
                      fontWeight: 700, color: "var(--success)", marginTop: 3,
                    }}>
                      ✓ Fully paid
                    </div>
                  )}
                </div>
              </div>

              {/* Meta chips */}
              <div style={{
                display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 14,
                paddingBottom: 14, borderBottom: "1px solid var(--border-light)",
              }}>
                <Chip>🛏 {getRoomIds(b).join(", ")}</Chip>
                <Chip>👥 {b.adults ?? b.guests} adult{(b.adults ?? b.guests) !== 1 ? "s" : ""}</Chip>
                {kids > 0 && <Chip>👶 {kids} kid{kids !== 1 ? "s" : ""}</Chip>}
                <Chip>📅 {fmtD(b.checkIn)} → {fmtD(b.checkOut)} · {n}N</Chip>
                <Chip>🥗 V:{b.vegCount || 0} / NV:{b.nonVegCount || 0}</Chip>
                {collected > 0 && (
                  <Chip color="var(--success)">
                    Collected: ₹{collected.toLocaleString("en-IN")}
                  </Chip>
                )}
              </div>

              {/* ── Inline edit form ──────────────────────────────────── */}
              {isEditing && (
                <div style={{
                  background: "var(--card-deep)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  padding: 16, marginBottom: 14,
                }}>
                  <div style={{
                    fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
                    fontWeight: 800, color: "var(--gold)",
                    letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12,
                  }}>
                    Edit Booking Details
                  </div>

                  {/* Warning note */}
                  <div style={{
                    background: "rgba(212,160,58,0.08)",
                    border: "1px solid rgba(212,160,58,0.25)",
                    borderRadius: "var(--radius-md)", padding: "8px 12px",
                    marginBottom: 14,
                    fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
                    color: "var(--warn)", lineHeight: 1.5,
                  }}>
                    ℹ Editing guests does not recalculate the booking total.
                    To change the amount, cancel and create a new booking.
                  </div>

                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                    gap: 10,
                  }}>
                    {[
                      ["Guest Name", "guestName", "text"],
                      ["Phone",      "phone",      "text"],
                      ["Adults",     "adults",     "num"],
                      ["Kids <5",    "kidsFree",   "num"],
                      ["Kids 5–9",   "kidsHalf",   "num"],
                      ["Kids 10+",   "kidsFull",   "num"],
                      ["Veg",        "vegCount",   "num"],
                      ["Non-Veg",    "nonVegCount","num"],
                      ["Booked By",  "bookedBy",   "text"],
                    ].map(([label, key, mode]) => (
                      <div key={key}>
                        <div style={{
                          fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
                          fontWeight: 700, color: "var(--text-muted)",
                          textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5,
                        }}>
                          {label}
                        </div>
                        <input
                          value={editForm[key]}
                          onChange={e => setEditForm((f: any) => ({
                            ...f,
                            [key]: mode === "num" ? numOnly(e.target.value) : e.target.value,
                          }))}
                          style={{
                            display: "block", width: "100%", padding: "8px 10px",
                            fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
                            background: "var(--card)", color: "var(--text)",
                            border: "1px solid var(--border)",
                            borderRadius: "var(--radius-md)", outline: "none",
                          }}
                          onFocus={e => (e.target as HTMLElement).style.borderColor = "var(--gold)"}
                          onBlur={e => (e.target as HTMLElement).style.borderColor = "var(--border)"}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Notes */}
                  <div style={{ marginTop: 10 }}>
                    <div style={{
                      fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
                      fontWeight: 700, color: "var(--text-muted)",
                      textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5,
                    }}>
                      Notes / Special Requests
                    </div>
                    <textarea
                      value={editForm.notes}
                      onChange={e => setEditForm((f: any) => ({ ...f, notes: e.target.value }))}
                      style={{
                        display: "block", width: "100%", padding: "9px 12px",
                        fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
                        background: "var(--card)", color: "var(--text)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-md)", outline: "none",
                        height: 60, resize: "vertical",
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button
                      onClick={() => saveEdit(b)}
                      style={{
                        padding: "8px 18px",
                        background: "linear-gradient(135deg,#C8963E,#A87830)",
                        border: "1px solid rgba(200,150,62,0.5)",
                        borderRadius: "var(--radius-md)",
                        color: "#0B1A0D", fontFamily: "var(--font-body)",
                        fontSize: "var(--text-sm)", fontWeight: 800, cursor: "pointer",
                      }}
                    >
                      Save Changes
                    </button>
                    <ActionBtn variant="ghost" icon={<X size={12}/>} label="Cancel" onClick={cancelEdit}/>
                  </div>
                </div>
              )}

              {/* ── Action buttons ─────────────────────────────────────── */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                <ActionBtn variant="ghost"   icon={<Eye size={12}/>}          label="View"    onClick={() => onView(b)}/>
                <ActionBtn variant="success" icon={<MessageSquare size={12}/>}label="WhatsApp"onClick={() => { setSel(b); setModal("whatsapp"); }}/>
                <ActionBtn variant="info"    icon={<FileText size={12}/>}      label="Invoice" onClick={() => onInvoice(b)}/>

                {can.staff && b.status !== "Checked Out" && b.status !== "Cancelled" && (
                  <ActionBtn
                    variant="warn"
                    icon={<Pencil size={12}/>}
                    label={isEditing ? "Close Edit" : "Edit"}
                    onClick={() => isEditing ? cancelEdit() : startEdit(b)}
                  />
                )}
                {can.staff && b.status === "Confirmed" && (
                  <ActionBtn
                    variant="success"
                    icon={<LogIn size={12}/>}
                    label="Check In"
                    onClick={() => { patchB(b.id, { status: "Checked In" }); notify(`${b.guestName} checked in!`); }}
                  />
                )}
                {can.staff && b.status === "Checked In" && (
                  <ActionBtn
                    variant="warn"
                    icon={<LogOut size={12}/>}
                    label="Check Out"
                    onClick={() => {
                      if (window.confirm(`Check out ${b.guestName}? Cannot be undone.`)) {
                        patchB(b.id, { status: "Checked Out" }); notify(`${b.guestName} checked out!`);
                      }
                    }}
                  />
                )}
                {can.admin && b.status !== "Checked Out" && b.status !== "Cancelled" && (
                  <ActionBtn
                    variant="danger"
                    icon={<XCircle size={12}/>}
                    label="Cancel"
                    onClick={() => { if (window.confirm("Cancel this booking?")) patchB(b.id, { status: "Cancelled" }); }}
                  />
                )}
                {can.admin && (
                  <ActionBtn
                    variant="danger"
                    icon={<Trash2 size={12}/>}
                    label="Delete"
                    onClick={async () => {
                      if (window.confirm(`Permanently delete ${b.guestName}'s booking?`)) {
                        await delB(b.id); notify("Booking deleted", "err");
                      }
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}

      <style>{`
        @media (max-width: 480px) {
          .rv-action-label { display: none; }
        }
      `}</style>
    </div>
  );
}

function fmtD(d: string) {
  if (!d) return "—";
  const dt = new Date(d);
  return `${String(dt.getDate()).padStart(2,"0")}-${String(dt.getMonth()+1).padStart(2,"0")}-${dt.getFullYear()}`;
}