import { useNavigate } from "react-router-dom";
import { HiBookmark, HiOutlineBookmark } from "react-icons/hi";

/**
 * 통합 기업 카드
 *
 * API 카드 필드:   company_name, job_name, overall_score, job_posting_id, is_favorite, apply_url, career_level, tech_stacks
 * CSV 카드 필드:   company_name, job_title, career_level, deadline, apply_url, tech_stacks
 *
 * Props:
 *  - company              : 위 필드를 가진 객체
 *  - onToggleFavorite(id) : API 카드용 북마크 토글
 *  - onRemove(company)    : CSV 카드용 북마크 클릭 → 관심 기업 해제
 */
export default function CompanyCard({ company, onToggleFavorite, onRemove }) {
  const navigate = useNavigate();

  // 프론트 snake_case 필드 + 백엔드 camelCase 필드 모두 수용
  const companyName  = company.company_name ?? company.companyName ?? "";
  const jobName      = company.job_name ?? company.jobName ?? company.job_title ?? "";
  const careerLevel  = company.career_level ?? company.careerCondition ?? "";
  const deadline     = company.deadline ?? company.deadlineDate ?? "";
  const applyUrl     = company.apply_url ?? company.originalUrl ?? "";
  const score        = company.overall_score ?? null;
  const jobPostingId = company.job_posting_id ?? company.jobPostingId ?? null;

  // tech_stacks: "Python, FastAPI, Flask" → ["Python", "FastAPI", "Flask"]
  const techs = company.tech_stacks
    ? String(company.tech_stacks).split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  // CSV 카드는 항상 북마크가 채워진 상태 (관심 기업에 있으므로)
  const isBookmarked = onRemove ? true : !!company.is_favorite;

  function handleBookmark() {
    if (onToggleFavorite) onToggleFavorite(jobPostingId);
    else if (onRemove) onRemove(company);
  }

  function goInterview() {
    const params = new URLSearchParams({ company: companyName, job: jobName });
    navigate(`/interview/setup?${params.toString()}`);
  }

  function goReport() {
    if (jobPostingId) navigate(`/report/${jobPostingId}`);
  }

  function goCoverLetter() {
    if (jobPostingId) navigate(`/cover-letter/${jobPostingId}`);
    else navigate("/cover-letters");
  }

  return (
    <article className="relative flex flex-col rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm">

      {/* 북마크 — 항상 표시 */}
      <button
        type="button"
        onClick={handleBookmark}
        className="absolute right-5 top-5 text-[22px] transition hover:text-blue-600"
        style={{ color: isBookmarked ? "#2563eb" : "#cbd5e1" }}
        title={isBookmarked ? "관심 기업 해제" : "관심 기업 등록"}
      >
        {isBookmarked ? <HiBookmark /> : <HiOutlineBookmark />}
      </button>

      {/* 경력 조건 */}
      {careerLevel && (
        <p className="mb-1 text-[12px] font-medium text-slate-400">{careerLevel}</p>
      )}

      {/* 회사명 */}
      <h3 className="text-[22px] font-black text-slate-900 leading-tight pr-8">
        {companyName}
      </h3>

      {/* 직무명 */}
      <p className="mt-1 text-[14px] text-slate-500">{jobName}</p>

      {/* 마감일 */}
      {deadline && (
        <p className="mt-2 flex items-center gap-1 text-[12px] text-slate-400">
          <span>📅</span>
          <span>{deadline}</span>
        </p>
      )}

      {/* 매칭률 */}
      <div className="mt-4">
        <p className="text-[13px] font-bold text-slate-500">1차 직무 매칭률</p>
        {score !== null ? (
          <>
            <p className="mt-1 text-[40px] font-black text-blue-600 leading-none">
              {score.toFixed(2)}%
            </p>
            <div className="mt-3 h-2 rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{ width: `${Math.min(score, 100)}%` }}
              />
            </div>
          </>
        ) : (
          <>
            <p className="mt-1 text-[20px] font-black text-slate-300">분석 전</p>
            <div className="mt-3 h-2 rounded-full bg-slate-100" />
          </>
        )}
      </div>

      {/* 기술 스택 태그 */}
      {techs.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {techs.slice(0, 6).map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-medium text-blue-600"
            >
              {tech}
            </span>
          ))}
          {techs.length > 6 && (
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] text-slate-400">
              +{techs.length - 6}
            </span>
          )}
        </div>
      )}

      {/* 버튼 영역 */}
      <div className="mt-auto pt-5 space-y-2">
        <button
          onClick={goReport}
          disabled={!jobPostingId}
          className="w-full rounded-xl border border-blue-600 py-3 text-[13px] font-black text-blue-600 hover:bg-blue-50 transition disabled:border-slate-200 disabled:text-slate-300 disabled:cursor-not-allowed"
        >
          분석 리포트 보기
        </button>

        <button
          onClick={goInterview}
          className="w-full rounded-xl bg-blue-600 py-3 text-[13px] font-black text-white hover:bg-blue-700 transition"
        >
          모의 면접 보러가기
        </button>

        <button
          onClick={goCoverLetter}
          className="w-full rounded-xl border border-slate-300 py-3 text-[13px] font-black text-slate-700 hover:bg-slate-50 transition"
        >
          자소서 생성
        </button>

        {applyUrl && (
          <a
            href={applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-xl bg-slate-800 py-3 text-center text-[13px] font-black text-white hover:bg-slate-700 transition"
          >
            공고 바로가기 →
          </a>
        )}
      </div>
    </article>
  );
}
