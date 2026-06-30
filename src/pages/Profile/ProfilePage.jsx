import { useEffect, useState } from "react";
import { getProfile } from "../../api/profileApi.js";
import { getFavorites } from "../../services/favoriteService.js";

import PageHero from "../../components/common/PageHero";

import UserInfoCard from "../../components/profile/UserInfoCard";
import ActivitySummaryCard from "../../components/profile/ActivitySummaryCard";
import MembershipCard from "../../components/profile/MembershipCard";
import ResumeSection from "../../components/profile/ResumeSection";
import FavoriteCompanySection from "../../components/profile/FavoriteCompanySection";
import PortfolioSection from "../../components/profile/PortfolioSection";
import HistorySection from "../../components/profile/HistorySection";
import PaymentHistorySection from "../../components/profile/PaymentHistorySection";
import SettingSection from "../../components/profile/SettingSection";

export default function ProfilePage() {
  const [profile, setProfile] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile =
    async () => {
      try {
        const data = await getProfile();
        const favorites = getFavorites();
        setProfile({
          ...data,
          favoriteCompanies: favorites,
          activity: {
            ...data?.activity,
            favoriteCompanyCount: favorites.length,
          },
        });
      } catch (error) {
        console.error(error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

  if (loading) {
    return (
      <div
        className="
          mx-auto
          max-w-[1120px]
          py-6
        "
      >
        로딩중...
      </div>
    );
  }

  return (
    <div
      className="
        mx-auto
        max-w-[1120px]
        space-y-10
        py-6
      "
    >
      <PageHero
        badge="마이페이지"
        title="나의 커리어 자산과 성장 기록을 관리하세요"
        description="이력서, 포트폴리오, 면접, 자소서 기록을 한 곳에서 확인할 수 있습니다."
        statTitle="활동 점수"
        statValue="87점"
        statDescription="서비스 활동 내역 기반 성장 지표"
        progressValue={87}
      />

      <UserInfoCard
        member={profile?.member}
      />

      <ActivitySummaryCard
        activity={
          profile?.activity
        }
      />

      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-8
        "
      >
        <MembershipCard
          usage={profile?.usage}
          membership={
            profile?.membership
          }
        />

        <ResumeSection
          resume={profile?.resume}
        />
      </div>

      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-8
        "
      >
        <FavoriteCompanySection
          companies={
            profile?.favoriteCompanies
          }
        />

        <PortfolioSection
          portfolios={
            profile?.portfolios
          }
        />
      </div>

      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-8
        "
      >
        <HistorySection />

        <PaymentHistorySection
          payments={
            profile?.payments
          }
        />
      </div>

      <SettingSection />
    </div>
  );
}