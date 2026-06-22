import { useEffect, useState } from "react";

import PageHero from "../../components/common/PageHero";

import RecommendationCard from "../../components/dashboard/RecommendationCard";
import InsightEmptyCard from "../../components/dashboard/InsightEmptyCard";

import { loadDashboard } from "../../services/dashboardService";

export default function DashboardPage() {
  const [loading, setLoading] =
    useState(true);

  const [profile, setProfile] =
    useState({});

  const [companies, setCompanies] =
    useState([]);

  const [issues, setIssues] =
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

  useEffect(() => {
    fetchDashboard();
  }, []);

  function handleToggleFavorite(
    jobPostingId
  ) {
    setCompanies((prev) => {
      const updated =
        prev.map((company) =>
          company.job_posting_id ===
          jobPostingId
            ? {
                ...company,
                is_favorite:
                  !company.is_favorite,
              }
            : company
        );

      const favoriteIds =
        updated
          .filter(
            (company) =>
              company.is_favorite
          )
          .map(
            (company) =>
              company.job_posting_id
          );

      localStorage.setItem(
        "favoriteCompanies",
        JSON.stringify(
          favoriteIds
        )
      );

      return updated;
    });
  }

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
        if (
          b.overall_score !==
          a.overall_score
        ) {
          return (
            b.overall_score -
            a.overall_score
          );
        }

        if (
          b.metrics.tech_stack_fit.score !==
          a.metrics.tech_stack_fit.score
        ) {
          return (
            b.metrics.tech_stack_fit.score -
            a.metrics.tech_stack_fit.score
          );
        }

        if (
          b.metrics.business_fit.score !==
          a.metrics.business_fit.score
        ) {
          return (
            b.metrics.business_fit.score -
            a.metrics.business_fit.score
          );
        }

        if (
          b.metrics.requirement_fit.score !==
          a.metrics.requirement_fit.score
        ) {
          return (
            b.metrics.requirement_fit.score -
            a.metrics.requirement_fit.score
          );
        }

        if (
          b.metrics.action_result_fit.score !==
          a.metrics.action_result_fit.score
        ) {
          return (
            b.metrics.action_result_fit.score -
            a.metrics.action_result_fit.score
          );
        }

        return (
          b.metrics.culture_fit.score -
          a.metrics.culture_fit.score
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
        statValue={`${profile.job_readiness}%`}
        statDescription="이력서 완성도 · 면접 활동 · 자소서 활동 기반"
        progressValue={
          profile.job_readiness
        }
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
                key={
                  company.job_posting_id
                }
                company={company}
                onToggleFavorite={
                  handleToggleFavorite
                }
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
          오늘의 IT 인사이트
        </h2>

        <div
          className="
            grid
            gap-6
            lg:grid-cols-3
          "
        >
          {issues.length > 0
            ? issues.map(
                (issue) => (
                  <InsightEmptyCard
                    key={issue.id}
                    issue={issue}
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