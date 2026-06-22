export default function FavoriteSearchSection() {
  return (
    <section
      className="
        rounded-[28px]
        bg-white
        p-8
        shadow-sm
      "
    >
      <h2
        className="
          mb-5
          text-[26px]
          font-black
        "
      >
        관심 기업 찾기
      </h2>

      <input
        type="text"
        placeholder="기업명을 입력하세요"
        className="
          w-full
          rounded-2xl
          border
          border-slate-200
          px-5
          py-4
          outline-none
          focus:border-blue-500
        "
      />

      <div
        className="
          mt-5
          flex
          h-[120px]
          items-center
          justify-center
          rounded-2xl
          border
          border-dashed
          border-slate-300
          bg-slate-50
        "
      >
        <span className="text-slate-400">
          기업 검색 API 연결 예정
        </span>
      </div>
    </section>
  );
}