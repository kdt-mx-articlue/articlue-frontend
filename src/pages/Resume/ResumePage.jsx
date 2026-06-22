import ResumeHeader from "../../components/resume/layout/ResumeHeader";
import ResumeSidebar from "../../components/resume/layout/ResumeSidebar";
import FloatingSubmitBar from "../../components/resume/layout/FloatingSubmitBar";

import GithubSection from "../../components/resume/github/GithubSection";
import ResumeInfoSection from "../../components/resume/resumeInfo/ResumeInfoSection";

import TechStackSection from "../../components/resume/techStack/TechStackSection";

import EducationSection from "../../components/resume/education/EducationSection";
import ExperienceSection from "../../components/resume/experience/ExperienceSection";
import CareerSection from "../../components/resume/career/CareerSection";

import CertificateSection from "../../components/resume/certificate/CertificateSection";

import CoverLetterSection from "../../components/resume/coverLetter/CoverLetterSection";

import PortfolioSection from "../../components/resume/portfolio/PortfolioSection";

export default function ResumePage() {
  return (
    <>
      <ResumeHeader />

      <ResumeSidebar />

      <main className="resume-container">
        <div className="page-title">
          <h1>
            커리어 프로필 작성
          </h1>

          <p>
            한 번만 입력하면 기업 매칭,
            AI 직무 적합도 분석,
            자기소개서 생성,
            면접 추천까지 활용되는
            통합 커리어 프로필이 생성됩니다.
          </p>
        </div>

        <GithubSection />

        <ResumeInfoSection />

        <TechStackSection />

        <EducationSection />

        <ExperienceSection />

        <CoverLetterSection />

        <CareerSection />

        <CertificateSection />

        <PortfolioSection />
      </main>

      <FloatingSubmitBar />
    </>
  );
}