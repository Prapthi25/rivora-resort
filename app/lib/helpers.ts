

import { HOLIDAYS } from "./constants";

export const genId = () =>
  `RVR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;

export const TODAY   = new Date();
export const todayStr = new Date().toISOString().split("T")[0];

export const fmtDate = (d?: string | Date) => {
  if (!d) return "—";
  const dt = new Date(d);
  return `${String(dt.getDate()).padStart(2,"0")}-${String(dt.getMonth()+1).padStart(2,"0")}-${dt.getFullYear()}`;
};

export const fmtFull = (d?: string | Date) =>
  d ? new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"long",year:"numeric"}) : "—";

export const nights = (a?: string, b?: string) =>
  !a || !b ? 0 : Math.max(0, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000));

// Handles both old schema (roomId) and new (roomIds)
export const getRoomIds = (b: any): string[] =>
  b.roomIds?.length > 0 ? b.roomIds : [b.roomId].filter(Boolean);

// Adults only (backwards-compat: falls back to guests field)
export const adultCount = (b: any): number =>
  Number(b.adults ?? b.guests ?? 0);

// Kids breakdown
export const totalKids = (b: any): number =>
  Number(b.kidsFree||0) + Number(b.kidsHalf||0) + Number(b.kidsFull||0);

// Total pax including all kids
export const totalPax = (b: any): number =>
  adultCount(b) + totalKids(b);

// Billable pax: adults + half-kids×0.5 + full-kids×1
export const billablePax = (b: any): number =>
  adultCount(b) + Number(b.kidsHalf||0) * 0.5 + Number(b.kidsFull||0);

// Payment collection helpers
export const calcCollected = (b: any): number =>
  Number(b.payments?.advance?.amount  || 0) +
  Number(b.payments?.fullStay?.amount || 0) +
  Number(b.payments?.extras?.amount   || 0);

export const calcBalance = (b: any): number =>
  Math.max(0, Number(b.total || 0) - calcCollected(b));

// Overdue helpers
export const isOverdueCheckIn  = (b: any) => b.status === "Confirmed"   && b.checkIn  < todayStr;
export const isOverdueCheckOut = (b: any) => b.status === "Checked In"  && b.checkOut < todayStr;

// Calendar helpers
export const getHol = (d: string) => HOLIDAYS.find(h => h.date === d);
export const isWknd = (d: string) => { const w = new Date(d).getDay(); return w === 0 || w === 6; };