import { useState } from "react";

/**
 * 공통 캐러셀 컴포넌트
 * items: 렌더링할 데이터 배열
 * renderItem(item, idx): 각 아이템 렌더링 함수
 */
export default function Carousel({ items, renderItem }) {
  const [current, setCurrent] = useState(0);

  if (!items || items.length === 0) return null;

  const prev = () => setCurrent((c) => (c === 0 ? items.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === items.length - 1 ? 0 : c + 1));

  return (
    <div style={{ position: "relative" }}>
      {/* 카드 */}
      <div style={{ overflow: "hidden" }}>
        {renderItem(items[current], current)}
      </div>

      {/* 화살표 + 도트 — 아이템이 2개 이상일 때만 */}
      {items.length > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            marginTop: "16px",
          }}
        >
          {/* 이전 */}
          <button
            onClick={prev}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              border: "1px solid #e2e8f0",
              background: "var(--surface, white)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              color: "#64748b",
              flexShrink: 0,
            }}
            aria-label="이전"
          >
            ‹
          </button>

          {/* 도트 */}
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`${i + 1}번째로 이동`}
                style={{
                  width: i === current ? "20px" : "8px",
                  height: "8px",
                  borderRadius: "999px",
                  border: "none",
                  background: i === current ? "#2563eb" : "#cbd5e1",
                  cursor: "pointer",
                  padding: 0,
                  transition: "width 0.2s, background 0.2s",
                  flexShrink: 0,
                }}
              />
            ))}
          </div>

          {/* 다음 */}
          <button
            onClick={next}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              border: "1px solid #e2e8f0",
              background: "var(--surface, white)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              color: "#64748b",
              flexShrink: 0,
            }}
            aria-label="다음"
          >
            ›
          </button>
        </div>
      )}

      {/* 카운터 */}
      {items.length > 1 && (
        <p
          style={{
            textAlign: "center",
            marginTop: "8px",
            fontSize: "12px",
            color: "#94a3b8",
          }}
        >
          {current + 1} / {items.length}
        </p>
      )}
    </div>
  );
}
