import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import PageHero from "../../components/common/PageHero";
import { searchJobPostings } from "../../services/jobPostingService";

export default function InterviewSetupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 기업 검색
  const [companyQuery, setCompanyQuery] = useState("");
  const [companyOpen, setCompanyOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]); // API 결과 (posting 목록)
  const [searching, setSearching] = useState(false);
  const companyRef = useRef(null);
  const debounceRef = useRef(null);

  // 선택된 값
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedJobName, setSelectedJobName] = useState("");
  const [selectedJobPostingId, setSelectedJobPostingId] = useState(null);

  // 면접 설정
  const [difficulty, setDifficulty] = useState("중");
  const [interviewerType, setInterviewerType] = useState("실무형");
  const [questionCount, setQuestionCount] = useState(10);
  const [interviewMode, setInterviewMode] = useState("CHATBOT");

  // 쿼리 파라미터 자동 선택 (?company=XXX&job=YYY)
  useEffect(() => {
    const company = searchParams.get("company");
    const job = searchParams.get("job");
    if (company) {
      setSelectedCompany(company);
      setCompanyQuery(company);
      // 파라미터로 들어온 경우 해당 키워드로 미리 검색
      searchJobPostings(company, 50).then((items) => {
        setSearchResults(items);
        if (job) setSelectedJobName(job);
      });
    }
  }, [searchParams]);

  // debounce API 검색
  const handleCompanyInput = useCallback((value) => {
    setCompanyQuery(value);
    setSelectedCompany("");
    setSelectedJobName("");
    setSelectedJobPostingId(null);
    setCompanyOpen(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

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

  // 기업 드롭다운: 유니크 기업명
  const companyResults = (() => {
    if (!companyQuery.trim()) return [];
    const lower = companyQuery.toLowerCase();
    const names = [
      ...new Set(
        searchResults
          .filter((p) => p.companyName?.toLowerCase().includes(lower))
          .map((p) => p.companyName)
      ),
    ];
    return names.slice(0, 15);
  })();

  // 선택된 기업의 직무 목록
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
    setSelectedJobPostingId(null);
    setCompanyOpen(false);
  }

  function handleSelectJob(jobName) {
    setSelectedJobName(jobName);
    // 해당 기업+직무의 jobPostingId 추출
    const posting = searchResults.find(
      (p) => p.companyName === selectedCompany && p.jobName === jobName
    );
    setSelectedJobPostingId(posting?.jobPostingId ?? null);
  }

  const INTERVIEWER_STYLE_MAP = {
    "친절형": "CALM",
    "실무형": "PRACTICAL",
    "압박형": "SHARP",
  };

  function getResumeId() {
    try {
      const raw = localStorage.getItem("articlue-resume-store");
      return JSON.parse(raw || "{}")?.state?.resumeId ?? null;
    } catch {
      return null;
    }
  }

  function handleStartInterview() {
    if (!selectedCompany || !selectedJobName) {
      alert("기업 및 직무를 선택해주세요.");
      return;
    }

    const setupData = {
      company_name:      selectedCompany,
      job_name:          selectedJobName,
      difficulty,
      interviewer_type:  interviewerType,
      interviewer_style: INTERVIEWER_STYLE_MAP[interviewerType] ?? "CALM",
      question_count:    questionCount,
      interview_mode:    interviewMode,
      chat_mode:         interviewMode === "TTS" ? "VOICE" : "TEXT",
      resume_id:         getResumeId(),
      job_posting_id:    selectedJobPostingId,
      started_at:        new Date().toISOString(),
    };

    localStorage.setItem("interviewSetup", JSON.stringify(setupData));

    if (interviewMode === "CHATBOT") {
      navigate("/interview/chat");
    } else {
      navigate("/interview/tts");
    }
  }

  return (
    <div className="mx-auto max-w-[1120px] space-y-10">
      <PageHero
        badge="면접 준비"
        subBadge="면접 설정"
        title="실전 면접을 시작하기 전 조건을 설정하세요"
        description="기업별 맞춤 질문으로 모의 면접을 진행할 수 있습니다."
        statTitle="면접 준비"
        statValue="Ready"
        statDescription="설정 완료 후 면접 시작"
      />

      <section className="rounded-[28px] bg-white dark:bg-slate-800 p-8">
        <h2 className="mb-8 text-2xl font-black dark:text-white">면접 설정</h2>

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

          {/* 직무 */}
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

          {/* 난이도 */}
          <div>
            <label className="mb-2 block font-black dark:text-white">난이도</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full rounded-xl border dark:border-slate-600 dark:bg-slate-700 dark:text-white p-4"
            >
              <option>하</option>
              <option>중</option>
              <option>상</option>
            </select>
          </div>

          {/* 면접관 성향 */}
          <div>
            <label className="mb-2 block font-black dark:text-white">면접관 성향</label>
            <select
              value={interviewerType}
              onChange={(e) => setInterviewerType(e.target.value)}
              className="w-full rounded-xl border dark:border-slate-600 dark:bg-slate-700 dark:text-white p-4"
            >
              <option>친절형</option>
              <option>실무형</option>
              <option>압박형</option>
            </select>
          </div>

          {/* 질문 수 */}
          <div>
            <label className="mb-2 block font-black dark:text-white">질문 수</label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full rounded-xl border dark:border-slate-600 dark:bg-slate-700 dark:text-white p-4"
            >
              <option value={5}>5문항</option>
              <option value={10}>10문항</option>
              <option value={15}>15문항</option>
              <option value={20}>20문항</option>
            </select>
          </div>

          {/* 유형 */}
          <div>
            <label className="mb-2 block font-black dark:text-white">유형</label>
            <select
              value={interviewMode}
              onChange={(e) => setInterviewMode(e.target.value)}
              className="w-full rounded-xl border dark:border-slate-600 dark:bg-slate-700 dark:text-white p-4"
            >
              <option value="CHATBOT">CHATBOT</option>
              <option value="TTS">TTS</option>
            </select>
          </div>

        </div>

        {/* 선택된 채용공고 ID 확인 (개발용) */}
        {selectedJobPostingId && (
          <div className="mt-4 text-[12px] text-slate-400 dark:text-slate-500">
            채용공고 ID: {selectedJobPostingId}
          </div>
        )}

        <button
          onClick={handleStartInterview}
          className="mt-10 w-full rounded-xl bg-blue-600 hover:bg-blue-700 py-4 text-lg font-black text-white transition-colors"
        >
          모의 면접 시작
        </button>
      </section>
    </div>
  );
}
