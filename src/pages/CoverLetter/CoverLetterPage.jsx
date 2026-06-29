import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHero from "../../components/common/PageHero";
import { searchJobPostings } from "../../services/jobPostingService";
import { getCoverLetters } from "../../services/coverLetterService";

export default function CoverLetterPage() {
  const navigate = useNavigate();

  // ── 기존 자소서 목록 ─────────────────────────────────────
  const [coverLetters, setCoverLetters] = useState([]);

  useEffect(() => {
    getCoverLetters().then(setCoverLetters).catch(console.error);
  }, []);

  // ── 기업/직무 선택 ───────────────────────────────────────
  const [companyQuery, setCompanyQuery]         = useState("");
  const [companyOpen, setCompanyOpen]           = useState(false);
  const [searchResults, setSearchResults]       = useState([]);
  const [searching, setSearching]               = useState(false);
  const [selectedCompany, setSelectedCompany]   = useState("");
  const [selectedJobName, setSelectedJobName]   = useState("");
  const [selectedPosting, setSelectedPosting]   = useState(null);
  const companyRef  = useRef(null);
  const debounceRef = useRef(null);

  // debounce 검색
  const handleCompanyInput = useCallback((value) => {
    setCompanyQuery(value);
    setSelectedCompany("");
    setSelectedJobName("");
    setSelectedPosting(null);
    setCompanyOpen(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim()) { setSearchResults([]); return; }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const items = await searchJobPostings(value.trim(), 50);
        setSearchResults(items);
      } catch (e) {
        console.error(e);
      } finally {
        setSearching(false);
      }
    }, 300);
  }, []);

  // 유니크 기업명 목록
  const companyResults = (() => {
    if (!companyQuery.trim()) return [];
    const lower = companyQuery.toLowerCase();
    return [
      ...new Set(
        searchResults
          .filter((p) => p.companyName?.toLowerCase().includes(lower))
          .map((p) => p.companyName)
      ),
    ].slice(0, 15);
  })();

  // 선택 기업의 직무 목록
  const jobOptions = (() => {
    if (!selectedCompany) return [];
    return [
      ...new Set(
        searchResults
          .filter((p) => p.companyName === selectedCompany)
          .map((p) => p.jobName)
          .filter(Boolean)
      ),
    ];
  })();

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    function onClickOutside(e) {
      if (companyRef.current && !companyRef.current.contains(e.target)) {
        setCompanyOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleSelectCompany(name) {
    setSelectedCompany(name);
    setCompanyQuery(name);
    setSelectedJobName("");
    setSelectedPosting(null);
    setCompanyOpen(false);
  }

  function handleSelectJob(jobName) {
    setSelectedJobName(jobName);
    const posting = searchResults.find(
      (p) => p.companyName === selectedCompany && p.jobName === jobName
    );
    setSelectedPosting(posting ?? null);
  }

  // ── 자소서 생성 페이지로 이동 ────────────────────────────
  function handleGenerate() {
    if (!selectedCompany || !selectedJobName) {
      alert("기업과 직무를 선택해주세요.");
      return;
    }

    const jobDescription = [selectedPosting?.requirements, selectedPosting?.responsibilities]
      .filter(Boolean)
      .join("\n\n");

    navigate("/cover-letters/generate", {
      state: {
        jobPostingId: selectedPosting?.jobPostingId ?? null,
        companyName:  selectedCompany,
        jobTitle:     selectedJobName,
        jobDescription,
      },
    });
  }

  // ── 렌더링 ───────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-[1120px] space-y-10 py-6">
      <PageHero
        badge="자소서 관리"
        title="기업 맞춤 자기소개서를 생성하세요"
        description="기업과 직무를 선택하면 이력서 기반으로 자기소개서를 자동 생성합니다."
      />

      {/* 자소서 설정 카드 */}
      <section className="rounded-[32px] border border-slate-200 bg-white p-8 dark:bg-slate-900 dark:border-slate-700">
        <h2 className="text-2xl font-black mb-6 dark:text-white">자소서 설정</h2>

        <div className="grid gap-6 lg:grid-cols-2">

          {/* 기업 검색 */}
          <div ref={companyRef} className="relative">
            <label className="mb-2 block font-black dark:text-white">기업</label>
            <input
              type="text"
              value={companyQuery}
              onChange={(e) => handleCompanyInput(e.target.value)}
              onFocus={() => setCompanyOpen(true)}
              placeholder="기업명을 검색하세요"
              className="w-full rounded-xl border dark:border-slate-600 dark:bg-slate-700 dark:text-white p-4 outline-none focus:border-blue-500"
            />
            {searching && (
              <div className="absolute right-4 top-[54px] text-[12px] text-slate-400">
                검색 중...
              </div>
            )}
            {companyOpen && companyResults.length > 0 && (
              <ul className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[220px] overflow-y-auto rounded-xl border border-slate-100 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xl">
                {companyResults.map((name) => (
                  <li
                    key={name}
                    onClick={() => handleSelectCompany(name)}
                    className="cursor-pointer px-4 py-3 text-[14px] dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            )}
            {companyOpen && !searching && companyQuery.trim() && companyResults.length === 0 && searchResults.length === 0 && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-xl border border-slate-100 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-[14px] text-slate-400 shadow-xl">
                검색 결과가 없습니다.
              </div>
            )}
          </div>

          {/* 직무 선택 */}
          <div>
            <label className="mb-2 block font-black dark:text-white">직무</label>
            <select
              value={selectedJobName}
              disabled={!selectedCompany}
              onChange={(e) => handleSelectJob(e.target.value)}
              className="w-full rounded-xl border dark:border-slate-600 dark:bg-slate-700 dark:text-white p-4 disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:text-slate-400"
            >
              <option value="">
                {selectedCompany ? "직무 선택" : "기업을 먼저 선택하세요"}
              </option>
              {jobOptions.map((job) => (
                <option key={job} value={job}>{job}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          className="mt-8 w-full rounded-xl bg-blue-600 hover:bg-blue-700 py-4 text-lg font-black text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          자소서 생성하기
        </button>
      </section>

      {/* 기존 자소서 목록 */}
      <section className="rounded-[32px] border border-slate-200 bg-white p-8 dark:bg-slate-900 dark:border-slate-700">
        <h2 className="text-2xl font-black mb-6 dark:text-white">생성된 자소서</h2>
        {coverLetters.length === 0 ? (
          <p className="text-center text-slate-400 py-8">생성된 자소서가 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {coverLetters.map((cl) => (
              <div
                key={cl.coverLetterId}
                onClick={() => navigate(`/cover-letters/${cl.coverLetterId}`)}
                className="flex items-center justify-between rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-6 py-4 cursor-pointer hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
              >
                <div>
                  <div className="font-black text-slate-800 dark:text-slate-200">{cl.companyName}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{cl.jobTitle}</div>
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500 shrink-0 ml-4">
                  {cl.createdAt ? new Date(cl.createdAt).toLocaleDateString("ko-KR") : ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
