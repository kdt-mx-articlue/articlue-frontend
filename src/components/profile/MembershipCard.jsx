import { useState } from "react";
import MembershipModal from "../common/MembershipModal";
import interviewReportMock from "../../mocks/interviewReportMock";
import { FREE_INTERVIEW_LIMIT, FREE_COVER_LIMIT } from "../../constants/usageConfig";

export default function MembershipCard({ membership, usage }) {
  const [showModal, setShowModal] = useState(false);

  const plan = membership || "FREE";
  const isFree = plan === "FREE";

  // API 미연결 → mock 데이터로 실제 사용 수 계산
  const usedInterview   = interviewReportMock.length;
  const maxInterview    = usage?.maxInterview        ?? FREE_INTERVIEW_LIMIT;
  const remainInterview = usage?.remainingInterview  ?? Math.max(0, maxInterview - usedInterview);

  // 자소서는 아직 mock 없으므로 0 사용으로 표시
  const maxCover        = usage?.maxCoverLetter       ?? FREE_COVER_LIMIT;
  const remainCover     = usage?.remainingCoverLetter ?? maxCover;

  return (
    <section className="section">
      {showModal && <MembershipModal onClose={() => setShowModal(false)} />}

      <div className="section-head">
        <h2>이용권</h2>
      </div>

      <div className="repeat-card">
        {/* 현재 플랜 */}
        <div className="flex items-center justify-between mb-4">
          <span className={`rounded-full px-3 py-1 text-[12px] font-black ${
            isFree ? "bg-slate-100 text-slate-600" : "bg-blue-600 text-white"
          }`}>
            {plan}
          </span>
          {isFree && (
            <span className="text-[11px] text-slate-400">무료 플랜 이용 중</span>
          )}
        </div>

        {/* 잔여 현황 */}
        <div className="space-y-3 mb-5">
          <div>
            <div className="flex justify-between text-[12px] text-slate-500 mb-1">
              <span>면접 잔여</span>
              <span className="font-bold">{remainInterview}/{maxInterview}회</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-500 transition-all"
                style={{ width: `${(remainInterview / maxInterview) * 100}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[12px] text-slate-500 mb-1">
              <span>자소서 잔여</span>
              <span className="font-bold">{remainCover}/{maxCover}건</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-500 transition-all"
                style={{ width: `${(remainCover / maxCover) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* 멤버십 업그레이드 버튼 */}
        <button
          onClick={() => setShowModal(true)}
          className="w-full rounded-xl bg-blue-600 py-3 text-[13px] font-black text-white hover:bg-blue-700 transition"
        >
          {isFree ? "멤버십 업그레이드" : "플랜 변경하기"}
        </button>
      </div>
    </section>
  );
}