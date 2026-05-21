// "use client";
// import { FileText } from "lucide-react";
// import { D } from "../../lib/constants";
// import { btn } from "../../lib/ui";
// import { nights, fmtDate, totalKids } from "../../lib/helpers";

// export default function InvoiceModal({booking:b,settings,onClose}:any) {
//   const n     = nights(b.checkIn,b.checkOut);
//   const adv   = Number(b.payments?.advance?.amount||b.advanceAmount||0);
//   const full  = Number(b.payments?.fullStay?.amount||0);
//   const extra = Number(b.payments?.extras?.amount||0);
//   const balance = Math.max(0,Number(b.total||0)-adv-full-extra);
//   const kids  = totalKids(b);

//   const kidsRow = kids>0
//     ? `<tr><td style="padding:8px 12px;font-size:12px;border-bottom:1px solid #e8e0d0;">Kids breakdown</td>
//        <td style="padding:8px 12px;font-size:12px;border-bottom:1px solid #e8e0d0;text-align:right;">Free:${b.kidsFree||0} Half:${b.kidsHalf||0} Full:${b.kidsFull||0}</td></tr>`
//     : "";

//   const getHTML = () =>
//     `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Rivora ${b.id}</title>
//     <style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Georgia,serif;background:#f9f6ef;color:#1a1a1a;padding:28px;}.page{max-width:680px;margin:0 auto;background:#fff;border-radius:12px;padding:36px 40px;box-shadow:0 2px 20px rgba(0,0,0,.08);}.hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;padding-bottom:16px;border-bottom:3px solid #D4A373;}.badge{background:#0F172A;color:#D4A373;padding:5px 12px;border-radius:6px;font-size:10px;font-weight:bold;letter-spacing:1px;}.sec{background:#f8f5ef;border-radius:8px;padding:14px 16px;margin-bottom:12px;border-left:3px solid #D4A373;}.stit{font-size:9px;font-weight:bold;color:#64748B;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;}.grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px;}.fl{font-size:9px;color:#64748B;display:block;margin-bottom:2px;}.fv{font-size:12px;color:#0F172A;font-weight:500;}.pkg{display:inline-block;background:#e4f0e8;color:#1a5a30;border:1px solid #b0d8b8;padding:2px 8px;border-radius:8px;font-size:10px;margin:2px 2px 0 0;}table{width:100%;border-collapse:collapse;}th{background:#0F172A;color:#D4A373;padding:8px 12px;font-size:10px;text-align:left;font-weight:600;}td{padding:8px 12px;font-size:12px;border-bottom:1px solid #e8e0d0;}.tr-tot td{font-weight:bold;background:#f0f8f0;font-size:13px;}.tr-bal td{font-weight:bold;background:${balance>0?"#fef3e8":"#f0faf0"};color:${balance>0?"#9a3a00":"#1a5a30"};font-size:13px;}.paybox{background:#0F172A;color:#c8d8b0;padding:12px 16px;border-radius:8px;margin-bottom:16px;font-size:11px;line-height:1.9;}.paybox strong{color:#D4A373;}.footer{text-align:center;color:#64748B;font-size:10px;line-height:1.8;padding-top:12px;border-top:1px solid #e8e0d0;}.print-btn{display:block;margin:18px auto;padding:10px 28px;background:#0F172A;color:#D4A373;border:2px solid #D4A373;border-radius:8px;font-size:13px;cursor:pointer;font-weight:bold;}@media print{.print-btn{display:none!important;}}</style></head>
//     <body><div class="page">{fmtDate(new Date())}
//     <div class="hdr"><div style="display:flex;align-items:center;"><div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#1a3520,#080e0a);border:2px solid #D4A373;display:flex;align-items:center;justify-content:center;font-size:18px;margin-right:12px;">🌿</div><div><div style="font-size:20px;font-weight:bold;color:#0F172A;letter-spacing:2px;">RIVORA</div><div style="font-size:9px;color:#64748B;letter-spacing:3px;margin-top:2px;">COORG · OFFLINE NATURE RESORT</div></div></div><div style="text-align:right;"><div class="badge">BOOKING RECEIPT</div><div style="font-size:18px;font-weight:bold;color:#0F172A;margin-top:4px;">${b.id}</div><div style="font-size:10px;color:#64748B;margin-top:2px;">$</div></div></div>
//     <div class="sec"><div class="stit">Guest Details</div><div class="grid2"><div><span class="fl">Guest Name</span><span class="fv">${b.guestName}</span></div><div><span class="fl">Phone</span><span class="fv">${b.phone}</span></div><div><span class="fl">Adults</span><span class="fv">${b.adults??b.guests} pax${kids>0?` + ${kids} kids`:""}</span></div><div><span class="fl">Food</span><span class="fv">Veg:${b.vegCount||0} NV:${b.nonVegCount||0}</span></div></div></div>
//     <div class="sec"><div class="stit">Stay Details</div><div class="grid2"><div><span class="fl">Room(s)</span><span class="fv">${(b.roomIds||[b.roomId]).join(", ")}</span></div><div><span class="fl">Room Type</span><span class="fv">${b.roomType}</span></div><div><span class="fl">Check-In</span><span class="fv">${fmtDate(b.checkIn)} at ${settings.checkInTime}</span></div><div><span class="fl">Check-Out</span><span class="fv">${fmtDate(b.checkOut)} at ${settings.checkOutTime}</span></div><div><span class="fl">Duration</span><span class="fv">${n} Night${n!==1?"s":""}</span></div><div><span class="fl">Status</span><span class="fv">${b.status}</span></div></div>${b.packages?.length>0?`<div style="margin-top:10px;"><span class="fl" style="margin-bottom:5px;display:block;">Package</span>${b.packages.map((p:string)=>`<span class="pkg">✓ ${p}</span>`).join("")}</div>`:""}</div>
//     <div class="sec"><div class="stit">Billing</div><table><tr><th>Description</th><th style="text-align:right;">Amount</th></tr><tr><td>${n}N × ${b.rateType==="perRoom"?`${(b.roomIds||[b.roomId]).length} room(s) × ₹${b.ratePerRoom}/room`:`${b.adults??b.guests} adults${b.kidsHalf>0?` + ${b.kidsHalf}×½`:""}${b.kidsFull>0?` + ${b.kidsFull}F`:""} × ₹${b.ratePerHead}/head`}</td><td style="text-align:right;">₹${Number(b.total||0).toLocaleString("en-IN")}</td></tr>${kidsRow}${adv>0?`<tr><td>Advance (${settings.advancePct}%)</td><td style="text-align:right;color:#1a5a30;">- ₹${adv.toLocaleString("en-IN")}</td></tr>`:""}${full>0?`<tr><td>Full Stay Paid</td><td style="text-align:right;color:#1a5a30;">- ₹${full.toLocaleString("en-IN")}</td></tr>`:""}${extra>0?`<tr><td>Extras</td><td style="text-align:right;">₹${extra.toLocaleString("en-IN")}</td></tr>`:""}<tr class="tr-tot"><td>Total</td><td style="text-align:right;">₹${Number(b.total||0).toLocaleString("en-IN")}</td></tr><tr class="tr-bal"><td>${balance>0?"Balance Due":"Fully Paid ✓"}</td><td style="text-align:right;">₹${balance.toLocaleString("en-IN")}</td></tr></table></div>
//     <div class="paybox"><strong>Payment Details</strong><br>Bank: ${settings.bankName} · A/C: ${settings.accNo} · IFSC: ${settings.ifsc}<br>Name: ${settings.accHolder} · UPI: ${settings.upi}</div>
//     <div class="footer">Thank you for choosing <strong style="color:#0F172A;">RIVORA COORG</strong> 🌿${b.notes ? `<br><em>${String(b.notes).replace(/</g,"&lt;").replace(/>/g,"&gt;")}</em>` : ""}</div>
//     <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
//     </div></body></html>`;

//   const download = () => {
//     const blob = new Blob([getHTML()],{type:"text/html;charset=utf-8"});
//     const url  = URL.createObjectURL(blob);
//     const a    = document.createElement("a"); a.href=url; a.download=`Rivora-${b.id}.html`;
//     document.body.appendChild(a); a.click(); document.body.removeChild(a);
//     setTimeout(()=>URL.revokeObjectURL(url),1000);
//   };

//   return (
//     <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:600,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"20px 16px",overflowY:"auto"}}>
//       <div style={{width:"100%",maxWidth:680}}>
//         <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
//           <span style={{color:D.gold,fontWeight:"700",fontSize:13}}>Receipt — {b.id}</span>
//           <div style={{display:"flex",gap:8}}>
//             <button onClick={download} style={btn("primary","md")}><FileText size={13}/>Download Invoice</button>
//             <button onClick={onClose}  style={btn("ghost","md")}>✕ Close</button>
//           </div>
//         </div>
//         {/* Preview card mirrors the HTML receipt */}
//         <div style={{background:D.card,borderRadius:14,padding:"24px 28px"}}>
//           <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18,paddingBottom:14,borderBottom:`2px solid ${D.gold}`}}>
//             <div style={{display:"flex",alignItems:"center",gap:10}}>
//               <div style={{width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,#1a3520,#080e0a)",border:`2px solid ${D.gold}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🌿</div>
//               <div><div style={{fontSize:16,fontWeight:"800",color:D.text,letterSpacing:"0.1em"}}>RIVORA</div><div style={{fontSize:8,color:D.sub,letterSpacing:"0.2em"}}>OFFLINE NATURE RESORT</div></div>
//             </div>
//             <div style={{textAlign:"right"}}>
//               <div style={{background:D.gold,color:"#0F172A",padding:"3px 10px",borderRadius:6,fontSize:10,fontWeight:"800",display:"inline-block"}}>BOOKING RECEIPT</div>
//               <div style={{fontSize:14,fontWeight:"800",color:D.text,marginTop:5}}>{b.id}</div>
//               <div style={{fontSize:10,color:D.sub,marginTop:2}}>{fmtDate(new Date())}</div>
//             </div>
//           </div>
//           {/* Summary rows */}
//           <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
//             {[["Guest",b.guestName],["Phone",b.phone],
//               ["Room(s)",(b.roomIds||[b.roomId]).join(", ")],
//               ["Check-In",`${fmtDate(b.checkIn)} ${settings.checkInTime}`],
//               ["Check-Out",`${fmtDate(b.checkOut)} ${settings.checkOutTime}`],
//               ["Adults",`${b.adults??b.guests}${kids>0?` + ${kids} kids`:""}`],
//               ["Veg / NV",`${b.vegCount||0} / ${b.nonVegCount||0}`],
//               ["Duration",`${n}N`]]
//               .map(([k,v])=>(
//                 <div key={k as string} style={{background:D.surface,borderRadius:8,padding:"7px 10px"}}>
//                   <div style={{fontSize:9,color:D.sub,marginBottom:2}}>{k}</div>
//                   <div style={{fontSize:12,color:D.text,fontWeight:"500"}}>{v}</div>
//                 </div>
//               ))}
//           </div>
//           {/* Billing table */}
//           <div style={{background:D.surface,borderRadius:10,padding:"12px 14px",marginBottom:10}}>
//             <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:D.sub,padding:"6px 0",borderBottom:`1px solid ${D.border}`}}>
//               <span>Booking Total</span><span style={{fontWeight:"700",color:D.gold}}>₹{Number(b.total||0).toLocaleString("en-IN")}</span>
//             </div>
//             {adv>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:D.sub,padding:"6px 0",borderBottom:`1px solid ${D.border}`}}><span>Advance</span><span style={{color:D.success}}>- ₹{adv.toLocaleString("en-IN")}</span></div>}
//             {full>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:D.sub,padding:"6px 0",borderBottom:`1px solid ${D.border}`}}><span>Full Stay</span><span style={{color:D.success}}>- ₹{full.toLocaleString("en-IN")}</span></div>}
//             {extra>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:D.sub,padding:"6px 0",borderBottom:`1px solid ${D.border}`}}><span>Extras</span><span>₹{extra.toLocaleString("en-IN")}</span></div>}
//             <div style={{display:"flex",justifyContent:"space-between",fontSize:13,fontWeight:"700",padding:"8px 0",color:balance>0?D.warning:D.success}}>
//               <span>{balance>0?"Balance Due":"Fully Paid ✓"}</span><span>₹{balance.toLocaleString("en-IN")}</span>
//             </div>
//           </div>
//         </div>
//         <div style={{textAlign:"center",color:D.sub,fontSize:11,marginTop:10}}>Download → open in browser → Ctrl+P to save as PDF</div>
//       </div>
//     </div>
//   );
// }

"use client";
import { FileText, Download } from "lucide-react";
import { D } from "../../lib/constants";
import { btn } from "../../lib/ui";
import { nights, fmtDate, totalKids } from "../../lib/helpers";

export default function InvoiceModal({ booking: b, settings, onClose }: any) {
  const n      = nights(b.checkIn, b.checkOut);
  const adv    = Number(b.payments?.advance?.amount || b.advanceAmount || 0);
  const full   = Number(b.payments?.fullStay?.amount || 0);
  const extra  = Number(b.payments?.extras?.amount || 0);
  const balance = Math.max(0, Number(b.total || 0) - adv - full - extra);
  const kids   = totalKids(b);

  const rooms = (b.roomIds || [b.roomId]).filter(Boolean).join(", ");
  const pax = `${b.adults ?? b.guests} adult${(b.adults ?? b.guests) !== 1 ? "s" : ""}${kids > 0 ? `, ${kids} kid${kids !== 1 ? "s" : ""}` : ""}`;
  const food =
    (b.vegCount || 0) + (b.nonVegCount || 0) > 0
      ? ` · Veg ${b.vegCount || 0} / NV ${b.nonVegCount || 0}`
      : "";
  const stayLine = `${fmtDate(b.checkIn)} – ${fmtDate(b.checkOut)} (${n} night${n !== 1 ? "s" : ""})`;
  const paidSoFar = adv + full;
  const esc = (s: string) => String(s).replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const getHTML = () => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Rivora · ${b.id}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @page { size: A4; margin: 14mm; }
  body {
    font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
    font-size: 11px; line-height: 1.45;
    color: #111; background: #fff;
    padding: 16px;
  }
  .page { max-width: 520px; margin: 0 auto; }

  .hdr {
    display: flex; justify-content: space-between; align-items: flex-start;
    padding-bottom: 10px; margin-bottom: 12px;
    border-bottom: 2px solid #C8963E;
  }
  .brand { font-size: 18px; font-weight: 800; letter-spacing: 3px; color: #0F1A0D; }
  .brand-sub { font-size: 9px; color: #666; letter-spacing: 1px; margin-top: 2px; }
  .meta { text-align: right; }
  .meta-id { font-size: 14px; font-weight: 700; }
  .meta-date { font-size: 10px; color: #666; margin-top: 2px; }

  .info { margin-bottom: 14px; font-size: 11px; line-height: 1.65; }
  .info strong { color: #333; font-weight: 600; }

  table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
  th {
    text-align: left; font-size: 9px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.08em;
    color: #666; padding: 6px 0; border-bottom: 1px solid #ddd;
  }
  th.amt { text-align: right; }
  td { padding: 7px 0; border-bottom: 1px solid #eee; vertical-align: top; }
  td.amt { text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }
  td.deduct { color: #1a5a30; }
  tr.grand td {
    padding: 10px 0 4px; border-bottom: none; border-top: 2px solid #0F1A0D;
    font-size: 13px; font-weight: 800;
  }
  tr.grand.due td { color: #9a3a00; }
  tr.grand.paid td { color: #1a5a30; }

  .pay {
    font-size: 10px; color: #444; line-height: 1.6;
    padding-top: 10px; border-top: 1px solid #eee;
  }
  .pay strong { color: #0F1A0D; font-size: 9px; letter-spacing: 0.06em; text-transform: uppercase; }
  .foot { text-align: center; font-size: 10px; color: #888; margin-top: 12px; }

  .print-btn {
    display: block; margin: 16px auto 0; padding: 8px 20px;
    background: #0F1A0D; color: #C8963E; border: 1px solid #C8963E;
    border-radius: 6px; font-size: 12px; cursor: pointer; font-weight: 600;
  }
  @media print {
    body { padding: 0; }
    .print-btn { display: none !important; }
  }
</style>
</head>
<body>
<div class="page">

  <div class="hdr">
    <div>
      <div class="brand">RIVORA</div>
      <div class="brand-sub">Coorg · Nature Resort</div>
    </div>
    <div class="meta">
      <div class="meta-id">${b.id}</div>
      <div class="meta-date">${fmtDate(new Date())}</div>
    </div>
  </div>

  <div class="info">
    <strong>${esc(b.guestName)}</strong> · ${esc(b.phone)}<br>
    ${stayLine} · ${esc(rooms)}${b.roomType ? ` (${esc(b.roomType)})` : ""}<br>
    ${pax}${food}
    ${b.packages?.length ? `<br>Package: ${b.packages.map((p: string) => esc(p)).join(", ")}` : ""}
    ${b.notes ? `<br>Note: ${esc(String(b.notes))}` : ""}
  </div>

  <table>
    <thead>
      <tr><th>Description</th><th class="amt">Amount (₹)</th></tr>
    </thead>
    <tbody>
      <tr>
        <td>Stay charges (${n} night${n !== 1 ? "s" : ""})</td>
        <td class="amt">${Number(b.total || 0).toLocaleString("en-IN")}</td>
      </tr>
      ${adv > 0 ? `<tr><td>Less: Advance paid</td><td class="amt deduct">− ${adv.toLocaleString("en-IN")}</td></tr>` : ""}
      ${full > 0 ? `<tr><td>Less: Full stay paid</td><td class="amt deduct">− ${full.toLocaleString("en-IN")}</td></tr>` : ""}
      ${extra > 0 ? `<tr><td>Extras</td><td class="amt">+ ${extra.toLocaleString("en-IN")}</td></tr>` : ""}
      ${paidSoFar > 0 && balance > 0 ? `<tr><td style="color:#666;font-size:10px;">Paid so far</td><td class="amt" style="color:#666;font-size:10px;">${paidSoFar.toLocaleString("en-IN")}</td></tr>` : ""}
      <tr class="grand ${balance > 0 ? "due" : "paid"}">
        <td>${balance > 0 ? "Balance due" : "Paid in full"}</td>
        <td class="amt">${balance.toLocaleString("en-IN")}</td>
      </tr>
    </tbody>
  </table>

  <div class="pay">
    <strong>Pay to</strong><br>
    ${esc(settings.accHolder)} · ${esc(settings.bankName)} · A/C ${esc(settings.accNo)} · IFSC ${esc(settings.ifsc)} · UPI ${esc(settings.upi)}
  </div>

  <div class="foot">Thank you — RIVORA COORG</div>

  <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
</div>
</body>
</html>`;

  const download = () => {
    const blob = new Blob([getHTML()], { type: "text/html;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `Rivora-${b.id}.html`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  /* ── Modal overlay ─────────────────────────────────────────────────── */
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.78)",
      zIndex: 600,
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      padding: "clamp(12px,3vw,24px) clamp(10px,3vw,16px)",
      overflowY: "auto",
    }}>
      <div style={{ width: "100%", maxWidth: 700 }}>

        {/* ── Top toolbar ─────────────────────────────────────────────── */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8,
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <FileText size={16} style={{ color: "var(--gold)" }}/>
            <span style={{
              fontFamily: "var(--font-display)", fontWeight: 700,
              fontSize: "var(--text-base)", color: "var(--gold)",
              letterSpacing: "0.04em",
            }}>
              Receipt — {b.id}
            </span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={download}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "9px 16px",
                background: "linear-gradient(135deg,#C8963E,#A87830)",
                border: "1px solid rgba(200,150,62,0.5)",
                borderRadius: "var(--radius-md)",
                color: "#0B1A0D",
                fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", fontWeight: 800,
                cursor: "pointer", whiteSpace: "nowrap",
              }}
            >
              <Download size={13}/>
              Download Invoice
            </button>
            <button
              onClick={onClose}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "9px 14px",
                background: "var(--card-deep)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                color: "var(--text-muted)",
                fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", fontWeight: 700,
                cursor: "pointer",
              }}
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* ── Preview card ─────────────────────────────────────────────── */}
        <div style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          overflow: "hidden",
        }}>

          {/* Header stripe */}
          <div style={{
            background: "linear-gradient(135deg,rgba(200,150,62,0.12),rgba(200,150,62,0.04))",
            borderBottom: `2px solid var(--gold)`,
            padding: "20px 22px",
            display: "flex", justifyContent: "space-between", alignItems: "flex-start",
            gap: 12, flexWrap: "wrap",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                background: "linear-gradient(145deg,#1a3520,#080e0a)",
                border: "2px solid var(--gold)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, flexShrink: 0,
              }}>🌿</div>
              <div>
                <div style={{
                  fontFamily: "var(--font-display)", fontSize: "var(--text-xl)",
                  fontWeight: 800, color: "var(--gold)", letterSpacing: "0.12em",
                }}>
                  RIVORA
                </div>
                <div style={{
                  fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
                  color: "var(--text-muted)", letterSpacing: "0.2em", marginTop: 2,
                }}>
                  COORG · NATURE RESORT
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{
                background: "var(--gold)", color: "#0B1A0D",
                padding: "3px 12px", borderRadius: 6,
                fontSize: "var(--text-xs)", fontWeight: 800, letterSpacing: "0.06em",
                display: "inline-block",
              }}>
                BOOKING RECEIPT
              </div>
              <div style={{
                fontFamily: "var(--font-display)", fontSize: "var(--text-xl)",
                fontWeight: 800, color: "var(--text)", marginTop: 6,
              }}>
                {b.id}
              </div>
              <div style={{
                fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
                color: "var(--text-muted)", marginTop: 3,
              }}>
                {fmtDate(new Date())}
              </div>
            </div>
          </div>

          <div style={{ padding: "20px 22px" }}>

            {/* Guest + stay — compact block */}
            <div style={{
              fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
              color: "var(--text)", lineHeight: 1.65, marginBottom: 16,
              padding: "12px 14px",
              background: "var(--card-deep)",
              border: "1px solid var(--border-light)",
              borderRadius: "var(--radius-md)",
            }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{b.guestName} · {b.phone}</div>
              <div style={{ color: "var(--text-muted)" }}>
                {fmtDate(b.checkIn)} – {fmtDate(b.checkOut)} ({n} night{n !== 1 ? "s" : ""})
                {" · "}{(b.roomIds || [b.roomId]).join(", ")}
                {b.roomType ? ` (${b.roomType})` : ""}
              </div>
              <div style={{ color: "var(--text-muted)", marginTop: 2 }}>
                {b.adults ?? b.guests} adult{(b.adults ?? b.guests) !== 1 ? "s" : ""}
                {kids > 0 ? `, ${kids} kid${kids !== 1 ? "s" : ""}` : ""}
                {(b.vegCount || b.nonVegCount) ? ` · Veg ${b.vegCount || 0} / NV ${b.nonVegCount || 0}` : ""}
              </div>
            </div>

            {/* Billing rows */}
            <div style={{
              background: "var(--card-deep)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              marginBottom: 14,
            }}>
              {/* Header */}
              <div style={{
                display: "flex", justifyContent: "space-between",
                padding: "10px 14px",
                background: "rgba(200,150,62,0.08)",
                borderBottom: "1px solid var(--border)",
              }}>
                <span style={{
                  fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
                  fontWeight: 800, color: "var(--gold)", letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}>
                  Billing
                </span>
                <span style={{
                  fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
                  fontWeight: 800, color: "var(--gold)", letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}>
                  Amount
                </span>
              </div>

              {/* Rows */}
              {[
                { label: `Stay (${n} night${n !== 1 ? "s" : ""})`, value: `₹${Number(b.total || 0).toLocaleString("en-IN")}`, color: "var(--text)" },
                ...(adv > 0 ? [{ label: "Less: Advance paid", value: `− ₹${adv.toLocaleString("en-IN")}`, color: "var(--success)" }] : []),
                ...(full > 0 ? [{ label: "Less: Full stay paid", value: `− ₹${full.toLocaleString("en-IN")}`, color: "var(--success)" }] : []),
                ...(extra > 0 ? [{ label: "Extras", value: `+ ₹${extra.toLocaleString("en-IN")}`, color: "var(--text)" }] : []),
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  style={{
                    display: "flex", justifyContent: "space-between",
                    padding: "11px 14px",
                    borderBottom: "1px solid var(--border-light)",
                  }}
                >
                  <span style={{
                    fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
                    color: "var(--text-muted)",
                  }}>
                    {label}
                  </span>
                  <span style={{
                    fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
                    fontWeight: 700, color,
                  }}>
                    {value}
                  </span>
                </div>
              ))}

              {/* Balance row */}
              <div style={{
                display: "flex", justifyContent: "space-between",
                padding: "14px 16px",
                background: balance > 0 ? "rgba(212,97,74,0.08)" : "rgba(91,173,122,0.09)",
                borderTop: `2px solid ${balance > 0 ? "rgba(212,97,74,0.3)" : "rgba(91,173,122,0.3)"}`,
              }}>
                <span style={{
                  fontFamily: "var(--font-display)", fontSize: "var(--text-base)",
                  fontWeight: 700,
                  color: balance > 0 ? "var(--danger)" : "var(--success)",
                }}>
                  {balance > 0 ? "Balance Due" : "Fully Paid ✓"}
                </span>
                <span style={{
                  fontFamily: "var(--font-display)", fontSize: "var(--text-xl)",
                  fontWeight: 800,
                  color: balance > 0 ? "var(--danger)" : "var(--success)",
                }}>
                  ₹{balance.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Payment details */}
            <div style={{
              background: "rgba(200,150,62,0.07)",
              border: "1px solid rgba(200,150,62,0.2)",
              borderRadius: "var(--radius-md)",
              padding: "12px 14px",
            }}>
              <div style={{
                fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
                fontWeight: 800, color: "var(--gold)",
                letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8,
              }}>
                Payment Details
              </div>
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "4px 16px",
              }}>
                {[
                  ["Bank", settings.bankName],
                  ["Account", settings.accNo],
                  ["Name", settings.accHolder],
                  ["IFSC", settings.ifsc],
                  ["UPI", settings.upi],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", gap: 6, alignItems: "baseline" }}>
                    <span style={{
                      fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
                      color: "var(--text-faint)", minWidth: 44, flexShrink: 0,
                    }}>
                      {k}:
                    </span>
                    <span style={{
                      fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
                      color: "var(--text)", fontWeight: 600,
                    }}>
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Hint ────────────────────────────────────────────────────── */}
        <div style={{
          textAlign: "center",
          fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
          color: "var(--text-faint)", marginTop: 10,
        }}>
          Download → open in browser → Ctrl+P (or ⌘P) → Save as PDF
        </div>

      </div>
    </div>
  );
}