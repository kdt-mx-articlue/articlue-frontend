export default function ActivitySummaryCard({
  activity,
}) {
  return (
    <section className="section">
      <div className="section-head">
        <h2>
          활동 현황
        </h2>
      </div>

      <div className="grid-2">
        <div className="repeat-card">
          <strong>
            이력서
          </strong>

          <div>
            {
              activity?.resumeCount ??
              0
            }
            건
          </div>
        </div>

        <div className="repeat-card">
          <strong>
            자소서
          </strong>

          <div>
            {
              activity?.coverLetterCount ??
              0
            }
            건
          </div>
        </div>

        <div className="repeat-card">
          <strong>
            면접
          </strong>

          <div>
            {
              activity?.interviewCount ??
              0
            }
            회
          </div>
        </div>

        <div className="repeat-card">
          <strong>
            찜한 기업
          </strong>

          <div>
            {
              activity?.favoriteCompanyCount ??
              0
            }
            개
          </div>
        </div>
      </div>
    </section>
  );
}