
import { D, F } from "./constants";

export const inp: React.CSSProperties = {
  background: D.surface,
  border: `1px solid ${D.border}`,
  borderRadius: 8,
  color: D.text,
  padding: "10px 13px",
  fontSize: 13,
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  fontFamily: F,
};

export const dateInp: React.CSSProperties = {
  ...inp,
  colorScheme: "dark",
};

export const lbl: React.CSSProperties = {
  display: "block",
  color: D.sub,
  fontSize: 11,
  marginBottom: 4,
  marginTop: 12,
  fontWeight: "500",
  letterSpacing: "0.02em",
};

export const crd: React.CSSProperties = {
  background: D.card,
  border: `1px solid ${D.border}`,
  borderRadius: 16,
  padding: "20px 22px",
};

export const sec: React.CSSProperties = {
  color: D.text,
  fontSize: 18,
  fontWeight: "700",
  marginBottom: 16,
  marginTop: 0,
  letterSpacing: "-0.02em",
};

export const ctit: React.CSSProperties = {
  color: D.sub,
  fontSize: 11,
  fontWeight: "600",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginTop: 0,
  marginBottom: 14,
};

export const divider: React.CSSProperties = {
  borderTop: `1px solid ${D.border}`,
  margin: "14px 0",
};

export const btn = (variant = "primary", size = "md"): React.CSSProperties => {
  const sizes: Record<string,string> = { sm:"6px 12px", md:"8px 16px", lg:"10px 20px" };
  const base: React.CSSProperties = {
    padding: sizes[size] || sizes.md,
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 12,
    fontFamily: F,
    fontWeight: "600",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    border: "none",
    whiteSpace: "nowrap",
    letterSpacing: "-0.01em",
  };
  const variants: Record<string, React.CSSProperties> = {
    primary: { ...base, background: D.gold,        color: "#0F172A" },
    ghost:   { ...base, background: "transparent", border: `1px solid ${D.border}`, color: D.sub },
    success: { ...base, background: D.successDim,  border: `1px solid ${D.successBorder}`, color: D.success },
    warning: { ...base, background: D.warningDim,  border: `1px solid ${D.warningBorder}`, color: D.warning },
    danger:  { ...base, background: D.dangerDim,   border: `1px solid ${D.dangerBorder}`,  color: D.danger },
    surface: { ...base, background: D.surface,     border: `1px solid ${D.border}`,        color: D.sub },
    blue:    { ...base, background: D.blueDim,     border: `1px solid ${D.blueBorder}`,    color: D.blue },
    green:   { ...base, background: D.greenDim,    border: `1px solid rgba(127,168,138,0.4)`, color: "#9BD3A8" },
  };
  return variants[variant] || variants.surface;
};

export const badge = (status: string): React.CSSProperties => {
  const m: Record<string, { bg:string; c:string; b:string }> = {
    "Confirmed":   { bg: D.successDim, c: D.success, b: D.successBorder },
    "Checked In":  { bg: D.blueDim,    c: D.blue,    b: D.blueBorder },
    "Checked Out": { bg: D.goldDim,    c: D.gold,    b: D.goldBorder },
    "Cancelled":   { bg: D.dangerDim,  c: D.danger,  b: D.dangerBorder },
  };
  const t = m[status] || { bg:"rgba(148,163,184,0.1)", c: D.sub, b:"rgba(148,163,184,0.2)" };
  return {
    background: t.bg, border: `1px solid ${t.b}`, color: t.c,
    padding: "3px 10px", borderRadius: 20, fontSize: 10,
    fontWeight: "700", whiteSpace: "nowrap", letterSpacing: "0.04em", fontFamily: F,
  };
};

export const roleColor = (r: string) =>
  r === "admin" ? D.gold : r === "staff" ? "#9BD3A8" : D.sub;

import React from "react";