// "use client";
// import { useState } from "react";
// import { Plus, XCircle } from "lucide-react";
// import { D } from "../lib/constants";
// import { sec, inp, lbl, crd, ctit, btn } from "../lib/ui";

// export default function SettingsPanel({settings,setSettings,notify,exportCSV}:any) {
//   const [s,setS]       = useState(settings);
//   const [newPkg,setNewPkg]   = useState("");
//   const [newStaff,setNewStaff] = useState("");
//   const save = () => { setSettings(s); notify("Settings saved!"); };

//   return (
//     <div>
//       <h2 style={sec}>Settings</h2>
//       <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14}}>

//         {/* Staff List */}
//         <div style={crd}>
//           <div style={ctit}>Staff List</div>
//           <div style={{fontSize:11,color:D.sub,marginBottom:10}}>Names shown in payment & booking dropdowns.</div>
//           {(s.staffList||[]).map((st:string,i:number)=>(
//             <div key={i} style={{display:"flex",gap:6,marginBottom:6}}>
//               <input value={st} onChange={e=>setS((p:any)=>({...p,staffList:p.staffList.map((x:string,j:number)=>j===i?e.target.value:x)}))} style={{...inp,flex:1,fontSize:12}}/>
//               <button onClick={()=>setS((p:any)=>({...p,staffList:p.staffList.filter((_:any,j:number)=>j!==i)}))} style={btn("danger","sm")}><XCircle size={10}/></button>
//             </div>
//           ))}
//           <div style={{display:"flex",gap:6,marginTop:8}}>
//             <input value={newStaff} onChange={e=>setNewStaff(e.target.value)} placeholder="Add staff name…" style={{...inp,flex:1,fontSize:12}}/>
//             <button onClick={()=>{if(newStaff.trim()){setS((p:any)=>({...p,staffList:[...(p.staffList||[]),newStaff.trim()]}));setNewStaff("");}}} style={btn("success","sm")}><Plus size={10}/></button>
//           </div>
//         </div>

//         {/* Package Inclusions */}
//         <div style={crd}>
//           <div style={ctit}>Package Inclusions</div>
//           <div style={{fontSize:11,color:D.sub,marginBottom:10}}>Shown as checkboxes in new booking form.</div>
//           {(s.packages||[]).map((pkg:string,i:number)=>(
//             <div key={i} style={{display:"flex",gap:6,marginBottom:6}}>
//               <input value={pkg} onChange={e=>setS((p:any)=>({...p,packages:p.packages.map((x:string,j:number)=>j===i?e.target.value:x)}))} style={{...inp,flex:1,fontSize:12}}/>
//               <button onClick={()=>setS((p:any)=>({...p,packages:p.packages.filter((_:any,j:number)=>j!==i)}))} style={btn("danger","sm")}><XCircle size={10}/></button>
//             </div>
//           ))}
//           <div style={{display:"flex",gap:6,marginTop:8}}>
//             <input value={newPkg} onChange={e=>setNewPkg(e.target.value)} placeholder="Add inclusion…" style={{...inp,flex:1,fontSize:12}}/>
//             <button onClick={()=>{if(newPkg.trim()){setS((p:any)=>({...p,packages:[...(p.packages||[]),newPkg.trim()]}));setNewPkg("");}}} style={btn("success","sm")}><Plus size={10}/></button>
//           </div>
//         </div>

//         {/* Operational Notes */}
//         <div style={crd}>
//           <div style={ctit}>Operational Notes</div>
//           <div style={{fontSize:11,color:D.sub,marginBottom:10}}>Internal notes — pool closures, events, maintenance etc.</div>
//           <textarea value={s.operationalNotes||""} onChange={e=>setS((p:any)=>({...p,operationalNotes:e.target.value}))}
//             style={{...inp,height:120,resize:"vertical",fontSize:12}} placeholder="e.g. Pool closed for maintenance until 25 May…"/>
//         </div>

//         {/* Config (advance %, check-in/out times, payment details for templates) */}
//         <div style={crd}>
//           <div style={ctit}>Config & Template Data</div>
//           <div style={lbl}>Advance Required (%)</div>
//           <input type="number" value={s.advancePct} onChange={e=>setS((p:any)=>({...p,advancePct:Number(e.target.value)}))} style={inp}/>
//           <div style={lbl}>Check-In Time</div>
//           <input value={s.checkInTime} onChange={e=>setS((p:any)=>({...p,checkInTime:e.target.value}))} style={inp}/>
//           <div style={lbl}>Check-Out Time</div>
//           <input value={s.checkOutTime} onChange={e=>setS((p:any)=>({...p,checkOutTime:e.target.value}))} style={inp}/>
//           <div style={lbl}>UPI ID (for WA template)</div>
//           <input value={s.upi||""} onChange={e=>setS((p:any)=>({...p,upi:e.target.value}))} style={inp}/>
//           <div style={lbl}>Bank Account (for invoice)</div>
//           <input value={s.accNo||""} onChange={e=>setS((p:any)=>({...p,accNo:e.target.value}))} style={inp}/>
//         </div>

//       </div>
//       <div style={{display:"flex",gap:10,marginTop:18,flexWrap:"wrap"}}>
//         <button onClick={save} style={btn("primary","md")}>Save Settings</button>
//         <button onClick={exportCSV} style={btn("blue","md")}>Export CSV</button>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { Plus, X, Save, Download, Settings as SettingsIcon } from "lucide-react";

/* ─── Shared input style ─────────────────────────────────────────────────── */
const inputStyle: React.CSSProperties = {
  display: "block", width: "100%", padding: "9px 12px",
  fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
  background: "var(--card-deep)", color: "var(--text)",
  border: "1px solid var(--border)", borderRadius: "var(--radius-md)",
  outline: "none", transition: "border-color var(--ease)",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
  fontWeight: 700, color: "var(--text-muted)",
  textTransform: "uppercase" as const, letterSpacing: "0.08em",
  marginBottom: 5,
};

/* ─── Section card ───────────────────────────────────────────────────────── */
function SectionCard({ title, icon, children }: {
  title: string; icon: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div style={{
      background: "var(--card)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "14px 18px",
        borderBottom: "1px solid var(--border-light)",
        background: "var(--card-deep)",
      }}>
        <div style={{ width: 3, height: 16, background: "var(--gold)", borderRadius: 2, flexShrink: 0 }}/>
        <span style={{ color: "var(--gold)", display: "flex", alignItems: "center" }}>{icon}</span>
        <span style={{
          fontFamily: "var(--font-display)", fontSize: "var(--text-lg)",
          fontWeight: 600, color: "var(--text)",
        }}>{title}</span>
      </div>
      <div style={{ padding: "16px 18px" }}>{children}</div>
    </div>
  );
}

/* ─── Tag-style list item (staff / package) ──────────────────────────────── */
function TagItem({ value, onChange, onRemove, disabled }: {
  value: string; onChange: (v: string) => void; onRemove: () => void; disabled?: boolean;
}) {
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
      <input value={value} onChange={e => onChange(e.target.value)}
        style={inputStyle}
        onFocus={e => (e.target as HTMLElement).style.borderColor = "var(--gold)"}
        onBlur={e => (e.target as HTMLElement).style.borderColor = "var(--border)"}
      />
      <button onClick={onRemove} style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 36, height: 36, flexShrink: 0,
        background: "rgba(212,97,74,0.10)", border: "1px solid rgba(212,97,74,0.35)",
        borderRadius: "var(--radius-md)", color: "var(--danger)",
        cursor: "pointer", transition: "background var(--ease)",
      }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(212,97,74,0.20)"}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(212,97,74,0.10)"}
      >
        <X size={12}/>
      </button>
    </div>
  );
}

/* ─── Add-row (input + add button) ─────────────────────────────────────── */
function AddRow({ value, onChange, onAdd, placeholder }: {
  value: string; onChange: (v: string) => void;
  onAdd: () => void; placeholder: string;
}) {
  return (
    <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
      <input value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
        onKeyDown={e => e.key === "Enter" && onAdd()}
        onFocus={e => (e.target as HTMLElement).style.borderColor = "var(--gold)"}
        onBlur={e => (e.target as HTMLElement).style.borderColor = "var(--border)"}
      />
      <button onClick={onAdd} style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 36, height: 36, flexShrink: 0,
        background: "rgba(91,173,122,0.12)", border: "1px solid rgba(91,173,122,0.35)",
        borderRadius: "var(--radius-md)", color: "var(--success)",
        cursor: "pointer", transition: "background var(--ease)",
      }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(91,173,122,0.22)"}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(91,173,122,0.12)"}
      >
        <Plus size={14}/>
      </button>
    </div>
  );
}

/* ─── Field row (label + input) ─────────────────────────────────────────── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={labelStyle}>{label}</div>
      {children}
    </div>
  );
}

/* ─── SettingsPanel ──────────────────────────────────────────────────────── */
export default function SettingsPanel({ settings, setSettings, notify, exportCSV }: any) {
  const [s, setS]           = useState(settings);
  const [newPkg, setNewPkg]     = useState("");
  const [newStaff, setNewStaff] = useState("");

  const save = () => { setSettings(s); notify("Settings saved!"); };

  const focusGold   = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.target as HTMLElement).style.borderColor = "var(--gold)";
  const blurDefault = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.target as HTMLElement).style.borderColor = "var(--border)";

  return (
    <div>
      {/* ── Page header ────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{
          fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)",
          fontWeight: 700, color: "var(--text)", margin: 0, letterSpacing: "0.01em",
        }}>Settings</h1>
        <div style={{
          fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
          color: "var(--text-muted)", marginTop: 4,
        }}>Property configuration &amp; defaults</div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 14, marginBottom: 20,
      }}>

        {/* Staff List */}
        <SectionCard title="Staff List" icon={<span style={{ fontSize: 14 }}>👤</span>}>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
            color: "var(--text-muted)", margin: "0 0 12px 0", lineHeight: 1.6,
          }}>
            Names shown in payment &amp; booking dropdowns.
          </p>
          {(s.staffList || []).map((st: string, i: number) => (
            <TagItem key={i} value={st}
              onChange={v => setS((p: any) => ({
                ...p, staffList: p.staffList.map((x: string, j: number) => j === i ? v : x),
              }))}
              onRemove={() => setS((p: any) => ({
                ...p, staffList: p.staffList.filter((_: any, j: number) => j !== i),
              }))}
            />
          ))}
          <AddRow value={newStaff} onChange={setNewStaff} placeholder="Add staff name…"
            onAdd={() => {
              if (newStaff.trim()) {
                setS((p: any) => ({ ...p, staffList: [...(p.staffList || []), newStaff.trim()] }));
                setNewStaff("");
              }
            }}
          />
        </SectionCard>

        {/* Package Inclusions */}
        <SectionCard title="Package Inclusions" icon={<span style={{ fontSize: 14 }}>📦</span>}>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
            color: "var(--text-muted)", margin: "0 0 12px 0", lineHeight: 1.6,
          }}>
            Shown as checkboxes in the new booking form.
          </p>
          {(s.packages || []).map((pkg: string, i: number) => (
            <TagItem key={i} value={pkg}
              onChange={v => setS((p: any) => ({
                ...p, packages: p.packages.map((x: string, j: number) => j === i ? v : x),
              }))}
              onRemove={() => setS((p: any) => ({
                ...p, packages: p.packages.filter((_: any, j: number) => j !== i),
              }))}
            />
          ))}
          <AddRow value={newPkg} onChange={setNewPkg} placeholder="Add inclusion…"
            onAdd={() => {
              if (newPkg.trim()) {
                setS((p: any) => ({ ...p, packages: [...(p.packages || []), newPkg.trim()] }));
                setNewPkg("");
              }
            }}
          />
        </SectionCard>

        {/* Operational Notes */}
        <SectionCard title="Operational Notes" icon={<span style={{ fontSize: 14 }}>📋</span>}>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
            color: "var(--text-muted)", margin: "0 0 12px 0", lineHeight: 1.6,
          }}>
            Internal notes — pool closures, events, maintenance etc.
          </p>
          <textarea
            value={s.operationalNotes || ""}
            onChange={e => setS((p: any) => ({ ...p, operationalNotes: e.target.value }))}
            placeholder="e.g. Pool closed for maintenance until 25 May…"
            onFocus={focusGold} onBlur={blurDefault}
            style={{
              ...inputStyle, height: 120, resize: "vertical",
              fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
              lineHeight: 1.6,
            }}
          />
        </SectionCard>

        {/* Config */}
        <SectionCard title="Config & Templates" icon={<SettingsIcon size={14}/>}>
          <Field label="Advance Required (%)">
            <input type="number" value={s.advancePct}
              onChange={e => setS((p: any) => ({ ...p, advancePct: Number(e.target.value) }))}
              style={inputStyle} onFocus={focusGold} onBlur={blurDefault}/>
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Check-In Time">
              <input value={s.checkInTime}
                onChange={e => setS((p: any) => ({ ...p, checkInTime: e.target.value }))}
                style={inputStyle} onFocus={focusGold} onBlur={blurDefault}/>
            </Field>
            <Field label="Check-Out Time">
              <input value={s.checkOutTime}
                onChange={e => setS((p: any) => ({ ...p, checkOutTime: e.target.value }))}
                style={inputStyle} onFocus={focusGold} onBlur={blurDefault}/>
            </Field>
          </div>
          <Field label="UPI ID (for WhatsApp template)">
            <input value={s.upi || ""}
              onChange={e => setS((p: any) => ({ ...p, upi: e.target.value }))}
              style={inputStyle} placeholder="yourname@upi"
              onFocus={focusGold} onBlur={blurDefault}/>
          </Field>
          <Field label="Bank Account (for Invoice)">
            <input value={s.accNo || ""}
              onChange={e => setS((p: any) => ({ ...p, accNo: e.target.value }))}
              style={inputStyle} placeholder="Account number"
              onFocus={focusGold} onBlur={blurDefault}/>
          </Field>
          <Field label="GSTIN (for GST Bills)">
            <input value={s.gstin || ""}
              onChange={e => setS((p: any) => ({ ...p, gstin: e.target.value }))}
              style={inputStyle} placeholder="GSTIN Number"
              onFocus={focusGold} onBlur={blurDefault}/>
          </Field>
        </SectionCard>

      </div>

      {/* ── Action buttons ─────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button onClick={save} style={{
          display: "flex", alignItems: "center", gap: 7,
          padding: "10px 22px",
          background: "linear-gradient(135deg, #C8963E, #A87830)",
          border: "1px solid rgba(200,150,62,0.5)",
          borderRadius: "var(--radius-md)",
          color: "#0B1A0D", fontFamily: "var(--font-body)",
          fontSize: "var(--text-sm)", fontWeight: 800, cursor: "pointer",
          transition: "opacity var(--ease)",
        }}>
          <Save size={13}/> Save Settings
        </button>
        <button onClick={exportCSV} style={{
          display: "flex", alignItems: "center", gap: 7,
          padding: "10px 22px",
          background: "rgba(74,154,191,0.10)", border: "1px solid rgba(74,154,191,0.35)",
          borderRadius: "var(--radius-md)",
          color: "var(--info)", fontFamily: "var(--font-body)",
          fontSize: "var(--text-sm)", fontWeight: 700, cursor: "pointer",
          transition: "background var(--ease)",
        }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(74,154,191,0.20)"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(74,154,191,0.10)"}
        >
          <Download size={13}/> Export CSV
        </button>
      </div>
    </div>
  );
}