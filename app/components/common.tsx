"use client";

import { D } from "../lib/constants";
import { badge } from "../lib/ui";
import { getRoomIds, totalKids } from "../lib/helpers";

type EmptyStateProps = {
  icon: React.ReactNode;
  title: string;
  sub?: string;
};

export function EmptyState({
  icon,
  title,
  sub,
}: EmptyStateProps) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div
        style={{
          fontSize: 36,
          marginBottom: 12,
          opacity: 0.4,
        }}
      >
        {icon}
      </div>

      <div
        style={{
          fontSize: 14,
          fontWeight: "600",
          color: D.sub,
        }}
      >
        {title}
      </div>

      {sub && (
        <div
          style={{
            fontSize: 12,
            color: D.muted,
            marginTop: 5,
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

export function GuestRow({
  b,
  onView,
  context,
}: any) {
  const kids = totalKids(b);

  return (
    <div
      onClick={onView}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 12px",
        background: "var(--card-deep)",
        borderRadius: "var(--radius-md)",
        marginBottom: 6,
        cursor: "pointer",
        border: "1px solid var(--border-light)",
        transition: "background var(--ease), border-color var(--ease)",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.background = "var(--card-hover)";
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.background = "var(--card-deep)";
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border-light)";
      }}
    >
      <div>
        <span
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--text)",
            fontWeight: 700,
            fontSize: "var(--text-sm)",
          }}
        >
          {b.guestName}
        </span>

        <span
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--text-muted)",
            marginLeft: 10,
            fontSize: "var(--text-xs)",
          }}
        >
          {b.phone}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          gap: 7,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {context && (
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-xs)",
              color: "var(--text-soft)",
            }}
          >
            {context}
          </span>
        )}

        {kids > 0 && (
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-xs)",
              color: "var(--text-soft)",
            }}
          >
            👶 {kids}
          </span>
        )}

        <span
          style={{
            background: "rgba(127,168,138,0.12)",
            border: "1px solid var(--border)",
            color: "var(--fern)",
            padding: "2px 8px",
            borderRadius: "var(--radius-sm)",
            fontSize: "var(--text-xs)",
            fontFamily: "var(--font-body)",
            fontWeight: 700,
          }}
        >
          {getRoomIds(b).join(", ")}
        </span>

        <span style={badge(b.status)}>
          {b.status}
        </span>
      </div>
    </div>
  );
}