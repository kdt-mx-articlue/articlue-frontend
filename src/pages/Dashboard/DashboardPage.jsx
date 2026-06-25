import { useEffect, useState } from "react";

import PageHero from "../../components/common/PageHero";

import RecommendationCard from "../../components/dashboard/RecommendationCard";
import InsightEmptyCard from "../../components/dashboard/InsightEmptyCard";
import InsightCard from "../../components/dashboard/InsightCard";

import { loadDashboard } from "../../services/dashboardService";
import { getWeeklyInsights } from "../../services/articleService";

export default function DashboardPage() {
  const [loading, setLoading] =
    useState(true);

  const [profile, setProfile] =
    useState({});

  const [companies, setCompanies] =
    useState([]);

  const [issues, setIssues] =
    useState([]);

  const [insights, setInsights] =
    useState([]);

  async function fetchDashboard() {
    try {
      const response =
        await loadDashboard();

      const favoriteIds =
        JSON.parse(
          localStorage.getItem(
            "favoriteCompanies"
          ) || "[]"
        );

      setProfile(
        response.profile || {}
      );

      setCompanies(
        (response.companies || []).map(
          (company) => ({
            ...company,

            is_favorite:
              favoriteIds.includes(
                company.job_posting_id
              ),
          })
        )
      );

      setIssues(
        response.issues || []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchInsights() {
    try {
      const articles = await getWeeklyInsights();
      setInsights(articles);
    } catch (error) {
      console.error("인사이트 로드 실패:", error);
    }
  }

  useEffect(() => {
    fetchDashboard();
    fetchInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // CompanyCard가 favoriteService를 직접 관리하므로
  // DashboardPage는 별도 토글 핸들러가 불필요

  if (loading) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  const topCompanies =
    [...companies]
      .sort((a, b) => {
        const as = a.overall_score ?? a.overallScore ?? 0;
        const bs = b.overall_score ?? b.overallScore ?? 0;
        if (bs !== as) {
          return bs - as;
        }

        if (
          b.metrics?.tech_stack_fit?.score !==
          a.metrics?.tech_stack_fit?.score
        ) {
          return (
            b.metrics?.tech_stack_fit?.score -
            a.metrics?.tech_stack_fit?.score
          );
        }

        if (
          b.metrics?.business_fit?.score !==
          a.metrics?.business_fit?.score
        ) {
          return (
            b.metrics?.business_fit?.score -
            a.metrics?.business_fit?.score
          );
        }

        if (
          b.metrics?.requirement_fit?.score !==
          a.metrics?.requirement_fit?.score
        ) {
          return (
            b.metrics?.requirement_fit?.score -
            a.metrics?.requirement_fit?.score
          );
        }

        if (
          b.metrics?.action_result_fit?.score !==
          a.metrics?.action_result_fit?.score
        ) {
          return (
            b.metrics?.action_result_fit?.score -
            a.metrics?.action_result_fit?.score
          );
        }

        return (
          (b.metrics?.culture_fit?.score ?? 0) -
          (a.metrics?.culture_fit?.score ?? 0)
        );
      })
      .slice(0, 3);

  return (
    <div
      className="
        mx-auto
        max-w-[1120px]
        space-y-10
      "
    >
      <PageHero
        badge="● 오늘의 커리어 대시보드"
        subBadge="AI 기반 데이터 표시"
        title="합격 가능성을 높이기 위한 현재 나의 커리어 상태를 확인하세요"
        description="이력서, 면접, 자소서 활동을 기반으로 취업 준비 현황을 확인할 수 있습니다."
        statTitle="취업 준비도"
        statValue={profile.job_readiness != null ? `${profile.job_readiness}%` : "-"}
        statDescription="추천 기업 매칭률 평균 기반"
        progressValue={profile.job_readiness ?? 0}
      />

      <section>

        <h2
          className="
            mb-6
            text-[24px]
            font-black
          "
        >
          추천 기업 TOP3
        </h2>

        <div
          className="
            grid
            gap-6
            lg:grid-cols-3
          "
        >
          {topCompanies.map(
            (company) => (
              <RecommendationCard
                key={company.recommendationId ?? company.jobPostingId ?? company.job_posting_id}
                company={company}
              />
            )
          )}
        </div>

      </section>

      <section>

        <h2
          className="
            mb-6
            text-[24px]
            font-black
          "
        >
          금주의 IT 인사이트
        </h2>

        <div
          className="
            grid
            gap-6
            lg:grid-cols-3
          "
        >
          {insights.length > 0
            ? insights.slice(0, 3).map(
                (article) => (
                  <InsightCard
                    key={article.id}
                    article={article}
                  />
                )
              )
            : [1, 2, 3].map(
                (item) => (
                  <InsightEmptyCard
                    key={item}
                  />
                )
              )}
        </div>

      </section>

    </div>
  );
}
