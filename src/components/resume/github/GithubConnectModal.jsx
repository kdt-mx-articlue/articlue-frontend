import { useState } from "react";

import {
  githubAuthLogin,
  githubAuthToken,
  githubStorage,
} from "../../../api/githubApi";

export default function GithubConnectModal({
  onClose,
}) {
  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    deviceInfo,
    setDeviceInfo,
  ] = useState(null);

  const startGithubLogin =
    async () => {
      try {
        setLoading(true);

        const response =
          await githubAuthLogin();

        const data =
          response.data;

        setDeviceInfo(data);

        sessionStorage.setItem(
          "githubDeviceCode",
          data.deviceCode
        );

        window.open(
          data.verificationUri,
          "_blank"
        );

        startPolling(
          data.deviceCode,
          data.interval
        );
      } catch (error) {
        console.error(error);

        alert(
          "GitHub 인증 시작 실패"
        );
      } finally {
        setLoading(false);
      }
    };

  const startPolling =
    (
      deviceCode,
      interval
    ) => {
      const timer =
        setInterval(
          async () => {
            try {
              const result =
                await githubAuthToken(
                  deviceCode
                );

              if (
                !result.authenticated
              ) {
                return;
              }

              clearInterval(
                timer
              );

              const githubData =
                result.data;

              const socialUser =
                githubData.socialUser;

              const githubSessionId =
                githubData.githubSessionId;

              sessionStorage.setItem(
                "githubUser",
                JSON.stringify(
                  socialUser
                )
              );

              sessionStorage.setItem(
                "githubSessionId",
                githubSessionId
              );

              const memberId =
                localStorage.getItem(
                  "memberId"
                );

              await githubStorage(
                Number(
                  memberId
                ),
                githubSessionId
              );

              alert(
                "GitHub 연동 완료"
              );

              onClose();
            } catch (
              error
            ) {
              console.error(
                error
              );
            }
          },
          interval * 1000
        );
    };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>
            GitHub 계정 연동
          </h3>

          <button
            onClick={
              onClose
            }
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          {!deviceInfo && (
            <button
              className="btn-primary"
              onClick={
                startGithubLogin
              }
              disabled={
                loading
              }
            >
              {loading
                ? "요청 중..."
                : "GitHub 로그인"}
            </button>
          )}

          {deviceInfo && (
            <div>
              <h4>
                GitHub 인증 진행
              </h4>

              <p>
                아래 코드를
                GitHub에 입력하세요.
              </p>

              <div
                style={{
                  fontSize:
                    "28px",
                  fontWeight:
                    "700",
                  marginTop:
                    "12px",
                }}
              >
                {
                  deviceInfo.userCode
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}