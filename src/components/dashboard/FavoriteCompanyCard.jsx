import CompanyCard from "./CompanyCard";

// CSV 기업 데이터 기반 관심 기업 카드 → CompanyCard로 위임
export default function FavoriteCompanyCard({ company, onRemove }) {
  return <CompanyCard company={company} onRemove={onRemove} />;
}
