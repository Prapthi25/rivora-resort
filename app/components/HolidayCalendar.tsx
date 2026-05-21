// "use client";
// import { useState } from "react";
// import { D, HOLIDAYS } from "../lib/constants";
// import { sec, crd, ctit, btn, inp, lbl } from "../lib/ui";
// import { todayStr, fmtDate, getHol, isWknd } from "../lib/helpers";

// export default function HolidayCalendar({settings,setSettings,notify,can}:any) {
//   const [month,setMonth] = useState(new Date(new Date().getFullYear(),new Date().getMonth(),1));
//   const [sel,setSel]     = useState<string|null>(null);
//   const cp = settings.customPrices||{};

//   const daysInMonth = new Date(month.getFullYear(),month.getMonth()+1,0).getDate();
//   const firstDay    = new Date(month.getFullYear(),month.getMonth(),1).getDay();
//   const days        = Array.from({length:daysInMonth},(_,i)=>new Date(month.getFullYear(),month.getMonth(),i+1).toISOString().split("T")[0]);

//   const setCustom = (d:string,v:string) => {
//     const u={...cp}; if(v==="") delete u[d]; else u[d]=Number(v);
//     setSettings((s:any)=>({...s,customPrices:u})); if(v) notify(`Custom rate ₹${v} set`);
//   };

//   return (
//     <div>
//       <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
//         <h2 style={sec}>Holiday Calendar</h2>
//         <div style={{display:"flex",gap:8,alignItems:"center"}}>
//           <button onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()-1,1))} style={btn("ghost","sm")}>◀</button>
//           <span style={{color:D.text,fontSize:13,fontWeight:"600",minWidth:140,textAlign:"center"}}>
//             {month.toLocaleDateString("en-IN",{month:"long",year:"numeric"})}
//           </span>
//           <button onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()+1,1))} style={btn("ghost","sm")}>▶</button>
//         </div>
//       </div>
//       <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:8}}>
//         {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d=>(
//           <div key={d} style={{textAlign:"center",color:D.sub,fontSize:10,padding:"4px 0",fontWeight:"600"}}>{d}</div>
//         ))}
//         {Array(firstDay).fill(null).map((_,i)=><div key={"e"+i}/>)}
//         {days.map(d=>{
//           const hol=getHol(d),wknd=isWknd(d),custom=cp[d],isToday=d===todayStr,isSel=sel===d;
//           return (
//             <div key={d} onClick={()=>setSel(isSel?null:d)}
//               style={{background:isSel?D.goldDim:hol?D.warningDim:wknd?D.blueDim:isToday?D.successDim:D.card,
//                 border:`1px solid ${isSel?D.goldBorder:isToday?D.successBorder:D.border}`,
//                 borderRadius:10,padding:"7px 5px",cursor:"pointer",minHeight:54}}>
//               <div style={{fontSize:12,fontWeight:"700",color:hol?D.warning:wknd?D.blue:isToday?D.success:D.text}}>
//                 {new Date(d).getDate()}
//               </div>
//               {isToday&&<div style={{fontSize:7,color:D.success,fontWeight:"700"}}>TODAY</div>}
//               {hol&&<div style={{fontSize:7,color:D.warning,lineHeight:1.3,marginTop:1}}>{hol.name.split(" ").slice(0,2).join(" ")}</div>}
//               {custom&&<div style={{fontSize:8,color:D.gold,fontWeight:"700",marginTop:1}}>₹{custom}</div>}
//             </div>
//           );
//         })}
//       </div>
//       {sel&&can.admin&&(
//         <div style={{...crd,border:`1px solid ${D.goldBorder}`,marginBottom:14}}>
//           <div style={ctit}>Custom Rate — {fmtDate(sel)}{getHol(sel)?` · ${getHol(sel)!.name}`:isWknd(sel)?" · Weekend":""}</div>
//           <div style={{display:"flex",gap:10,alignItems:"flex-end",flexWrap:"wrap"}}>
//             <div style={{flex:1,minWidth:160}}>
//               <div style={lbl}>Rate per head per night (₹)</div>
//               <input type="number" key={sel} defaultValue={cp[sel]||""} onBlur={e=>setCustom(sel,e.target.value)}
//                 style={inp} placeholder={`₹${settings.familyRate||2000}`}/>
//             </div>
//             {cp[sel]&&<button onClick={()=>setCustom(sel,"")} style={btn("danger","sm")}>Clear</button>}
//           </div>
//         </div>
//       )}
//       <div style={crd}>
//         <div style={ctit}>Upcoming Holidays</div>
//         <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:8}}>
//           {HOLIDAYS.filter(h=>h.date>=todayStr).slice(0,12).map(h=>(
//             <div key={h.date} style={{background:D.surface,border:`1px solid ${D.border}`,borderRadius:10,padding:"8px 12px"}}>
//               <div style={{color:D.warning,fontSize:10,fontWeight:"700"}}>{fmtDate(h.date)}</div>
//               <div style={{color:D.text,fontSize:12,marginTop:2}}>{h.name}</div>
//               {cp[h.date]&&<div style={{color:D.gold,fontSize:10,marginTop:3,fontWeight:"600"}}>₹{cp[h.date]}/head</div>}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { HOLIDAYS } from "../lib/constants";
import { todayStr, fmtDate, getHol, isWknd } from "../lib/helpers";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

/* ─── Shared input ───────────────────────────────────────────────────────── */
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
  textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 5,
};

/* ─── Section card ───────────────────────────────────────────────────────── */
function SectionCard({ title, accent = "var(--gold)", children }: {
  title: string; accent?: string; children: React.ReactNode;
}) {
  return (
    <div style={{
      background: "var(--card)", border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)", overflow: "hidden", marginBottom: 14,
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "14px 18px",
        borderBottom: "1px solid var(--border-light)",
        background: "var(--card-deep)",
      }}>
        <div style={{ width: 3, height: 16, background: accent, borderRadius: 2, flexShrink: 0 }}/>
        <span style={{
          fontFamily: "var(--font-display)", fontSize: "var(--text-lg)",
          fontWeight: 600, color: "var(--text)",
        }}>{title}</span>
      </div>
      <div style={{ padding: "16px 18px" }}>{children}</div>
    </div>
  );
}

/* ─── HolidayCalendar ────────────────────────────────────────────────────── */
export default function HolidayCalendar({ settings, setSettings, notify, can }: any) {
  const [month, setMonth] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [sel, setSel] = useState<string | null>(null);
  const cp = settings.customPrices || {};

  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const firstDay    = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const days        = Array.from({ length: daysInMonth }, (_, i) =>
    new Date(month.getFullYear(), month.getMonth(), i + 1).toISOString().split("T")[0]
  );

  const setCustom = (d: string, v: string) => {
    const u = { ...cp };
    if (v === "") delete u[d]; else u[d] = Number(v);
    setSettings((s: any) => ({ ...s, customPrices: u }));
    if (v) notify(`Custom rate ₹${v} set for ${fmtDate(d)}`);
  };

  const prevMonth = () => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1));
  const nextMonth = () => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1));

  return (
    <div>
      {/* ── Page header ────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{
          fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)",
          fontWeight: 700, color: "var(--text)", margin: 0, letterSpacing: "0.01em",
        }}>Holiday Calendar</h1>
        <div style={{
          fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
          color: "var(--text-muted)", marginTop: 4,
        }}>View holidays and set custom pricing per night</div>
      </div>

      {/* ── Calendar ───────────────────────────────────────────────────── */}
      <div style={{
        background: "var(--card)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)", overflow: "hidden", marginBottom: 14,
      }}>
        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "14px 18px",
          borderBottom: "1px solid var(--border-light)",
          background: "var(--card-deep)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 3, height: 16, background: "var(--gold)", borderRadius: 2 }}/>
            <span style={{
              fontFamily: "var(--font-display)", fontSize: "var(--text-lg)",
              fontWeight: 600, color: "var(--text)",
            }}>
              {month.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
            </span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {[
              { icon: <ChevronLeft size={14}/>, action: prevMonth, title: "Previous month" },
              { icon: <ChevronRight size={14}/>, action: nextMonth, title: "Next month" },
            ].map(({ icon, action, title }) => (
              <button key={title} onClick={action} title={title} style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 32, height: 32,
                background: "var(--card-deep)", border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)", color: "var(--text-muted)",
                cursor: "pointer", transition: "all var(--ease)",
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = "var(--gold-muted)";
                  (e.currentTarget as HTMLElement).style.color = "var(--gold)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,150,62,0.4)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = "var(--card-deep)";
                  (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                }}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: "16px 18px" }}>
          {/* Day labels */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
            gap: 3, marginBottom: 4,
          }}>
            {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
              <div key={d} style={{
                textAlign: "center",
                fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
                fontWeight: 700, color: "var(--text-faint)",
                padding: "4px 0", letterSpacing: "0.05em",
              }}>{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
            {Array(firstDay).fill(null).map((_, i) => <div key={`empty-${i}`}/>)}
            {days.map(d => {
              const hol    = getHol(d);
              const wknd   = isWknd(d);
              const custom = cp[d];
              const isToday = d === todayStr;
              const isSel   = sel === d;
              const isPast  = d < todayStr;

              let bg = "var(--card-deep)";
              let borderColor = "var(--border-light)";
              let dayColor = "var(--text)";

              if (isSel)    { bg = "var(--gold-muted)";            borderColor = "rgba(200,150,62,0.5)"; dayColor = "var(--gold)"; }
              else if (isToday) { bg = "rgba(91,173,122,0.1)";     borderColor = "rgba(91,173,122,0.35)"; dayColor = "var(--success)"; }
              else if (hol) { bg = "rgba(212,160,58,0.10)";        borderColor = "rgba(212,160,58,0.25)"; dayColor = "var(--warn)"; }
              else if (wknd){ bg = "rgba(74,154,191,0.08)";        borderColor = "rgba(74,154,191,0.2)"; dayColor = "var(--info)"; }

              return (
                <div key={d} onClick={() => setSel(isSel ? null : d)} style={{
                  background: bg,
                  border: `1px solid ${borderColor}`,
                  borderRadius: "var(--radius-md)",
                  padding: "7px 6px", cursor: can.admin ? "pointer" : "default",
                  minHeight: 54,
                  opacity: isPast && !isToday ? 0.55 : 1,
                  transition: "all var(--ease)",
                }}
                  onMouseEnter={e => {
                    if (can.admin && !isSel)
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,150,62,0.35)";
                  }}
                  onMouseLeave={e => {
                    if (!isSel)
                      (e.currentTarget as HTMLElement).style.borderColor = borderColor;
                  }}
                >
                  <div style={{
                    fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
                    fontWeight: 700, color: dayColor,
                  }}>
                    {new Date(d).getDate()}
                  </div>
                  {isToday && (
                    <div style={{
                      fontFamily: "var(--font-body)", fontSize: 7,
                      color: "var(--success)", fontWeight: 800, letterSpacing: "0.06em",
                    }}>TODAY</div>
                  )}
                  {hol && (
                    <div style={{
                      fontFamily: "var(--font-body)", fontSize: 7,
                      color: "var(--warn)", lineHeight: 1.3, marginTop: 1,
                    }}>{hol.name.split(" ").slice(0, 2).join(" ")}</div>
                  )}
                  {custom && (
                    <div style={{
                      fontFamily: "var(--font-body)", fontSize: 8,
                      color: "var(--gold)", fontWeight: 800, marginTop: 1,
                    }}>₹{custom}</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 14 }}>
            {[
              ["rgba(91,173,122,0.5)",  "Today"],
              ["rgba(212,160,58,0.5)",  "Holiday"],
              ["rgba(74,154,191,0.5)",  "Weekend"],
              ["var(--gold)",           "Custom Rate"],
            ].map(([c, l]) => (
              <span key={l} style={{
                display: "flex", alignItems: "center", gap: 6,
                fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
                color: "var(--text-muted)",
              }}>
                <span style={{
                  width: 9, height: 9, background: c,
                  borderRadius: 2, display: "inline-block",
                }}/>
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Custom rate editor ────────────────────────────────────────── */}
      {sel && can.admin && (
        <div style={{
          background: "var(--card)",
          border: "1px solid var(--border-gold)",
          borderRadius: "var(--radius-lg)", overflow: "hidden", marginBottom: 14,
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "14px 18px",
            borderBottom: "1px solid var(--border-light)",
            background: "var(--card-deep)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 3, height: 16, background: "var(--gold)", borderRadius: 2 }}/>
              <div>
                <span style={{
                  fontFamily: "var(--font-display)", fontSize: "var(--text-lg)",
                  fontWeight: 600, color: "var(--text)",
                }}>Custom Rate — </span>
                <span style={{ color: "var(--gold)", fontWeight: 700 }}>{fmtDate(sel)}</span>
                {getHol(sel) && (
                  <span style={{
                    fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
                    color: "var(--warn)", marginLeft: 8,
                  }}>· {getHol(sel)!.name}</span>
                )}
                {!getHol(sel) && isWknd(sel) && (
                  <span style={{
                    fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
                    color: "var(--info)", marginLeft: 8,
                  }}>· Weekend</span>
                )}
              </div>
            </div>
            <button onClick={() => setSel(null)} style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 28, height: 28, background: "none", border: "none",
              color: "var(--text-muted)", cursor: "pointer",
            }}>
              <X size={14}/>
            </button>
          </div>
          <div style={{ padding: "16px 18px" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 160 }}>
                <div style={labelStyle}>Rate per head per night (₹)</div>
                <input type="number" key={sel} defaultValue={cp[sel] || ""}
                  onBlur={e => setCustom(sel, e.target.value)}
                  style={inputStyle}
                  placeholder={`Default: ₹${settings.familyRate || 2000}`}
                  onFocus={e => (e.target as HTMLElement).style.borderColor = "var(--gold)"}
                  onBlur2={e => (e.target as HTMLElement).style.borderColor = "var(--border)"}
                />
              </div>
              {cp[sel] && (
                <button onClick={() => setCustom(sel, "")} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "9px 16px",
                  background: "rgba(212,97,74,0.10)", border: "1px solid rgba(212,97,74,0.35)",
                  borderRadius: "var(--radius-md)", color: "var(--danger)",
                  fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
                  fontWeight: 700, cursor: "pointer", transition: "background var(--ease)",
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(212,97,74,0.20)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(212,97,74,0.10)"}
                >
                  <X size={12}/> Clear Rate
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Upcoming holidays ─────────────────────────────────────────── */}
      <SectionCard title="Upcoming Holidays" accent="var(--warn)">
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 8,
        }}>
          {HOLIDAYS.filter((h: any) => h.date >= todayStr).slice(0, 12).map((h: any) => (
            <div key={h.date} style={{
              background: "var(--card-deep)",
              border: `1px solid ${cp[h.date] ? "rgba(200,150,62,0.3)" : "var(--border-light)"}`,
              borderRadius: "var(--radius-md)", padding: "10px 12px",
              transition: "border-color var(--ease)",
            }}>
              <div style={{
                fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
                fontWeight: 700, color: "var(--warn)", marginBottom: 3,
              }}>{fmtDate(h.date)}</div>
              <div style={{
                fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
                color: "var(--text)", fontWeight: 600,
              }}>{h.name}</div>
              {cp[h.date] && (
                <div style={{
                  fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
                  color: "var(--gold)", fontWeight: 800, marginTop: 4,
                }}>₹{cp[h.date]}/head</div>
              )}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}