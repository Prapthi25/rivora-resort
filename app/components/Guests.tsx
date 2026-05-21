// "use client";
// import { useState } from "react";
// import { D } from "../lib/constants";
// import { sec, inp, crd, badge } from "../lib/ui";
// import { fmtDate } from "../lib/helpers";
// import { EmptyState } from "./common";

// export default function Guests({bookings}:any) {
//   const [search,setSearch] = useState("");
//   const map: Record<string,any> = {};
//   bookings.forEach((b:any)=>{
//     if (!b.phone) return;
//     if (!map[b.phone]) map[b.phone]={name:b.guestName,phone:b.phone,stays:[]};
//     map[b.phone].stays.push(b);
//   });
//   const list = Object.values(map).filter((g:any)=>
//     g.name?.toLowerCase().includes(search.toLowerCase())||g.phone?.includes(search));

//   return (
//     <div>
//       <div style={{display:"flex",gap:10,marginBottom:14,alignItems:"center",flexWrap:"wrap"}}>
//         <h2 style={{...sec,margin:0,flex:1}}>Guests <span style={{color:D.sub,fontWeight:"400",fontSize:14}}>({list.length})</span></h2>
//         <input placeholder="Search name or phone…" value={search} onChange={e=>setSearch(e.target.value)} style={{...inp,width:230,fontSize:12}}/>
//       </div>
//       {list.length===0&&<EmptyState icon="👥" title="No guests yet" sub="Guests appear here after first booking"/>}
//       {list.map((g:any)=>(
//         <div key={g.phone} style={{...crd,marginBottom:10}}>
//           <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6}}>
//             <div>
//               <div style={{fontSize:14,fontWeight:"700",color:D.text}}>{g.name}</div>
//               <div style={{fontSize:12,color:D.sub,marginTop:2}}>📞 {g.phone}</div>
//             </div>
//             <div style={{textAlign:"right"}}>
//               <div style={{fontSize:16,fontWeight:"800",color:D.gold}}>₹{g.stays.reduce((s:number,b:any)=>s+Number(b.total||0),0).toLocaleString("en-IN")}</div>
//               <div style={{fontSize:11,color:D.sub}}>{g.stays.length} stay{g.stays.length!==1?"s":""}</div>
//             </div>
//           </div>
//           <div style={{borderTop:`1px solid ${D.border}`,margin:"14px 0"}}/>
//           {g.stays.map((b:any)=>(
//             <div key={b.id} style={{display:"flex",flexWrap:"wrap",gap:10,fontSize:11,color:D.sub,padding:"5px 0"}}>
//               <span style={{color:D.gold,fontWeight:"600",fontFamily:"monospace"}}>{b.id}</span>
//               <span>{(b.roomIds?b.roomIds.join(", "):b.roomId)}</span>
//               <span>{fmtDate(b.checkIn)} → {fmtDate(b.checkOut)}</span>
//               <span style={{color:D.text,fontWeight:"600"}}>₹{Number(b.total||0).toLocaleString("en-IN")}</span>
//               <span style={badge(b.status)}>{b.status}</span>
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   );
// }


"use client";
import { useState } from "react";
import { Search, X, Phone, Star } from "lucide-react";
import { fmtDate } from "../lib/helpers";
import { EmptyState } from "./common";

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
      padding: "2px 9px", borderRadius: 100,
      fontSize: "var(--text-xs)", fontWeight: 800,
      fontFamily: "var(--font-body)",
      color: s.color, background: s.bg, border: `1px solid ${s.border}`,
      letterSpacing: "0.04em", whiteSpace: "nowrap",
    }}>{status}</span>
  );
}

/* ─── Guests ──────────────────────────────────────────────────────────────── */
export default function Guests({ bookings }: any) {
  const [search, setSearch] = useState("");

  const map: Record<string, any> = {};
  bookings.forEach((b: any) => {
    if (!b.phone) return;
    if (!map[b.phone]) map[b.phone] = { name: b.guestName, phone: b.phone, stays: [] };
    map[b.phone].stays.push(b);
  });

  const list = Object.values(map)
    .filter((g: any) =>
      g.name?.toLowerCase().includes(search.toLowerCase()) ||
      g.phone?.includes(search)
    )
    .sort((a: any, b: any) =>
      b.stays.reduce((s: number, x: any) => s + Number(x.total || 0), 0) -
      a.stays.reduce((s: number, x: any) => s + Number(x.total || 0), 0)
    );

  return (
    <div>
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 10, marginBottom: 22, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1 }}>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)",
            fontWeight: 700, color: "var(--text)", margin: 0, letterSpacing: "0.01em",
          }}>
            Guests
            <span style={{
              fontFamily: "var(--font-body)", fontWeight: 400,
              fontSize: "var(--text-sm)", color: "var(--text-muted)", marginLeft: 8,
            }}>{list.length}</span>
          </h1>
          <div style={{
            fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
            color: "var(--text-muted)", marginTop: 4,
          }}>Unified guest profiles across all bookings</div>
        </div>

        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 180px", maxWidth: 260 }}>
          <Search size={13} style={{
            position: "absolute", left: 11, top: "50%",
            transform: "translateY(-50%)", color: "var(--text-faint)", pointerEvents: "none",
          }}/>
          <input
            placeholder="Name or phone…" value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              display: "block", width: "100%", padding: "9px 12px 9px 34px",
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
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-muted)", display: "flex", padding: 2,
            }}>
              <X size={12}/>
            </button>
          )}
        </div>
      </div>

      {/* ── Empty state ───────────────────────────────────────────────── */}
      {list.length === 0 && (
        <EmptyState icon="👥" title="No guests yet"
          sub={search ? "No results for your search" : "Guests appear here after their first booking"}/>
      )}

      {/* ── Guest cards ───────────────────────────────────────────────── */}
      {list.map((g: any, idx: number) => {
        const totalSpend  = g.stays.reduce((s: number, b: any) => s + Number(b.total || 0), 0);
        const activeStays = g.stays.filter((b: any) => b.status === "Checked In").length;
        const isTop3      = idx < 3;

        return (
          <div key={g.phone} style={{
            background: "var(--card)",
            border: `1px solid ${activeStays > 0 ? "rgba(91,173,122,0.25)" : isTop3 ? "rgba(200,150,62,0.2)" : "var(--border)"}`,
            borderRadius: "var(--radius-lg)",
            marginBottom: 12, overflow: "hidden",
            transition: "border-color var(--ease)",
          }}>
            {/* Active stay banner */}
            {activeStays > 0 && (
              <div style={{
                background: "rgba(91,173,122,0.08)",
                borderBottom: "1px solid rgba(91,173,122,0.15)",
                padding: "5px 18px",
                fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
                fontWeight: 800, color: "var(--success)", letterSpacing: "0.06em",
              }}>
                ● CURRENTLY IN-HOUSE
              </div>
            )}

            <div style={{ padding: "16px 18px" }}>
              {/* Top row */}
              <div style={{
                display: "flex", justifyContent: "space-between",
                flexWrap: "wrap", gap: 10, marginBottom: 14,
              }}>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    {/* Avatar */}
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: isTop3 ? "var(--gold-muted)" : "var(--card-deep)",
                      border: `1px solid ${isTop3 ? "rgba(200,150,62,0.4)" : "var(--border)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "var(--font-display)", fontWeight: 700,
                      fontSize: "var(--text-sm)",
                      color: isTop3 ? "var(--gold)" : "var(--text-muted)",
                      flexShrink: 0,
                    }}>
                      {g.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{
                          fontFamily: "var(--font-display)", fontSize: "var(--text-xl)",
                          fontWeight: 700, color: "var(--text)", lineHeight: 1.2,
                        }}>{g.name}</span>
                        {isTop3 && (
                          <Star size={12} fill="var(--gold)" style={{ color: "var(--gold)", flexShrink: 0 }}/>
                        )}
                      </div>
                      <div style={{
                        display: "flex", alignItems: "center", gap: 5, marginTop: 3,
                        fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
                        color: "var(--text-muted)",
                      }}>
                        <Phone size={11}/>
                        {g.phone}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: spend + stays */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{
                    fontFamily: "var(--font-display)", fontSize: "clamp(20px, 3vw, 26px)",
                    fontWeight: 700, color: "var(--gold)", lineHeight: 1,
                  }}>₹{totalSpend.toLocaleString("en-IN")}</div>
                  <div style={{
                    fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
                    color: "var(--text-muted)", marginTop: 4,
                  }}>
                    {g.stays.length} stay{g.stays.length !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>

              {/* Stays list */}
              <div style={{
                borderTop: "1px solid var(--border-light)",
                paddingTop: 12,
                display: "flex", flexDirection: "column", gap: 6,
              }}>
                {g.stays
                  .slice()
                  .sort((a: any, b: any) => (b.checkIn || "").localeCompare(a.checkIn || ""))
                  .map((b: any) => (
                    <div key={b.id} style={{
                      display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center",
                      background: "var(--card-deep)",
                      borderRadius: "var(--radius-md)", padding: "8px 12px",
                    }}>
                      <span style={{
                        fontFamily: "monospace", fontSize: "var(--text-xs)",
                        color: "var(--gold)", fontWeight: 600,
                        background: "var(--gold-muted)", padding: "1px 6px",
                        borderRadius: 4,
                      }}>{b.id}</span>

                      <span style={{
                        fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
                        color: "var(--text-muted)",
                      }}>
                        🛏 {b.roomIds ? b.roomIds.join(", ") : b.roomId}
                      </span>

                      <span style={{
                        fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
                        color: "var(--text-muted)",
                      }}>
                        📅 {fmtDate(b.checkIn)} → {fmtDate(b.checkOut)}
                      </span>

                      <span style={{
                        fontFamily: "var(--font-display)", fontSize: "var(--text-sm)",
                        fontWeight: 700, color: "var(--text)", marginLeft: "auto",
                      }}>
                        ₹{Number(b.total || 0).toLocaleString("en-IN")}
                      </span>

                      <StatusBadge status={b.status}/>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}