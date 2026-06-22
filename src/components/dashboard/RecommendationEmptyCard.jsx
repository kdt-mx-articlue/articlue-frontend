export default function RecommendationEmptyCard() {
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
        border-dashed
        border-slate-300
        bg-white
        p-6
      "
    >
      <div className="mb-5 text-5xl">
        🎯
      </div>

      <h3
        className="
          text-xl
          font-black
          text-slate-900
        "
      >
        추천 기업 준비 중
      </h3>

      <p
        className="
          mt-3
          text-center
          text-sm
          text-slate-500
        "
      >
        추천 데이터가 연결되면
        표시됩니다.
      </p>

    </article>
  );
}