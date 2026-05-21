// "use client";
// import { useState } from "react";
// import { Pencil, Trash2 } from "lucide-react";
// import { D } from "../lib/constants";
// import { sec, inp, lbl, crd, ctit, btn, roleColor } from "../lib/ui";
// import * as DB from "../lib/db";

// export default function UsersPanel({users,notify,session}:any) {
//   const [form,setForm]     = useState({username:"",password:"",role:"staff",name:""});
//   const [editing,setEditing] = useState<string|null>(null);
//   const [showPw,setShowPw] = useState<Record<string,boolean>>({});
//   const upd = (k:string,v:string) => setForm(p=>({...p,[k]:v}));

//   const save = async () => {
//     if (!form.name||!form.username||!form.password) return notify("Fill all fields","err");
//     if (!editing&&users.find((u:any)=>u.username===form.username)) return notify("Username exists","err");
//     await DB.saveUser(form);
//     notify(editing?"User updated!":"User added!");
//     setEditing(null); setForm({username:"",password:"",role:"staff",name:""});
//   };

//   const remove = async (u:any) => {
//     if (u.username===session.username) return notify("Cannot delete yourself","err");
//     if (window.confirm(`Delete "${u.name}"?`)) { await DB.deleteUser(u.username); notify("User deleted"); }
//   };

//   return (
//     <div>
//       <h2 style={sec}>Users & Access</h2>
//       <div style={{...crd,marginBottom:14,borderLeft:`2px solid ${D.goldBorder}`}}>
//         <div style={ctit}>Role Permissions</div>
//         {[["admin","Full access — all features, delete, settings, user management",D.gold],
//           ["staff","Bookings, check-in/out, payments. No delete, no settings.","#9BD3A8"],
//           ["viewer","Availability only — read only.",D.sub]].map(([r,desc,c])=>(
//           <div key={r as string} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"7px 0",borderBottom:`1px solid rgba(255,255,255,0.04)`}}>
//             <span style={{border:`1px solid ${c}`,color:c as string,fontSize:9,padding:"2px 8px",borderRadius:20,textTransform:"uppercase",whiteSpace:"nowrap",marginTop:2,fontWeight:"700"}}>{r}</span>
//             <span style={{color:D.sub,fontSize:12}}>{desc}</span>
//           </div>
//         ))}
//       </div>
//       <div style={{...crd,marginBottom:14}}>
//         <div style={ctit}>{editing?"Edit User":"Add User"}</div>
//         <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:10}}>
//           <div><div style={lbl}>Full Name</div><input value={form.name} onChange={e=>upd("name",e.target.value)} style={inp} placeholder="Ravi Kumar"/></div>
//           <div><div style={lbl}>Username</div><input value={form.username} onChange={e=>upd("username",e.target.value.toLowerCase().trim())} style={inp} placeholder="ravi" disabled={!!editing}/></div>
//           <div><div style={lbl}>Password</div><input value={form.password} onChange={e=>upd("password",e.target.value)} style={inp} placeholder="Set password"/></div>
//           <div><div style={lbl}>Role</div>
//             <select value={form.role} onChange={e=>upd("role",e.target.value)} style={inp}>
//               <option value="admin">Admin</option><option value="staff">Staff</option><option value="viewer">Viewer</option>
//             </select>
//           </div>
//         </div>
//         <div style={{display:"flex",gap:8,marginTop:14}}>
//           <button onClick={save} style={btn("primary","sm")}>{editing?"Save Changes":"Add User"}</button>
//           {editing&&<button onClick={()=>{setEditing(null);setForm({username:"",password:"",role:"staff",name:""}); }} style={btn("ghost","sm")}>Cancel</button>}
//         </div>
//       </div>
//       <div style={crd}>
//         <div style={ctit}>All Users ({users.length})</div>
//         {users.map((u:any)=>(
//           <div key={u.username} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",background:D.surface,borderRadius:10,marginBottom:7,flexWrap:"wrap",gap:8}}>
//             <div>
//               <span style={{color:D.text,fontWeight:"600",fontSize:13}}>{u.name}</span>
//               <span style={{color:D.sub,marginLeft:7,fontSize:11}}>@{u.username}</span>
//               {u.username===session.username&&<span style={{color:D.success,fontSize:10,marginLeft:5}}>(you)</span>}
//             </div>
//             <div style={{display:"flex",gap:7,alignItems:"center",flexWrap:"wrap"}}>
//               <span style={{background:D.card,color:D.sub,fontSize:10,padding:"2px 9px",borderRadius:6,fontFamily:"monospace"}}>{showPw[u.username]?u.password:"••••••"}</span>
//               <button onClick={()=>setShowPw(p=>({...p,[u.username]:!p[u.username]}))} style={btn("ghost","sm")}>{showPw[u.username]?"Hide":"Show"}</button>
//               <span style={{border:`1px solid ${roleColor(u.role)}`,color:roleColor(u.role),fontSize:9,padding:"2px 8px",borderRadius:20,textTransform:"uppercase",fontWeight:"700"}}>{u.role}</span>
//               <button onClick={()=>{setEditing(u.username);setForm({...u});}} style={btn("surface","sm")}><Pencil size={10}/>Edit</button>
//               <button onClick={()=>remove(u)} style={btn("danger","sm")}><Trash2 size={10}/></button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { Pencil, Trash2, Eye, EyeOff, ShieldCheck, Shield, User } from "lucide-react";
import * as DB from "../lib/db";

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
  textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 5,
};

/* ─── Role config ────────────────────────────────────────────────────────── */
const ROLE_CONFIG: Record<string, { color: string; bg: string; border: string; icon: React.ReactNode; desc: string }> = {
  admin: {
    color: "var(--gold)", bg: "var(--gold-muted)", border: "rgba(200,150,62,0.4)",
    icon: <ShieldCheck size={11}/>,
    desc: "Full access — all features, delete, settings, user management",
  },
  staff: {
    color: "var(--success)", bg: "rgba(91,173,122,0.12)", border: "rgba(91,173,122,0.35)",
    icon: <Shield size={11}/>,
    desc: "Bookings, check-in/out, payments. No delete, no settings.",
  },
  viewer: {
    color: "var(--text-muted)", bg: "var(--card-deep)", border: "var(--border)",
    icon: <User size={11}/>,
    desc: "Availability only — read only.",
  },
};

/* ─── Role badge ─────────────────────────────────────────────────────────── */
function RoleBadge({ role }: { role: string }) {
  const c = ROLE_CONFIG[role] ?? ROLE_CONFIG.viewer;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 10px", borderRadius: 100,
      fontSize: "var(--text-xs)", fontWeight: 800,
      fontFamily: "var(--font-body)",
      color: c.color, background: c.bg, border: `1px solid ${c.border}`,
      letterSpacing: "0.04em", textTransform: "uppercase",
    }}>
      {c.icon}
      {role}
    </span>
  );
}

/* ─── Section card ───────────────────────────────────────────────────────── */
function SectionCard({ title, subtitle, accent = "var(--gold)", children }: {
  title: string; subtitle?: string; accent?: string; children: React.ReactNode;
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
        <div style={{ flex: 1 }}>
          <span style={{
            fontFamily: "var(--font-display)", fontSize: "var(--text-lg)",
            fontWeight: 600, color: "var(--text)",
          }}>{title}</span>
          {subtitle && (
            <span style={{
              fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
              color: "var(--text-faint)", marginLeft: 8,
            }}>{subtitle}</span>
          )}
        </div>
      </div>
      <div style={{ padding: "16px 18px" }}>{children}</div>
    </div>
  );
}

/* ─── UsersPanel ─────────────────────────────────────────────────────────── */
export default function UsersPanel({ users, notify, session }: any) {
  const [form, setForm]         = useState({ username: "", password: "", role: "staff", name: "" });
  const [editing, setEditing]   = useState<string | null>(null);
  const [showPw, setShowPw]     = useState<Record<string, boolean>>({});
  const upd = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const focusGold   = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) =>
    (e.target as HTMLElement).style.borderColor = "var(--gold)";
  const blurDefault = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) =>
    (e.target as HTMLElement).style.borderColor = "var(--border)";

  const save = async () => {
    if (!form.name || !form.username || !form.password) return notify("Fill all fields", "err");
    if (!editing && users.find((u: any) => u.username === form.username)) return notify("Username exists", "err");
    await DB.saveUser(form);
    notify(editing ? "User updated!" : "User added!");
    setEditing(null);
    setForm({ username: "", password: "", role: "staff", name: "" });
  };

  const remove = async (u: any) => {
    if (u.username === session.username) return notify("Cannot delete yourself", "err");
    if (window.confirm(`Delete "${u.name}"?`)) {
      await DB.deleteUser(u.username);
      notify("User deleted");
    }
  };

  return (
    <div>
      {/* ── Page header ─────────────────────────────────────────────── */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{
          fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)",
          fontWeight: 700, color: "var(--text)", margin: 0, letterSpacing: "0.01em",
        }}>Users &amp; Access</h1>
        <div style={{
          fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
          color: "var(--text-muted)", marginTop: 4,
        }}>Manage team members and their permissions</div>
      </div>

      {/* ── Role permissions ────────────────────────────────────────── */}
      <SectionCard title="Role Permissions" accent="var(--gold)">
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {Object.entries(ROLE_CONFIG).map(([role, cfg]) => (
            <div key={role} style={{
              display: "flex", gap: 14, alignItems: "flex-start",
              padding: "12px 0",
              borderBottom: "1px solid var(--border-light)",
            }}>
              <div style={{ flexShrink: 0, paddingTop: 1 }}>
                <RoleBadge role={role}/>
              </div>
              <span style={{
                fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
                color: "var(--text-muted)", lineHeight: 1.5,
              }}>
                {cfg.desc}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ── Add / edit user ─────────────────────────────────────────── */}
      <SectionCard
        title={editing ? "Edit User" : "Add User"}
        accent={editing ? "var(--warn)" : "var(--success)"}
      >
        {editing && (
          <div style={{
            background: "rgba(212,160,58,0.07)",
            border: "1px solid rgba(212,160,58,0.25)",
            borderRadius: "var(--radius-md)", padding: "9px 14px",
            marginBottom: 16,
            fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
            color: "var(--warn)", lineHeight: 1.5,
          }}>
            ℹ Editing @{editing} — leave password unchanged to keep existing.
          </div>
        )}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 12, marginBottom: 16,
        }}>
          {[
            { label: "Full Name", key: "name", placeholder: "Ravi Kumar", type: "text" },
            { label: "Username",  key: "username", placeholder: "ravi", type: "text", disabled: !!editing },
            { label: "Password",  key: "password", placeholder: "Set password", type: "password" },
          ].map(({ label, key, placeholder, type, disabled }) => (
            <div key={key}>
              <div style={labelStyle}>{label}</div>
              <input
                type={type} value={(form as any)[key]}
                onChange={e => upd(key, type === "text" ? e.target.value.toLowerCase().trim() : e.target.value)}
                style={{ ...inputStyle, opacity: disabled ? 0.5 : 1 }}
                placeholder={placeholder}
                disabled={disabled}
                onFocus={focusGold} onBlur={blurDefault}
              />
            </div>
          ))}
          <div>
            <div style={labelStyle}>Role</div>
            <select value={form.role} onChange={e => upd("role", e.target.value)}
              style={{ ...inputStyle, appearance: "none" }}
              onFocus={focusGold} onBlur={blurDefault}>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={save} style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "9px 20px",
            background: editing ? "linear-gradient(135deg, #D4A03A, #B8882A)" : "linear-gradient(135deg, #C8963E, #A87830)",
            border: `1px solid ${editing ? "rgba(212,160,58,0.5)" : "rgba(200,150,62,0.5)"}`,
            borderRadius: "var(--radius-md)",
            color: "#0B1A0D", fontFamily: "var(--font-body)",
            fontSize: "var(--text-sm)", fontWeight: 800, cursor: "pointer",
          }}>
            {editing ? <Pencil size={12}/> : <span style={{ fontSize: 12 }}>+</span>}
            {editing ? "Save Changes" : "Add User"}
          </button>
          {editing && (
            <button onClick={() => { setEditing(null); setForm({ username: "", password: "", role: "staff", name: "" }); }}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "9px 16px",
                background: "var(--card-deep)", border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                color: "var(--text-muted)", fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)", fontWeight: 700, cursor: "pointer",
                transition: "background var(--ease)",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--card-hover)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "var(--card-deep)"}
            >
              Cancel
            </button>
          )}
        </div>
      </SectionCard>

      {/* ── All users list ──────────────────────────────────────────── */}
      <SectionCard
        title="All Users"
        subtitle={`${users.length} member${users.length !== 1 ? "s" : ""}`}
        accent="var(--info)"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {users.map((u: any) => (
            <div key={u.username} style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", flexWrap: "wrap", gap: 10,
              background: "var(--card-deep)",
              border: `1px solid ${u.username === session.username ? "rgba(200,150,62,0.2)" : "var(--border-light)"}`,
              borderRadius: "var(--radius-md)", padding: "12px 14px",
              transition: "border-color var(--ease)",
            }}>
              {/* Left: user info */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 180 }}>
                {/* Avatar */}
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: ROLE_CONFIG[u.role]?.bg ?? "var(--card)",
                  border: `1px solid ${ROLE_CONFIG[u.role]?.border ?? "var(--border)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: ROLE_CONFIG[u.role]?.color ?? "var(--text-muted)",
                  flexShrink: 0,
                }}>
                  <User size={14}/>
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{
                      fontFamily: "var(--font-display)", fontWeight: 700,
                      color: "var(--text)", fontSize: "var(--text-base, 14px)",
                    }}>{u.name}</span>
                    {u.username === session.username && (
                      <span style={{
                        fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
                        color: "var(--success)", fontWeight: 700,
                      }}>you</span>
                    )}
                  </div>
                  <div style={{
                    fontFamily: "monospace", fontSize: "var(--text-xs)",
                    color: "var(--text-faint)", marginTop: 2,
                  }}>@{u.username}</div>
                </div>
              </div>

              {/* Right: controls */}
              <div style={{ display: "flex", gap: 7, alignItems: "center", flexWrap: "wrap" }}>
                <RoleBadge role={u.role}/>

                {/* Password reveal */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "var(--card)", border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)", padding: "4px 10px",
                  fontFamily: "monospace", fontSize: "var(--text-xs)",
                  color: "var(--text-faint)",
                }}>
                  {showPw[u.username] ? u.password : "••••••"}
                  <button onClick={() => setShowPw(p => ({ ...p, [u.username]: !p[u.username] }))}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      color: "var(--text-muted)", display: "flex", padding: 0,
                    }}>
                    {showPw[u.username] ? <EyeOff size={11}/> : <Eye size={11}/>}
                  </button>
                </div>

                {/* Edit */}
                <button onClick={() => { setEditing(u.username); setForm({ ...u }); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 5,
                    padding: "6px 11px",
                    background: "rgba(212,160,58,0.10)", border: "1px solid rgba(212,160,58,0.35)",
                    borderRadius: "var(--radius-md)", color: "var(--warn)",
                    fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
                    fontWeight: 700, cursor: "pointer", transition: "background var(--ease)",
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(212,160,58,0.20)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(212,160,58,0.10)"}
                >
                  <Pencil size={11}/> Edit
                </button>

                {/* Delete */}
                <button onClick={() => remove(u)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 32, height: 32,
                    background: "rgba(212,97,74,0.10)", border: "1px solid rgba(212,97,74,0.35)",
                    borderRadius: "var(--radius-md)", color: "var(--danger)",
                    cursor: "pointer", transition: "background var(--ease)",
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(212,97,74,0.20)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(212,97,74,0.10)"}
                >
                  <Trash2 size={12}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}