import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiBookmark } from "react-icons/hi";
import { getFavorites, removeFavorite } from "../../services/favoriteService";

function FavoriteCard({ company, onRemove }) {
  const navigate = useNavigate();
  const companyName  = company.companyName  ?? company.company_name  ?? "";
  const jobName      = company.jobName      ?? company.job_name      ?? company.job_title ?? "";
  const careerLevel  = company.careerCondition ?? company.career_level ?? "";
  const deadline     = company.deadlineDate ?? company.deadline ?? "";
  const applyUrl     = company.originalUrl  ?? company.apply_url ?? "";
  const jobPostingId = company.jobPostingId ?? company.job_posting_id ?? null;

  return (
    <div className="relative flex flex-col rounded-[20px] border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm min-h-[200px]">
      {/* 북마크 해제 버튼 */}
      <button
        onClick={onRemove}
        className="absolute right-4 top-4 text-blue-500 hover:text-slate-400 transition text-[22px]"
        title="찜 해제"
      >
        <HiBookmark />
      </button>

      {/* 상단 콘텐츠 */}
      <div>
        {careerLevel && (
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-1">{careerLevel}</p>
        )}
        <h3 className="text-[16px] font-black text-slate-900 dark:text-white pr-6 leading-tight">{companyName}</h3>
        <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">{jobName}</p>
        {deadline && (
          <p className="mt-2 text-[12px] text-slate-400 dark:text-slate-500">📅 {deadline}</p>
        )}
      </div>

      {/* 버튼 하단 고정 */}
      <div className="mt-auto pt-4 flex flex-col gap-2">
        <button
          onClick={() => jobPostingId && navigate(`/report/${jobPostingId}`)}
          disabled={!jobPostingId}
          className="w-full rounded-xl border border-blue-600 py-2.5 text-[12px] font-black text-blue-600 dark:text-blue-400 dark:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition disabled:border-slate-200 disabled:text-slate-300 disabled:cursor-not-allowed"
        >
          리포트 보기
        </button>
        {applyUrl ? (
          <a
            href={applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-xl bg-slate-800 dark:bg-slate-700 py-2.5 text-center text-[12px] font-black text-white hover:bg-slate-700 transition"
          >
            공고 바로가기 →
          </a>
        ) : (
          <button
            disabled
            className="w-full rounded-xl bg-slate-200 dark:bg-slate-600 py-2.5 text-[12px] font-black text-slate-400 cursor-not-allowed"
          >
            공고 바로가기 →
          </button>
        )}
      </div>
    </div>
  );
}

export default function FavoriteCompanySection() {
  const [favorites, setFavorites] = useState(() => getFavorites());

  function handleRemove(jobPostingId) {
    removeFavorite(jobPostingId);
    setFavorites(getFavorites());
  }

  return (
    <section className="section">
      <div className="section-head">
        <h2>찜한 기업</h2>
        {favorites.length > 0 && (
          <span style={{ fontSize: "13px", color: "#94a3b8" }}>총 {favorites.length}개</span>
        )}
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((company) => {
            const id = company.jobPostingId ?? company.job_posting_id;
            return (
              <FavoriteCard
                key={id}
                company={company}
                onRemove={() => handleRemove(id)}
              />
            );
          })}
        </div>
      ) : (
        <div className="repeat-card">
          찜한 기업이 없습니다.<br />
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>
            대시보드에서 기업 카드의 북마크를 눌러 찜해보세요.
          </span>
        </div>
      )}
    </section>
  );
}
