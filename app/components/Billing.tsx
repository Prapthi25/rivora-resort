"use client";

import { useState, useMemo } from "react";
import {
  FileText, Search, Plus, Trash2, Printer, Download, Save, RefreshCw, Calendar, Eye
} from "lucide-react";
import { fmtDate, nights, getRoomIds } from "../lib/helpers";

/* ─── Indian Number to Words Converter ────────────────────────────────── */
function toWords(num: number): string {
  const rounded = Math.round(num * 100) / 100;
  const integerPart = Math.floor(rounded);
  const decimalPart = Math.round((rounded - integerPart) * 100);

  if (integerPart === 0 && decimalPart === 0) return "Zero Rupees Only";

  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const formatWords = (n: number): string => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : "");
    if (n < 1000) return a[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " and " + formatWords(n % 100) : "");
    if (n < 100000) return formatWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 !== 0 ? " " + formatWords(n % 1000) : "");
    if (n < 10000000) return formatWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 !== 0 ? " " + formatWords(n % 100000) : "");
    return formatWords(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 !== 0 ? " " + formatWords(n % 10000000) : "");
  };

  let words = "";
  if (integerPart > 0) {
    words += formatWords(integerPart) + " Rupees";
  }

  if (decimalPart > 0) {
    if (words) words += " and ";
    words += formatWords(decimalPart) + " Paise";
  }

  return words + " Only";
}

interface LineItem {
  id: string;
  description: string;
  hsn: string;
  qty: number;
  unit: string;
  price: number;
  gstRate: number;
}

interface BillingProps {
  bookings: any[];
  settings: any;
  patchB: (id: string, update: any) => Promise<void>;
  notify: (msg: string, type?: string) => void;
  session: any;
  bills: any[];
  saveBill: (bill: any) => Promise<void>;
  deleteBill: (id: string) => Promise<void>;
}

export default function Billing({
  bookings,
  settings,
  patchB,
  notify,
  session,
  bills,
  saveBill,
  deleteBill,
}: BillingProps) {
  const [subTab, setSubTab] = useState<"create" | "history">("create");
  const [searchId, setSearchId] = useState("");
  const [booking, setBooking] = useState<any | null>(null);

  // Form states for creating a new bill
  const [docType, setDocType] = useState<"receipt" | "bill">("bill");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [sameState, setSameState] = useState(true);
  const [gstMode, setGstMode] = useState<"inclusive" | "exclusive">("inclusive");
  const [gstRateOption, setGstRateOption] = useState<string>("18");
  const [customGstRate, setCustomGstRate] = useState<number>(18);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);

  // History search filter state
  const [historySearch, setHistorySearch] = useState("");

  // Search booking by ID, Name or Phone
  const handleSearch = () => {
    const term = searchId.trim().toUpperCase();
    if (!term) return;

    const found = bookings.find(
      b =>
        b.id.toUpperCase() === term ||
        b.guestName.toUpperCase().includes(term) ||
        (b.phone && b.phone.includes(term))
    );

    if (found) {
      setBooking(found);
      notify("Booking found and details loaded!");
      
      const nNights = nights(found.checkIn, found.checkOut) || 1;
      const totalAmount = Number(found.total || 0);
      const roomsStr = getRoomIds(found).join(", ");
      
      const initialItem: LineItem = {
        id: "room-stay",
        description: `Room Stay: Room ${roomsStr} (${nNights} Night${nNights !== 1 ? "s" : ""})`,
        hsn: "9963",
        qty: nNights,
        unit: "NIGHTS",
        price: nNights > 0 ? Math.round(totalAmount / nNights) : totalAmount,
        gstRate: 18,
      };
      
      setLineItems([initialItem]);
      setInvoiceNo(`RVR-INV-${found.id.split("-")[1] || found.id}`);
      setGstRateOption("18");
      setCustomGstRate(18);
      setDocType("bill");
    } else {
      notify("No matching booking found by ID, Name, or Phone.", "err");
    }
  };

  // Sync edits back to database on field blur
  const handleFieldBlur = async (key: string, val: any) => {
    if (!booking) return;
    try {
      await patchB(booking.id, { [key]: val });
      
      // If we modified the total staying price, update the room charges row rate automatically
      if (key === "total") {
        const totalAmount = Number(val || 0);
        const nNights = nights(booking.checkIn, booking.checkOut) || 1;
        setLineItems(items =>
          items.map(item => {
            if (item.id === "room-stay") {
              return {
                ...item,
                price: nNights > 0 ? Math.round(totalAmount / nNights) : totalAmount,
              };
            }
            return item;
          })
        );
      }
      notify("Details synced to Firestore booking!");
    } catch (err) {
      console.error(err);
      notify("Failed to sync change to Firestore booking", "err");
    }
  };

  // Keep local state in sync and save on blur
  const updateField = (key: string, val: any) => {
    if (!booking) return;
    setBooking({ ...booking, [key]: val });
  };

  // Date updates with local recalculation
  const handleDateChange = async (key: "checkIn" | "checkOut", val: string) => {
    if (!booking) return;
    const updated = { ...booking, [key]: val };
    setBooking(updated);
    
    try {
      await patchB(booking.id, { [key]: val });
      const nNights = nights(updated.checkIn, updated.checkOut) || 1;
      const totalAmount = Number(updated.total || 0);
      const roomsStr = getRoomIds(updated).join(", ");
      
      setLineItems(items =>
        items.map(item => {
          if (item.id === "room-stay") {
            return {
              ...item,
              qty: nNights,
              description: `Room Stay: Room ${roomsStr} (${nNights} Night${nNights !== 1 ? "s" : ""})`,
              price: nNights > 0 ? Math.round(totalAmount / nNights) : totalAmount,
            };
          }
          return item;
        })
      );
      notify("Stay dates updated and stay charges recalculated!");
    } catch (err) {
      console.error(err);
      notify("Failed to update booking stay dates", "err");
    }
  };

  // Line item handlers
  const addLineItem = () => {
    const rate = Number(gstRateOption === "custom" ? customGstRate : gstRateOption);
    const newItem: LineItem = {
      id: Math.random().toString(36).slice(2, 9),
      description: "",
      hsn: "9963",
      qty: 1,
      unit: "PCS",
      price: 0,
      gstRate: rate,
    };
    setLineItems([...lineItems, newItem]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length === 1) {
      notify("Must contain at least one billing item", "err");
      return;
    }
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const updateLineItem = (id: string, key: keyof LineItem, val: any) => {
    setLineItems(lineItems.map(item => (item.id === id ? { ...item, [key]: val } : item)));
  };

  // Calculate taxes and totals per line item
  const computedItems = useMemo(() => {
    return lineItems.map(item => {
      const qty = Number(item.qty) || 0;
      const price = Number(item.price) || 0;
      const rate = docType === "bill" ? (Number(item.gstRate) || 0) : 0;
      const rawTotal = qty * price;

      let taxable = 0;
      let gst = 0;
      let total = 0;

      if (gstMode === "inclusive") {
        total = rawTotal;
        taxable = rawTotal / (1 + rate / 100);
        gst = rawTotal - taxable;
      } else {
        taxable = rawTotal;
        gst = rawTotal * (rate / 100);
        total = taxable + gst;
      }

      return {
        ...item,
        qty,
        price,
        gstRate: rate,
        taxable,
        gst,
        total,
      };
    });
  }, [lineItems, gstMode, docType]);

  // Combined totals
  const totals = useMemo(() => {
    let taxableAmount = 0;
    let gstAmount = 0;
    let grandTotal = 0;

    computedItems.forEach(item => {
      taxableAmount += item.taxable;
      gstAmount += item.gst;
      grandTotal += item.total;
    });

    const cgst = sameState ? gstAmount / 2 : 0;
    const sgst = sameState ? gstAmount / 2 : 0;
    const igst = !sameState ? gstAmount : 0;

    return {
      taxableAmount,
      gstAmount,
      grandTotal,
      cgst,
      sgst,
      igst,
    };
  }, [computedItems, sameState]);

  // Renders the HTML template
  const getHTML = (bill: any) => {
    const isBill = bill.type === "bill";
    const guest = bill.guestSnapshot;
    const isSameState = bill.sameState;
    const placeOfSupply = isSameState ? "Karnataka (29)" : "Out of State";

    const rowsHtml = bill.lineItems
      .map((item: any, idx: number) => {
        if (isBill) {
          const gstRate = Number(item.gstRate);
          const gstLabel = isSameState
            ? `CGST @ ${(gstRate / 2).toFixed(1)}%<br>SGST @ ${(gstRate / 2).toFixed(1)}%`
            : `IGST @ ${gstRate.toFixed(1)}%`;
          const gstAmtHtml = isSameState
            ? `₹${(item.gst / 2).toFixed(2)}<br>₹${(item.gst / 2).toFixed(2)}`
            : `₹${item.gst.toFixed(2)}`;

          return `
          <tr>
            <td style="text-align: center; border: 1px solid #ddd; padding: 6px;">${idx + 1}</td>
            <td style="border: 1px solid #ddd; padding: 6px;">${item.description}</td>
            <td style="text-align: center; border: 1px solid #ddd; padding: 6px;">${item.hsn}</td>
            <td style="text-align: center; border: 1px solid #ddd; padding: 6px;">${item.qty}</td>
            <td style="text-align: center; border: 1px solid #ddd; padding: 6px;">${item.unit}</td>
            <td style="text-align: right; border: 1px solid #ddd; padding: 6px;">₹${Number(item.price).toFixed(2)}</td>
            <td style="text-align: right; border: 1px solid #ddd; padding: 6px;">₹${Number(item.taxable).toFixed(2)}</td>
            <td style="text-align: center; border: 1px solid #ddd; padding: 6px; font-size: 9px; line-height:1.2;">${gstLabel}</td>
            <td style="text-align: right; border: 1px solid #ddd; padding: 6px; font-size: 9px; line-height:1.2;">${gstAmtHtml}</td>
            <td style="text-align: right; border: 1px solid #ddd; padding: 6px; font-weight: bold;">₹${Number(item.total).toFixed(2)}</td>
          </tr>
        `;
        } else {
          return `
          <tr>
            <td style="text-align: center; border: 1px solid #ddd; padding: 8px;">${idx + 1}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${item.description}</td>
            <td style="text-align: center; border: 1px solid #ddd; padding: 8px;">${item.qty}</td>
            <td style="text-align: center; border: 1px solid #ddd; padding: 8px;">${item.unit}</td>
            <td style="text-align: right; border: 1px solid #ddd; padding: 8px;">₹${Number(item.price).toFixed(2)}</td>
            <td style="text-align: right; border: 1px solid #ddd; padding: 8px; font-weight: bold;">₹${Number(item.total).toFixed(2)}</td>
          </tr>
        `;
        }
      })
      .join("");

    let gstSummaryHtml = "";
    if (isBill) {
      const groups: Record<number, { taxable: number; gst: number }> = {};
      bill.lineItems.forEach((item: any) => {
        const rate = Number(item.gstRate);
        if (!groups[rate]) groups[rate] = { taxable: 0, gst: 0 };
        groups[rate].taxable += item.taxable;
        groups[rate].gst += item.gst;
      });

      const summaryRows = Object.entries(groups)
        .map(([rateStr, data]) => {
          const rate = Number(rateStr);
          if (isSameState) {
            return `
            <tr>
              <td style="border: 1px solid #ddd; padding: 5px; text-align: center;">9963</td>
              <td style="border: 1px solid #ddd; padding: 5px; text-align: right;">₹${data.taxable.toFixed(2)}</td>
              <td style="border: 1px solid #ddd; padding: 5px; text-align: center;">${(rate / 2).toFixed(1)}%</td>
              <td style="border: 1px solid #ddd; padding: 5px; text-align: right;">₹${(data.gst / 2).toFixed(2)}</td>
              <td style="border: 1px solid #ddd; padding: 5px; text-align: center;">${(rate / 2).toFixed(1)}%</td>
              <td style="border: 1px solid #ddd; padding: 5px; text-align: right;">₹${(data.gst / 2).toFixed(2)}</td>
              <td style="border: 1px solid #ddd; padding: 5px; text-align: right; font-weight: bold;">₹${data.gst.toFixed(2)}</td>
            </tr>
          `;
          } else {
            return `
            <tr>
              <td style="border: 1px solid #ddd; padding: 5px; text-align: center;">9963</td>
              <td style="border: 1px solid #ddd; padding: 5px; text-align: right;">₹${data.taxable.toFixed(2)}</td>
              <td style="border: 1px solid #ddd; padding: 5px; text-align: center;">${rate.toFixed(1)}%</td>
              <td style="border: 1px solid #ddd; padding: 5px; text-align: right;">₹${data.gst.toFixed(2)}</td>
              <td style="border: 1px solid #ddd; padding: 5px; text-align: right; font-weight: bold;">₹${data.gst.toFixed(2)}</td>
            </tr>
          `;
          }
        })
        .join("");

      gstSummaryHtml = `
        <div style="margin-top: 20px; margin-bottom: 15px;">
          <h4 style="margin-bottom: 6px; font-size: 10px; font-family: sans-serif; text-transform: uppercase; color: #444; letter-spacing: 0.5px;">Tax Amount Split Summary</h4>
          <table style="width: 100%; border-collapse: collapse; font-size: 9px; font-family: sans-serif;">
            <thead>
              <tr style="background: #f4f4f4;">
                <th style="border: 1px solid #ddd; padding: 5px; text-align: center;" rowspan="2">HSN/SAC</th>
                <th style="border: 1px solid #ddd; padding: 5px; text-align: center;" rowspan="2">Taxable Value</th>
                ${isSameState ? `
                  <th style="border: 1px solid #ddd; padding: 5px; text-align: center;" colspan="2">Central Tax</th>
                  <th style="border: 1px solid #ddd; padding: 5px; text-align: center;" colspan="2">State Tax</th>
                ` : `
                  <th style="border: 1px solid #ddd; padding: 5px; text-align: center;" colspan="2">Integrated Tax</th>
                `}
                <th style="border: 1px solid #ddd; padding: 5px; text-align: center;" rowspan="2">Total Tax Amount</th>
              </tr>
              <tr style="background: #f4f4f4;">
                ${isSameState ? `
                  <th style="border: 1px solid #ddd; padding: 5px; text-align: center;">Rate</th>
                  <th style="border: 1px solid #ddd; padding: 5px; text-align: center;">Amount</th>
                  <th style="border: 1px solid #ddd; padding: 5px; text-align: center;">Rate</th>
                  <th style="border: 1px solid #ddd; padding: 5px; text-align: center;">Amount</th>
                ` : `
                  <th style="border: 1px solid #ddd; padding: 5px; text-align: center;">Rate</th>
                  <th style="border: 1px solid #ddd; padding: 5px; text-align: center;">Amount</th>
                `}
              </tr>
            </thead>
            <tbody>
              ${summaryRows}
            </tbody>
          </table>
        </div>
      `;
    }

    const titleText = isBill ? "TAX INVOICE" : "RECEIPT";
    const dateStr = new Date(bill.createdAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const amountInWords = toWords(bill.grandTotal);
    const resortGstin = settings.gstin ? settings.gstin : "—";

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Rivora - ${bill.id}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      font-size: 11px;
      line-height: 1.45;
      color: #222;
      background: #fff;
      padding: 10px;
    }
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      border: 1px solid #ccc;
      padding: 30px;
      background: #fff;
      box-shadow: 0 0 10px rgba(0,0,0,0.05);
    }
    .header-table {
      width: 100%;
      margin-bottom: 22px;
      border-bottom: 2px solid #C8963E;
    }
    .header-table td {
      border: none;
      padding: 4px 0;
    }
    .resort-name {
      font-size: 24px;
      font-weight: bold;
      color: #0B1A0D;
      letter-spacing: 2.5px;
    }
    .resort-sub {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 3px;
      color: #555;
    }
    .doc-title {
      font-size: 18px;
      font-weight: bold;
      color: #C8963E;
      text-align: right;
      letter-spacing: 1px;
    }
    .details-table {
      width: 100%;
      margin-bottom: 22px;
    }
    .details-table td {
      border: none;
      padding: 4px;
      vertical-align: top;
    }
    .details-label {
      color: #555;
      font-weight: bold;
      font-size: 10px;
      font-family: sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #eee;
      padding-bottom: 3px;
      margin-bottom: 6px;
    }
    .details-val {
      font-size: 11px;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 15px;
    }
    .items-table th {
      background: #0B1A0D;
      color: #EDE8DC;
      font-size: 9px;
      font-weight: bold;
      font-family: sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 7px;
      border: 1px solid #0B1A0D;
      text-align: center;
    }
    .items-table td {
      padding: 7px;
      border: 1px solid #ddd;
    }
    .summary-table {
      width: 100%;
      margin-top: 15px;
      border-collapse: collapse;
    }
    .summary-table td {
      padding: 6px 10px;
      border: 1px solid #ddd;
    }
    .terms-box {
      font-size: 9px;
      color: #555;
      line-height: 1.5;
      background: #fafafa;
      border: 1px dashed #ddd;
      padding: 10px;
      border-radius: 4px;
    }
    .signature-area {
      margin-top: 60px;
      display: flex;
      justify-content: space-between;
    }
    .signature-box {
      text-align: center;
      width: 220px;
      border-top: 1px solid #555;
      padding-top: 6px;
      font-size: 10px;
    }
    .print-btn {
      display: block;
      margin: 24px auto 0;
      padding: 10px 28px;
      background: #0B1A0D;
      color: #C8963E;
      border: 1px solid #C8963E;
      border-radius: 6px;
      font-size: 13px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
      transition: background 0.2s;
    }
    .print-btn:hover {
      background: #153018;
    }
    @media print {
      body { padding: 0; }
      .invoice-container { border: none; padding: 0; box-shadow: none; }
      .print-btn { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <table class="header-table">
      <tr>
        <td>
          <div class="resort-name">🌿 RIVORA COORG</div>
          <div class="resort-sub">Offline Nature Resort & Spa</div>
          <div style="font-size: 10px; color: #555; margin-top: 6px; line-height: 1.5;">
            Coorg, Karnataka, India<br>
            Phone: +91 81977 27572 · Email: stay@rivoracoorg.com<br>
            <strong>GSTIN:</strong> ${resortGstin}
          </div>
        </td>
        <td style="text-align: right; vertical-align: bottom;">
          <div class="doc-title">${titleText}</div>
          <div style="font-size: 11px; margin-top: 6px; line-height: 1.5;">
            <strong>Doc No:</strong> ${bill.id}<br>
            <strong>Date:</strong> ${dateStr}<br>
            <strong>Booking ID:</strong> ${bill.bookingId}
          </div>
        </td>
      </tr>
    </table>

    <table class="details-table">
      <tr>
        <td style="width: 50%;">
          <div class="details-label">Billed To (Customer Details):</div>
          <div class="details-val" style="line-height: 1.6;">
            <strong>Guest Name:</strong> ${guest.guestName}<br>
            <strong>Phone:</strong> ${guest.phone}<br>
            <strong>Email:</strong> ${guest.email || '—'}<br>
            <strong>Address:</strong> ${guest.address || '—'}<br>
            ${isBill ? `<strong>Customer GSTIN:</strong> ${guest.guestGstin || '—'}` : ''}
          </div>
        </td>
        <td style="width: 50%; padding-left: 25px;">
          <div class="details-label">Supply &amp; Stay Details:</div>
          <div class="details-val" style="line-height: 1.6;">
            <strong>Place of Supply:</strong> ${placeOfSupply}<br>
            <strong>Place of Delivery:</strong> Coorg, Karnataka (29)<br>
            <strong>Check-In Date:</strong> ${booking ? fmtDate(booking.checkIn) : '—'} (${settings.checkInTime})<br>
            <strong>Check-Out Date:</strong> ${booking ? fmtDate(booking.checkOut) : '—'} (${settings.checkOutTime})
          </div>
        </td>
      </tr>
    </table>

    <table class="items-table">
      <thead>
        <tr>
          <th style="width: 5%;">S.N</th>
          <th>Description of Services</th>
          ${isBill ? `
            <th style="width: 12%;">HSN/SAC</th>
            <th style="width: 8%;">Qty</th>
            <th style="width: 8%;">Unit</th>
            <th style="width: 12%;">Rate (₹)</th>
            <th style="width: 12%;">Taxable Amt (₹)</th>
            <th style="width: 15%;">GST Rate</th>
            <th style="width: 12%;">GST Amt (₹)</th>
          ` : `
            <th style="width: 10%;">Qty</th>
            <th style="width: 10%;">Unit</th>
            <th style="width: 15%;">Rate (₹)</th>
          `}
          <th style="width: 15%;">Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>

    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
      <tr>
        <td style="width: 55%; vertical-align: top; padding-right: 20px; border: none;">
          <div class="terms-box">
            <strong>Terms &amp; Conditions:</strong><br>
            1. All bills must be settled fully prior to guest checkout.<br>
            2. Any loss or damage to resort property will be charged to the guest invoice.<br>
            3. All disputes are subject to Madikeri, Coorg jurisdiction only.<br>
            4. This is a computer generated document, no physical seal required.
          </div>
          
          <div style="margin-top: 16px; font-size: 10px;">
            <strong>Total Amount in Words:</strong><br>
            <span style="font-style: italic; color: #444; font-weight: bold;">${amountInWords}</span>
          </div>
        </td>
        <td style="width: 45%; vertical-align: top; border: none;">
          <table class="summary-table">
            <tr>
              <td style="font-weight: bold; color: #555; font-size: 10px;">Subtotal (Taxable Value)</td>
              <td style="text-align: right; font-weight: bold;">₹${bill.taxableAmount.toFixed(2)}</td>
            </tr>
            ${isBill ? `
              ${isSameState ? `
                <tr>
                  <td style="color: #666; font-size: 10px;">CGST Total</td>
                  <td style="text-align: right;">₹${bill.cgst.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="color: #666; font-size: 10px;">SGST Total</td>
                  <td style="text-align: right;">₹${bill.sgst.toFixed(2)}</td>
                </tr>
              ` : `
                <tr>
                  <td style="color: #666; font-size: 10px;">IGST Total</td>
                  <td style="text-align: right;">₹${bill.igst.toFixed(2)}</td>
                </tr>
              `}
              <tr>
                <td style="font-weight: bold; color: #555; font-size: 10px;">Total Tax (GST)</td>
                <td style="text-align: right; font-weight: bold;">₹${bill.gstAmount.toFixed(2)}</td>
              </tr>
            ` : ''}
            <tr style="background: #f5f5f5; font-size: 13px;">
              <td style="font-weight: bold; color: #0B1A0D;">Grand Total</td>
              <td style="text-align: right; font-weight: bold; color: #C8963E;">₹${bill.grandTotal.toFixed(2)}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    ${gstSummaryHtml}

    <div class="signature-area">
      <div class="signature-box">
        Guest's Signature
      </div>
      <div class="signature-box" style="border-top: none;">
        <span style="font-size: 9px; color: #555; display: block; margin-bottom: 30px; font-family: sans-serif;">For RIVORA COORG</span>
        <div style="border-top: 1px solid #555; padding-top: 6px;">Authorised Signatory</div>
      </div>
    </div>

    <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
  </div>
</body>
</html>`;
  };

  const handlePrint = (billData: any) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      notify("Failed to open print window. Please allow popups.", "err");
      return;
    }
    printWindow.document.write(getHTML(billData));
    printWindow.document.close();
    printWindow.focus();
  };

  const handleDownload = (billData: any) => {
    const blob = new Blob([getHTML(billData)], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${billData.type === "bill" ? "Bill" : "Receipt"}-${billData.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const [savingBill, setSavingBill] = useState(false);
  const handleSave = async () => {
    if (!booking) {
      notify("Please search and load a booking details first", "err");
      return;
    }
    if (!invoiceNo.trim()) {
      notify("Please enter a valid Invoice/Receipt number", "err");
      return;
    }

    setSavingBill(true);
    try {
      const newBill = {
        id: invoiceNo.trim(),
        bookingId: booking.id,
        type: docType,
        gstType: docType === "bill" ? (sameState ? "CGST+SGST" : "IGST") : "NONE",
        gstRate: docType === "bill" ? (gstRateOption === "custom" ? customGstRate : Number(gstRateOption)) : 0,
        sameState,
        gstMode,
        guestSnapshot: {
          guestName: booking.guestName || "",
          phone: booking.phone || "",
          address: booking.address || "",
          email: booking.email || "",
          guestGstin: booking.guestGstin || "",
        },
        lineItems: computedItems.map(item => ({
          description: item.description,
          hsn: item.hsn,
          qty: item.qty,
          unit: item.unit,
          price: item.price,
          gstRate: item.gstRate,
          taxable: item.taxable,
          gst: item.gst,
          total: item.total,
        })),
        taxableAmount: totals.taxableAmount,
        gstAmount: totals.gstAmount,
        grandTotal: totals.grandTotal,
        cgst: totals.cgst,
        sgst: totals.sgst,
        igst: totals.igst,
        createdAt: new Date().toISOString(),
        createdBy: session?.name || "Admin",
      };

      await saveBill(newBill);
      notify(`${docType === "bill" ? "Bill" : "Receipt"} saved to history!`);
    } catch (err) {
      console.error(err);
      notify("Failed to save bill to database", "err");
    } finally {
      setSavingBill(false);
    }
  };

  const handleDeleteBill = async (id: string) => {
    if (window.confirm(`Delete invoice record ${id} permanently from history?`)) {
      try {
        await deleteBill(id);
        notify("Invoice record deleted from history!");
      } catch (err) {
        console.error(err);
        notify("Failed to delete invoice record", "err");
      }
    }
  };

  // Filter bills list for history
  const filteredHistory = useMemo(() => {
    const q = historySearch.toLowerCase().trim();
    if (!q) return bills;
    return bills.filter(
      b =>
        b.id.toLowerCase().includes(q) ||
        b.bookingId.toLowerCase().includes(q) ||
        (b.guestSnapshot?.guestName && b.guestSnapshot.guestName.toLowerCase().includes(q)) ||
        (b.guestSnapshot?.phone && b.guestSnapshot.phone.includes(q))
    );
  }, [bills, historySearch]);

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)",
            fontWeight: 700, color: "var(--text)", margin: 0, letterSpacing: "0.01em"
          }}>Billing</h1>
          <div style={{
            fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
            color: "var(--text-muted)", marginTop: 4
          }}>Generate resort receipts &amp; GST tax invoices</div>
        </div>

        {/* Tab Toggle buttons */}
        <div style={{
          display: "flex",
          background: "var(--card-deep)",
          padding: 3,
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border)"
        }}>
          <button
            onClick={() => setSubTab("create")}
            style={{
              padding: "6px 14px",
              fontSize: "var(--text-xs)",
              fontWeight: 700,
              borderRadius: "var(--radius-sm)",
              background: subTab === "create" ? "linear-gradient(135deg,#C8963E,#A87830)" : "transparent",
              color: subTab === "create" ? "#0B1A0D" : "var(--text-muted)",
            }}
          >
            ✍️ Create Document
          </button>
          <button
            onClick={() => setSubTab("history")}
            style={{
              padding: "6px 14px",
              fontSize: "var(--text-xs)",
              fontWeight: 700,
              borderRadius: "var(--radius-sm)",
              background: subTab === "history" ? "linear-gradient(135deg,#C8963E,#A87830)" : "transparent",
              color: subTab === "history" ? "#0B1A0D" : "var(--text-muted)",
            }}
          >
            📜 History List ({bills.length})
          </button>
        </div>
      </div>

      {/* ── CREATE BILLING TAB ─────────────────────────────────────────── */}
      {subTab === "create" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          
          {/* Booking search card */}
          <div className="card">
            <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
              Search Hotel Booking
            </h3>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ position: "relative", flex: 1 }}>
                <input
                  type="text"
                  placeholder="Enter Booking ID (e.g. RVR-...), Guest Name, or Phone..."
                  value={searchId}
                  onChange={e => setSearchId(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSearch()}
                  style={{ paddingLeft: 36 }}
                />
                <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }} />
              </div>
              <button
                onClick={handleSearch}
                style={{
                  padding: "0 20px",
                  background: "linear-gradient(135deg,#C8963E,#A87830)",
                  border: "1px solid rgba(200,150,62,0.5)",
                  borderRadius: "var(--radius-md)",
                  color: "#0B1A0D",
                  fontSize: "var(--text-sm)",
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                }}
              >
                <Search size={13} /> Find
              </button>
            </div>
          </div>

          {booking ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 16,
              alignItems: "start"
            }}>
              
              {/* Left Column: Customer details form */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="card-raised">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, borderBottom: "1px solid var(--border-light)", paddingBottom: 6 }}>
                    <h3 style={{ fontSize: "var(--text-md)", fontWeight: 700, color: "var(--gold)" }}>
                      Customer details (Editable)
                    </h3>
                    <span style={{ fontSize: "var(--text-xs)", color: "var(--text-faint)", display: "flex", alignItems: "center", gap: 4 }}>
                      <RefreshCw size={10} className="animate-spin" /> Auto-sync to DB
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div>
                      <label style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Guest Name</label>
                      <input
                        type="text"
                        value={booking.guestName || ""}
                        onChange={e => updateField("guestName", e.target.value)}
                        onBlur={e => handleFieldBlur("guestName", e.target.value)}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <div>
                        <label style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Phone No</label>
                        <input
                          type="text"
                          value={booking.phone || ""}
                          onChange={e => updateField("phone", e.target.value)}
                          onBlur={e => handleFieldBlur("phone", e.target.value)}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Email</label>
                        <input
                          type="email"
                          placeholder="name@email.com"
                          value={booking.email || ""}
                          onChange={e => updateField("email", e.target.value)}
                          onBlur={e => handleFieldBlur("email", e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Address</label>
                      <textarea
                        rows={2}
                        placeholder="Customer residential/billing address..."
                        value={booking.address || ""}
                        onChange={e => updateField("address", e.target.value)}
                        onBlur={e => handleFieldBlur("address", e.target.value)}
                        style={{ width: "100%", padding: "10px 14px", background: "var(--card-deep)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", outline: "none", resize: "none" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Customer GSTIN / UIN (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. 29AAAAA1111A1Z1"
                        value={booking.guestGstin || ""}
                        onChange={e => updateField("guestGstin", e.target.value)}
                        onBlur={e => handleFieldBlur("guestGstin", e.target.value)}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, borderTop: "1px solid var(--border-light)", paddingTop: 10, marginTop: 4 }}>
                      <div>
                        <label style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Check-In Date</label>
                        <input
                          type="date"
                          value={booking.checkIn || ""}
                          onChange={e => handleDateChange("checkIn", e.target.value)}
                          style={{ colorScheme: "dark" }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Check-Out Date</label>
                        <input
                          type="date"
                          value={booking.checkOut || ""}
                          onChange={e => handleDateChange("checkOut", e.target.value)}
                          style={{ colorScheme: "dark" }}
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <div>
                        <label style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Adults</label>
                        <input
                          type="number"
                          value={booking.adults ?? booking.guests ?? 1}
                          onChange={e => updateField("adults", Number(e.target.value))}
                          onBlur={e => handleFieldBlur("adults", Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Agreed Stay Total (₹)</label>
                        <input
                          type="number"
                          value={booking.total || 0}
                          onChange={e => updateField("total", Number(e.target.value))}
                          onBlur={e => handleFieldBlur("total", Number(e.target.value))}
                        />
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Right Column: Preferences, Line Items, Actions */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                
                {/* Configuration Card */}
                <div className="card">
                  <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
                    Document settings
                  </h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    
                    {/* Document Type Selection */}
                    <div>
                      <label style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Document Type</label>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        <button
                          onClick={() => setDocType("receipt")}
                          style={{
                            padding: "9px 0",
                            borderRadius: "var(--radius-md)",
                            border: docType === "receipt" ? "1px solid var(--gold)" : "1px solid var(--border)",
                            background: docType === "receipt" ? "var(--gold-muted)" : "var(--card-deep)",
                            color: docType === "receipt" ? "var(--gold)" : "var(--text-muted)",
                            fontWeight: 700,
                            fontSize: "var(--text-sm)"
                          }}
                        >
                          RECEIPT (Plain Acknowledgement)
                        </button>
                        <button
                          onClick={() => setDocType("bill")}
                          style={{
                            padding: "9px 0",
                            borderRadius: "var(--radius-md)",
                            border: docType === "bill" ? "1px solid var(--gold)" : "1px solid var(--border)",
                            background: docType === "bill" ? "var(--gold-muted)" : "var(--card-deep)",
                            color: docType === "bill" ? "var(--gold)" : "var(--text-muted)",
                            fontWeight: 700,
                            fontSize: "var(--text-sm)"
                          }}
                        >
                          BILL (With GST Breakdown)
                        </button>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <div>
                        <label style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Document No.</label>
                        <input
                          type="text"
                          value={invoiceNo}
                          onChange={e => setInvoiceNo(e.target.value)}
                        />
                      </div>
                      
                      {/* Only show GST mode toggle if Bill selected */}
                      {docType === "bill" && (
                        <div>
                          <label style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>GST Mode</label>
                          <select value={gstMode} onChange={e => setGstMode(e.target.value as any)}>
                            <option value="inclusive">Tax Inclusive (Included)</option>
                            <option value="exclusive">Tax Exclusive (Added)</option>
                          </select>
                        </div>
                      )}
                    </div>

                    {/* Only show GST details if Bill selected */}
                    {docType === "bill" && (
                      <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: 10, display: "flex", flexDirection: "column", gap: 12 }}>
                        
                        {/* State Toggle */}
                        <div>
                          <label style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Place of Supply (State split)</label>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                            <button
                              onClick={() => setSameState(true)}
                              style={{
                                padding: "7px 0",
                                borderRadius: "var(--radius-md)",
                                border: sameState ? "1px solid var(--success)" : "1px solid var(--border)",
                                background: sameState ? "var(--success-bg)" : "var(--card-deep)",
                                color: sameState ? "var(--success)" : "var(--text-muted)",
                                fontWeight: 600,
                                fontSize: "var(--text-xs)"
                              }}
                            >
                              Same State (CGST + SGST split)
                            </button>
                            <button
                              onClick={() => setSameState(false)}
                              style={{
                                padding: "7px 0",
                                borderRadius: "var(--radius-md)",
                                border: !sameState ? "1px solid var(--gold)" : "1px solid var(--border)",
                                background: !sameState ? "var(--gold-muted)" : "var(--card-deep)",
                                color: !sameState ? "var(--gold)" : "var(--text-muted)",
                                fontWeight: 600,
                                fontSize: "var(--text-xs)"
                              }}
                            >
                              Out of State (IGST full)
                            </button>
                          </div>
                        </div>

                        {/* GST Rates selection */}
                        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 10 }}>
                          <div>
                            <label style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Default Rate Preset</label>
                            <div style={{ display: "flex", gap: 5 }}>
                              {["5", "12", "18", "custom"].map(opt => (
                                <button
                                  key={opt}
                                  onClick={() => {
                                    setGstRateOption(opt);
                                    if (opt !== "custom") {
                                      setLineItems(items => items.map(item => ({ ...item, gstRate: Number(opt) })));
                                    }
                                  }}
                                  style={{
                                    flex: 1,
                                    padding: "6px 0",
                                    fontSize: "var(--text-xs)",
                                    fontWeight: 700,
                                    borderRadius: "var(--radius-sm)",
                                    background: gstRateOption === opt ? "var(--gold)" : "var(--card-deep)",
                                    color: gstRateOption === opt ? "#0B1A0D" : "var(--text-soft)",
                                    border: gstRateOption === opt ? "1px solid var(--gold)" : "1px solid var(--border)",
                                  }}
                                >
                                  {opt === "custom" ? "Custom" : opt + "%"}
                                </button>
                              ))}
                            </div>
                          </div>

                          {gstRateOption === "custom" && (
                            <div>
                              <label style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Rate (%)</label>
                              <input
                                type="number"
                                value={customGstRate}
                                onChange={e => {
                                  const r = Number(e.target.value);
                                  setCustomGstRate(r);
                                  setLineItems(items => items.map(item => ({ ...item, gstRate: r })));
                                }}
                              />
                            </div>
                          )}
                        </div>

                      </div>
                    )}

                  </div>
                </div>

                {/* Line Items Card */}
                <div className="card-raised">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Line items breakdown
                    </h3>
                    <button
                      onClick={addLineItem}
                      style={{
                        padding: "4px 10px",
                        background: "rgba(91,173,122,0.12)",
                        border: "1px solid rgba(91,173,122,0.35)",
                        borderRadius: "var(--radius-sm)",
                        color: "var(--success)",
                        fontSize: "var(--text-xs)",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: 4
                      }}
                    >
                      <Plus size={12} /> Add Item
                    </button>
                  </div>

                  <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", marginBottom: 10 }}>
                    <table style={{ minWidth: 600 }}>
                      <thead>
                        <tr style={{ background: "var(--card-deep)" }}>
                          <th style={{ width: "45%" }}>Description</th>
                          {docType === "bill" && <th style={{ width: "12%" }}>HSN/SAC</th>}
                          <th style={{ width: "10%" }}>Qty</th>
                          <th style={{ width: "10%" }}>Unit</th>
                          <th style={{ width: "15%" }}>Rate (₹)</th>
                          {docType === "bill" && <th style={{ width: "10%" }}>GST %</th>}
                          <th style={{ width: "5%", textAlign: "center" }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {lineItems.map(item => (
                          <tr key={item.id}>
                            <td>
                              <input
                                type="text"
                                value={item.description}
                                onChange={e => updateLineItem(item.id, "description", e.target.value)}
                                style={{ padding: "6px 8px", background: "transparent", border: "none" }}
                              />
                            </td>
                            {docType === "bill" && (
                              <td>
                                <input
                                  type="text"
                                  value={item.hsn}
                                  onChange={e => updateLineItem(item.id, "hsn", e.target.value)}
                                  style={{ padding: "6px 8px", background: "transparent", border: "none", textAlign: "center" }}
                                />
                              </td>
                            )}
                            <td>
                              <input
                                type="number"
                                value={item.qty}
                                onChange={e => updateLineItem(item.id, "qty", Number(e.target.value))}
                                style={{ padding: "6px 8px", background: "transparent", border: "none", textAlign: "center" }}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.unit}
                                onChange={e => updateLineItem(item.id, "unit", e.target.value)}
                                style={{ padding: "6px 8px", background: "transparent", border: "none", textAlign: "center" }}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={item.price}
                                onChange={e => updateLineItem(item.id, "price", Number(e.target.value))}
                                style={{ padding: "6px 8px", background: "transparent", border: "none", textAlign: "right" }}
                              />
                            </td>
                            {docType === "bill" && (
                              <td>
                                <input
                                  type="number"
                                  value={item.gstRate}
                                  onChange={e => updateLineItem(item.id, "gstRate", Number(e.target.value))}
                                  style={{ padding: "6px 8px", background: "transparent", border: "none", textAlign: "center" }}
                                />
                              </td>
                            )}
                            <td style={{ textAlign: "center" }}>
                              <button
                                onClick={() => removeLineItem(item.id)}
                                style={{ background: "none", color: "var(--danger)", cursor: "pointer", padding: 4 }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Calculations Summary */}
                  <div style={{
                    background: "var(--card-deep)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    padding: 12,
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    fontSize: "var(--text-xs)"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                      <span>Subtotal (Taxable Value)</span>
                      <span style={{ fontWeight: 700, color: "var(--text)" }}>₹{totals.taxableAmount.toFixed(2)}</span>
                    </div>

                    {docType === "bill" && (
                      <>
                        {sameState ? (
                          <>
                            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                              <span>CGST Total</span>
                              <span style={{ color: "var(--text)" }}>₹{totals.cgst.toFixed(2)}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                              <span>SGST Total</span>
                              <span style={{ color: "var(--text)" }}>₹{totals.sgst.toFixed(2)}</span>
                            </div>
                          </>
                        ) : (
                          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                            <span>IGST Total</span>
                            <span style={{ color: "var(--text)" }}>₹{totals.igst.toFixed(2)}</span>
                          </div>
                        )}
                        <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                          <span>Total Tax (GST)</span>
                          <span style={{ fontWeight: 700, color: "var(--text)" }}>₹{totals.gstAmount.toFixed(2)}</span>
                        </div>
                      </>
                    )}

                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: 800,
                      fontSize: "var(--text-sm)",
                      borderTop: "1px solid var(--border-light)",
                      paddingTop: 8,
                      marginTop: 4,
                      color: "var(--gold)"
                    }}>
                      <span>Grand Total</span>
                      <span>₹{totals.grandTotal.toFixed(2)}</span>
                    </div>

                    <div style={{ fontSize: 10, fontStyle: "italic", color: "var(--text-faint)", marginTop: 4 }}>
                      Words: {toWords(totals.grandTotal)}
                    </div>
                  </div>

                  {/* Actions area */}
                  <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                    <button
                      onClick={handleSave}
                      disabled={savingBill}
                      style={{
                        flex: 1,
                        padding: "10px 14px",
                        background: "var(--card-deep)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-md)",
                        color: "var(--success)",
                        fontWeight: 700,
                        fontSize: "var(--text-xs)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        cursor: savingBill ? "wait" : "pointer"
                      }}
                    >
                      <Save size={13} /> {savingBill ? "Saving..." : "Save Invoice"}
                    </button>
                    <button
                      onClick={() => handlePrint({
                        id: invoiceNo,
                        bookingId: booking.id,
                        type: docType,
                        sameState,
                        gstMode,
                        guestSnapshot: {
                          guestName: booking.guestName || "",
                          phone: booking.phone || "",
                          address: booking.address || "",
                          email: booking.email || "",
                          guestGstin: booking.guestGstin || "",
                        },
                        lineItems: computedItems,
                        taxableAmount: totals.taxableAmount,
                        gstAmount: totals.gstAmount,
                        grandTotal: totals.grandTotal,
                        cgst: totals.cgst,
                        sgst: totals.sgst,
                        igst: totals.igst,
                        createdAt: new Date().toISOString(),
                      })}
                      style={{
                        flex: 1,
                        padding: "10px 14px",
                        background: "linear-gradient(135deg,#C8963E,#A87830)",
                        border: "none",
                        borderRadius: "var(--radius-md)",
                        color: "#0B1A0D",
                        fontWeight: 800,
                        fontSize: "var(--text-xs)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6
                      }}
                    >
                      <Printer size={13} /> Print Document
                    </button>
                    <button
                      onClick={() => handleDownload({
                        id: invoiceNo,
                        bookingId: booking.id,
                        type: docType,
                        sameState,
                        gstMode,
                        guestSnapshot: {
                          guestName: booking.guestName || "",
                          phone: booking.phone || "",
                          address: booking.address || "",
                          email: booking.email || "",
                          guestGstin: booking.guestGstin || "",
                        },
                        lineItems: computedItems,
                        taxableAmount: totals.taxableAmount,
                        gstAmount: totals.gstAmount,
                        grandTotal: totals.grandTotal,
                        cgst: totals.cgst,
                        sgst: totals.sgst,
                        igst: totals.igst,
                        createdAt: new Date().toISOString(),
                      })}
                      style={{
                        flex: 1,
                        padding: "10px 14px",
                        background: "rgba(74,154,191,0.12)",
                        border: "1px solid rgba(74,154,191,0.35)",
                        borderRadius: "var(--radius-md)",
                        color: "var(--info)",
                        fontWeight: 700,
                        fontSize: "var(--text-xs)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6
                      }}
                    >
                      <Download size={13} /> Download HTML
                    </button>
                  </div>

                </div>

              </div>

            </div>
          ) : (
            <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--text-muted)", border: "1px dashed var(--border)", borderRadius: "var(--radius-lg)", background: "var(--card-deep)" }}>
              <FileText size={42} style={{ color: "var(--text-faint)", marginBottom: 12, display: "inline-block" }} />
              <div style={{ fontSize: "var(--text-base)", fontWeight: 700 }}>No Booking Loaded</div>
              <div style={{ fontSize: "var(--text-sm)", color: "var(--text-faint)", marginTop: 4 }}>Search for a booking ID above to begin invoicing</div>
            </div>
          )}

        </div>
      )}

      {/* ── BILLING HISTORY TAB ─────────────────────────────────────────── */}
      {subTab === "history" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          
          {/* History Search */}
          <div className="card">
            <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
              Search History
            </h3>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Search history by Document No, Booking ID, or Guest Name..."
                value={historySearch}
                onChange={e => setHistorySearch(e.target.value)}
                style={{ paddingLeft: 36 }}
              />
              <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }} />
            </div>
          </div>

          {/* History table */}
          {filteredHistory.length > 0 ? (
            <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", background: "var(--card)" }}>
              <table style={{ width: "100%" }}>
                <thead>
                  <tr style={{ background: "var(--card-deep)" }}>
                    <th style={{ width: "8%" }}>Type</th>
                    <th style={{ width: "15%" }}>Doc No.</th>
                    <th style={{ width: "15%" }}>Booking ID</th>
                    <th style={{ width: "25%" }}>Guest Details</th>
                    <th style={{ width: "15%", textAlign: "right" }}>Grand Total</th>
                    <th style={{ width: "22%", textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map(bill => (
                    <tr key={bill.id}>
                      <td>
                        <span style={{
                          padding: "2px 6px",
                          borderRadius: 4,
                          fontSize: 10,
                          fontWeight: 800,
                          textTransform: "uppercase",
                          background: bill.type === "bill" ? "var(--gold-muted)" : "var(--success-bg)",
                          color: bill.type === "bill" ? "var(--gold)" : "var(--success)",
                          border: bill.type === "bill" ? "1px solid rgba(200,150,62,0.3)" : "1px solid rgba(91,173,122,0.3)"
                        }}>
                          {bill.type}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, color: "var(--text)" }}>{bill.id}</td>
                      <td>{bill.bookingId}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{bill.guestSnapshot?.guestName || "—"}</div>
                        <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{bill.guestSnapshot?.phone || "—"}</div>
                      </td>
                      <td style={{ textAlign: "right", fontWeight: 700, color: "var(--gold)" }}>₹{Number(bill.grandTotal).toLocaleString("en-IN")}</td>
                      <td>
                        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                          <button
                            onClick={() => handlePrint(bill)}
                            title="Print Invoice"
                            style={{
                              padding: "6px 10px",
                              background: "rgba(200,150,62,0.12)",
                              border: "1px solid rgba(200,150,62,0.3)",
                              borderRadius: "var(--radius-sm)",
                              color: "var(--gold)",
                              display: "flex",
                              alignItems: "center"
                            }}
                          >
                            <Printer size={12} />
                          </button>
                          <button
                            onClick={() => handleDownload(bill)}
                            title="Download HTML"
                            style={{
                              padding: "6px 10px",
                              background: "rgba(74,154,191,0.12)",
                              border: "1px solid rgba(74,154,191,0.3)",
                              borderRadius: "var(--radius-sm)",
                              color: "var(--info)",
                              display: "flex",
                              alignItems: "center"
                            }}
                          >
                            <Download size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteBill(bill.id)}
                            title="Delete Record"
                            style={{
                              padding: "6px 10px",
                              background: "rgba(212,97,74,0.12)",
                              border: "1px solid rgba(212,97,74,0.3)",
                              borderRadius: "var(--radius-sm)",
                              color: "var(--danger)",
                              display: "flex",
                              alignItems: "center"
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--text-muted)", border: "1px dashed var(--border)", borderRadius: "var(--radius-lg)", background: "var(--card-deep)" }}>
              <FileText size={42} style={{ color: "var(--text-faint)", marginBottom: 12, display: "inline-block" }} />
              <div style={{ fontSize: "var(--text-base)", fontWeight: 700 }}>No Saved Invoices</div>
              <div style={{ fontSize: "var(--text-sm)", color: "var(--text-faint)", marginTop: 4 }}>Any bills or receipts generated and saved will appear here</div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
