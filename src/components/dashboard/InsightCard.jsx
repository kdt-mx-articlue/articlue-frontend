/**
 * InsightCard
 * 금주의 IT 인사이트 기사 카드
 *
 * Props:
 *   article - { id, title, summary, url, thumbnail, source, publishedAt }
 */
export default function InsightCard({ article }) {
  const { title, summary, url, thumbnail, source = "DBR", publishedAt } = article;

  /* publishedAt → "YYYY.MM.DD" 포맷 */
  const dateLabel = (() => {
    if (!publishedAt) return null;
    const d = new Date(publishedAt);
    if (isNaN(d)) return null;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}.${m}.${day}`;
  })();

  /* summary를 최대 3줄 분리 */
  const lines = summary
    ? summary
        .split(/\n/)
        .map((l) => l.trim())
        .filter(Boolean)
        .slice(0, 3)
    : [];

  /* 줄 분리가 안 된 경우(단일 문단) — 문장 단위로 최대 3개 */
  const summaryLines =
    lines.length >= 2
      ? lines
      : summary
      ? summary
          .split(/(?<=[.?!])\s+/)
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 3)
      : [];

  return (
    <article
      className="
        flex flex-col
        rounded-[28px]
        border border-slate-200
        dark:border-slate-700
        bg-white dark:bg-slate-800
        overflow-hidden
        shadow-sm
        hover:shadow-md
        transition-shadow
      "
    >
      {/* 썸네일 */}
      {thumbnail ? (
        <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0">
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      ) : (
        <div className="h-44 w-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center flex-shrink-0">
          <span className="text-4xl">📰</span>
        </div>
      )}

      {/* 본문 */}
      <div className="flex flex-col flex-1 p-5 gap-3">

        {/* source 뱃지 + 날짜 */}
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-blue-50 dark:bg-blue-900/30 px-2.5 py-0.5 text-[11px] font-medium text-blue-600 dark:text-blue-300">
            {source}
          </span>
          {dateLabel && (
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              {dateLabel}
            </span>
          )}
        </div>

        {/* 제목 */}
        <h3
          className="
            text-[15px] font-black leading-snug
            text-slate-900 dark:text-white
            line-clamp-2
          "
        >
          {title}
        </h3>

        {/* 3줄 요약 */}
        {summaryLines.length > 0 && (
          <ul className="flex flex-col gap-1.5 flex-1">
            {summaryLines.map((line, i) => (
              <li
                key={i}
                className="
                  flex items-start gap-2
                  text-[13px] leading-relaxed
                  text-slate-600 dark:text-slate-300
                "
              >
                <span className="mt-[3px] text-blue-400 flex-shrink-0 text-[10px]">▸</span>
                <span className="line-clamp-2">{line}</span>
              </li>
            ))}
          </ul>
        )}

        {/* 원문 버튼 */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="
            mt-auto
            inline-flex items-center justify-center gap-1.5
            rounded-xl
            border border-blue-200 dark:border-blue-700
            bg-blue-50 dark:bg-blue-900/30
            text-blue-700 dark:text-blue-300
            text-[13px] font-bold
            px-4 py-2.5
            hover:bg-blue-100 dark:hover:bg-blue-800/40
            transition-colors
          "
        >
          기사 원문 보러가기
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>

      </div>
    </article>
  );
}
