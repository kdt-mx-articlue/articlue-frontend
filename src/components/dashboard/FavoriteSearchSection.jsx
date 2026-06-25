import { useCallback, useEffect, useRef, useState } from "react";
import { searchJobPostings } from "../../services/jobPostingService";

export default function FavoriteSearchSection({ onFavorite, favoriteKeys }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const timerRef = useRef(null);

  // 디바운스 검색
  const doSearch = useCallback((q) => {
    clearTimeout(timerRef.current);
    if (!q.trim()) { setResults([]); setLoading(false); return; }
    setLoading(true);
    timerRef.current = setTimeout(async () => {
      try {
        const data = await searchJobPostings(q, 20);
        setResults(data);
      } catch (err) {
        console.error("[FavoriteSearchSection] 검색 실패:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  useEffect(() => { doSearch(query); }, [query, doSearch]);

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

  return (
    <section className="rounded-[28px] bg-white p-8 shadow-sm">
      <h2 className="mb-5 text-[26px] font-black">관심 기업 찾기</h2>

      <div ref={containerRef} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="기업명 또는 직무명을 입력하세요"
          className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:border-blue-500"
        />

        {/* 검색 결과 드롭다운 */}
        {open && query.trim() && (
          <ul className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[320px] overflow-y-auto rounded-2xl border border-slate-100 bg-white shadow-xl">
            {loading ? (
              <li className="px-5 py-4 text-[14px] text-slate-400">검색 중...</li>
            ) : results.length === 0 ? (
              <li className="px-5 py-4 text-[14px] text-slate-400">
                "{query}"에 해당하는 기업이 없습니다
              </li>
            ) : (
              results.map((item) => {
                const id = String(item.jobPostingId ?? "");
                const alreadyFavorited = id && favoriteKeys.includes(id);
                return (
                  <li
                    key={item.jobPostingId}
                    onClick={() => !alreadyFavorited && handleSelect(item)}
                    className={`flex items-center justify-between gap-3 px-5 py-3.5 transition-colors ${
                      alreadyFavorited
                        ? "cursor-default bg-slate-50 opacity-60"
                        : "cursor-pointer hover:bg-blue-50"
                    }`}
                  >
                    <div>
                      <p className="text-[14px] font-bold text-slate-800">
                        {item.companyName}
                      </p>
                      <p className="text-[12px] text-slate-500">
                        {item.jobName} · {item.careerLevel ?? item.career_level}
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
              })
            )}
          </ul>
        )}

        {/* 초기 안내 */}
        {!query.trim() && (
          <div className="mt-3 flex h-[80px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50">
            <span className="text-slate-400">기업명을 검색하면 공고가 표시됩니다</span>
          </div>
        )}
      </div>
    </section>
  );
}
