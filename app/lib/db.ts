

import { db } from "../firebase";
import {
  collection, doc, setDoc, deleteDoc, getDoc, getDocs,
  onSnapshot, query, orderBy, limit, addDoc, writeBatch,
} from "firebase/firestore";

// ── Bookings ──────────────────────────────────────────────────────────────────
export const subscribeBookings = (cb: Function) =>
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
export const subscribeSettings = (cb: Function) =>
  onSnapshot(doc(db, "meta", "settings"), d => cb(d.exists() ? d.data() : null));

export const saveSettings = (s: any) =>
  setDoc(doc(db, "meta", "settings"), s, { merge: true });

// ── Users ─────────────────────────────────────────────────────────────────────
export const subscribeUsers = (cb: Function) =>
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

export const subscribeAudit = (cb: Function) =>
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