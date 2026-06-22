import resumeAnalysisMock from "../mocks/resumeAnalysisMock";

function sortCompanies(companies) {
  return [...companies].sort((a, b) => {
    // 1순위
    if (b.overall_score !== a.overall_score) {
      return b.overall_score - a.overall_score;
    }

    // 2순위
    if (
      b.metrics.tech_stack_fit.score !==
      a.metrics.tech_stack_fit.score
    ) {
      return (
        b.metrics.tech_stack_fit.score -
        a.metrics.tech_stack_fit.score
      );
    }

    // 3순위
    if (
      b.metrics.business_fit.score !==
      a.metrics.business_fit.score
    ) {
      return (
        b.metrics.business_fit.score -
        a.metrics.business_fit.score
      );
    }

    // 4순위
    if (
      b.metrics.requirement_fit.score !==
      a.metrics.requirement_fit.score
    ) {
      return (
        b.metrics.requirement_fit.score -
        a.metrics.requirement_fit.score
      );
    }

    // 5순위
    if (
      b.metrics.action_result_fit.score !==
      a.metrics.action_result_fit.score
    ) {
      return (
        b.metrics.action_result_fit.score -
        a.metrics.action_result_fit.score
      );
    }

    // 6순위
    return (
      b.metrics.culture_fit.score -
      a.metrics.culture_fit.score
    );
  });
}

export async function loadDashboard() {
  const companies =
    sortCompanies(resumeAnalysisMock);

  return {
    profile: {
      job_readiness: 68.42,
    },

    companies,

    topCompanies: companies.slice(0, 3),

    issues: [],
  };
}