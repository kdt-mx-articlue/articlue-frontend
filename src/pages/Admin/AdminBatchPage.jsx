import { useCallback, useEffect, useState } from "react";
import api from "../../api/axios";

/**
 * 관리자 배치 관리 (/admin/batch)
 * - 백엔드 .env 의 ADMIN_TOKEN 으로 인증 (브라우저 세션 동안만 보관)
 * - 배치가 실패했거나 바로 갱신이 필요할 때 수동 실행
 */
const TOKEN_KEY = "articlue_admin_token";

const STATUS_STYLE = {
  RUNNING: { label: "실행 중", color: "#2563eb", bg: "#eff6ff" },
  SUCCESS: { label: "성공", color: "#16a34a", bg: "#f0fdf4" },
  PARTIAL: { label: "일부 실패", color: "#d97706", bg: "#fffbeb" },
  FAILED: { label: "실패", color: "#dc2626", bg: "#fef2f2" },
};

const TRIGGER_LABEL = { SCHEDULE: "정기", CATCHUP: "보충", MANUAL: "수동" };

function readToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("ko-KR", { hour12: false });
}

export default function AdminBatchPage() {
  const [token, setToken] = useState(readToken);
  const [tokenInput, setTokenInput] = useState("");
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const headers = { "X-Admin-Token": token };

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await api.get("/admin/batches", { headers: { "X-Admin-Token": token } });
      setStatus(res.data?.data ?? null);
      setMessage("");
    } catch (error) {
      if (error.response?.status === 401) {
        try { sessionStorage.removeItem(TOKEN_KEY); } catch { /* 무시 */ }
        setToken("");
      }
      setMessage(error.response?.data?.message || "배치 상태를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  // 실행 중인 배치가 있으면 10초마다 갱신
  useEffect(() => {
    if (!status?.running?.length) return undefined;
    const timer = setInterval(load, 10000);
    return () => clearInterval(timer);
  }, [status, load]);

  function handleLogin(event) {
    event.preventDefault();
    const value = tokenInput.trim();
    if (!value) return;
    try { sessionStorage.setItem(TOKEN_KEY, value); } catch { /* 무시 */ }
    setToken(value);
    setTokenInput("");
  }

  async function handleRun(jobName) {
    setMessage("");
    try {
      const res = await api.post(`/admin/batches/${jobName}/run`, null, { headers });
      setMessage(res.data?.message || "실행을 시작했습니다.");
    } catch (error) {
      setMessage(error.response?.data?.message || "실행 요청에 실패했습니다.");
    }
    load();
  }

  const card = {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    padding: "24px",
    marginBottom: "20px",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8faff",
        padding: "48px 20px",
        fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif",
        color: "#0f172a",
      }}
    >
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 900, marginBottom: "8px" }}>배치 관리</h1>
        <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "28px" }}>
          정기 실행이 실패하면 원인을 수정해 재배포하거나(기동 시 자동 보충 실행) 여기서 직접 실행하세요.
        </p>

        {!token ? (
          <form onSubmit={handleLogin} style={card}>
            <label style={{ display: "block", fontWeight: 700, marginBottom: "10px" }}>관리자 토큰</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="password"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="서버 .env 의 ADMIN_TOKEN"
                style={{ flex: 1, padding: "10px 14px", borderRadius: "12px", border: "1px solid #cbd5e1" }}
              />
              <button
                type="submit"
                style={{ padding: "10px 20px", borderRadius: "12px", border: "none", background: "#2563eb", color: "#fff", fontWeight: 700, cursor: "pointer" }}
              >
                확인
              </button>
            </div>
            {message && <p style={{ marginTop: "12px", color: "#dc2626", fontSize: "14px" }}>{message}</p>}
          </form>
        ) : (
          <>
            {message && (
              <div style={{ ...card, padding: "14px 20px", background: "#f1f5f9" }}>{message}</div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "20px" }}>
              {(status?.jobs ?? []).map((job) => {
                const running = status.running.some((r) => r.jobName === job.jobName);
                return (
                  <div key={job.jobName} style={{ ...card, marginBottom: 0 }}>
                    <div style={{ fontWeight: 800, marginBottom: "6px" }}>{job.label}</div>
                    <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>
                      정기 실행: <code>{job.cron}</code> (KST)
                    </div>
                    <button
                      type="button"
                      disabled={running}
                      onClick={() => handleRun(job.jobName)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "12px",
                        border: "none",
                        background: running ? "#cbd5e1" : "#0f172a",
                        color: "#fff",
                        fontWeight: 700,
                        cursor: running ? "not-allowed" : "pointer",
                      }}
                    >
                      {running ? "실행 중…" : "지금 실행"}
                    </button>
                  </div>
                );
              })}
            </div>

            <div style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <div style={{ fontWeight: 800 }}>최근 실행 이력</div>
                <button
                  type="button"
                  onClick={load}
                  disabled={loading}
                  style={{ padding: "6px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", background: "#fff", cursor: "pointer" }}
                >
                  새로고침
                </button>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ textAlign: "left", color: "#64748b" }}>
                      <th style={{ padding: "8px" }}>#</th>
                      <th style={{ padding: "8px" }}>배치</th>
                      <th style={{ padding: "8px" }}>구분</th>
                      <th style={{ padding: "8px" }}>상태</th>
                      <th style={{ padding: "8px" }}>시작</th>
                      <th style={{ padding: "8px" }}>종료</th>
                      <th style={{ padding: "8px" }}>결과</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(status?.recentRuns ?? []).map((run) => {
                      const style = STATUS_STYLE[run.status] ?? STATUS_STYLE.FAILED;
                      return (
                        <tr key={run.runId} style={{ borderTop: "1px solid #f1f5f9", verticalAlign: "top" }}>
                          <td style={{ padding: "8px" }}>{run.runId}</td>
                          <td style={{ padding: "8px" }}>{run.jobName}</td>
                          <td style={{ padding: "8px" }}>{TRIGGER_LABEL[run.triggerType] ?? run.triggerType}</td>
                          <td style={{ padding: "8px" }}>
                            <span style={{ padding: "2px 10px", borderRadius: "999px", color: style.color, background: style.bg, fontWeight: 700 }}>
                              {style.label}
                            </span>
                          </td>
                          <td style={{ padding: "8px", whiteSpace: "nowrap" }}>{formatDate(run.startedAt)}</td>
                          <td style={{ padding: "8px", whiteSpace: "nowrap" }}>{formatDate(run.finishedAt)}</td>
                          <td style={{ padding: "8px", maxWidth: "320px" }}>
                            {run.summary && (
                              <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontSize: "12px" }}>
                                {JSON.stringify(run.summary, null, 1)}
                              </pre>
                            )}
                            {run.errorMessage && (
                              <pre style={{ margin: "4px 0 0", whiteSpace: "pre-wrap", fontSize: "12px", color: "#dc2626" }}>
                                {run.errorMessage.slice(0, 600)}
                              </pre>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
