import { useEffect, useMemo, useRef, useState } from "react";

import {
  loadJobPostings,
  searchJobPostings,
} from "../../utils/jobPostingsLoader";

export default function FavoriteSearchSection({ onFavorite, favoriteKeys }) {
  const [query, setQuery] = useState("");
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true); // 초기값 true — effect에서 동기 setState 불필요
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // CSV 데이터 초기 로드
  useEffect(() => {
    loadJobPostings()
      .then((data) => setAllData(data))
      .catch((err) => console.error("job_postings.csv 로드 실패:", err))
      .finally(() => setLoading(false));
  }, []);

  // 검색 결과: useEffect 대신 useMemo로 파생
  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchJobPostings(query, allData).slice(0, 20);
  }, [query, allData]);

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(item) {
    onFavorite(item);
    setQuery("");
    setOpen(false);
  }

  function getKey(item) {
    return `${item.company_name}__${item.job_title}`;
  }

  return (
    <section className="rounded-[28px] bg-white p-8 shadow-sm">
      <h2 className="mb-5 text-[26px] font-black">관심 기업 찾기</h2>

      <div ref={containerRef} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={
            loading ? "공고 데이터 로딩 중..." : "기업명 또는 직무명을 입력하세요"
          }
          disabled={loading}
          className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
        />

        {/* 검색 결과 드롭다운 */}
        {open && results.length > 0 && (
          <ul className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[320px] overflow-y-auto rounded-2xl border border-slate-100 bg-white shadow-xl">
            {results.map((item) => {
              const key = getKey(item);
              const alreadyFavorited = favoriteKeys.includes(key);
              return (
                <li
                  key={key}
                  onClick={() => !alreadyFavorited && handleSelect(item)}
                  className={`flex items-center justify-between gap-3 px-5 py-3.5 transition-colors ${
                    alreadyFavorited
                      ? "cursor-default bg-slate-50 opacity-60"
                      : "cursor-pointer hover:bg-blue-50"
                  }`}
                >
                  <div>
                    <p className="text-[14px] font-bold text-slate-800">
                      {item.company_name}
                    </p>
                    <p className="text-[12px] text-slate-500">
                      {item.job_title} · {item.career_level}
                    </p>
                  </div>
                  {alreadyFavorited ? (
                    <span className="flex-shrink-0 rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-semibold text-blue-500">
                      찜 완료
                    </span>
                  ) : (
                    <span className="flex-shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] text-slate-400">
                      + 찜하기
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {/* 검색어 있는데 결과 없음 */}
        {query.trim() && results.length === 0 && !loading && (
          <div className="mt-3 flex h-[80px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50">
            <span className="text-[14px] text-slate-400">
              "{query}"에 해당하는 기업이 없습니다
            </span>
          </div>
        )}

        {/* 초기 안내 */}
        {!query.trim() && !loading && (
          <div className="mt-3 flex h-[80px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50">
            <span className="text-slate-400">기업명을 검색하면 공고가 표시됩니다</span>
          </div>
        )}
      </div>
    </section>
  );
}