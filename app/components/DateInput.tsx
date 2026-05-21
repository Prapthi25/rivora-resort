"use client";
import { useState, useEffect } from "react";

export function DateInput({ value, onChange, style }: any) {
  const toDisplay = (v: string) => {
    if (!v) return "";
    const [y,m,d] = v.split("-");
    return `${d}/${m}/${y}`;
  };
  const [raw, setRaw] = useState(toDisplay(value));
  useEffect(() => { setRaw(toDisplay(value)); }, [value]);

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/[^0-9/]/g,"");
    const digits = v.replace(/\//g,"");
    if      (digits.length <= 2) v = digits;
    else if (digits.length <= 4) v = `${digits.slice(0,2)}/${digits.slice(2)}`;
    else                          v = `${digits.slice(0,2)}/${digits.slice(2,4)}/${digits.slice(4,8)}`;
    setRaw(v);
    if (digits.length === 8)
      onChange({ target: { value: `${digits.slice(4,8)}-${digits.slice(2,4)}-${digits.slice(0,2)}` } });
    if (v === "") onChange({ target: { value: "" } });
  };

  return (
    <input value={raw} onChange={handle} placeholder="DD/MM/YYYY"
      style={{ ...style, letterSpacing:"0.5px" }} maxLength={10}/>
  );
}