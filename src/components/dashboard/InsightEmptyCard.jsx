export default function InsightEmptyCard() {
  return (
    <article
      className="
        flex
        aspect-[6/4.2]
        flex-col
        items-center
        justify-center
        rounded-[28px]
        border
        border-slate-200
        bg-white
      "
    >
      <div className="mb-5 text-5xl">
        📰
      </div>

      <h3
        className="
          text-xl
          font-black
          text-slate-900
        "
      >
        IT 인사이트 준비중
      </h3>

      <p
        className="
          mt-3
          text-center
          text-sm
          text-slate-500
        "
      >
        기사 API 연결 예정
      </p>

    </article>
  );
}