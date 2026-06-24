import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import PageHero from "../../components/common/PageHero";
import { loadJobPostings } from "../../utils/jobPostingsLoader";

export default function InterviewSetupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // CSV 전체 데이터
  const [allData, setAllData] = useState([]);

  // 기업 검색 인풋
  const [companyQuery, setCompanyQuery] = useState("");
  const [companyOpen, setCompanyOpen] = useState(false);
  const companyRef = useRef(null);

  // 선택된 값
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedJobName, setSelectedJobName] = useState("");

  // 면접 설정
  const [difficulty, setDifficulty] = useState("중");
  const [interviewerType, setInterviewerType] = useState("실무형");
  const [questionCount, setQuestionCount] = useState(10);
  const [interviewMode, setInterviewMode] = useState("CHATBOT");

  // CSV 로드
  useEffect(() => {
    loadJobPostings().then(setAllData).catch(console.error);
  }, []);

  // 쿼리 파라미터로 자동 선택 (?company=XXX&job=YYY)
  useEffect(() => {
    const company = searchParams.get("company");
    const job = searchParams.get("job");
    if (company) { setSelectedCompany(company); setCompanyQuery(company); }
    if (job) setSelectedJobName(job);
  }, [searchParams]);

  // 기업 검색 결과 (useMemo)
  const companyResults = useMemo(() => {
    if (!companyQuery.trim()) return [];
    const lower = companyQuery.toLowerCase();
    const names = [
      ...new Set(
        allData
          .filter((d) => d.company_name?.toLowerCase().includes(lower))
          .map((d) => d.company_name)
      ),
    ];
    return names.slice(0, 15);
  }, [companyQuery, allData]);

  // 선택된 기업의 직무 목록
  const jobOptions = useMemo(() => {
    if (!selectedCompany) return [];
    return allData
      .filter((d) => d.company_name === selectedCompany)
      .map((d) => d.job_title)
      .filter(Boolean);
  }, [selectedCompany, allData]);

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
    setCompanyOpen(false);
  }

  const INTERVIEWER_STYLE_MAP = {
    "친절형": "CALM",
    "실무형": "NEUTRAL",
    "압박형": "PRESSURE",
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
      job_posting_id:    null,
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
    <div
      className="
        mx-auto
        max-w-[1120px]
        space-y-10
      "
    >
      <PageHero
        badge="면접 준비"
        subBadge="면접 설정"
        title="실전 면접을 시작하기 전 조건을 설정하세요"
        description="기업별 맞춤 질문으로 모의 면접을 진행할 수 있습니다."
        statTitle="면접 준비"
        statValue="Ready"
        statDescription="설정 완료 후 면접 시작"
      />

      <section
        className="
          rounded-[28px]
          bg-white
          p-8
        "
      >
        <h2
          className="
            mb-8
            text-2xl
            font-black
          "
        >
          면접 설정
        </h2>

        <div
          className="
            grid
            gap-6
            lg:grid-cols-2
          "
        >
          {/* 기업 검색 */}
          <div ref={companyRef} className="relative">
            <label className="mb-2 block font-black">기업</label>
            <input
              type="text"
              value={companyQuery}
              onChange={(e) => {
                setCompanyQuery(e.target.value);
                setSelectedCompany("");
                setSelectedJobName("");
                setCompanyOpen(true);
              }}
              onFocus={() => setCompanyOpen(true)}
              placeholder="기업명을 검색하세요"
              className="w-full rounded-xl border p-4 outline-none focus:border-blue-500"
            />
            {companyOpen && companyResults.length > 0 && (
              <ul className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[220px] overflow-y-auto rounded-xl border border-slate-100 bg-white shadow-xl">
                {companyResults.map((name) => (
                  <li
                    key={name}
                    onClick={() => handleSelectCompany(name)}
                    className="cursor-pointer px-4 py-3 text-[14px] hover:bg-blue-50 transition-colors"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 직무 */}
          <div>
            <label className="mb-2 block font-black">직무</label>
            <select
              value={selectedJobName}
              disabled={!selectedCompany}
              onChange={(e) => setSelectedJobName(e.target.value)}
              className="w-full rounded-xl border p-4 disabled:bg-slate-50 disabled:text-slate-400"
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
            <label
              className="
                mb-2
                block
                font-black
              "
            >
              난이도
            </label>

            <select
              value={difficulty}
              onChange={(e) =>
                setDifficulty(
                  e.target.value
                )
              }
              className="
                w-full
                rounded-xl
                border
                p-4
              "
            >
              <option>
                하
              </option>

              <option>
                중
              </option>

              <option>
                상
              </option>
            </select>
          </div>

          {/* 면접관 성향 */}

          <div>
            <label
              className="
                mb-2
                block
                font-black
              "
            >
              면접관 성향
            </label>

            <select
              value={
                interviewerType
              }
              onChange={(e) =>
                setInterviewerType(
                  e.target.value
                )
              }
              className="
                w-full
                rounded-xl
                border
                p-4
              "
            >
              <option>
                친절형
              </option>

              <option>
                실무형
              </option>

              <option>
                압박형
              </option>
            </select>
          </div>

          {/* 질문 수 */}

          <div>
            <label
              className="
                mb-2
                block
                font-black
              "
            >
              질문 수
            </label>

            <select
              value={
                questionCount
              }
              onChange={(e) =>
                setQuestionCount(
                  Number(
                    e.target.value
                  )
                )
              }
              className="
                w-full
                rounded-xl
                border
                p-4
              "
            >
              <option value={5}>
                5문항
              </option>

              <option value={10}>
                10문항
              </option>

              <option value={15}>
                15문항
              </option>

              <option value={20}>
                20문항
              </option>
            </select>
          </div>

          {/* 유형 */}

          <div>
            <label
              className="
                mb-2
                block
                font-black
              "
            >
              유형
            </label>

            <select
              value={
                interviewMode
              }
              onChange={(e) =>
                setInterviewMode(
                  e.target.value
                )
              }
              className="
                w-full
                rounded-xl
                border
                p-4
              "
            >
              <option value="CHATBOT">
                CHATBOT
              </option>

              <option value="TTS">
                TTS
              </option>
            </select>
          </div>
        </div>

        <button
          onClick={
            handleStartInterview
          }
          className="
            mt-10
            w-full
            rounded-xl
            bg-blue-600
            py-4
            text-lg
            font-black
            text-white
          "
        >
          모의 면접 시작
        </button>
      </section>
    </div>
  );
}