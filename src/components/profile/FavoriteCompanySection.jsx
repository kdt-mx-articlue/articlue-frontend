export default function FavoriteCompanySection({
  companies,
}) {
  return (
    <section className="section">
      <div className="section-head">
        <h2>
          찜한 기업
        </h2>
      </div>

      {companies?.length > 0 ? (
        <div className="grid-2">
          {companies.map(
            (company) => (
              <div
                key={
                  company.companyId
                }
                className="repeat-card"
              >
                <strong>
                  {
                    company.companyName
                  }
                </strong>

                <div>
                  {
                    company.jobTitle
                  }
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <div className="repeat-card">
          찜한 기업이
          없습니다.
        </div>
      )}
    </section>
  );
}