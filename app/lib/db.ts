

import { db } from "../firebase";
import {
  collection, doc, setDoc, deleteDoc, getDoc, getDocs,
  onSnapshot, query, orderBy, limit, addDoc, writeBatch,
} from "firebase/firestore";

// ── Bookings ──────────────────────────────────────────────────────────────────
export const subscribeBookings = (cb: (bookings: any[]) => void) =>
  onSnapshot(
    collection(db, "bookings"),
    s => cb(s.docs.map(d => ({ ...d.data(), id: d.id }))),
    e => console.error("bookings sub error", e)
  );

export const saveBooking = (b: any) =>
  setDoc(doc(db, "bookings", b.id), b, { merge: true });

export const deleteBooking = (id: string) =>
  deleteDoc(doc(db, "bookings", id));

// ── Settings ──────────────────────────────────────────────────────────────────
export const subscribeSettings = (cb: (settings: any) => void) =>
  onSnapshot(doc(db, "meta", "settings"), d => cb(d.exists() ? d.data() : null));

export const saveSettings = (s: any) =>
  setDoc(doc(db, "meta", "settings"), s, { merge: true });

// ── Users ─────────────────────────────────────────────────────────────────────
export const subscribeUsers = (cb: (users: any[]) => void) =>
  onSnapshot(
    collection(db, "users"),
    s => cb(s.docs.map(d => ({ ...d.data(), _docId: d.id }))),
    e => console.error("users sub error", e)
  );

export const saveUser = (u: any) => {
  // Use username as doc id for stable references
  const ref = doc(db, "users", u.username);
  return setDoc(ref, u, { merge: true });
};

export const deleteUser = (username: string) =>
  deleteDoc(doc(db, "users", username));

// ── Audit log ─────────────────────────────────────────────────────────────────
const AUDIT_MAX = 150;

export const subscribeAudit = (cb: (entries: any[]) => void) =>
  onSnapshot(
    query(collection(db, "audit"), orderBy("ts", "desc"), limit(AUDIT_MAX)),
    s => cb(s.docs.map(d => ({ ...d.data(), id: d.id }))),
    e => console.error("audit sub error", e)
  );

export const addAudit = (entry: any) =>
  addDoc(collection(db, "audit"), entry);

export const clearAudit = async () => {
  const snap = await getDocs(collection(db, "audit"));
  const batch = writeBatch(db);
  snap.docs.forEach(d => batch.delete(d.ref));
  return batch.commit();
};

// ── Expenses ─────────────────────────────────────────────────────────────────
export const subscribeExpenses = (cb: (expenses: any[]) => void) =>
  onSnapshot(
    query(collection(db, "expenses"), orderBy("date", "desc")),
    s => cb(s.docs.map(d => ({ ...d.data(), id: d.id }))),
    e => console.error("expenses sub error", e)
  );

export const saveExpense = (e: any) =>
  setDoc(doc(db, "expenses", e.id), e, { merge: true });

export const deleteExpense = (id: string) =>
  deleteDoc(doc(db, "expenses", id));

// ── Expense Categories (custom) ───────────────────────────────────────────────
export const subscribeExpenseCategories = (cb: (cats: string[]) => void) =>
  onSnapshot(
    doc(db, "meta", "expenseCategories"),
    d => cb(d.exists() ? (d.data()?.list ?? []) : []),
    e => console.error("expenseCategories sub error", e)
  );

export const saveExpenseCategories = (list: string[]) =>
  setDoc(doc(db, "meta", "expenseCategories"), { list }, { merge: true });

// ── Bills ────────────────────────────────────────────────────────────────────
export const subscribeBills = (cb: (bills: any[]) => void) =>
  onSnapshot(
    query(collection(db, "bills"), orderBy("createdAt", "desc")),
    s => cb(s.docs.map(d => ({ ...d.data(), id: d.id }))),
    e => console.error("bills sub error", e)
  );

export const saveBill = (b: any) =>
  setDoc(doc(db, "bills", b.id), b, { merge: true });

export const deleteBill = (id: string) =>
  deleteDoc(doc(db, "bills", id));

// ── Seed ─────────────────────────────────────────────────────────────────────
// Only seeds if collections are empty (first run)
export const seedIfEmpty = async (defaultUsers: any[], defaultSettings: any) => {
  try {
    const [usersSnap, settingsDoc] = await Promise.all([
      getDocs(collection(db, "users")),
      getDoc(doc(db, "meta", "settings")),
    ]);
    if (usersSnap.empty) {
      await Promise.all(defaultUsers.map(u => saveUser(u)));
    }
    if (!settingsDoc.exists()) {
      await saveSettings(defaultSettings);
    }
  } catch (e) {
    console.error("seed error", e);
  }
};