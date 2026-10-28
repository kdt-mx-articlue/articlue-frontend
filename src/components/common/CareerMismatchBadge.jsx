/**
 * 경력 요건 미달 표시
 * 공고 요구 경력이 이력서 경력보다 2년 넘게 높으면 AI 가 매칭 점수를 크게 깎고 careerCheck.mismatch = true
 *
 * Props:
 *   careerCheck - { mismatch, requiredYears, resumeYears } (분석 결과, 없으면 표시 안 함)
 *   compact     - 검색 목록 등 좁은 곳용 짧은 문구
 */
export default function CareerMismatchBadge({ careerCheck, compact = false }) {
  if (!careerCheck?.mismatch) return null;

  const required = careerCheck.requiredYears;
  const resume = Number(careerCheck.resumeYears ?? 0);
  const detail = required != null ? `요구 ${required}년 / 보유 ${resume % 1 === 0 ? resume : resume.toFixed(1)}년` : "";

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full bg-rose-50 dark:bg-rose-900/30 px-2.5 py-0.5 text-[11px] font-bold text-rose-500 dark:text-rose-400"
      title="공고가 요구하는 경력이 이력서 경력보다 2년 넘게 높아 매칭 점수가 감점되었습니다."
    >
      경력 요건 미달{!compact && detail ? ` (${detail})` : ""}
    </span>
  );
}
