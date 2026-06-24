/**
 * 멤버십 가입 모달 — 공통 컴포넌트
 * InterviewPage / MembershipCard 양쪽에서 재사용
 */

const PLANS = [
  {
    id: "basic",
    name: "BASIC",
    price: "9,900원",
    period: "/ 월",
    color: "border-blue-200 bg-blue-50",
    badgeColor: "bg-blue-100 text-blue-700",
    benefits: [
      "모의 면접 월 10회",
      "AI 면접 리포트 제공",
      "자소서 월 5건 생성",
      "기업 매칭 분석",
    ],
  },
  {
    id: "pro",
    name: "PRO",
    price: "19,900원",
    period: "/ 월",
    color: "border-blue-600 bg-white ring-2 ring-blue-600",
    badgeColor: "bg-blue-600 text-white",
    recommended: true,
    benefits: [
      "모의 면접 무제한",
      "AI 심층 리포트 + 피드백",
      "자소서 무제한 생성",
      "기업 매칭 분석 강화",
      "음성 면접(TTS) 이용",
      "전담 커리어 코치 1회",
    ],
  },
  {
    id: "team",
    name: "TEAM",
    price: "49,900원",
    period: "/ 월",
    color: "border-slate-200 bg-slate-50",
    badgeColor: "bg-slate-700 text-white",
    benefits: [
      "PRO 혜택 전체 포함",
      "팀원 5명까지 이용",
      "팀 면접 통계 대시보드",
      "우선 고객 지원",
    ],
  },
];

export default function MembershipModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-[720px] rounded-[28px] bg-white shadow-2xl overflow-y-auto max-h-[90vh]">

        {/* 헤더 */}
        <div className="sticky top-0 flex items-center justify-between px-8 pt-8 pb-4 bg-white border-b border-slate-100 z-10">
          <div>
            <h2 className="text-[22px] font-black text-slate-900">멤버십 플랜 선택</h2>
            <p className="mt-1 text-[13px] text-slate-500">원하는 플랜을 선택하고 더 많은 기능을 이용하세요</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition text-xl"
          >
            ✕
          </button>
        </div>

        {/* 플랜 카드들 */}
        <div className="grid gap-4 p-8 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-[20px] border-2 p-6 ${plan.color}`}
            >
              {plan.recommended && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-1 text-[11px] font-black text-white whitespace-nowrap">
                  추천
                </span>
              )}

              {/* 플랜명 */}
              <span className={`self-start rounded-full px-3 py-1 text-[12px] font-black ${plan.badgeColor}`}>
                {plan.name}
              </span>

              {/* 가격 */}
              <div className="mt-4 flex items-end gap-1">
                <span className="text-[28px] font-black text-slate-900 leading-none">{plan.price}</span>
                <span className="text-[13px] text-slate-400 mb-0.5">{plan.period}</span>
              </div>

              {/* 혜택 */}
              <ul className="mt-4 flex-1 space-y-2">
                {plan.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-[13px] text-slate-700">
                    <span className="text-blue-500 mt-0.5">✓</span>
                    {b}
                  </li>
                ))}
              </ul>

              {/* 결제 버튼 */}
              <button
                onClick={() => alert(`${plan.name} 플랜 결제 기능은 준비 중입니다.`)}
                className={`mt-6 w-full rounded-xl py-3 text-[13px] font-black transition ${
                  plan.recommended
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "border border-slate-300 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {plan.name} 시작하기
              </button>
            </div>
          ))}
        </div>

        {/* 하단 안내 */}
        <div className="px-8 pb-8 text-center text-[12px] text-slate-400">
          결제는 준비 중입니다. 곧 서비스될 예정이에요.
        </div>
      </div>
    </div>
  );
}
