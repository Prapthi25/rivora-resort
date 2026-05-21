// "use client";
// import { useState } from "react";
// import { Copy, SendHorizonal, RefreshCw } from "lucide-react";
// import { D } from "../../lib/constants";
// import { inp, btn } from "../../lib/ui";
// import { nights, fmtDate, totalKids } from "../../lib/helpers";
// import { ModalWrap } from "./ModalWrap";

// export default function WAModal({booking:b,settings,onClose}:any) {
//   const n   = nights(b.checkIn,b.checkOut);
//   const bal = Number(b.total||0)-Number(b.advanceAmount||0);
//   const kids = totalKids(b);
//   const kidsLine = kids>0
//     ? `👶 Kids: ${Number(b.kidsFree||0)} (free) · ${Number(b.kidsHalf||0)} (half) · ${Number(b.kidsFull||0)} (full)\n`
//     : "";

//   const defaultMsg =
// `Hello ${b.guestName},

// Warm welcome in advance 😊
// We're happy to host you and share the details of your stay.

// *Booking Name:* ${b.guestName}
// *Ph:* ${b.phone}

// *Your package includes:*
// ${(b.packages||[]).map((p:string)=>"• " + p).join("\n")}

// ━━━━━━━━━━━━━━━━━━
// *BOOKING DETAILS*
// ━━━━━━━━━━━━━━━━━━
// 📅 ${n} Night${n!==1?"s":""}
// 🛏️ ${(b.roomIds||[b.roomId]).join(", ")} — ${b.roomType==="Family"?"Premium Family Room":"Premium Couple Room"}
// 👥 ${b.adults??b.guests} Adults${kids>0 ? " · " + kids + " Kids" : ""}
// ${kidsLine}🥗 Veg: ${b.vegCount||0} | Non-Veg: ${b.nonVegCount||0}
// 💰 ${b.rateType==="perRoom" ? "₹" + b.ratePerRoom + "/room/night" : "₹" + b.ratePerHead + "/head/night"}

// 📆 Check-In:  ${fmtDate(b.checkIn)} at ${settings.checkInTime}
// 📆 Check-Out: ${fmtDate(b.checkOut)} at ${settings.checkOutTime}

// ━━━━━━━━━━━━━━━━━━
// *BILLING*
// ━━━━━━━━━━━━━━━━━━
// Total Amount  : ₹${Number(b.total||0).toLocaleString("en-IN")}/-
// Advance (${settings.advancePct}%) : ₹${Number(b.advanceAmount||0).toLocaleString("en-IN")}/-
// Remaining     : ₹${bal.toLocaleString("en-IN")}/-

// ━━━━━━━━━━━━━━━━━━
// *PAYMENT DETAILS*
// ━━━━━━━━━━━━━━━━━━
// Bank  : ${settings.bankName}
// Acc   : ${settings.accNo}
// Name  : ${settings.accHolder}
// IFSC  : ${settings.ifsc}
// UPI   : ${settings.upi}

// Please send a screenshot once payment is done 📸

// Best regards,
// *${settings.resortName}* 🌿`;

//   const [msg,setMsg]     = useState(defaultMsg);
//   const [copied,setCopied] = useState(false);
//   const copy = async () => {
//     try {
//       await navigator.clipboard.writeText(msg);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2500);
//     } catch {
//       alert("Copy failed");
//     }
//   };
//   const phone = (b.phone || "").replace(/\D/g, "");

//   return (
//     <ModalWrap title="WhatsApp Message" onClose={onClose}>
//       <div style={{background:D.surface,border:`1px solid ${D.border}`,borderRadius:8,padding:"7px 11px",marginBottom:8,fontSize:11,color:D.sub}}>✏️ Edit before copying or sending</div>
//       <textarea value={msg} onChange={e=>setMsg(e.target.value)} style={{...inp,height:280,fontSize:11,lineHeight:1.65,fontFamily:"monospace",resize:"vertical"}}/>
//       <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}>
//         <button onClick={copy} style={btn("surface","sm")}><Copy size={11}/>{copied?"Copied!":"Copy"}</button>
//         <button
//           onClick={() =>
//             window.open(
//               `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,
//               "_blank"
//             )
//           }
//           style={btn("green", "sm")}
//         >
//           <SendHorizonal size={11} /> Open WhatsApp
//         </button>
//         <button onClick={()=>setMsg(defaultMsg)} style={btn("ghost","sm")}><RefreshCw size={10}/>Reset</button>
//       </div>
//     </ModalWrap>
//   );
// }


"use client";
import { useState } from "react";
import { Copy, SendHorizonal, RefreshCw } from "lucide-react";
import { D } from "../../lib/constants";
import { inp, btn } from "../../lib/ui";
import { nights, fmtDate, totalKids } from "../../lib/helpers";
import { ModalWrap } from "./ModalWrap";

export default function WAModal({ booking: b, settings, onClose }: any) {
  const n    = nights(b.checkIn, b.checkOut);
  const bal  = Number(b.total || 0) - Number(b.advanceAmount || 0);
  const kids = totalKids(b);
  const kidsLine = kids > 0
    ? `👶 Kids: ${Number(b.kidsFree || 0)} (free) · ${Number(b.kidsHalf || 0)} (half) · ${Number(b.kidsFull || 0)} (full)\n`
    : "";

  const defaultMsg =
`Hello ${b.guestName},

Warm welcome in advance 😊
We're happy to host you and share the details of your stay.

*Booking Name:* ${b.guestName}
*Ph:* ${b.phone}

*Your package includes:*
${(b.packages || []).map((p: string) => "• " + p).join("\n")}

━━━━━━━━━━━━━━━━━━
*BOOKING DETAILS*
━━━━━━━━━━━━━━━━━━
📅 ${n} Night${n !== 1 ? "s" : ""}
🛏️ ${(b.roomIds || [b.roomId]).join(", ")} — ${b.roomType === "Family" ? "Premium Family Room" : "Premium Couple Room"}
👥 ${b.adults ?? b.guests} Adults${kids > 0 ? " · " + kids + " Kids" : ""}
${kidsLine}🥗 Veg: ${b.vegCount || 0} | Non-Veg: ${b.nonVegCount || 0}
💰 ${b.rateType === "perRoom" ? "₹" + b.ratePerRoom + "/room/night" : "₹" + b.ratePerHead + "/head/night"}

📆 Check-In:  ${fmtDate(b.checkIn)} at ${settings.checkInTime}
📆 Check-Out: ${fmtDate(b.checkOut)} at ${settings.checkOutTime}

━━━━━━━━━━━━━━━━━━
*BILLING*
━━━━━━━━━━━━━━━━━━
Total Amount  : ₹${Number(b.total || 0).toLocaleString("en-IN")}/-
Advance (${settings.advancePct}%) : ₹${Number(b.advanceAmount || 0).toLocaleString("en-IN")}/-
Remaining     : ₹${bal.toLocaleString("en-IN")}/-

━━━━━━━━━━━━━━━━━━
*PAYMENT DETAILS*
━━━━━━━━━━━━━━━━━━
Bank  : ${settings.bankName}
Acc   : ${settings.accNo}
Name  : ${settings.accHolder}
IFSC  : ${settings.ifsc}
UPI   : ${settings.upi}

Please send a screenshot once payment is done 📸

Best regards,
*${settings.resortName}* 🌿`;

  const [msg, setMsg]       = useState(defaultMsg);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(msg);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert("Copy failed");
    }
  };

  const phone = (b.phone || "").replace(/\D/g, "");

  return (
    <ModalWrap title="WhatsApp Message" onClose={onClose}>

      {/* ── Guest context bar ────────────────────────────────────────── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 8,
        background: "rgba(91,173,122,0.09)",
        border: "1px solid rgba(91,173,122,0.22)",
        borderRadius: "var(--radius-md)",
        padding: "10px 14px",
        marginBottom: 14,
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{
            fontFamily: "var(--font-display)", fontSize: "var(--text-base)",
            fontWeight: 700, color: "var(--text)",
          }}>
            {b.guestName}
          </span>
          <span style={{
            fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
            color: "var(--text-muted)",
          }}>
            {fmtDate(b.checkIn)} → {fmtDate(b.checkOut)} · {n}N · {(b.roomIds || [b.roomId]).join(", ")}
          </span>
        </div>
        <span style={{
          fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
          fontWeight: 700, color: "var(--success)",
        }}>
          📞 {b.phone}
        </span>
      </div>

      {/* ── Edit hint ────────────────────────────────────────────────── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        background: "var(--card-deep)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        padding: "8px 12px",
        marginBottom: 10,
        fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
        color: "var(--text-muted)",
      }}>
        <span style={{ fontSize: 14 }}>✏️</span>
        <span>Edit the message below before copying or sending</span>
      </div>

      {/* ── Message textarea ─────────────────────────────────────────── */}
      <textarea
        value={msg}
        onChange={e => setMsg(e.target.value)}
        style={{
          display: "block",
          width: "100%",
          minHeight: 280,
          maxHeight: "42vh",
          padding: "12px 14px",
          fontFamily: "'Courier New', 'Courier', monospace",
          fontSize: "clamp(12px, 1.8vw, 13px)",
          lineHeight: 1.7,
          background: "var(--card-deep)",
          color: "var(--text)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)",
          outline: "none",
          resize: "vertical",
          overflowY: "auto",
          transition: "border-color var(--ease)",
          boxSizing: "border-box",
        }}
        onFocus={e => (e.target as HTMLElement).style.borderColor = "rgba(91,173,122,0.6)"}
        onBlur={e => (e.target as HTMLElement).style.borderColor = "var(--border)"}
      />

      {/* ── Character count ──────────────────────────────────────────── */}
      <div style={{
        fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
        color: "var(--text-faint)", textAlign: "right",
        marginTop: 5, marginBottom: 14,
      }}>
        {msg.length} characters
      </div>

      {/* ── Action buttons ───────────────────────────────────────────── */}
      <div style={{
        display: "flex", gap: 8, flexWrap: "wrap",
        paddingTop: 4,
      }}>
        {/* Copy */}
        <button
          onClick={copy}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "9px 16px",
            background: copied ? "rgba(91,173,122,0.15)" : "var(--card-deep)",
            border: `1px solid ${copied ? "rgba(91,173,122,0.4)" : "var(--border)"}`,
            borderRadius: "var(--radius-md)",
            color: copied ? "var(--success)" : "var(--text-muted)",
            fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", fontWeight: 700,
            cursor: "pointer", transition: "all var(--ease)",
            whiteSpace: "nowrap",
          }}
        >
          <Copy size={13}/>
          {copied ? "Copied!" : "Copy Text"}
        </button>

        {/* Open WhatsApp */}
        <button
          onClick={() =>
            window.open(
              `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,
              "_blank"
            )
          }
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "9px 16px",
            background: "rgba(37,211,102,0.12)",
            border: "1px solid rgba(37,211,102,0.35)",
            borderRadius: "var(--radius-md)",
            color: "#25D366",
            fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", fontWeight: 700,
            cursor: "pointer", transition: "background var(--ease)",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(37,211,102,0.22)"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(37,211,102,0.12)"}
        >
          <SendHorizonal size={13}/>
          Open WhatsApp
        </button>

        {/* Reset */}
        <button
          onClick={() => setMsg(defaultMsg)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "9px 14px",
            background: "transparent",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            color: "var(--text-faint)",
            fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", fontWeight: 600,
            cursor: "pointer", transition: "all var(--ease)",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = "var(--card-deep)";
            (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "var(--text-faint)";
          }}
        >
          <RefreshCw size={12}/>
          Reset
        </button>
      </div>

    </ModalWrap>
  );
}