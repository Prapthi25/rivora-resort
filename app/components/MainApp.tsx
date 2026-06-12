// "use client";
// import { useState } from "react";
// import { Plus, Users, Settings, Calendar, LayoutDashboard, CreditCard,
//   BookOpen, Lock, BarChart2, Activity } from "lucide-react";
// import { D, F } from "../lib/constants";
// import { btn } from "../lib/ui";
// import Dashboard from "./Dashboard";
// import Availability from "./Availability";
// import BookingsList from "./BookingsList";
// import Payments from "./Payments";
// import Analytics from "./Analytics";
// import HolidayCalendar from "./HolidayCalendar";
// import Guests from "./Guests";
// import AuditLog from "./AuditLog";
// import UsersPanel from "./UsersPanel";
// import SettingsPanel from "./SettingsPanel";
// import BookingModal from "./modals/BookingModal";
// import ViewModal from "./modals/ViewModal";
// import WAModal from "./modals/WAModal";
// import InvoiceModal from "./modals/InvoiceModal";

// export default function MainApp({ bookings,settings,users,session,can,addB,patchB,delB,
//   setSettings,notify,exportCSV,auditLog,clearAudit }) {
//   const [tab,setTab]   = useState(can.viewer&&!can.staff?"availability":"dashboard");
//   const [modal,setModal] = useState(null);
//   const [sel,setSel]   = useState(null);
//   const [invoiceSel,setInvoiceSel] = useState(null);
//   const openView = (b)=>{ setSel(b); setModal("view"); };

//   // Viewer-only layout
//   if (can.viewer && !can.staff) return (
//     <div>
//       <nav style={{background:D.card,borderBottom:`1px solid ${D.border}`,padding:"0 20px",
//         display:"flex",alignItems:"center",height:46}}>
//         <span style={{fontSize:11,fontWeight:"600",color:D.gold,display:"flex",alignItems:"center",gap:5}}>
//           <Calendar size={12}/> Availability
//         </span>
//         <span style={{marginLeft:"auto",fontSize:10,color:D.sub,background:D.surface,
//           padding:"3px 10px",borderRadius:20,border:`1px solid ${D.border}`}}>View only</span>
//       </nav>
//       <main style={{padding:"20px",maxWidth:1200,margin:"0 auto"}}>
//         <Availability bookings={bookings}/>
//       </main>
//     </div>
//   );

//   const TABS = [
//     {k:"dashboard",   i:<LayoutDashboard size={12}/>, l:"Dashboard"},
//     {k:"availability",i:<Calendar size={12}/>,        l:"Availability"},
//     {k:"bookings",    i:<BookOpen size={12}/>,        l:"Bookings"},
//     {k:"payments",    i:<CreditCard size={12}/>,      l:"Payments"},
//     {k:"analytics",   i:<BarChart2 size={12}/>,       l:"Analytics"},
//     {k:"calendar",    i:<Calendar size={12}/>,        l:"Holidays"},
//     {k:"guests",      i:<Users size={12}/>,           l:"Guests"},
//     ...(can.admin ? [
//       {k:"audit",   i:<Activity size={12}/>, l:"Audit"},
//       {k:"users",   i:<Lock size={12}/>,     l:"Users"},
//       {k:"settings",i:<Settings size={12}/>, l:"Settings"},
//     ] : []),
//   ];

//   return (
//     <>
//       <nav style={{background:D.card,borderBottom:`1px solid ${D.border}`,display:"flex",
//         overflowX:"auto",padding:"0 6px",alignItems:"center",height:46}}>
//         {TABS.map(({k,i,l})=>(
//           <button key={k} onClick={()=>setTab(k)} style={{background:"none",border:"none",cursor:"pointer",
//             padding:"0 10px",height:"100%",color:tab===k?D.gold:D.sub,
//             borderBottom:tab===k?`2px solid ${D.gold}`:"2px solid transparent",fontSize:11,
//             whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:5,fontFamily:F,
//             fontWeight:tab===k?"600":"400",flexShrink:0,transition:"color .15s"}}>
//             {i}{l}
//           </button>
//         ))}
//         {can.staff && (
//           <div style={{marginLeft:"auto",display:"flex",gap:8,padding:"0 8px",flexShrink:0,alignItems:"center"}}>
//             <button onClick={()=>setModal("new")} style={btn("primary","sm")}><Plus size={12}/>New Booking</button>
//           </div>
//         )}
//       </nav>

//       <main style={{padding:"20px",maxWidth:1200,margin:"0 auto"}}>
//         {tab==="dashboard"   && <Dashboard bookings={bookings} onView={openView}/>}
//         {tab==="availability"&& <Availability bookings={bookings}/>}
//         {tab==="bookings"    && <BookingsList bookings={bookings} can={can} onView={openView}
//           patchB={patchB} delB={delB} notify={notify} setSel={setSel} setModal={setModal}
//           onInvoice={b=>setInvoiceSel(b)}/>}
//         {tab==="payments"    && <Payments bookings={bookings} settings={settings} patchB={patchB} can={can}/>}
//         {tab==="analytics"   && <Analytics bookings={bookings}/>}
//         {tab==="calendar"    && <HolidayCalendar settings={settings} setSettings={setSettings} notify={notify} can={can}/>}
//         {tab==="guests"      && <Guests bookings={bookings}/>}
//         {tab==="audit"   && can.admin && <AuditLog auditLog={auditLog} clearAudit={clearAudit}/>}
//         {tab==="users"   && can.admin && <UsersPanel users={users} notify={notify} session={session}/>}
//         {tab==="settings"&& can.admin && <SettingsPanel settings={settings} setSettings={setSettings}
//           notify={notify} exportCSV={exportCSV}/>}
//       </main>

//       {modal==="new" && can.staff && (
//         <BookingModal onClose={()=>setModal(null)} settings={settings} bookings={bookings} session={session}
//           onSave={async b=>{ await addB(b); notify(`Booking ${b.id} created!`); setModal(null); }}/>
//       )}
//       {modal==="view" && sel && (
//         <ViewModal booking={sel} settings={settings} can={can} patchB={patchB} delB={delB} notify={notify}
//           onClose={()=>{setModal(null);setSel(null);}} onWA={()=>setModal("whatsapp")}
//           onInvoice={()=>setInvoiceSel(sel)}/>
//       )}
//       {modal==="whatsapp" && sel && (
//         <WAModal booking={sel} settings={settings} onClose={()=>{setModal(null);setSel(null);}}/>
//       )}
//       {invoiceSel && (
//         <InvoiceModal booking={invoiceSel} settings={settings} onClose={()=>setInvoiceSel(null)}/>
//       )}
//     </>
//   );
// }

"use client";

import { useState } from "react";
import {
  Plus, Users, Settings, Calendar, LayoutDashboard,
  CreditCard, BookOpen, Lock, BarChart2, Activity, ChevronDown, Receipt, FileText,
} from "lucide-react";
import { D, F } from "../lib/constants";
import { btn } from "../lib/ui";
import Dashboard       from "./Dashboard";
import Availability    from "./Availability";
import BookingsList    from "./BookingsList";
import Payments        from "./Payments";
import Analytics       from "./Analytics";
import HolidayCalendar from "./HolidayCalendar";
import Guests          from "./Guests";
import AuditLog        from "./AuditLog";
import UsersPanel      from "./UsersPanel";
import SettingsPanel   from "./SettingsPanel";
import BookingModal    from "./modals/BookingModal";
import ViewModal       from "./modals/ViewModal";
import WAModal         from "./modals/WAModal";
import InvoiceModal    from "./modals/InvoiceModal";
import Expenses        from "./Expenses";
import Billing         from "./Billing";

/* ─── Nav tab definition ─────────────────────────────────────────────────── */

type TabKey = string;
interface Tab {
  k: TabKey;
  i: React.ReactNode;
  l: string;
  adminOnly?: boolean;
}

const iconSize = 14;

const MAIN_TABS: Tab[] = [
  { k: "dashboard",    i: <LayoutDashboard size={iconSize}/>, l: "Dashboard"   },
  { k: "availability", i: <Calendar        size={iconSize}/>, l: "Availability"},
  { k: "bookings",     i: <BookOpen        size={iconSize}/>, l: "Bookings"    },
  { k: "payments",     i: <CreditCard      size={iconSize}/>, l: "Payments"    },
  { k: "billing",      i: <FileText        size={iconSize}/>, l: "Billing"     },
  { k: "analytics",    i: <BarChart2       size={iconSize}/>, l: "Analytics"   },
  { k: "calendar",     i: <Calendar        size={iconSize}/>, l: "Holidays"    },
  { k: "guests",       i: <Users           size={iconSize}/>, l: "Guests"      },
];

const ADMIN_TABS: Tab[] = [
  { k: "expenses", i: <Receipt  size={iconSize}/>, l: "Expenses", adminOnly: true },
  { k: "audit",    i: <Activity  size={iconSize}/>, l: "Audit",    adminOnly: true },
  { k: "users",    i: <Lock      size={iconSize}/>, l: "Users",    adminOnly: true },
  { k: "settings", i: <Settings  size={iconSize}/>, l: "Settings", adminOnly: true },
];

/* ─── Single nav tab button ─────────────────────────────────────────────── */

function NavTab({ tab, active, onClick }: {
  tab: Tab; active: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        borderBottom: active
          ? "2px solid var(--gold)"
          : "2px solid transparent",
        padding: "0 13px",
        height: "100%",
        color: active ? "var(--gold)" : "var(--text-muted)",
        fontSize: "var(--text-xs)",
        fontFamily: "var(--font-body)",
        fontWeight: active ? 700 : 500,
        whiteSpace: "nowrap",
        display: "flex",
        alignItems: "center",
        gap: 6,
        cursor: "pointer",
        flexShrink: 0,
        transition: "color 0.15s, border-color 0.15s",
        letterSpacing: "0.01em",
      }}
      onMouseEnter={e => {
        if (!active) (e.currentTarget as HTMLElement).style.color = "var(--text-soft)";
      }}
      onMouseLeave={e => {
        if (!active) (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
      }}
    >
      <span style={{ opacity: active ? 1 : 0.7 }}>{tab.i}</span>
      {tab.l}
    </button>
  );
}

/* ─── Mobile dropdown nav ───────────────────────────────────────────────── */

function MobileNav({ tabs, current, onSelect }: {
  tabs: Tab[]; current: string; onSelect: (k: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const cur = tabs.find(t => t.k === current) ?? tabs[0];

  return (
    <div style={{ position: "relative", flex: 1 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "var(--card-hover)", border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)", padding: "8px 14px",
          color: "var(--gold)", fontFamily: "var(--font-body)",
          fontSize: "var(--text-sm)", fontWeight: 700, cursor: "pointer",
          width: "100%", justifyContent: "space-between",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {cur.i} {cur.l}
        </span>
        <ChevronDown
          size={14}
          style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "0.2s" }}
        />
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
          background: "var(--card)", border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)", zIndex: 500,
          boxShadow: "var(--shadow-lg)", overflow: "hidden",
        }}>
          {tabs.map(t => (
            <button
              key={t.k}
              onClick={() => { onSelect(t.k); setOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                width: "100%", padding: "11px 16px",
                background: t.k === current ? "var(--gold-muted)" : "none",
                border: "none", borderBottom: "1px solid var(--border-light)",
                color: t.k === current ? "var(--gold)" : "var(--text-soft)",
                fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
                fontWeight: t.k === current ? 700 : 500, cursor: "pointer",
                textAlign: "left",
              }}
            >
              {t.i} {t.l}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── View-only layout (viewer role) ────────────────────────────────────── */

function ViewerLayout({ bookings }: { bookings: any[] }) {
  return (
    <div>
      <nav style={{
        background: "var(--card)",
        borderBottom: "1px solid var(--border)",
        padding: "0 clamp(14px,4vw,24px)",
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        height: 50, gap: 12,
      }}>
        <span style={{
          fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
          fontWeight: 700, color: "var(--gold)",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <Calendar size={13}/> Availability Calendar
        </span>
        <span style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-xs)", fontWeight: 600,
          color: "var(--text-muted)",
          background: "var(--card-deep)",
          padding: "4px 12px", borderRadius: 100,
          border: "1px solid var(--border)",
          letterSpacing: "0.05em",
        }}>
          View only
        </span>
      </nav>
      <main style={{ padding: "clamp(16px,3vw,24px)", maxWidth: 1200, margin: "0 auto" }}>
        <Availability bookings={bookings}/>
      </main>
    </div>
  );
}

/* ─── Main App ──────────────────────────────────────────────────────────── */

export default function MainApp({
  bookings, settings, users, session, can,
  addB, patchB, delB, setSettings, notify,
  exportCSV, auditLog, clearAudit,
  expenses, customCategories, addExpense, deleteExpense, saveExpenseCategories,
  bills, saveBill, deleteBill,
}: any) {
  const [tab,       setTab]       = useState<TabKey>(
    can.viewer && !can.staff ? "availability" : "dashboard"
  );
  const [modal,     setModal]     = useState<string | null>(null);
  const [sel,       setSel]       = useState<any>(null);
  const [invoiceSel,setInvoiceSel]= useState<any>(null);

  const openView = (b: any) => { setSel(b); setModal("view"); };

  if (can.viewer && !can.staff) {
    return <ViewerLayout bookings={bookings}/>;
  }

  const allTabs: Tab[] = [
    ...MAIN_TABS,
    ...(can.admin ? ADMIN_TABS : []),
  ];

  return (
    <>
      {/* ── Navigation bar ─────────────────────────────────────────────── */}
      <nav style={{
        background: "var(--card)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        height: 50,
        padding: "0 clamp(4px,2vw,12px)",
        position: "sticky",
        top: 62,   /* below header */
        zIndex: 300,
        boxShadow: "0 1px 8px rgba(0,0,0,0.25)",
        gap: 8,
      }}>

        {/* Desktop tabs — hidden on mobile */}
        <div style={{
          display: "flex", alignItems: "center",
          height: "100%", overflowX: "auto", flex: 1,
        }}
          className="rv-desktop-tabs"
        >
          {allTabs.map(t => (
            <NavTab key={t.k} tab={t} active={tab === t.k} onClick={() => setTab(t.k)}/>
          ))}
        </div>

        {/* Mobile dropdown — shown only on small screens */}
        <div className="rv-mobile-tabs" style={{ flex: 1, display: "none" }}>
          <MobileNav tabs={allTabs} current={tab} onSelect={setTab}/>
        </div>

        {/* New Booking button */}
        {can.staff && (
          <div style={{ flexShrink: 0, paddingRight: 4 }}>
            <button
              onClick={() => setModal("new")}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 14px",
                background: "linear-gradient(135deg,#C8963E,#A87830)",
                border: "1px solid rgba(200,150,62,0.5)",
                borderRadius: "var(--radius-md)",
                color: "#0B1A0D",
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-xs)",
                fontWeight: 800,
                cursor: "pointer",
                whiteSpace: "nowrap",
                letterSpacing: "0.02em",
                transition: "all var(--ease)",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(200,150,62,0.35)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <Plus size={13}/> <span className="rv-btn-label">New Booking</span>
            </button>
          </div>
        )}
      </nav>

      {/* ── Page content ───────────────────────────────────────────────── */}
      <main style={{
        padding: "clamp(16px,3vw,24px)",
        maxWidth: 1280,
        margin: "0 auto",
        minHeight: "calc(100dvh - 112px)",
      }}>
        {tab === "dashboard"    && <Dashboard bookings={bookings} onView={openView}/>}
        {tab === "availability" && <Availability bookings={bookings}/>}
        {tab === "bookings"     && (
          <BookingsList bookings={bookings} can={can} onView={openView}
            patchB={patchB} delB={delB} notify={notify} setSel={setSel}
            setModal={setModal} onInvoice={(b: any) => setInvoiceSel(b)}/>
        )}
        {tab === "payments"     && (
          <Payments bookings={bookings} settings={settings} patchB={patchB} can={can}/>
        )}
        {tab === "billing"      && (
          <Billing
            bookings={bookings}
            settings={settings}
            patchB={patchB}
            notify={notify}
            session={session}
            bills={bills}
            saveBill={saveBill}
            deleteBill={deleteBill}
          />
        )}
        {tab === "analytics"    && <Analytics bookings={bookings}/>}
        {tab === "calendar"     && (
          <HolidayCalendar settings={settings} setSettings={setSettings}
            notify={notify} can={can}/>
        )}
        {tab === "guests"       && <Guests bookings={bookings}/>}
        {tab === "expenses" && can.admin && (
          <Expenses
            expenses={expenses ?? []}
            customCategories={customCategories ?? []}
            onAdd={addExpense}
            onDelete={deleteExpense}
            onSaveCategories={saveExpenseCategories}
            notify={notify}
            session={session}
          />
        )}
        {tab === "audit"   && can.admin && (
          <AuditLog auditLog={auditLog} clearAudit={clearAudit}/>
        )}
        {tab === "users"   && can.admin && (
          <UsersPanel users={users} notify={notify} session={session}/>
        )}
        {tab === "settings" && can.admin && (
          <SettingsPanel settings={settings} setSettings={setSettings}
            notify={notify} exportCSV={exportCSV}/>
        )}
      </main>

      {/* ── Modals ─────────────────────────────────────────────────────── */}
      {modal === "new" && can.staff && (
        <BookingModal
          onClose={() => setModal(null)}
          settings={settings} bookings={bookings} session={session}
          onSave={async (b: any) => {
            await addB(b);
            notify(`Booking ${b.id} created!`);
            setModal(null);
          }}
        />
      )}
      {modal === "view" && sel && (
        <ViewModal
          booking={sel} settings={settings} can={can}
          patchB={patchB} delB={delB} notify={notify}
          onClose={() => { setModal(null); setSel(null); }}
          onWA={() => setModal("whatsapp")}
          onInvoice={() => setInvoiceSel(sel)}
        />
      )}
      {modal === "whatsapp" && sel && (
        <WAModal
          booking={sel} settings={settings}
          onClose={() => { setModal(null); setSel(null); }}
        />
      )}
      {invoiceSel && (
        <InvoiceModal
          booking={invoiceSel} settings={settings}
          onClose={() => setInvoiceSel(null)}
        />
      )}

      {/* ── Responsive helpers ─────────────────────────────────────────── */}
      <style>{`
        @media (max-width: 767px) {
          .rv-desktop-tabs { display: none !important; }
          .rv-mobile-tabs  { display: flex !important; }
          .rv-btn-label    { display: none; }
        }
        @media (min-width: 768px) {
          .rv-desktop-tabs { display: flex !important; }
          .rv-mobile-tabs  { display: none !important; }
        }
        /* Smooth tab scroll on desktop */
        .rv-desktop-tabs::-webkit-scrollbar { height: 0; }
      `}</style>
    </>
  );
}