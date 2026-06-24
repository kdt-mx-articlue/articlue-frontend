import { useState } from "react";

import GithubConnectModal from "./GithubConnectModal";

export default function GithubSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [githubUser, setGithubUser] = useState(() => {
    const user = sessionStorage.getItem("githubUser");
    return user ? JSON.parse(user) : null;
  });

  /* socialUser가 있으면 바로 상태 반영 (새로고침 불필요) */
  function handleModalClose(socialUser) {
    setIsModalOpen(false);
    if (socialUser) {
      setGithubUser(socialUser);
    }
  }

  return (
    <section
      className="section"
      id="section-github"
    >
      <div className="section-head">
        <div>
          <h2>1. GitHub 계정 연동</h2>
          <p>
            GitHub 계정을 연동하면
            Repository 및 기술 스택을 자동 분석합니다.
          </p>
        </div>
      </div>

      <div className="github-box">
        <div>
          <h3>GitHub 계정 연동</h3>
          <p>GitHub 프로필을 불러옵니다.</p>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          {githubUser ? "다시 연동" : "GitHub 계정 연동하기"}
        </button>
      </div>

      {githubUser ? (
        <div className="github-profile-card">
          <img
            src={githubUser.avatarUrl || githubUser.avatar_url}
            alt="github"
            className="github-avatar"
          />
          <div className="github-profile-info">
            <strong>{githubUser.login}</strong>
            <a
              href={githubUser.htmlUrl || githubUser.html_url}
              target="_blank"
              rel="noreferrer"
            >
              {githubUser.htmlUrl || githubUser.html_url}
            </a>
            <span>Public Repository : {githubUser.publicRepos ?? githubUser.public_repos}</span>
            <span>Followers : {githubUser.followers}</span>
          </div>
        </div>
      ) : (
        <div className="github-profile-card" style={{ justifyContent: "center" }}>
          GitHub 계정을 연동하면 프로필 정보가 표시됩니다.
        </div>
      )}

      {isModalOpen && (
        <GithubConnectModal onClose={handleModalClose} />
      )}
    </section>
  );
}
