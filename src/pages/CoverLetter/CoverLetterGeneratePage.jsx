import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import {
  extractCoverLetterQuestions,
  generateCoverLetter,
} from "../../services/coverLetterService";
import { getJobPostingDetail } from "../../services/jobPostingService";

/**
 * 자소서 생성 흐름 페이지
 *
 * 진입 방법: navigate("/cover-letters/generate", { state: { jobPostingId, companyName, jobTitle, jobDescription } })
 *
 * 단계:
 *   extracting → 공고에서 문항 자동 추출 중 (로딩)
 *   editing    → 추출된 문항 확인/수정
 *   generating → 자소서 생성 중 (LoadingOverlay)
 */
export default function CoverLetterGeneratePage() {
  const navigate = useNavigate();
  const location = useLocation();

  // 이전 페이지에서 navigate state로 전달받은 공고 정보
  const {
    jobPostingId,
    companyName = "",
    jobTitle = "",
    jobDescription = "",
  } = location.state ?? {};

  const [step, setStep] = useState("extracting"); // extracting | editing | generating
  const [questions, setQuestions] = useState([]);
  const [source, setSource] = useState("default"); // extracted | default
  const [extractError, setExtractError] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");

  // ── 1단계: 마운트 시 문항 자동 추출 ──────────────────────
  useEffect(() => {
    if (!companyName) {
      navigate("/cover-letters");
      return;
    }
    runExtract(jobDescription);
  }, []);

  const runExtract = async (jd) => {
    setStep("extracting");
    try {
      // jobDescription이 없으면 jobPostingId로 공고 상세 조회
      let description = jd;
      if (!description && jobPostingId) {
        const detail = await getJobPostingDetail(jobPostingId);
        if (detail) {
          description = [detail.requirements, detail.responsibilities]
            .filter(Boolean)
            .join("\n\n");
        }
      }

      const result = await extractCoverLetterQuestions({ jobDescription: description || "" });
      setQuestions(result.questions ?? []);
      setSource(result.source ?? "default");
    } catch {
      setExtractError(true);
      setQuestions([
        "지원 동기",
        "성장과정 및 가치관",
        "직무 관련 경험 및 역량",
        "팀 협업 및 갈등 해결 경험",
        "입사 후 포부 및 목표",
      ]);
      setSource("default");
    } finally {
      setStep("editing");
    }
  };

  // ── 문항 편집 핸들러 ──────────────────────────────────────
  const handleQuestionChange = (index, value) => {
    setQuestions((prev) => prev.map((q, i) => (i === index ? value : q)));
  };

  const handleDeleteQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddQuestion = () => {
    const trimmed = newQuestion.trim();
    if (!trimmed) return;
    setQuestions((prev) => [...prev, trimmed]);
    setNewQuestion("");
  };

  // ── 2단계: 자소서 생성 ───────────────────────────────────
  const handleGenerate = async () => {
    if (questions.length === 0) return;
    setStep("generating");
    try {
      const result = await generateCoverLetter({
        jobPostingId,
        companyName,
        jobTitle,
        jobDescription,
        questions,
      });
      // 생성 완료 → 상세 페이지로 이동
      navigate(`/cover-letters/${result.coverLetterId}`);
    } catch (e) {
      alert("자소서 생성에 실패했습니다: " + e.message);
      setStep("editing");
    }
  };

  // ── 렌더링 ───────────────────────────────────────────────

  // 문항 추출 중
  if (step === "extracting") {
    return (
      <div className="mx-auto max-w-[1120px] py-20 flex flex-col items-center gap-6">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-lg">공고에서 자소서 문항을 분석하고 있습니다...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1120px] space-y-10 py-6">
      {/* 자소서 생성 중 오버레이 */}
      {step === "generating" && <LoadingOverlay />}

      {/* 헤더 */}
      <div className="rounded-[32px] border border-slate-200 bg-white p-8 dark:bg-slate-900 dark:border-slate-700">
        <div className="inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-600 mb-4">
          자소서 생성
        </div>
        <h1 className="text-3xl font-black dark:text-white">
          {companyName} — {jobTitle}
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          {source === "extracted"
            ? "공고에서 자소서 문항을 추출했습니다. 문항을 확인하고 수정해주세요."
            : "공고에서 문항을 찾지 못해 기본 문항을 사용합니다. 필요하면 수정해주세요."}
        </p>
        {extractError && (
          <p className="mt-1 text-sm text-amber-500">* 문항 추출 중 오류가 발생해 기본 문항을 사용합니다.</p>
        )}
      </div>

      {/* 문항 편집 */}
      <section className="rounded-[32px] border border-slate-200 bg-white p-8 dark:bg-slate-900 dark:border-slate-700">
        <h2 className="text-xl font-black mb-6 dark:text-white">자소서 문항</h2>

        <div className="space-y-3">
          {questions.map((q, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="text-blue-600 font-bold text-sm w-8 shrink-0">Q{index + 1}</span>
              <input
                type="text"
                value={q}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => handleDeleteQuestion(index)}
                className="px-3 py-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition text-sm"
              >
                삭제
              </button>
            </div>
          ))}
        </div>

        {/* 문항 추가 */}
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <span className="text-slate-400 font-bold text-sm w-8 shrink-0">+</span>
          <input
            type="text"
            placeholder="문항 직접 추가..."
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddQuestion()}
            className="flex-1 px-4 py-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleAddQuestion}
            className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-sm font-semibold"
          >
            추가
          </button>
        </div>
      </section>

      {/* 액션 버튼 */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition font-semibold"
        >
          취소
        </button>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={questions.length === 0 || step === "generating"}
          className="px-8 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          이 문항으로 생성하기
        </button>
      </div>
    </div>
  );
}
