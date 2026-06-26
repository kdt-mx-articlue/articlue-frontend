import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageHero from "../../components/common/PageHero";
import RecommendationCard from "../../components/dashboard/RecommendationCard";
import FavoriteSearchSection from "../../components/dashboard/FavoriteSearchSection";
import CompanyCard from "../../components/dashboard/CompanyCard";

import { loadRecommendations, getJobMatchRate, getStoredResumeId } from "../../services/dashboardService";
import { generateCoverLetter } from "../../services/coverLetterService";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import {
  getFavorites,
  addFavorite,
} from "../../services/favoriteService";

export default function MatchingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [favorites, setFavorites] = useState(() => getFavorites());
  const [generating, setGenerating] = useState(false);
  const [resumeId, setResumeId] = useState(null);

  /* Effect 1: 페이지 렌더링 시 서버에서 추천 기업 목록 조회 */
  useEffect(() => {
    let cancelled = false;
    loadRecommendations()
      .then(({ companies: recs, resumeId: rid }) => {
        if (cancelled) return;
        setCompanies(recs);
        setResumeId(rid);
      })
      .catch(console.error)
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  /* Effect 2: resumeId 확보 후 overallScore 없는 관심 기업 매칭률 일괄 조회 */
  useEffect(() => {
    if (!resumeId) return;
    const missing = getFavorites().filter((f) => {
      const s = f.overallScore ?? f.overall_score;
      return s === null || s === undefined;
    });
    if (missing.length === 0) return;

    Promise.allSettled(
      missing.map(async (fav) => {
        const id = fav.jobPostingId ?? fav.job_posting_id;
        if (!id) return;
        const matchData = await getJobMatchRate(resumeId, id);
        if (matchData?.overallScore != null) {
          addFavorite({
            ...fav,
            overallScore:  matchData.overallScore,
            overall_score: matchData.overallScore,
            metrics:       matchData.metrics,
          });
        }
      })
    ).then(() => setFavorites(getFavorites()));
  }, [resumeId]);

  /* CompanyCard 찜 상태 변경 시 favorites 목록 갱신 */
  function handleFavoriteChange() {
    setFavorites(getFavorites());
  }

  /* 자소서 생성 */
  async function handleGenerateCoverLetter({ jobPostingId, companyName, jobTitle }) {
    if (generating) return;
    setGenerating(true);
    try {
      const result = await generateCoverLetter({ jobPostingId, companyName, jobTitle });
      if (result?.coverLetterId) {
        navigate(`/cover-letters/${result.coverLetterId}`);
      }
    } catch (e) {
      alert("자소서 생성 실패: " + (e.response?.data?.message || e.message));
    } finally {
      setGenerating(false);
    }
  }

  /* FavoriteSearchSection에서 항목 선택 시 — DB에서 매칭률 조회 후 찜 추가/업데이트 */
  async function handleAddFromSearch(item) {
    const id = item.jobPostingId ?? item.job_posting_id;
    if (!id) return;

    let enriched = item;
    try {
      const rid = resumeId ?? getStoredResumeId();
      if (rid) {
        const matchData = await getJobMatchRate(rid, id);
        if (matchData) {
          enriched = {
            ...item,
            overallScore:  matchData.overallScore,
            overall_score: matchData.overallScore,
            metrics:       matchData.metrics,
          };
        }
      }
    } catch (e) {
      console.warn("[handleAddFromSearch] 매칭률 조회 실패:", e);
    }

    // 이미 찜한 경우도 최신 매칭률로 덮어씀
    addFavorite(enriched);
    setFavorites(getFavorites());
  }

  /* 찜 목록에서 쓸 favoriteKeys — FavoriteSearchSection 중복 방지용 */
  const favoriteKeys = favorites.map(
    (f) => String(f.jobPostingId ?? f.job_posting_id ?? "")
  );

  const topCompanies = companies.slice(0, 3);
  const bestScore = topCompanies[0]?.overallScore ?? topCompanies[0]?.overall_score ?? 0;

  // 추천 기업 맵 (jobPostingId → recommendation 데이터) — 관심 기업 overallScore 보완용
  const recommendationMap = new Map(
    companies.map((c) => [String(c.jobPostingId ?? c.job_posting_id), c])
  );

  // 검색 드롭다운용 scoreMap (jobPostingId → overallScore)
  const scoreMap = Object.fromEntries(
    companies
      .filter((c) => (c.overallScore ?? c.overall_score) != null)
      .map((c) => [
        String(c.jobPostingId ?? c.job_posting_id),
        c.overallScore ?? c.overall_score,
      ])
  );

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center text-slate-400 dark:text-slate-500">
        불러오는 중...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1120px] space-y-10">
      {generating && <LoadingOverlay />}

      <PageHero
        badge="기업 탐색"
        subBadge="AI 기반 기업 추천"
        title="이력서 기반 AI 분석으로 나에게 가장 적합한 기업과 직무를 찾아보세요"
        description="기업 공고와 이력서를 비교해 가장 높은 적합도를 가진 기업을 추천합니다."
        statTitle="최고 매칭률"
        statValue={`${Number(bestScore).toFixed(2)}%`}
        statDescription="1차 직무 매칭 결과 기준"
        progressValue={bestScore}
      />

      {/* 추천 기업 TOP3 */}
      <section>
        <h2 className="mb-6 text-[24px] font-black dark:text-white">추천 기업 TOP3</h2>
        {topCompanies.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {topCompanies.map((company) => (
              <RecommendationCard
                key={company.recommendationId ?? company.jobPostingId ?? company.job_posting_id}
                company={company}
                onFavoriteChange={handleFavoriteChange}
                onGenerateCoverLetter={handleGenerateCoverLetter}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-12 text-center text-slate-500 dark:text-slate-400">
            아직 추천 기업이 없습니다. 이력서를 제출하면 AI가 기업을 추천해 드려요.
          </div>
        )}
      </section>

      {/* 기업 검색 */}
      <FavoriteSearchSection
        onFavorite={handleAddFromSearch}
        favoriteKeys={favoriteKeys}
        scoreMap={scoreMap}
      />

      {/* 관심 기업 */}
      <section>
        <h2 className="mb-6 text-[24px] font-black dark:text-white">관심 기업</h2>
        {favorites.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-12 text-center text-slate-500 dark:text-slate-400">
            관심 기업이 없습니다. 기업 카드의 북마크 또는 검색으로 찜해보세요.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {favorites.map((company) => {
              const id = company.jobPostingId ?? company.job_posting_id;
              // 추천 기업 데이터에 있으면 overallScore + metrics 병합
              const rec = recommendationMap.get(String(id));
              const enriched = rec
                ? { ...company, overallScore: rec.overallScore, metrics: rec.metrics }
                : company;
              return (
                <CompanyCard
                  key={company.recommendationId ?? id}
                  company={enriched}
                  onFavoriteChange={handleFavoriteChange}
                  onGenerateCoverLetter={handleGenerateCoverLetter}
                />
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
}
