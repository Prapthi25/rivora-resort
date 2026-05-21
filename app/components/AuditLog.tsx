"use client";
import { useState } from "react";
import { D } from "../lib/constants";
import { sec, inp, crd, btn } from "../lib/ui";
import { EmptyState } from "./common";

export default function AuditLog({auditLog,clearAudit}:any) {
  const [search,setSearch] = useState("");
  const list = (auditLog||[]).filter((l:any)=>
    !search||l.user?.toLowerCase().includes(search.toLowerCase())||
    l.action?.toLowerCase().includes(search.toLowerCase())||
    l.detail?.toLowerCase().includes(search.toLowerCase())||
    l.bookingId?.toLowerCase().includes(search.toLowerCase()));
  const ac: Record<string,string> = {Created:D.success,Updated:D.blue,Deleted:D.danger};

  return (
    <div>
      <div style={{display:"flex",gap:10,marginBottom:14,alignItems:"center",flexWrap:"wrap"}}>
        <h2 style={{...sec,margin:0,flex:1}}>Audit Log <span style={{color:D.sub,fontWeight:"400",fontSize:14}}>({auditLog?.length||0}/100)</span></h2>
        <input placeholder="Search user / action / booking…" value={search} onChange={e=>setSearch(e.target.value)} style={{...inp,width:240,fontSize:12}}/>
        <button onClick={()=>{if(window.confirm("Clear all audit entries? This cannot be undone."))clearAudit();}} style={btn("danger","sm")}>Clear All</button>
      </div>
      {list.length===0&&<EmptyState icon="📋" title="No audit entries" sub="Actions appear here as staff use the system"/>}
      <div style={{...crd,padding:0,overflow:"hidden"}}>
        {list.map((l:any,i:number)=>(
          <div key={l.id||i} style={{display:"flex",flexWrap:"wrap",gap:10,padding:"10px 16px",background:i%2===0?D.card:D.surface,borderBottom:`1px solid rgba(255,255,255,0.04)`,alignItems:"center"}}>
            <div style={{fontSize:10,color:D.sub,minWidth:130,fontFamily:"monospace"}}>
              {/* {new Date(l.ts).toLocaleDateString("en-IN",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"})} */}
              {l.ts
  ? new Date(l.ts).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  : "—"}
            </div>
            <div style={{minWidth:70,fontWeight:"700",fontSize:10,color:ac[l.action]||D.sub,textTransform:"uppercase",letterSpacing:"0.05em"}}>{l.action}</div>
            <div style={{flex:1,fontSize:12,color:D.text}}>{l.detail}</div>
            <div style={{fontSize:10,color:D.sub}}>by {l.user}</div>
          </div>
        ))}
      </div>
    </div>
  );
}