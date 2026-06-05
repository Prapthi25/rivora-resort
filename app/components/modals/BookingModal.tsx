// "use client";
// import { useState, useMemo, useCallback } from "react";
// import { Plus, XCircle, AlertCircle } from "lucide-react";
// import { D, ROOMS } from "../../lib/constants";
// import { inp, lbl, btn } from "../../lib/ui";
// import { genId, nights, getRoomIds, todayStr, fmtDate } from "../../lib/helpers";
// import { ModalWrap } from "./ModalWrap"; 

// export default function BookingModal({onClose,onSave,settings,bookings,session}:any) {
//   const nextId = genId();
//   const [bookedByOther,setBBO] = useState(false);
//   const [roomSlots,setRoomSlots] = useState([{roomType:"Family",roomId:"FR-01"}]);
//   const [f,setF] = useState({
//     id:nextId, guestName:"", phone:"", checkIn:"", checkOut:"",
//     adults:"", kidsFree:"", kidsHalf:"", kidsFull:"",
//     vegCount:"", nonVegCount:"",
//     bookedBy:session.name, rateType:"perHead",
//     ratePerHead:settings.familyRate, ratePerRoom:"",
//     packages:[...(settings.packages||[])], notes:"", status:"Confirmed",
//     createdAt:new Date().toISOString(),
//     payments:{advance:{},fullStay:{},extras:{}},
//   });
//   const [err,setErr] = useState("");
//   const upd = (k:string,v:any) => setF(p=>({...p,[k]:v}));
//   const num = (v:string) => v.replace(/[^0-9]/g,"");

//   const n    = nights(f.checkIn,f.checkOut);
//   const adults   = Number(f.adults||0);
//   const kidsFree = Number(f.kidsFree||0);
//   const kidsHalf = Number(f.kidsHalf||0);
//   const kidsFull = Number(f.kidsFull||0);
//   const totalGuests = adults+kidsFree+kidsHalf+kidsFull;
//   const billablePax = adults+kidsFull+kidsHalf*0.5;
//   const total = f.rateType==="perHead"
//     ? Math.round(billablePax*Number(f.ratePerHead||0)*n)
//     : Number(f.ratePerRoom||0)*roomSlots.length*n;
//   const advanceAmount = Math.round(total*(settings.advancePct||30)/100);

//   const getAvail = useCallback((type:string,idx:number)=>{
//     const otherIds = roomSlots.filter((_,i)=>i!==idx).map(s=>s.roomId);
//     return ROOMS.filter(r=>
//       r.type===type&&
//       !otherIds.includes(r.id)&&
//       !bookings.some((b:any)=>
//         getRoomIds(b).includes(r.id)&&
//         b.status!=="Cancelled"&&b.status!=="Checked Out"&&
//         b.checkIn<f.checkOut&&b.checkOut>f.checkIn&&
//         f.checkIn&&f.checkOut)
//     );
//   },[roomSlots,bookings,f.checkIn,f.checkOut]);

//   const vegWarn  = (Number(f.vegCount||0)+Number(f.nonVegCount||0))>totalGuests&&totalGuests>0?"Veg + Non-Veg count exceeds total guests":"";
//   const pastWarn = f.checkIn&&f.checkIn<todayStr?"Check-in date is in the past — verify this is correct":"";

//   const addRoom    = () => setRoomSlots(s=>[...s,{roomType:"Family",roomId:"FR-01"}]);
//   const removeRoom = (i:number) => setRoomSlots(s=>s.filter((_,j)=>j!==i));
//   const updateSlot = (i:number,key:string,val:string) => setRoomSlots(s=>s.map((sl,j)=>j===i?{...sl,[key]:val}:sl));

//   const submit = () => {
//     if (!f.guestName.trim()) return setErr("Guest name is required.");
//     if (!f.phone.trim()||f.phone.replace(/\D/g,"").length<10) return setErr("Enter a valid 10-digit phone number.");
//     if (!f.checkIn||!f.checkOut) return setErr("Both dates are required.");
//     if (n<=0)  return setErr("Check-out must be after check-in.");
//     if (n>30)  return setErr("Duration cannot exceed 30 nights.");
//     if (adults<1) return setErr("At least 1 adult is required.");
//     if (f.rateType==="perHead"&&(!f.ratePerHead||Number(f.ratePerHead)<1)) return setErr("Enter a valid rate per head.");
//     if (f.rateType==="perRoom"&&(!f.ratePerRoom||Number(f.ratePerRoom)<1)) return setErr("Enter a valid rate per room.");
//     if ((Number(f.vegCount||0)+Number(f.nonVegCount||0))>totalGuests) return setErr("Veg + Non-Veg count cannot exceed total guests.");
//     const conflicts:string[] = [];
//     roomSlots.forEach(slot=>{
//       const c = bookings.find((b:any)=>
//         getRoomIds(b).includes(slot.roomId)&&
//         b.status!=="Cancelled"&&b.status!=="Checked Out"&&
//         b.checkIn<f.checkOut&&b.checkOut>f.checkIn);
//       if (c) conflicts.push(`${slot.roomId} is already booked by ${c.guestName} (${fmtDate(c.checkIn)} – ${fmtDate(c.checkOut)})`);
//     });
//     if (conflicts.length) return setErr(`Room conflict:\n${conflicts.join("\n")}`);
//     const roomIds = roomSlots.map(s=>s.roomId);
//     onSave({...f, guests:totalGuests, adults, kidsFree, kidsHalf, kidsFull,
//       roomId:roomIds[0], roomIds, roomSlots, roomType:roomSlots[0].roomType, total, advanceAmount});
//   };

//   return (
//     <ModalWrap title="New Booking" onClose={onClose}>
//       {err&&<div style={{background:D.dangerDim,border:`1px solid ${D.dangerBorder}`,color:D.danger,fontSize:12,padding:"10px 14px",borderRadius:8,marginBottom:14,display:"flex",gap:8,alignItems:"flex-start",whiteSpace:"pre-line"}}><AlertCircle size={13} style={{marginTop:1,flexShrink:0}}/>{err}</div>}
//       {(vegWarn||pastWarn)&&!err&&(
//         <div style={{background:"rgba(251,191,36,0.08)",border:"1px solid rgba(251,191,36,0.25)",color:D.warning,fontSize:11,padding:"8px 12px",borderRadius:8,marginBottom:12}}>
//           {pastWarn&&<div>⚠ {pastWarn}</div>}
//           {vegWarn&&<div>⚠ {vegWarn}</div>}
//         </div>
//       )}

//       <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
//         <div><div style={lbl}>Guest Name *</div><input value={f.guestName} onChange={e=>{upd("guestName",e.target.value);setErr("");}} style={inp} placeholder="Full name"/></div>
//         <div><div style={lbl}>Phone *</div><input value={f.phone} onChange={e=>{upd("phone",e.target.value);setErr("");}} style={inp} placeholder="+91 XXXXX XXXXX"/></div>
//         <div><div style={lbl}>Check-In *</div><input type="date" value={f.checkIn} onChange={e=>{upd("checkIn",e.target.value);setErr("");}} style={{...inp,colorScheme:"dark"}}/></div>
//         <div><div style={lbl}>Check-Out *</div><input type="date" value={f.checkOut} onChange={e=>{upd("checkOut",e.target.value);setErr("");}} style={{...inp,colorScheme:"dark"}}/></div>
//       </div>

//       {/* Room slots */}
//       <div style={{marginTop:12}}>
//         <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
//           <div style={lbl}>Room Assignment(s)</div>
//           <button onClick={addRoom} style={btn("success","sm")}><Plus size={10}/>Add Room</button>
//         </div>
//         {roomSlots.map((slot,i)=>{
//           const avail = getAvail(slot.roomType,i);
//           return (
//             <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1fr auto",gap:8,marginBottom:8,background:D.surface,padding:"10px",borderRadius:10,border:`1px solid ${D.border}`}}>
//               <div><div style={lbl}>Type</div>
//                 <select value={slot.roomType} onChange={e=>{
//                   const t=e.target.value; updateSlot(i,"roomType",t);
//                   updateSlot(i,"roomId",ROOMS.find(r=>r.type===t)?.id||(t==="Family"?"FR-01":"CR-01"));
//                   if(i===0) upd("ratePerHead",t==="Family"?settings.familyRate:settings.coupleRate);
//                 }} style={inp}>
//                   <option value="Family">Family (3+ sharing)</option>
//                   <option value="Couple">Couple (2 sharing)</option>
//                 </select>
//               </div>
//               <div><div style={lbl}>Room</div>
//                 <select value={slot.roomId} onChange={e=>updateSlot(i,"roomId",e.target.value)} style={inp}>
//                   {avail.map(r=><option key={r.id} value={r.id}>{r.id}</option>)}
//                   {avail.length===0&&<option>None available</option>}
//                 </select>
//                 {avail.length===0&&f.checkIn&&f.checkOut&&<div style={{color:D.danger,fontSize:9,marginTop:2}}>All {slot.roomType} rooms booked</div>}
//               </div>
//               <div style={{display:"flex",alignItems:"flex-end",paddingBottom:1}}>
//                 {roomSlots.length>1&&<button onClick={()=>removeRoom(i)} style={btn("danger","sm")}><XCircle size={10}/></button>}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Guests */}
//       <div style={{background:D.surface,border:`1px solid ${D.border}`,borderRadius:10,padding:"12px",marginTop:8}}>
//         <div style={{fontSize:10,fontWeight:"700",color:D.sub,letterSpacing:"0.06em",marginBottom:10}}>GUEST HEADCOUNT</div>
//         <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:8}}>
//           <div><div style={lbl}>Adults *</div><input type="text" inputMode="numeric" value={f.adults} onChange={e=>{upd("adults",num(e.target.value));setErr("");}} style={inp} placeholder="0"/></div>
//           <div>
//             <div style={lbl}>Kids under 5</div>
//             <div style={{fontSize:9,color:D.success,marginBottom:3}}>No charge</div>
//             <input type="text" inputMode="numeric" value={f.kidsFree} onChange={e=>upd("kidsFree",num(e.target.value))} style={inp} placeholder="0"/>
//           </div>
//           <div>
//             <div style={lbl}>Kids 5–9 yrs</div>
//             <div style={{fontSize:9,color:D.warning,marginBottom:3}}>Half charge</div>
//             <input type="text" inputMode="numeric" value={f.kidsHalf} onChange={e=>upd("kidsHalf",num(e.target.value))} style={inp} placeholder="0"/>
//           </div>
//           <div>
//             <div style={lbl}>Kids 10+ yrs</div>
//             <div style={{fontSize:9,color:D.danger,marginBottom:3}}>Full charge</div>
//             <input type="text" inputMode="numeric" value={f.kidsFull} onChange={e=>upd("kidsFull",num(e.target.value))} style={inp} placeholder="0"/>
//           </div>
//         </div>
//         {totalGuests>0&&<div style={{fontSize:11,color:D.sub,marginTop:8}}>Total headcount: <b style={{color:D.text}}>{totalGuests}</b></div>}
//       </div>

//       {/* Rate */}
//       <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:10}}>
//         <div>
//           <div style={lbl}>Rate Type</div>
//           <div style={{display:"flex",borderRadius:8,overflow:"hidden",border:`1px solid ${D.border}`}}>
//             {["perHead","perRoom"].map(rt=>(
//               <button key={rt} onClick={()=>upd("rateType",rt)} style={{flex:1,padding:"8px",fontSize:11,cursor:"pointer",background:f.rateType===rt?D.gold:D.surface,color:f.rateType===rt?"#0F172A":D.sub,border:"none",fontWeight:"600"}}>
//                 {rt==="perHead"?"Per Head":"Per Room"}
//               </button>
//             ))}
//           </div>
//           <div style={{marginTop:6}}>
//             {f.rateType==="perHead"
//               ? <input type="number" value={f.ratePerHead} onChange={e=>upd("ratePerHead",e.target.value)} style={inp} placeholder="₹ per head"/>
//               : <input type="number" value={f.ratePerRoom} onChange={e=>upd("ratePerRoom",e.target.value)} style={inp} placeholder="₹ per room"/>}
//           </div>
//         </div>
//         <div>
//           <div><div style={lbl}>Veg Count</div><input type="text" inputMode="numeric" value={f.vegCount} onChange={e=>upd("vegCount",num(e.target.value))} style={inp} placeholder="0"/></div>
//           <div><div style={lbl}>Non-Veg Count</div><input type="text" inputMode="numeric" value={f.nonVegCount} onChange={e=>upd("nonVegCount",num(e.target.value))} style={inp} placeholder="0"/></div>
//         </div>
//       </div>

//       {/* Booked By */}
//       <div style={{marginTop:10}}>
//         <div style={lbl}>Booking Taken By</div>
//         <select value={bookedByOther?"__other__":f.bookedBy} onChange={e=>{
//           if(e.target.value==="__other__"){setBBO(true);upd("bookedBy","");}
//           else{setBBO(false);upd("bookedBy",e.target.value);}
//         }} style={inp}>
//           {(settings.staffList||["Agnish","Deekshith","Mahindra"]).map((s:string)=><option key={s} value={s}>{s}</option>)}
//           <option value="Booking Agent">Booking Agent</option>
//           <option value="__other__">Other…</option>
//         </select>
//         {bookedByOther&&<input value={f.bookedBy} onChange={e=>upd("bookedBy",e.target.value)} style={{...inp,marginTop:6}} placeholder="Enter name" autoFocus/>}
//       </div>

//       {/* Packages */}
//       <div style={{marginTop:12}}>
//         <div style={lbl}>Package Inclusions</div>
//         <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:6}}>
//           {(settings.packages||[]).map((pkg:string)=>(
//             <label key={pkg} style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",fontSize:12,color:f.packages.includes(pkg)?D.gold:D.sub,background:f.packages.includes(pkg)?D.goldDim:D.surface,border:`1px solid ${f.packages.includes(pkg)?D.goldBorder:D.border}`,padding:"4px 10px",borderRadius:20}}>
//               <input type="checkbox" checked={f.packages.includes(pkg)} onChange={e=>upd("packages",e.target.checked?[...f.packages,pkg]:f.packages.filter((p:string)=>p!==pkg))} style={{accentColor:D.gold}}/>{pkg}
//             </label>
//           ))}
//         </div>
//       </div>

//       <div style={{marginTop:10}}>
//         <div style={lbl}>Notes</div>
//         <textarea value={f.notes} onChange={e=>upd("notes",e.target.value)} style={{...inp,height:52,resize:"vertical"}} placeholder="Special requests, arrival time…"/>
//       </div>

//       {/* Total summary */}
//       {n>0&&adults>0&&(
//         <div style={{background:D.successDim,border:`1px solid ${D.successBorder}`,borderRadius:10,padding:"12px 14px",marginTop:12}}>
//           <div style={{fontSize:11,color:D.sub,marginBottom:4}}>
//             {f.rateType==="perHead"
//               ? `${n}N × ${adults}A${kidsHalf>0?` + ${kidsHalf}×½`:""} ${kidsFull>0?`+ ${kidsFull}F`:""} × ₹${f.ratePerHead}`
//               : `${n}N × ${roomSlots.length} room${roomSlots.length>1?"s":""} × ₹${f.ratePerRoom}`}
//           </div>
//           <div style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
//             <span style={{color:D.sub}}>Total</span>
//             <span style={{color:D.gold,fontWeight:"800",fontSize:16}}>₹{total.toLocaleString("en-IN")}</span>
//           </div>
//           <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:D.sub,marginTop:4}}>
//             <span>Advance ({settings.advancePct}%)</span>
//             <span style={{color:D.success,fontWeight:"600"}}>₹{advanceAmount.toLocaleString("en-IN")}</span>
//           </div>
//           <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:D.sub}}>
//             <span>Balance at check-in</span>
//             <span style={{color:D.warning,fontWeight:"600"}}>₹{(total-advanceAmount).toLocaleString("en-IN")}</span>
//           </div>
//         </div>
//       )}
//       <div style={{display:"flex",gap:8,marginTop:14}}>
//         <button onClick={submit} style={btn("primary","md")}>Save Booking</button>
//         <button onClick={onClose} style={btn("ghost","md")}>Cancel</button>
//       </div>
//     </ModalWrap>
//   );
// }

"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import { Plus, XCircle, AlertCircle, ChevronDown } from "lucide-react";
import { D, ROOMS } from "../../lib/constants";
import { inp, lbl, btn } from "../../lib/ui";
import { genId, nights, getRoomIds, todayStr, fmtDate } from "../../lib/helpers";
import { ModalWrap } from "./ModalWrap";

/* ── Shared field label ─────────────────────────────────────────────────── */
const FIELD_LABEL: React.CSSProperties = {
  fontFamily: "var(--font-body, inherit)",
  fontSize: 13,
  fontWeight: 700,
  color: "var(--text-muted, #8A9A8F)",
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  marginBottom: 6,
  display: "block",
};

/* ── Section divider with title ─────────────────────────────────────────── */
function SectionHeader({ title, icon }: { title: string; icon?: string }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      margin: "18px 0 12px",
      paddingBottom: 8,
      borderBottom: `1px solid ${D.border}`,
    }}>
      {icon && <span style={{ fontSize: 14 }}>{icon}</span>}
      <span style={{
        fontFamily: "var(--font-display, inherit)",
        fontSize: 12,
        fontWeight: 800,
        color: D.sub,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
      }}>
        {title}
      </span>
    </div>
  );
}

/* ── Field wrapper ──────────────────────────────────────────────────────── */
function Field({
  label, hint, children, span = 1,
}: {
  label: string; hint?: string; children: React.ReactNode; span?: number;
}) {
  return (
    <div style={{ gridColumn: span > 1 ? `span ${span}` : undefined }}>
      <label style={FIELD_LABEL}>{label}</label>
      {hint && (
        <div style={{ fontSize: 11, color: D.sub, marginBottom: 5, marginTop: -2 }}>
          {hint}
        </div>
      )}
      {children}
    </div>
  );
}

/* ── Input with shared sizing ───────────────────────────────────────────── */
const INPUT_BASE: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "10px 12px",
  fontSize: 14,
  lineHeight: 1.4,
  fontFamily: "var(--font-body, inherit)",
  background: D.surface,
  color: D.text,
  border: `1.5px solid ${D.border}`,
  borderRadius: 8,
  outline: "none",
  transition: "border-color 0.15s ease",
  boxSizing: "border-box",
};

const DATE_INPUT: React.CSSProperties = {
  ...INPUT_BASE,
  colorScheme: "dark",
};

const SELECT_INPUT: React.CSSProperties = {
  ...INPUT_BASE,
  appearance: "none",
  WebkitAppearance: "none",
  cursor: "pointer",
  paddingRight: 32,
};

/* ── Select with caret icon ─────────────────────────────────────────────── */
function Select({
  value, onChange, children, style,
}: {
  value: string; onChange: (v: string) => void;
  children: React.ReactNode; style?: React.CSSProperties;
}) {
  return (
    <div style={{ position: "relative" }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ ...SELECT_INPUT, ...style }}
      >
        {children}
      </select>
      <ChevronDown
        size={13}
        style={{
          position: "absolute", right: 10, top: "50%",
          transform: "translateY(-50%)", pointerEvents: "none",
          color: D.sub,
        }}
      />
    </div>
  );
}

/* ── Rate toggle ─────────────────────────────────────────────────────────── */
function RateToggle({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{
      display: "flex",
      borderRadius: 8,
      border: `1.5px solid ${D.border}`,
      overflow: "hidden",
      height: 40,
    }}>
      {[
        { id: "perHead", label: "Per Head" },
        { id: "perRoom", label: "Per Room" },
      ].map(opt => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          style={{
            flex: 1,
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "var(--font-body, inherit)",
            cursor: "pointer",
            border: "none",
            background: value === opt.id ? D.gold : D.surface,
            color: value === opt.id ? "#0F172A" : D.sub,
            transition: "background 0.15s ease, color 0.15s ease",
            letterSpacing: "0.03em",
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/* ── Pax row (Adults / Kids) ────────────────────────────────────────────── */
function PaxField({
  label, badge, badgeColor, value, onChange,
}: {
  label: string; badge: string; badgeColor: string;
  value: string; onChange: (v: string) => void;
}) {
  return (
    <div style={{
      background: D.surface,
      border: `1.5px solid ${D.border}`,
      borderRadius: 8,
      padding: "10px 12px",
    }}>
      <div style={{ marginBottom: 6 }}>
        <span style={{ ...FIELD_LABEL, display: "inline", marginBottom: 0 }}>{label}</span>
        <span style={{
          marginLeft: 6,
          fontSize: 10,
          fontWeight: 700,
          color: badgeColor,
          background: `${badgeColor}22`,
          padding: "2px 7px",
          borderRadius: 20,
          letterSpacing: "0.04em",
        }}>
          {badge}
        </span>
      </div>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={e => onChange(e.target.value.replace(/[^0-9]/g, ""))}
        placeholder="0"
        style={{ ...INPUT_BASE, textAlign: "center", fontWeight: 700, fontSize: 16, padding: "8px" }}
      />
    </div>
  );
}

/* ── Summary row ────────────────────────────────────────────────────────── */
function SummaryRow({
  label, value, valueColor, size = "md",
}: {
  label: string; value: string; valueColor?: string; size?: "sm" | "md" | "lg";
}) {
  const sz = size === "lg" ? 18 : size === "md" ? 14 : 12;
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      padding: "4px 0",
    }}>
      <span style={{ fontSize: 12, color: D.sub, fontFamily: "var(--font-body, inherit)" }}>
        {label}
      </span>
      <span style={{
        fontSize: sz,
        fontWeight: size === "lg" ? 800 : 700,
        color: valueColor ?? D.text,
        fontFamily: "var(--font-display, inherit)",
      }}>
        {value}
      </span>
    </div>
  );
}

/* ══ Main Component ══════════════════════════════════════════════════════ */
export default function BookingModal({
  onClose, onSave, settings, bookings, session,
}: any) {
  const nextId = genId();
  const [bookedByOther, setBBO] = useState(false);
  const [roomSlots, setRoomSlots] = useState([{ roomType: "Family", roomId: "FR-01" }]);
  const [f, setF] = useState({
    id: nextId, guestName: "", phone: "", checkIn: "", checkOut: "",
    adults: "", kidsFree: "", kidsHalf: "", kidsFull: "",
    vegCount: "", nonVegCount: "",
    bookedBy: session.name, rateType: "perHead",
    ratePerHead: settings.familyRate, ratePerRoom: "",
    packages: [...(settings.packages || [])], notes: "", status: "Confirmed",
    createdAt: new Date().toISOString(),
    payments: { advance: {}, fullStay: {}, extras: {} },
  });
  const [err, setErr] = useState("");
  const upd = (k: string, v: any) => setF(p => ({ ...p, [k]: v }));

  const n = nights(f.checkIn, f.checkOut);
  const adults = Number(f.adults || 0);
  const kidsFree = Number(f.kidsFree || 0);
  const kidsHalf = Number(f.kidsHalf || 0);
  const kidsFull = Number(f.kidsFull || 0);
  const totalGuests = adults + kidsFree + kidsHalf + kidsFull;
  const billablePax = adults + kidsFull + kidsHalf * 0.5;
  const total = f.rateType === "perHead"
    ? Math.round(billablePax * Number(f.ratePerHead || 0) * n)
    : Number(f.ratePerRoom || 0) * roomSlots.length * n;
  const advanceAmount = Math.round(total * (settings.advancePct || 30) / 100);

  const getAvail = useCallback((type: string, idx: number) => {
    const otherIds = roomSlots.filter((_, i) => i !== idx).map(s => s.roomId);
    return ROOMS.filter(r =>
      r.type === type &&
      !otherIds.includes(r.id) &&
      !bookings.some((b: any) =>
        getRoomIds(b).includes(r.id) &&
        b.status !== "Cancelled" && b.status !== "Checked Out" &&
        b.checkIn < f.checkOut && b.checkOut > f.checkIn &&
        f.checkIn && f.checkOut)
    );
  }, [roomSlots, bookings, f.checkIn, f.checkOut]);

  useEffect(() => {
    if (!f.checkIn || !f.checkOut) return;
    setRoomSlots(slots => {
      let changed = false;
      const newSlots = slots.map((slot, i) => {
        const otherIds = slots.filter((_, j) => j !== i).map(s => s.roomId);
        const avail = ROOMS.filter(r =>
          r.type === slot.roomType &&
          !otherIds.includes(r.id) &&
          !bookings.some((b: any) =>
            getRoomIds(b).includes(r.id) &&
            b.status !== "Cancelled" && b.status !== "Checked Out" &&
            b.checkIn < f.checkOut && b.checkOut > f.checkIn)
        );
        if (avail.length > 0 && !avail.some(a => a.id === slot.roomId)) {
          changed = true;
          return { ...slot, roomId: avail[0].id };
        }
        return slot;
      });
      return changed ? newSlots : slots;
    });
  }, [f.checkIn, f.checkOut, bookings]);

  const vegWarn = (Number(f.vegCount || 0) + Number(f.nonVegCount || 0)) > totalGuests && totalGuests > 0
    ? "Veg + Non-Veg count exceeds total guests" : "";
  const pastWarn = f.checkIn && f.checkIn < todayStr
    ? "Check-in date is in the past — verify this is correct" : "";

  const addRoom = () => setRoomSlots(s => [...s, { roomType: "Family", roomId: "FR-01" }]);
  const removeRoom = (i: number) => setRoomSlots(s => s.filter((_, j) => j !== i));
  const updateSlot = (i: number, key: string, val: string) =>
    setRoomSlots(s => s.map((sl, j) => j === i ? { ...sl, [key]: val } : sl));

  const submit = () => {
    if (!f.guestName.trim()) return setErr("Guest name is required.");
    if (!f.phone.trim() || f.phone.replace(/\D/g, "").length < 10) return setErr("Enter a valid 10-digit phone number.");
    if (!f.checkIn || !f.checkOut) return setErr("Both check-in and check-out dates are required.");
    if (n <= 0) return setErr("Check-out must be after check-in.");
    if (n > 30) return setErr("Duration cannot exceed 30 nights.");
    if (adults < 1) return setErr("At least 1 adult is required.");
    if (f.rateType === "perHead" && (!f.ratePerHead || Number(f.ratePerHead) < 1)) return setErr("Enter a valid rate per head.");
    if (f.rateType === "perRoom" && (!f.ratePerRoom || Number(f.ratePerRoom) < 1)) return setErr("Enter a valid rate per room.");
    if ((Number(f.vegCount || 0) + Number(f.nonVegCount || 0)) > totalGuests) return setErr("Veg + Non-Veg count cannot exceed total guests.");
    const conflicts: string[] = [];
    roomSlots.forEach(slot => {
      const c = bookings.find((b: any) =>
        getRoomIds(b).includes(slot.roomId) &&
        b.status !== "Cancelled" && b.status !== "Checked Out" &&
        b.checkIn < f.checkOut && b.checkOut > f.checkIn);
      if (c) conflicts.push(`${slot.roomId} is booked by ${c.guestName} (${fmtDate(c.checkIn)} – ${fmtDate(c.checkOut)})`);
    });
    if (conflicts.length) return setErr(`Room conflict:\n${conflicts.join("\n")}`);
    const roomIds = roomSlots.map(s => s.roomId);
    onSave({
      ...f, guests: totalGuests, adults, kidsFree, kidsHalf, kidsFull,
      roomId: roomIds[0], roomIds, roomSlots, roomType: roomSlots[0].roomType, total, advanceAmount,
    });
  };

  return (
    <ModalWrap title="New Booking" onClose={onClose}>

      {/* ── Error banner ─────────────────────────────────────────────── */}
      {err && (
        <div style={{
          display: "flex", gap: 10, alignItems: "flex-start",
          background: "rgba(212,97,74,0.1)",
          border: `1px solid ${D.dangerBorder}`,
          color: D.danger,
          borderRadius: 10,
          padding: "12px 14px",
          marginBottom: 16,
          whiteSpace: "pre-line",
        }}>
          <AlertCircle size={16} style={{ marginTop: 1, flexShrink: 0 }} />
          <span style={{ fontSize: 13, lineHeight: 1.5 }}>{err}</span>
        </div>
      )}

      {/* ── Warning banner ───────────────────────────────────────────── */}
      {(vegWarn || pastWarn) && !err && (
        <div style={{
          background: "rgba(251,191,36,0.08)",
          border: "1px solid rgba(251,191,36,0.25)",
          color: D.warning,
          borderRadius: 10,
          padding: "10px 14px",
          marginBottom: 14,
          fontSize: 13,
          lineHeight: 1.6,
        }}>
          {pastWarn && <div>⚠ {pastWarn}</div>}
          {vegWarn && <div>⚠ {vegWarn}</div>}
        </div>
      )}

      {/* ── SECTION: Guest Details ───────────────────────────────────── */}
      <SectionHeader title="Guest Details" icon="👤" />
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 12,
      }}>
        <Field label="Guest Name *">
          <input
            value={f.guestName}
            onChange={e => { upd("guestName", e.target.value); setErr(""); }}
            style={INPUT_BASE}
            placeholder="Full name"
          />
        </Field>
        <Field label="Phone *">
          <input
            value={f.phone}
            onChange={e => { upd("phone", e.target.value); setErr(""); }}
            style={INPUT_BASE}
            placeholder="+91 XXXXX XXXXX"
          />
        </Field>
        <Field label="Check-In *">
          <input
            type="date"
            value={f.checkIn}
            onChange={e => { upd("checkIn", e.target.value); setErr(""); }}
            style={DATE_INPUT}
          />
        </Field>
        <Field label="Check-Out *">
          <input
            type="date"
            value={f.checkOut}
            onChange={e => { upd("checkOut", e.target.value); setErr(""); }}
            style={DATE_INPUT}
          />
        </Field>
      </div>

      {/* ── SECTION: Room Assignment ─────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "18px 0 12px", paddingBottom: 8, borderBottom: `1px solid ${D.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14 }}>🛏</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: D.sub, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
            Room Assignment
          </span>
        </div>
        <button onClick={addRoom} style={btn("success", "sm")}>
          <Plus size={11} /> Add Room
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
        {roomSlots.map((slot, i) => {
          const avail = getAvail(slot.roomType, i);
          return (
            <div key={i} style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr auto",
              gap: 10,
              background: D.surface,
              padding: 12,
              borderRadius: 10,
              border: `1.5px solid ${D.border}`,
              alignItems: "end",
            }}>
              <Field label="Type">
                <Select
                  value={slot.roomType}
                  onChange={t => {
                    updateSlot(i, "roomType", t);
                    updateSlot(i, "roomId", ROOMS.find(r => r.type === t)?.id || (t === "Family" ? "FR-01" : "CR-01"));
                    if (i === 0) upd("ratePerHead", t === "Family" ? settings.familyRate : settings.coupleRate);
                    setErr("");
                  }}
                >
                  <option value="Family">Family (3+ sharing)</option>
                  <option value="Couple">Couple (2 sharing)</option>
                </Select>
              </Field>

              <Field label="Room">
                <Select
                  value={slot.roomId}
                  onChange={v => { updateSlot(i, "roomId", v); setErr(""); }}
                >
                  {avail.map(r => <option key={r.id} value={r.id}>{r.id}</option>)}
                  {avail.length === 0 && <option>None available</option>}
                </Select>
                {avail.length === 0 && f.checkIn && f.checkOut && (
                  <div style={{ fontSize: 10, color: D.danger, marginTop: 3 }}>
                    All {slot.roomType} rooms booked
                  </div>
                )}
              </Field>

              <div style={{ paddingBottom: 0 }}>
                {roomSlots.length > 1 && (
                  <button
                    onClick={() => removeRoom(i)}
                    title="Remove room"
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      width: 36, height: 40,
                      background: "rgba(212,97,74,0.1)",
                      border: `1px solid rgba(212,97,74,0.3)`,
                      borderRadius: 8, cursor: "pointer", color: D.danger,
                    }}
                  >
                    <XCircle size={15} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── SECTION: Guest Headcount ─────────────────────────────────── */}
      <SectionHeader title="Guest Headcount" icon="👥" />
      <div style={{
        background: D.surface,
        border: `1.5px solid ${D.border}`,
        borderRadius: 10,
        padding: 14,
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
          gap: 10,
        }}>
          <PaxField
            label="Adults *"
            badge="Full"
            badgeColor={D.danger}
            value={f.adults}
            onChange={v => { upd("adults", v); setErr(""); }}
          />
          <PaxField
            label="Kids under 5"
            badge="Free"
            badgeColor={D.success}
            value={f.kidsFree}
            onChange={v => upd("kidsFree", v)}
          />
          <PaxField
            label="Kids 5–9 yrs"
            badge="Half"
            badgeColor={D.warning}
            value={f.kidsHalf}
            onChange={v => upd("kidsHalf", v)}
          />
          <PaxField
            label="Kids 10+ yrs"
            badge="Full"
            badgeColor={D.danger}
            value={f.kidsFull}
            onChange={v => upd("kidsFull", v)}
          />
        </div>

        {totalGuests > 0 && (
          <div style={{
            display: "flex", justifyContent: "space-between",
            marginTop: 12, paddingTop: 10,
            borderTop: `1px solid ${D.border}`,
            fontSize: 13,
          }}>
            <span style={{ color: D.sub }}>Total headcount</span>
            <span style={{ fontWeight: 800, color: D.text, fontSize: 15 }}>
              {totalGuests} <span style={{ fontSize: 11, color: D.sub, fontWeight: 400 }}>pax</span>
            </span>
          </div>
        )}
      </div>

      {/* ── SECTION: Rate & Meals ────────────────────────────────────── */}
      <SectionHeader title="Rate & Meals" icon="💰" />
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 12,
      }}>
        <div>
          <label style={FIELD_LABEL}>Rate Type</label>
          <RateToggle value={f.rateType} onChange={v => upd("rateType", v)} />
          <div style={{ marginTop: 8 }}>
            <label style={FIELD_LABEL}>
              {f.rateType === "perHead" ? "₹ per head per night" : "₹ per room per night"}
            </label>
            <input
              type="number"
              value={f.rateType === "perHead" ? f.ratePerHead : f.ratePerRoom}
              onChange={e => upd(f.rateType === "perHead" ? "ratePerHead" : "ratePerRoom", e.target.value)}
              style={INPUT_BASE}
              placeholder="Enter amount"
            />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
          <Field label="Veg Count" hint="Vegetarian meals">
            <input
              type="text" inputMode="numeric"
              value={f.vegCount}
              onChange={e => upd("vegCount", e.target.value.replace(/[^0-9]/g, ""))}
              style={INPUT_BASE} placeholder="0"
            />
          </Field>
          <Field label="Non-Veg Count" hint="Non-vegetarian meals">
            <input
              type="text" inputMode="numeric"
              value={f.nonVegCount}
              onChange={e => upd("nonVegCount", e.target.value.replace(/[^0-9]/g, ""))}
              style={INPUT_BASE} placeholder="0"
            />
          </Field>
        </div>
      </div>

      {/* ── SECTION: Booking Details ─────────────────────────────────── */}
      <SectionHeader title="Booking Details" icon="📋" />

      {/* Booked by */}
      <Field label="Booking Taken By">
        <Select
          value={bookedByOther ? "__other__" : f.bookedBy}
          onChange={v => {
            if (v === "__other__") { setBBO(true); upd("bookedBy", ""); }
            else { setBBO(false); upd("bookedBy", v); }
          }}
        >
          {(settings.staffList || ["Agnish", "Deekshith", "Mahindra"]).map((s: string) => (
            <option key={s} value={s}>{s}</option>
          ))}
          <option value="Booking Agent">Booking Agent</option>
          <option value="__other__">Other…</option>
        </Select>
        {bookedByOther && (
          <input
            value={f.bookedBy}
            onChange={e => upd("bookedBy", e.target.value)}
            style={{ ...INPUT_BASE, marginTop: 8 }}
            placeholder="Enter name"
            autoFocus
          />
        )}
      </Field>

      {/* Packages */}
      {(settings.packages || []).length > 0 && (
        <div style={{ marginTop: 14 }}>
          <label style={FIELD_LABEL}>Package Inclusions</label>
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8, marginTop: 6 }}>
            {(settings.packages || []).map((pkg: string) => {
              const active = f.packages.includes(pkg);
              return (
                <label key={pkg} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  cursor: "pointer",
                  fontSize: 13, fontWeight: 600,
                  color: active ? D.gold : D.sub,
                  background: active ? D.goldDim : D.surface,
                  border: `1.5px solid ${active ? D.goldBorder : D.border}`,
                  padding: "6px 12px",
                  borderRadius: 20,
                  transition: "all 0.15s ease",
                  userSelect: "none" as const,
                }}>
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={e => upd("packages", e.target.checked
                      ? [...f.packages, pkg]
                      : f.packages.filter((p: string) => p !== pkg)
                    )}
                    style={{ accentColor: D.gold, width: 13, height: 13 }}
                  />
                  {pkg}
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Notes */}
      <div style={{ marginTop: 14 }}>
        <label style={FIELD_LABEL}>Notes / Special Requests</label>
        <textarea
          value={f.notes}
          onChange={e => upd("notes", e.target.value)}
          style={{ ...INPUT_BASE, height: 72, resize: "vertical" as const, lineHeight: 1.6 }}
          placeholder="Arrival time, dietary needs, special requests…"
        />
      </div>

      {/* ── SECTION: Booking Summary ─────────────────────────────────── */}
      {n > 0 && adults > 0 && (
        <>
          <SectionHeader title="Booking Summary" icon="🧾" />
          <div style={{
            background: "rgba(91,173,122,0.06)",
            border: `1.5px solid ${D.successBorder}`,
            borderRadius: 12,
            padding: "14px 16px",
          }}>
            {/* Calculation note */}
            <div style={{
              fontSize: 12,
              color: D.sub,
              marginBottom: 10,
              padding: "6px 10px",
              background: D.surface,
              borderRadius: 6,
              lineHeight: 1.6,
            }}>
              {f.rateType === "perHead"
                ? `${n} night${n !== 1 ? "s" : ""} × ${adults} adult${adults !== 1 ? "s" : ""}${kidsHalf > 0 ? ` + ${kidsHalf} half-rate` : ""}${kidsFull > 0 ? ` + ${kidsFull} full-rate` : ""} × ₹${f.ratePerHead}/head`
                : `${n} night${n !== 1 ? "s" : ""} × ${roomSlots.length} room${roomSlots.length !== 1 ? "s" : ""} × ₹${f.ratePerRoom}/room`
              }
            </div>

            <SummaryRow
              label="Total stay amount"
              value={`₹${total.toLocaleString("en-IN")}`}
              valueColor={D.gold}
              size="lg"
            />
            <div style={{ height: 1, background: D.border, margin: "8px 0" }} />
            <SummaryRow
              label={`Advance (${settings.advancePct}%)`}
              value={`₹${advanceAmount.toLocaleString("en-IN")}`}
              valueColor={D.success}
            />
            <SummaryRow
              label="Balance at check-in"
              value={`₹${(total - advanceAmount).toLocaleString("en-IN")}`}
              valueColor={D.warning}
            />
          </div>
        </>
      )}

      {/* ── Action buttons ───────────────────────────────────────────── */}
      <div style={{
        display: "flex",
        gap: 10,
        marginTop: 20,
        paddingTop: 16,
        borderTop: `1px solid ${D.border}`,
      }}>
        <button
          onClick={submit}
          style={{
            flex: 1,
            padding: "12px 20px",
            fontSize: 15,
            fontWeight: 800,
            fontFamily: "var(--font-body, inherit)",
            background: `linear-gradient(135deg, ${D.gold}, ${D.gold}CC)`,
            color: "#0F172A",
            border: `1px solid ${D.goldBorder}`,
            borderRadius: 10,
            cursor: "pointer",
            letterSpacing: "0.02em",
            transition: "opacity 0.15s ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          Save Booking
        </button>
        <button
          onClick={onClose}
          style={{
            padding: "12px 20px",
            fontSize: 14,
            fontWeight: 700,
            fontFamily: "var(--font-body, inherit)",
            background: "transparent",
            color: D.sub,
            border: `1.5px solid ${D.border}`,
            borderRadius: 10,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>

    </ModalWrap>
  );
}