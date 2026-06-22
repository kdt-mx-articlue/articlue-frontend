import interviewReportMock from "../mocks/interviewReportMock";

export async function getInterviewReport(
  jobPostingId
) {
  return (
    interviewReportMock.find(
      (item) =>
        item.job_posting_id ===
        Number(jobPostingId)
    ) || null
  );
}