// "use client";

// import { X } from "lucide-react";
// import { D } from "../../lib/constants";
// import { btn } from "../../lib/ui";

// type ModalWrapProps = {
//   title: string;
//   onClose: () => void;
//   children: React.ReactNode;
//   maxWidth?: number;
// };

// export function ModalWrap({
//   title,
//   onClose,
//   children,
//   maxWidth = 560,
// }: ModalWrapProps) {
//   return (
//     <div
//       style={{
//         position: "fixed",
//         inset: 0,
//         background: "rgba(0,0,0,0.75)",
//         zIndex: 500,
//         display: "flex",
//         alignItems: "flex-start",
//         justifyContent: "center",
//         padding: "20px 16px",
//         overflowY: "auto",
//       }}
//       onClick={onClose}
//     >
//       <div
//         style={{ width: "100%", maxWidth }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginBottom: 12,
//           }}
//         >
//           <span
//             style={{
//               color: D.gold,
//               fontWeight: "700",
//               fontSize: 15,
//             }}
//           >
//             {title}
//           </span>
//           <button onClick={onClose} style={btn("ghost", "sm")}>
//             <X size={14} />
//           </button>
//         </div>
//         <div
//           style={{
//             background: D.card,
//             border: `1px solid ${D.border}`,
//             borderRadius: 14,
//             padding: "20px 22px",
//           }}
//         >
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { X } from "lucide-react";

type ModalWrapProps = {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: number;
  icon?: React.ReactNode;
};

export function ModalWrap({
  title,
  subtitle,
  onClose,
  children,
  maxWidth = 580,
  icon,
}: ModalWrapProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(5,12,7,0.82)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        zIndex: 500,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "clamp(12px,4vw,28px) clamp(10px,3vw,20px)",
        overflowY: "auto",
        overflowX: "hidden",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth,
          animation: "rv-modal-in 0.22s cubic-bezier(0.34,1.4,0.64,1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Modal shell ── */}
        <div
          style={{
            background: "var(--card, #0F1F12)",
            border: "1px solid var(--border-gold, rgba(200,150,62,0.3))",
            borderRadius: "var(--radius-xl, 18px)",
            overflow: "hidden",
            boxShadow:
              "0 8px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(200,150,62,0.08) inset",
          }}
        >
          {/* ── Header ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "16px 20px 14px",
              borderBottom: "1px solid var(--border-light, rgba(255,255,255,0.06))",
              background: "var(--card-deep, #0A1A0D)",
            }}
          >
            {/* Gold accent bar */}
            <div
              style={{
                width: 3,
                height: 22,
                borderRadius: 2,
                background: "linear-gradient(180deg, var(--gold, #C8963E), rgba(200,150,62,0.3))",
                flexShrink: 0,
              }}
            />

            {icon && (
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "var(--radius-md, 8px)",
                  background: "var(--gold-muted, rgba(200,150,62,0.12))",
                  border: "1px solid rgba(200,150,62,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--gold, #C8963E)",
                  flexShrink: 0,
                }}
              >
                {icon}
              </div>
            )}

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "var(--font-display, Georgia, serif)",
                  fontSize: "clamp(15px, 2.5vw, 18px)",
                  fontWeight: 700,
                  color: "var(--text, #E8EFE9)",
                  letterSpacing: "0.01em",
                  lineHeight: 1.2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {title}
              </div>
              {subtitle && (
                <div
                  style={{
                    fontFamily: "var(--font-body, sans-serif)",
                    fontSize: "var(--text-xs, 11px)",
                    color: "var(--text-muted, #7FA88A)",
                    marginTop: 2,
                  }}
                >
                  {subtitle}
                </div>
              )}
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              title="Close"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                border: "1px solid var(--border, rgba(127,168,138,0.2))",
                borderRadius: "var(--radius-md, 8px)",
                background: "transparent",
                color: "var(--text-muted, #7FA88A)",
                cursor: "pointer",
                flexShrink: 0,
                transition: "all var(--ease, 0.15s)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "rgba(212,97,74,0.12)";
                el.style.borderColor = "rgba(212,97,74,0.4)";
                el.style.color = "var(--danger, #D4614A)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "transparent";
                el.style.borderColor = "var(--border, rgba(127,168,138,0.2))";
                el.style.color = "var(--text-muted, #7FA88A)";
              }}
            >
              <X size={14} />
            </button>
          </div>

          {/* ── Body ── */}
          <div
            style={{
              padding: "clamp(16px,3vw,24px) clamp(16px,3vw,22px)",
              maxHeight: "calc(100dvh - 160px)",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            {children}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes rv-modal-in {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
