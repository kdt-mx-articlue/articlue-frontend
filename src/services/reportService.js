import resumeAnalysisMock from "../mocks/resumeAnalysisMock";

import finalAnalysisMock from "../mocks/finalAnalysisMock";

import resumeActionPlanMock from "../mocks/resumeActionPlanMock";

import finalActionPlanMock from "../mocks/finalActionPlanMock";

export async function getReportData(
  jobPostingId
) {
  const resumeAnalysis =
    resumeAnalysisMock.find(
      (item) =>
        item.job_posting_id ===
        Number(jobPostingId)
    );

  const finalAnalysis =
    finalAnalysisMock.find(
      (item) =>
        item.job_posting_id ===
        Number(jobPostingId)
    );

  const resumeActionPlan =
    resumeActionPlanMock.find(
      (item) =>
        item.job_posting_id ===
        Number(jobPostingId)
    );

  const finalActionPlan =
    finalActionPlanMock.find(
      (item) =>
        item.job_posting_id ===
        Number(jobPostingId)
    );

  return {
    resumeAnalysis,

    finalAnalysis,

    resumeActionPlan,

    finalActionPlan,
  };
}