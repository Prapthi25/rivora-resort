// "use client";
// import { MessageSquare, FileText, LogIn, LogOut, Trash2 } from "lucide-react";
// import { D } from "../../lib/constants";
// import { btn, badge, divider } from "../../lib/ui";
// import { nights, getRoomIds, calcCollected, calcBalance, totalKids, fmtDate } from "../../lib/helpers";
// import { ModalWrap } from "./ModalWrap";

// export default function ViewModal({booking:b,onClose,patchB,delB,settings,can,notify,onWA,onInvoice}:any) {
//   const n         = nights(b.checkIn,b.checkOut);
//   const collected = calcCollected(b);
//   const balance   = calcBalance(b);
//   const total     = Number(b.total||0);
//   const kids      = totalKids(b);

//   return (
//     <ModalWrap title={b.guestName} onClose={onClose}>
//       <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
//         <span style={badge(b.status)}>{b.status}</span>
//         <span style={{color:D.sub,fontSize:11,fontFamily:"monospace"}}>{b.id}</span>
//         <span style={{marginLeft:"auto",fontSize:18,fontWeight:"800",color:D.gold}}>₹{total.toLocaleString("en-IN")}</span>
//       </div>
//       <div style={{background:D.surface,borderRadius:10,padding:"10px 14px",marginBottom:14,borderLeft:`2px solid ${balance>0?D.danger:D.success}`}}>
//         <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:6}}>
//           <span style={{color:D.sub}}>Collected: <b style={{color:D.success}}>₹{collected.toLocaleString("en-IN")}</b></span>
//           {balance>0
//             ? <span style={{color:D.danger,fontWeight:"700"}}>Balance Due: ₹{balance.toLocaleString("en-IN")}</span>
//             : <span style={{color:D.success,fontWeight:"700"}}>Fully Paid ✓</span>}
//         </div>
//         <div style={{background:"rgba(255,255,255,0.06)",borderRadius:3,height:4,overflow:"hidden"}}>
//           <div style={{width:total>0?`${Math.min(100,Math.round(collected/total*100))}%`:"0%",height:"100%",background:balance>0?D.warning:D.success,borderRadius:3}}/>
//         </div>
//       </div>
//       <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
//         {[["Phone",b.phone],["Room(s)",getRoomIds(b).join(", ")],
//           ["Check-In",`${fmtDate(b.checkIn)} ${settings.checkInTime}`],
//           ["Check-Out",`${fmtDate(b.checkOut)} ${settings.checkOutTime}`],
//           ["Nights",n],
//           ["Adults",`${b.adults??b.guests??0} pax`],
//           ...(kids>0?[["Kids",`${Number(b.kidsFree||0)} free · ${Number(b.kidsHalf||0)} half · ${Number(b.kidsFull||0)} full`]]:[]),
//           ["Veg / NV",`${b.vegCount||0} / ${b.nonVegCount||0}`],
//           ["Rate",b.rateType==="perRoom"?`₹${b.ratePerRoom}/room/night`:`₹${b.ratePerHead}/head/night`],
//           ["Advance",`₹${Number(b.advanceAmount||0).toLocaleString("en-IN")}`],
//           ["Booked By",b.bookedBy],
//           ["Created",b.createdAt?fmtDate(b.createdAt.split("T")[0]):"—"]]
//           .map(([k,v])=>(
//             <div key={k as string} style={{background:D.surface,borderRadius:8,padding:"8px 11px"}}>
//               <div style={{color:D.sub,fontSize:9,fontWeight:"600",letterSpacing:"0.06em",marginBottom:3}}>{(k as string).toUpperCase()}</div>
//               <div style={{color:D.text,fontSize:12,fontWeight:"500"}}>{v}</div>
//             </div>
//           ))}
//       </div>
//       {b.packages?.length>0&&(
//         <div style={{marginBottom:12}}>
//           <div style={{color:D.sub,fontSize:9,fontWeight:"600",letterSpacing:"0.06em",marginBottom:7}}>PACKAGE</div>
//           <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
//             {b.packages.map((p:string)=><span key={p} style={{background:D.greenDim,color:"#9BD3A8",border:"1px solid rgba(127,168,138,0.3)",padding:"3px 9px",borderRadius:20,fontSize:10,fontWeight:"600"}}>✓ {p}</span>)}
//           </div>
//         </div>
//       )}
//       {b.notes&&<div style={{background:D.surface,borderRadius:8,padding:"9px 12px",fontSize:12,color:D.sub,marginBottom:12,borderLeft:`2px solid ${D.goldBorder}`}}>📝 {b.notes}</div>}
//       <div style={divider}/>
//       <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
//         <button onClick={onWA}      style={btn("green","sm")}><MessageSquare size={11}/>WhatsApp</button>
//         <button onClick={onInvoice} style={btn("blue","sm")}><FileText size={11}/>Invoice</button>
//         {can.staff&&b.status==="Confirmed"&&<button onClick={()=>{patchB(b.id,{status:"Checked In"});notify(`${b.guestName} checked in!`);onClose();}} style={btn("success","sm")}><LogIn size={11}/>Check-In</button>}
//         {can.staff&&b.status==="Checked In"&&<button onClick={()=>{if(window.confirm(`Check out ${b.guestName}?`)){patchB(b.id,{status:"Checked Out"});notify(`${b.guestName} checked out!`);onClose();}}} style={btn("warning","sm")}><LogOut size={11}/>Check-Out</button>}
//         {can.admin&&<button onClick={()=>{if(window.confirm("Delete permanently?")){delB(b.id);onClose();notify("Deleted","err");}}} style={btn("danger","sm")}><Trash2 size={11}/>Delete</button>}
//       </div>
//     </ModalWrap>
//   );
// }

"use client";

import { MessageSquare, FileText, LogIn, LogOut, Trash2, Eye } from "lucide-react";
import { nights, getRoomIds, calcCollected, calcBalance, totalKids, fmtDate } from "../../lib/helpers";
import { ModalWrap } from "./ModalWrap";

/* ─── Design tokens (mirror app CSS vars with fallbacks) ─── */

type BtnV = "gold" | "success" | "danger" | "info" | "ghost" | "warn" | "green";

const BTN: Record<BtnV, { color: string; bg: string; border: string; hover: string }> = {
  gold:    { color: "var(--gold)",    bg: "var(--gold-muted)",          border: "rgba(200,150,62,0.4)",  hover: "rgba(200,150,62,0.22)" },
  success: { color: "var(--success)", bg: "rgba(91,173,122,0.12)",      border: "rgba(91,173,122,0.4)",  hover: "rgba(91,173,122,0.22)" },
  danger:  { color: "var(--danger)",  bg: "rgba(212,97,74,0.10)",       border: "rgba(212,97,74,0.4)",   hover: "rgba(212,97,74,0.20)" },
  info:    { color: "var(--info)",    bg: "rgba(74,154,191,0.10)",      border: "rgba(74,154,191,0.4)",  hover: "rgba(74,154,191,0.20)" },
  ghost:   { color: "var(--text-muted)", bg: "transparent",             border: "var(--border)",         hover: "var(--card-hover, rgba(127,168,138,0.1))" },
  warn:    { color: "var(--warn)",    bg: "rgba(212,160,58,0.10)",      border: "rgba(212,160,58,0.4)",  hover: "rgba(212,160,58,0.20)" },
  green:   { color: "var(--success)", bg: "rgba(91,173,122,0.12)",      border: "rgba(91,173,122,0.4)",  hover: "rgba(91,173,122,0.22)" },
};

function ActionBtn({ variant = "ghost", icon, label, onClick, title }: {
  variant?: BtnV; icon: React.ReactNode; label?: string; onClick: () => void; title?: string;
}) {
  const s = BTN[variant];
  return (
    <button
      onClick={onClick}
      title={title ?? label}
      style={{
        display: "flex", alignItems: "center", gap: 5,
        padding: label ? "8px 14px" : "8px 10px",
        background: s.bg, border: `1px solid ${s.border}`,
        borderRadius: "var(--radius-md, 8px)",
        color: s.color,
        fontFamily: "var(--font-body, sans-serif)",
        fontSize: "var(--text-sm, 13px)", fontWeight: 700,
        cursor: "pointer", whiteSpace: "nowrap",
        transition: "background var(--ease, 0.15s)",
      }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = s.hover}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = s.bg}
    >
      {icon}{label && <span>{label}</span>}
    </button>
  );
}

function MetaGrid({ items }: { items: [string, React.ReactNode][] }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
      gap: 8,
    }}>
      {items.map(([k, v]) => (
        <div key={k} style={{
          background: "var(--card-deep, #0A1A0D)",
          borderRadius: "var(--radius-md, 8px)",
          padding: "9px 12px",
          border: "1px solid var(--border-light, rgba(255,255,255,0.05))",
        }}>
          <div style={{
            fontFamily: "var(--font-body, sans-serif)",
            fontSize: "var(--text-xs, 11px)",
            fontWeight: 700,
            color: "var(--text-faint, rgba(127,168,138,0.5))",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 4,
          }}>
            {k}
          </div>
          <div style={{
            fontFamily: "var(--font-body, sans-serif)",
            fontSize: "var(--text-sm, 13px)",
            fontWeight: 500,
            color: "var(--text, #E8EFE9)",
            lineHeight: 1.3,
          }}>
            {v}
          </div>
        </div>
      ))}
    </div>
  );
}

const STATUS_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  "Confirmed":   { color: "var(--gold)",    bg: "var(--gold-muted)",        border: "rgba(200,150,62,0.35)" },
  "Checked In":  { color: "var(--success)", bg: "rgba(91,173,122,0.12)",    border: "rgba(91,173,122,0.35)" },
  "Checked Out": { color: "var(--info)",    bg: "rgba(74,154,191,0.12)",    border: "rgba(74,154,191,0.35)" },
  "Cancelled":   { color: "var(--danger)",  bg: "rgba(212,97,74,0.10)",     border: "rgba(212,97,74,0.30)" },
};

function StatusPill({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE["Confirmed"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "4px 12px", borderRadius: 100,
      fontSize: "var(--text-xs, 11px)", fontWeight: 800,
      fontFamily: "var(--font-body, sans-serif)",
      color: s.color, background: s.bg,
      border: `1px solid ${s.border}`,
      letterSpacing: "0.05em",
    }}>
      {status}
    </span>
  );
}

export default function ViewModal({ booking: b, onClose, patchB, delB, settings, can, notify, onWA, onInvoice }: any) {
  const n         = nights(b.checkIn, b.checkOut);
  const collected = calcCollected(b);
  const balance   = calcBalance(b);
  const total     = Number(b.total || 0);
  const kids      = totalKids(b);
  const paidPct   = total > 0 ? Math.min(100, Math.round((collected / total) * 100)) : 0;

  const metaItems: [string, React.ReactNode][] = [
    ["Phone",    b.phone],
    ["Room(s)",  getRoomIds(b).join(", ")],
    ["Check-In", `${fmtDate(b.checkIn)} · ${settings.checkInTime}`],
    ["Check-Out",`${fmtDate(b.checkOut)} · ${settings.checkOutTime}`],
    ["Duration", `${n} Night${n !== 1 ? "s" : ""}`],
    ["Adults",   `${b.adults ?? b.guests ?? 0} pax`],
    ...(kids > 0 ? [["Kids", `${Number(b.kidsFree || 0)} free · ${Number(b.kidsHalf || 0)} half · ${Number(b.kidsFull || 0)} full`] as [string, React.ReactNode]] : []),
    ["Veg / NV", `${b.vegCount || 0} / ${b.nonVegCount || 0}`],
    ["Rate",     b.rateType === "perRoom" ? `₹${b.ratePerRoom}/room/night` : `₹${b.ratePerHead}/head/night`],
    ["Advance",  `₹${Number(b.advanceAmount || 0).toLocaleString("en-IN")}`],
    ["Booked By", b.bookedBy || "—"],
    ["Created",  b.createdAt ? fmtDate(b.createdAt.split("T")[0]) : "—"],
  ];

  return (
    <ModalWrap title={b.guestName} subtitle={`Booking · ${b.id}`} onClose={onClose} icon={<Eye size={15}/>}>

      {/* ── Status + total ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 10, marginBottom: 16,
      }}>
        <StatusPill status={b.status}/>
        <div style={{ textAlign: "right" }}>
          <div style={{
            fontFamily: "var(--font-display, Georgia, serif)",
            fontSize: "clamp(22px, 4vw, 28px)", fontWeight: 700,
            color: "var(--gold, #C8963E)", lineHeight: 1,
          }}>
            ₹{total.toLocaleString("en-IN")}
          </div>
          <div style={{
            fontFamily: "var(--font-body, sans-serif)",
            fontSize: "var(--text-xs, 11px)", fontWeight: 700,
            color: balance > 0 ? "var(--danger)" : "var(--success)",
            marginTop: 3,
          }}>
            {balance > 0 ? `₹${balance.toLocaleString("en-IN")} outstanding` : "✓ Fully paid"}
          </div>
        </div>
      </div>

      {/* ── Payment progress bar ── */}
      <div style={{
        background: "var(--card-deep, #0A1A0D)",
        border: `1px solid ${balance > 0 ? "rgba(212,97,74,0.25)" : "rgba(91,173,122,0.25)"}`,
        borderRadius: "var(--radius-md, 8px)",
        padding: "12px 14px",
        marginBottom: 16,
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          fontFamily: "var(--font-body, sans-serif)", fontSize: "var(--text-xs, 11px)",
          color: "var(--text-muted, #7FA88A)", marginBottom: 8,
        }}>
          <span>Collected <strong style={{ color: "var(--success)", fontWeight: 700 }}>
            ₹{collected.toLocaleString("en-IN")}
          </strong></span>
          <span style={{ fontWeight: 700, color: balance > 0 ? "var(--danger)" : "var(--success)" }}>
            {paidPct}% {balance > 0 ? "paid" : "· Settled ✓"}
          </span>
        </div>
        <div style={{
          height: 5, borderRadius: 4,
          background: "rgba(255,255,255,0.06)",
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            width: `${paidPct}%`,
            borderRadius: 4,
            background: balance > 0
              ? "linear-gradient(90deg,var(--warn),rgba(212,160,58,0.7))"
              : "linear-gradient(90deg,var(--success),rgba(91,173,122,0.7))",
            transition: "width 0.4s ease",
          }}/>
        </div>
      </div>

      {/* ── Meta grid ── */}
      <MetaGrid items={metaItems}/>

      {/* ── Package inclusions ── */}
      {b.packages?.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <div style={{
            fontFamily: "var(--font-body, sans-serif)",
            fontSize: "var(--text-xs, 11px)", fontWeight: 700,
            color: "var(--text-faint)", letterSpacing: "0.08em",
            textTransform: "uppercase", marginBottom: 8,
          }}>
            Package Inclusions
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {b.packages.map((p: string) => (
              <span key={p} style={{
                background: "rgba(91,173,122,0.1)",
                color: "var(--success, #5BAD7A)",
                border: "1px solid rgba(91,173,122,0.3)",
                padding: "4px 10px", borderRadius: 100,
                fontFamily: "var(--font-body, sans-serif)",
                fontSize: "var(--text-xs, 11px)", fontWeight: 700,
              }}>
                ✓ {p}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Notes ── */}
      {b.notes && (
        <div style={{
          marginTop: 14,
          background: "var(--card-deep, #0A1A0D)",
          border: "1px solid rgba(200,150,62,0.2)",
          borderLeft: "3px solid rgba(200,150,62,0.5)",
          borderRadius: "var(--radius-md, 8px)",
          padding: "10px 14px",
          fontFamily: "var(--font-body, sans-serif)",
          fontSize: "var(--text-sm, 13px)",
          color: "var(--text-muted, #7FA88A)",
          lineHeight: 1.55,
        }}>
          📝 {b.notes}
        </div>
      )}

      {/* ── Divider ── */}
      <div style={{
        margin: "18px 0 14px",
        borderTop: "1px solid var(--border-light, rgba(255,255,255,0.06))",
      }}/>

      {/* ── Action buttons ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <ActionBtn variant="green"   icon={<MessageSquare size={13}/>} label="WhatsApp" onClick={onWA}/>
        <ActionBtn variant="info"    icon={<FileText size={13}/>}      label="Invoice"  onClick={onInvoice}/>
        {can.staff && b.status === "Confirmed" && (
          <ActionBtn
            variant="success"
            icon={<LogIn size={13}/>}
            label="Check-In"
            onClick={() => {
              patchB(b.id, { status: "Checked In" });
              notify(`${b.guestName} checked in!`);
              onClose();
            }}
          />
        )}
        {can.staff && b.status === "Checked In" && (
          <ActionBtn
            variant="warn"
            icon={<LogOut size={13}/>}
            label="Check-Out"
            onClick={() => {
              if (window.confirm(`Check out ${b.guestName}?`)) {
                patchB(b.id, { status: "Checked Out" });
                notify(`${b.guestName} checked out!`);
                onClose();
              }
            }}
          />
        )}
        {can.admin && (
          <ActionBtn
            variant="danger"
            icon={<Trash2 size={13}/>}
            label="Delete"
            onClick={() => {
              if (window.confirm("Permanently delete this booking?")) {
                delB(b.id);
                onClose();
                notify("Booking deleted", "err");
              }
            }}
          />
        )}
      </div>
    </ModalWrap>
  );
}