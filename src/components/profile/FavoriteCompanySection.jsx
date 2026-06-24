import Carousel from "../common/Carousel";

function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem("favoriteCompaniesCsv") || "[]");
  } catch {
    return [];
  }
}

export default function FavoriteCompanySection() {
  const companies = loadFavorites();

  return (
    <section className="section">
      <div className="section-head">
        <h2>찜한 기업</h2>
        {companies.length > 0 && (
          <span style={{ fontSize: "13px", color: "#94a3b8" }}>총 {companies.length}개</span>
        )}
      </div>

      {companies.length > 0 ? (
        <Carousel
          items={companies}
          renderItem={(company) => (
            <div className="repeat-card" style={{ marginBottom: 0 }}>
              <strong style={{ fontSize: "18px" }}>{company.company_name}</strong>

              <div style={{ marginTop: "6px", fontSize: "13px", color: "#64748b" }}>
                {company.job_title}
              </div>

              {company.career_level && (
                <div style={{ marginTop: "4px", fontSize: "12px", color: "#94a3b8" }}>
                  {company.career_level}
                </div>
              )}

              {company.deadline && (
                <div style={{ marginTop: "8px", fontSize: "12px", color: "#94a3b8" }}>
                  📅 {company.deadline}
                </div>
              )}

              {company.tech_stacks && (
                <div style={{ marginTop: "10px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {String(company.tech_stacks).split(",").slice(0, 4).map((t) => (
                    <span
                      key={t.trim()}
                      style={{
                        padding: "2px 10px",
                        borderRadius: "999px",
                        background: "#eff6ff",
                        color: "#2563eb",
                        fontSize: "11px",
                        fontWeight: "700",
                      }}
                    >
                      {t.trim()}
                    </span>
                  ))}
                </div>
              )}

              {company.apply_url && (
                <a
                  href={company.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    marginTop: "14px",
                    fontSize: "12px",
                    color: "#2563eb",
                    fontWeight: "700",
                  }}
                >
                  공고 바로가기 →
                </a>
              )}
            </div>
          )}
        />
      ) : (
        <div className="repeat-card">
          찜한 기업이 없습니다.<br />
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>
            기업 탐색 페이지에서 관심 기업을 찜해보세요.
          </span>
        </div>
      )}
    </section>
  );
}