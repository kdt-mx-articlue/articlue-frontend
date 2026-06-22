export default function FavoriteCompanyEmptyCard() {
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
        ❤️
      </div>

      <h3
        className="
          text-xl
          font-black
          text-slate-900
        "
      >
        관심 기업 없음
      </h3>

      <p
        className="
          mt-3
          text-center
          text-sm
          text-slate-500
        "
      >
        기업을 검색 후 등록하세요
      </p>

    </article>
  );
}