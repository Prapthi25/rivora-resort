"use client";

import { useState, useMemo, useRef } from "react";
import {
  Plus, Trash2, Download, Tag, X, ChevronUp, ChevronDown,
  Receipt, Search, SlidersHorizontal, TrendingUp, IndianRupee,
} from "lucide-react";

/* ─── Constants ─────────────────────────────────────────────────────────── */

export const DEFAULT_EXPENSE_CATEGORIES: string[] = [
  "Vehicle Charge",
  "Electricity Bill",
  "Fuel",
  "Groceries",
  "Woods (Soudey)",
  "Traveling (Auto / Transport)",
  "Meat (Chicken)",
  "Salary",
  "Swimming Pool Maintenance",
  "Maintenance Accessories",
  "Others",
];

const CATEGORY_EMOJI: Record<string, string> = {
  "Vehicle Charge":              "🚗",
  "Electricity Bill":            "⚡",
  "Fuel":                        "⛽",
  "Groceries":                   "🛒",
  "Woods (Soudey)":              "🪵",
  "Traveling (Auto / Transport)":"🚌",
  "Meat (Chicken)":              "🍗",
  "Salary":                      "👷",
  "Swimming Pool Maintenance":   "🏊",
  "Maintenance Accessories":     "🔧",
  "Others":                      "📝",
};

const PAYMENT_METHODS = ["Cash", "UPI", "Bank Transfer", "Card"];

function catEmoji(cat: string) {
  return CATEGORY_EMOJI[cat] ?? "🏷️";
}

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

function fmtDate(d: string) {
  if (!d) return "—";
  const dt = new Date(d + "T00:00:00");
  return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function monthKey(date: string) {
  return date?.slice(0, 7) ?? "";
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/* ─── Types ─────────────────────────────────────────────────────────────── */

interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
  employeeName?: string;
  paidBy: string;
  paymentMethod: string;
  createdAt: string;
  createdBy: string;
}

interface Props {
  expenses: Expense[];
  customCategories: string[];
  onAdd: (e: Expense) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onSaveCategories: (cats: string[]) => Promise<void>;
  notify: (msg: string, type?: string) => void;
  session: any;
}

/* ─── Summary Card ───────────────────────────────────────────────────────── */

function SummaryCard({
  label, value, sub, icon, color,
}: { label: string; value: string; sub?: string; icon: React.ReactNode; color: string }) {
  return (
    <div style={{
      background: "var(--card)",
      border: `1px solid var(--border)`,
      borderRadius: "var(--radius-lg)",
      padding: "18px 20px",
      display: "flex",
      alignItems: "flex-start",
      gap: 14,
      flex: "1 1 180px",
      minWidth: 0,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: "var(--radius-md)",
        background: `${color}18`,
        border: `1px solid ${color}40`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, color,
      }}>
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>
          {label}
        </div>
        <div style={{ fontSize: "var(--text-xl)", fontWeight: 800, color: "var(--text)", lineHeight: 1.1 }}>
          {value}
        </div>
        {sub && (
          <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: 4 }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Monthly Bar Chart ─────────────────────────────────────────────────── */

function MonthlyChart({ expenses, allCategories }: { expenses: Expense[]; allCategories: string[] }) {
  const months = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return {
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
        label: d.toLocaleDateString("en-IN", { month: "short" }),
      };
    });
  }, []);

  const totals = useMemo(() =>
    months.map(m => ({
      ...m,
      total: expenses.filter(e => monthKey(e.date) === m.key).reduce((s, e) => s + Number(e.amount || 0), 0),
    })), [months, expenses]);

  const max = Math.max(...totals.map(t => t.total), 1);
  const H = 120;

  return (
    <div style={{
      background: "var(--card)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      padding: "20px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <TrendingUp size={15} color="var(--gold)" />
        <span style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--text)" }}>
          Last 6 Months
        </span>
      </div>
      <svg width="100%" viewBox={`0 0 ${months.length * 70} ${H + 36}`} style={{ overflow: "visible" }}>
        {totals.map((m, i) => {
          const bh = Math.max(4, (m.total / max) * H);
          const x = i * 70 + 10;
          const y = H - bh;
          return (
            <g key={m.key}>
              <rect
                x={x} y={y} width={50} height={bh}
                rx={6}
                fill={m.total > 0 ? "url(#barGrad)" : "var(--border)"}
              />
              {m.total > 0 && (
                <text x={x + 25} y={y - 6} textAnchor="middle"
                  fill="var(--gold)" fontSize={9} fontWeight={700} fontFamily="var(--font-body)">
                  {fmt(m.total)}
                </text>
              )}
              <text x={x + 25} y={H + 18} textAnchor="middle"
                fill="var(--text-muted)" fontSize={11} fontFamily="var(--font-body)">
                {m.label}
              </text>
            </g>
          );
        })}
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--gold-dark)" stopOpacity="0.6" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/* ─── Category Breakdown Chart ───────────────────────────────────────────── */

function CategoryChart({ expenses, allCategories }: { expenses: Expense[]; allCategories: string[] }) {
  const data = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach(e => {
      map[e.category] = (map[e.category] ?? 0) + Number(e.amount || 0);
    });
    return Object.entries(map)
      .filter(([, v]) => v > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [expenses]);

  const total = data.reduce((s, [, v]) => s + v, 0) || 1;

  const COLORS = [
    "#C8963E","#5BAD7A","#4A9ABF","#D4614A","#A78BFA",
    "#F59E0B","#34D399","#F87171",
  ];

  return (
    <div style={{
      background: "var(--card)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      padding: "20px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <Tag size={15} color="var(--gold)" />
        <span style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--text)" }}>
          By Category
        </span>
      </div>
      {data.length === 0 ? (
        <div style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", textAlign: "center", padding: "24px 0" }}>
          No expenses yet
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {data.map(([cat, val], i) => (
            <div key={cat}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--text-soft)", display: "flex", alignItems: "center", gap: 6 }}>
                  <span>{catEmoji(cat)}</span> {cat}
                </span>
                <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text)" }}>
                  {fmt(val)}
                </span>
              </div>
              <div style={{ height: 6, background: "var(--border)", borderRadius: 99 }}>
                <div style={{
                  height: "100%",
                  width: `${(val / total) * 100}%`,
                  background: COLORS[i % COLORS.length],
                  borderRadius: 99,
                  transition: "width 0.5s ease",
                }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Add Expense Modal ──────────────────────────────────────────────────── */

function AddExpenseModal({
  allCategories, session, onSave, onClose,
}: {
  allCategories: string[];
  session: any;
  onSave: (e: Expense) => Promise<void>;
  onClose: () => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    date: today,
    category: allCategories[0] ?? "",
    amount: "",
    description: "",
    employeeName: "",
    paidBy: session?.name ?? "Admin",
    paymentMethod: "Cash",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      setErr("Please enter a valid amount."); return;
    }
    if (!form.date) { setErr("Please select a date."); return; }
    if (!form.category) { setErr("Please select a category."); return; }
    if (form.category === "Salary" && !form.employeeName.trim()) {
      setErr("Please enter the employee name for Salary."); return;
    }
    setSaving(true);
    try {
      await onSave({
        id: uid(),
        date: form.date,
        category: form.category,
        amount: Number(form.amount),
        description: form.description.trim(),
        employeeName: form.category === "Salary" ? form.employeeName.trim() : "",
        paidBy: form.paidBy.trim() || "Admin",
        paymentMethod: form.paymentMethod,
        createdAt: new Date().toISOString(),
        createdBy: session?.name ?? "Admin",
      });
      onClose();
    } catch {
      setErr("Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "var(--text-xs)",
    fontWeight: 700,
    color: "var(--text-muted)",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    marginBottom: 6,
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 2000,
      background: "rgba(0,0,0,0.72)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "16px",
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-xl)",
        width: "100%",
        maxWidth: 520,
        maxHeight: "90dvh",
        overflowY: "auto",
        boxShadow: "var(--shadow-lg)",
        animation: "rv-toast-in 0.22s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px",
          borderBottom: "1px solid var(--border)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Receipt size={18} color="var(--gold)" />
            <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", fontWeight: 700, color: "var(--text)" }}>
              Add Expense
            </span>
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "var(--text-muted)", padding: 4, borderRadius: "var(--radius-sm)",
          }}>
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Date + Amount row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={labelStyle}>Date</label>
              <input type="date" value={form.date} onChange={e => set("date", e.target.value)}
                style={{ colorScheme: "dark" }} />
            </div>
            <div>
              <label style={labelStyle}>Amount (₹)</label>
              <input type="number" min="0" placeholder="0"
                value={form.amount} onChange={e => set("amount", e.target.value)} />
            </div>
          </div>

          {/* Category */}
          <div>
            <label style={labelStyle}>Category</label>
            <select value={form.category} onChange={e => set("category", e.target.value)}>
              {allCategories.map(c => (
                <option key={c} value={c}>{catEmoji(c)} {c}</option>
              ))}
            </select>
          </div>

          {/* Employee Name — only for Salary */}
          {form.category === "Salary" && (
            <div style={{
              background: "rgba(200,150,62,0.08)",
              border: "1px solid rgba(200,150,62,0.3)",
              borderRadius: "var(--radius-md)",
              padding: "14px",
            }}>
              <label style={{ ...labelStyle, color: "var(--gold)" }}>👷 Employee Name</label>
              <input
                placeholder="e.g. Agnish"
                value={form.employeeName}
                onChange={e => set("employeeName", e.target.value)}
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <input placeholder="Brief description (optional)"
              value={form.description} onChange={e => set("description", e.target.value)} />
          </div>

          {/* Paid By + Payment Method row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={labelStyle}>Paid By</label>
              <input placeholder="Admin"
                value={form.paidBy} onChange={e => set("paidBy", e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Payment Method</label>
              <select value={form.paymentMethod} onChange={e => set("paymentMethod", e.target.value)}>
                {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>

          {err && (
            <div style={{
              background: "var(--danger-bg)", border: "1px solid var(--danger-border)",
              color: "var(--danger)", borderRadius: "var(--radius-md)",
              padding: "10px 14px", fontSize: "var(--text-sm)", fontWeight: 600,
            }}>
              {err}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
            <button onClick={onClose} style={{
              padding: "9px 18px", background: "none",
              border: "1px solid var(--border)", borderRadius: "var(--radius-md)",
              color: "var(--text-muted)", fontSize: "var(--text-sm)", fontWeight: 600, cursor: "pointer",
            }}>
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} style={{
              padding: "9px 22px",
              background: "linear-gradient(135deg,#C8963E,#A87830)",
              border: "1px solid rgba(200,150,62,0.5)",
              borderRadius: "var(--radius-md)",
              color: "#0B1A0D",
              fontSize: "var(--text-sm)", fontWeight: 800,
              cursor: saving ? "wait" : "pointer",
              opacity: saving ? 0.7 : 1,
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <Plus size={14} /> {saving ? "Saving…" : "Add Expense"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Manage Categories Modal ────────────────────────────────────────────── */

function ManageCategoriesModal({
  customCategories, onSave, onClose, notify,
}: {
  customCategories: string[];
  onSave: (cats: string[]) => Promise<void>;
  onClose: () => void;
  notify: (msg: string, type?: string) => void;
}) {
  const [cats, setCats] = useState<string[]>([...customCategories]);
  const [input, setInput] = useState("");
  const [saving, setSaving] = useState(false);

  const addCat = () => {
    const v = input.trim();
    if (!v) return;
    if ([...DEFAULT_EXPENSE_CATEGORIES, ...cats].map(c => c.toLowerCase()).includes(v.toLowerCase())) {
      notify("Category already exists", "err"); return;
    }
    setCats(prev => [...prev, v]);
    setInput("");
  };

  const removeCat = (cat: string) => setCats(prev => prev.filter(c => c !== cat));

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(cats);
      notify("Categories saved!");
      onClose();
    } catch {
      notify("Failed to save categories", "err");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 2100,
      background: "rgba(0,0,0,0.75)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 16,
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-xl)",
        width: "100%", maxWidth: 460,
        maxHeight: "85dvh", overflowY: "auto",
        boxShadow: "var(--shadow-lg)",
        animation: "rv-toast-in 0.22s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px", borderBottom: "1px solid var(--border)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Tag size={17} color="var(--gold)" />
            <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", fontWeight: 700, color: "var(--text)" }}>
              Manage Categories
            </span>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: 24 }}>
          {/* Default categories */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>
              Default Categories (protected)
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {DEFAULT_EXPENSE_CATEGORIES.map(c => (
                <span key={c} style={{
                  background: "var(--card-deep)", border: "1px solid var(--border-light)",
                  color: "var(--text-soft)", padding: "4px 12px", borderRadius: 100,
                  fontSize: "var(--text-xs)", fontWeight: 600,
                }}>
                  {catEmoji(c)} {c}
                </span>
              ))}
            </div>
          </div>

          {/* Custom categories */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>
              Custom Categories
            </div>
            {cats.length === 0 ? (
              <div style={{ color: "var(--text-faint)", fontSize: "var(--text-sm)", fontStyle: "italic" }}>
                No custom categories yet
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {cats.map(c => (
                  <div key={c} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: "rgba(200,150,62,0.08)", border: "1px solid rgba(200,150,62,0.25)",
                    borderRadius: "var(--radius-md)", padding: "8px 14px",
                  }}>
                    <span style={{ fontSize: "var(--text-sm)", color: "var(--gold)", fontWeight: 600 }}>
                      🏷️ {c}
                    </span>
                    <button onClick={() => removeCat(c)} style={{
                      background: "none", border: "none", cursor: "pointer",
                      color: "var(--danger)", padding: 4, borderRadius: "var(--radius-sm)",
                      display: "flex", alignItems: "center",
                    }}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add new */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>
              Add New Category
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                placeholder="e.g. Internet Bill"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") addCat(); }}
                style={{ flex: 1 }}
              />
              <button onClick={addCat} style={{
                padding: "9px 16px",
                background: "linear-gradient(135deg,#C8963E,#A87830)",
                border: "none", borderRadius: "var(--radius-md)",
                color: "#0B1A0D", fontWeight: 800, fontSize: "var(--text-sm)",
                cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", gap: 6,
              }}>
                <Plus size={14} /> Add
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button onClick={onClose} style={{
              padding: "9px 18px", background: "none",
              border: "1px solid var(--border)", borderRadius: "var(--radius-md)",
              color: "var(--text-muted)", fontSize: "var(--text-sm)", fontWeight: 600, cursor: "pointer",
            }}>
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} style={{
              padding: "9px 22px",
              background: "linear-gradient(135deg,#C8963E,#A87830)",
              border: "none", borderRadius: "var(--radius-md)",
              color: "#0B1A0D", fontWeight: 800, fontSize: "var(--text-sm)",
              cursor: saving ? "wait" : "pointer",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Expenses Component ────────────────────────────────────────────── */

export default function Expenses({
  expenses, customCategories, onAdd, onDelete, onSaveCategories, notify, session,
}: Props) {
  const allCategories = useMemo(
    () => [...DEFAULT_EXPENSE_CATEGORIES, ...customCategories],
    [customCategories]
  );

  const now = new Date();
  const curMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const [filterMonth, setFilterMonth]   = useState(curMonth);
  const [filterCat,   setFilterCat]     = useState("All");
  const [search,      setSearch]        = useState("");
  const [sortKey,     setSortKey]       = useState<"date"|"amount"|"category">("date");
  const [sortDir,     setSortDir]       = useState<"asc"|"desc">("desc");
  const [showAdd,     setShowAdd]       = useState(false);
  const [showManage,  setShowManage]    = useState(false);
  const [deleting,    setDeleting]      = useState<string | null>(null);

  /* ── Derived data ── */
  const thisMonthExpenses = useMemo(
    () => expenses.filter(e => monthKey(e.date) === filterMonth),
    [expenses, filterMonth]
  );

  const totalThisMonth = useMemo(
    () => thisMonthExpenses.reduce((s, e) => s + Number(e.amount || 0), 0),
    [thisMonthExpenses]
  );

  const totalAllTime = useMemo(
    () => expenses.reduce((s, e) => s + Number(e.amount || 0), 0),
    [expenses]
  );

  const topCategory = useMemo(() => {
    const map: Record<string, number> = {};
    thisMonthExpenses.forEach(e => { map[e.category] = (map[e.category] ?? 0) + Number(e.amount || 0); });
    const top = Object.entries(map).sort((a, b) => b[1] - a[1])[0];
    return top ? `${catEmoji(top[0])} ${top[0]}` : "—";
  }, [thisMonthExpenses]);

  const filtered = useMemo(() => {
    let list = [...thisMonthExpenses];
    if (filterCat !== "All") list = list.filter(e => e.category === filterCat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(e =>
        e.description?.toLowerCase().includes(q) ||
        e.category?.toLowerCase().includes(q) ||
        e.employeeName?.toLowerCase().includes(q) ||
        String(e.amount).includes(q)
      );
    }
    list.sort((a, b) => {
      let va: any, vb: any;
      if (sortKey === "date")     { va = a.date; vb = b.date; }
      else if (sortKey === "amount") { va = Number(a.amount); vb = Number(b.amount); }
      else { va = a.category; vb = b.category; }
      return sortDir === "asc"
        ? (va < vb ? -1 : va > vb ? 1 : 0)
        : (va > vb ? -1 : va < vb ? 1 : 0);
    });
    return list;
  }, [thisMonthExpenses, filterCat, search, sortKey, sortDir]);

  const handleSort = (key: "date"|"amount"|"category") => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const SortIcon = ({ k }: { k: string }) =>
    sortKey === k
      ? (sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />)
      : null;

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await onDelete(id);
      notify("Expense deleted");
    } catch {
      notify("Failed to delete", "err");
    } finally {
      setDeleting(null);
    }
  };

  const exportCSV = () => {
    const h = ["Date","Category","Employee","Amount (₹)","Description","Paid By","Payment Method","Created By","Created At"];
    const rows = filtered.map(e => [
      e.date, e.category, e.employeeName ?? "",
      e.amount, e.description ?? "", e.paidBy, e.paymentMethod,
      e.createdBy, e.createdAt,
    ]);
    const csv = [h, ...rows]
      .map(r => r.map(x => `"${String(x ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = `rivora_expenses_${filterMonth}.csv`;
    a.click();
    notify("CSV downloaded!");
  };

  const thStyle: React.CSSProperties = {
    cursor: "pointer", userSelect: "none",
    transition: "color 0.15s",
    whiteSpace: "nowrap",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>

      {/* ── Page Header ────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)", fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
            Expense Tracker
          </h2>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
            Resort operational expenses — admin only
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={() => setShowManage(true)} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 16px",
            background: "var(--card-hover)", border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)", color: "var(--text-soft)",
            fontSize: "var(--text-sm)", fontWeight: 600, cursor: "pointer",
          }}>
            <Tag size={13} /> Categories
          </button>
          <button onClick={exportCSV} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 16px",
            background: "var(--card-hover)", border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)", color: "var(--text-soft)",
            fontSize: "var(--text-sm)", fontWeight: 600, cursor: "pointer",
          }}>
            <Download size={13} /> Export CSV
          </button>
          <button onClick={() => setShowAdd(true)} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 18px",
            background: "linear-gradient(135deg,#C8963E,#A87830)",
            border: "1px solid rgba(200,150,62,0.5)",
            borderRadius: "var(--radius-md)", color: "#0B1A0D",
            fontSize: "var(--text-sm)", fontWeight: 800, cursor: "pointer",
          }}>
            <Plus size={14} /> Add Expense
          </button>
        </div>
      </div>

      {/* ── Summary Cards ──────────────────────────────────────────────── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
        <SummaryCard
          label="This Month"
          value={fmt(totalThisMonth)}
          sub={`${thisMonthExpenses.length} expense${thisMonthExpenses.length !== 1 ? "s" : ""}`}
          icon={<IndianRupee size={18} />}
          color="var(--gold)"
        />
        <SummaryCard
          label="All Time"
          value={fmt(totalAllTime)}
          sub={`${expenses.length} total entries`}
          icon={<Receipt size={18} />}
          color="var(--info)"
        />
        <SummaryCard
          label="Top Category"
          value={topCategory}
          sub="This month"
          icon={<Tag size={18} />}
          color="var(--success)"
        />
      </div>

      {/* ── Charts ─────────────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
        <MonthlyChart expenses={expenses} allCategories={allCategories} />
        <CategoryChart expenses={thisMonthExpenses} allCategories={allCategories} />
      </div>

      {/* ── Filters ────────────────────────────────────────────────────── */}
      <div style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "16px 20px",
        display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center",
      }}>
        <SlidersHorizontal size={14} color="var(--text-muted)" />

        {/* Month picker */}
        <input
          type="month"
          value={filterMonth}
          onChange={e => setFilterMonth(e.target.value)}
          style={{ width: "auto", colorScheme: "dark", minWidth: 150 }}
        />

        {/* Category filter */}
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          style={{ width: "auto", minWidth: 180 }}
        >
          <option value="All">All Categories</option>
          {allCategories.map(c => (
            <option key={c} value={c}>{catEmoji(c)} {c}</option>
          ))}
        </select>

        {/* Search */}
        <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
          <Search size={13} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)", pointerEvents: "none" }} />
          <input
            placeholder="Search description, employee…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 34 }}
          />
        </div>
      </div>

      {/* ── Expenses Table ──────────────────────────────────────────────── */}
      <div style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
      }}>
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort("date")} style={thStyle}>
                  Date <SortIcon k="date" />
                </th>
                <th onClick={() => handleSort("category")} style={thStyle}>
                  Category <SortIcon k="category" />
                </th>
                <th>Description / Employee</th>
                <th onClick={() => handleSort("amount")} style={{ ...thStyle, textAlign: "right" }}>
                  Amount <SortIcon k="amount" />
                </th>
                <th>Method</th>
                <th>Paid By</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)" }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>🧾</div>
                    No expenses found for this period
                  </td>
                </tr>
              ) : (
                filtered.map(e => (
                  <tr key={e.id}>
                    <td style={{ whiteSpace: "nowrap", color: "var(--text-soft)" }}>
                      {fmtDate(e.date)}
                    </td>
                    <td>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        background: "var(--gold-muted)", border: "1px solid rgba(200,150,62,0.3)",
                        color: "var(--gold)", padding: "3px 10px", borderRadius: 100,
                        fontSize: "var(--text-xs)", fontWeight: 700, whiteSpace: "nowrap",
                      }}>
                        {catEmoji(e.category)} {e.category}
                      </span>
                    </td>
                    <td>
                      <div style={{ color: "var(--text)" }}>{e.description || <span style={{ color: "var(--text-faint)" }}>—</span>}</div>
                      {e.employeeName && (
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--gold)", marginTop: 2, fontWeight: 600 }}>
                          👷 {e.employeeName}
                        </div>
                      )}
                    </td>
                    <td style={{ textAlign: "right", fontWeight: 800, color: "var(--danger)", whiteSpace: "nowrap" }}>
                      {fmt(Number(e.amount))}
                    </td>
                    <td>
                      <span style={{
                        background: "var(--info-bg)", color: "var(--info)",
                        padding: "2px 9px", borderRadius: 100,
                        fontSize: "var(--text-xs)", fontWeight: 700,
                      }}>
                        {e.paymentMethod}
                      </span>
                    </td>
                    <td style={{ color: "var(--text-soft)", fontSize: "var(--text-xs)" }}>
                      {e.paidBy}
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(e.id)}
                        disabled={deleting === e.id}
                        title="Delete expense"
                        style={{
                          background: "var(--danger-bg)", border: "1px solid var(--danger-border)",
                          borderRadius: "var(--radius-sm)", color: "var(--danger)",
                          padding: "5px 8px", cursor: deleting === e.id ? "wait" : "pointer",
                          display: "flex", alignItems: "center", opacity: deleting === e.id ? 0.5 : 1,
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        {filtered.length > 0 && (
          <div style={{
            padding: "12px 20px",
            borderTop: "1px solid var(--border)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            flexWrap: "wrap", gap: 8,
          }}>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
              {filtered.length} expense{filtered.length !== 1 ? "s" : ""}
            </span>
            <span style={{ fontSize: "var(--text-sm)", fontWeight: 800, color: "var(--danger)" }}>
              Total: {fmt(filtered.reduce((s, e) => s + Number(e.amount || 0), 0))}
            </span>
          </div>
        )}
      </div>

      {/* ── Modals ─────────────────────────────────────────────────────── */}
      {showAdd && (
        <AddExpenseModal
          allCategories={allCategories}
          session={session}
          onSave={async (e) => { await onAdd(e); notify("Expense added!"); }}
          onClose={() => setShowAdd(false)}
        />
      )}
      {showManage && (
        <ManageCategoriesModal
          customCategories={customCategories}
          onSave={onSaveCategories}
          onClose={() => setShowManage(false)}
          notify={notify}
        />
      )}
    </div>
  );
}
