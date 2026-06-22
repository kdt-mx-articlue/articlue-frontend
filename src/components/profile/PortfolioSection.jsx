export default function PortfolioSection({
  portfolios,
}) {
  return (
    <section className="section">
      <div className="section-head">
        <h2>
          포트폴리오
        </h2>
      </div>

      {portfolios?.length > 0 ? (
        portfolios.map(
          (portfolio) => (
            <div
              key={
                portfolio.portfolioId
              }
              className="repeat-card"
            >
              <strong>
                {
                  portfolio.originalFileName
                }
              </strong>

              <div>
                {
                  portfolio.fileSize
                }
                bytes
              </div>
            </div>
          )
        )
      ) : (
        <div className="repeat-card">
          등록된
          포트폴리오가
          없습니다.
        </div>
      )}
    </section>
  );
}