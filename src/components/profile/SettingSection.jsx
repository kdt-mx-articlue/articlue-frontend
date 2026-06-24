import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* ── 알림 설정 모달 ────────────────────────────────── */
function NotificationModal({ onClose }) {
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(false);
  const [marketing, setMarketing] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-[400px] rounded-[24px] bg-white p-8 shadow-2xl" style={{ background: "var(--surface)" }}>
        <h2 className="text-[20px] font-black mb-6" style={{ color: "var(--text-main)" }}>알림 설정</h2>

        {[
          { label: "앱 푸시 알림", desc: "면접·자소서 분석 완료 알림", value: push, set: setPush },
          { label: "이메일 알림", desc: "서비스 업데이트 및 공지 수신", value: email, set: setEmail },
          { label: "마케팅 수신 동의", desc: "이벤트·혜택 정보 수신", value: marketing, set: setMarketing },
        ].map(({ label, desc, value, set }) => (
          <div key={label} className="flex items-center justify-between py-4 border-b" style={{ borderColor: "var(--border)" }}>
            <div>
              <p className="font-bold text-[14px]" style={{ color: "var(--text-main)" }}>{label}</p>
              <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>{desc}</p>
            </div>
            {/* 토글 스위치 */}
            <button
              onClick={() => set((v) => !v)}
              style={{
                width: "44px", height: "24px", borderRadius: "999px", border: "none",
                background: value ? "#2563eb" : "#cbd5e1",
                position: "relative", cursor: "pointer", flexShrink: 0,
                transition: "background 0.2s",
              }}
            >
              <span style={{
                position: "absolute", top: "2px",
                left: value ? "22px" : "2px",
                width: "20px", height: "20px",
                borderRadius: "50%", background: "white",
                transition: "left 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              }} />
            </button>
          </div>
        ))}

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-blue-600 py-3 text-[14px] font-black text-white hover:bg-blue-700 transition"
        >
          저장
        </button>
      </div>
    </div>
  );
}

/* ── 비밀번호 변경 모달 ────────────────────────────── */
function PasswordModal({ onClose }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (next.length < 8) { setError("비밀번호는 8자 이상이어야 합니다."); return; }
    if (next !== confirm) { setError("새 비밀번호가 일치하지 않습니다."); return; }
    setDone(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-[400px] rounded-[24px] p-8 shadow-2xl" style={{ background: "var(--surface)" }}>
        <h2 className="text-[20px] font-black mb-6" style={{ color: "var(--text-main)" }}>비밀번호 변경</h2>

        {done ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-4">✅</div>
            <p className="font-bold" style={{ color: "var(--text-main)" }}>비밀번호가 변경되었습니다.</p>
            <button onClick={onClose} className="mt-6 w-full rounded-xl bg-blue-600 py-3 text-[14px] font-black text-white hover:bg-blue-700 transition">
              닫기
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: "현재 비밀번호", val: current, set: setCurrent },
              { label: "새 비밀번호", val: next, set: setNext },
              { label: "새 비밀번호 확인", val: confirm, set: setConfirm },
            ].map(({ label, val, set }) => (
              <div key={label}>
                <label className="block text-[12px] font-black mb-1" style={{ color: "var(--text-sub)" }}>{label}</label>
                <input
                  type="password"
                  value={val}
                  onChange={(e) => { set(e.target.value); setError(""); }}
                  className="w-full rounded-xl border px-4 py-3 text-[14px]"
                  style={{ borderColor: "var(--border)", background: "var(--surface-soft)", color: "var(--text-main)" }}
                  required
                />
              </div>
            ))}

            {error && <p className="text-[12px] text-red-500 font-bold">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose}
                className="flex-1 rounded-xl border py-3 text-[14px] font-black hover:bg-slate-50 transition"
                style={{ borderColor: "var(--border)", color: "var(--text-sub)" }}>
                취소
              </button>
              <button type="submit" className="flex-1 rounded-xl bg-blue-600 py-3 text-[14px] font-black text-white hover:bg-blue-700 transition">
                변경하기
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ── 로그아웃 모달 ─────────────────────────────────── */
function LogoutModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-[360px] rounded-[24px] p-8 shadow-2xl" style={{ background: "var(--surface)" }}>
        <div className="text-3xl mb-4">👋</div>
        <h2 className="text-[20px] font-black mb-2" style={{ color: "var(--text-main)" }}>로그아웃 하시겠어요?</h2>
        <p className="text-[14px] mb-6" style={{ color: "var(--text-sub)" }}>다음에 다시 로그인하면 이어서 이용할 수 있습니다.</p>
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 rounded-xl border py-3 text-[14px] font-black transition hover:bg-slate-50"
            style={{ borderColor: "var(--border)", color: "var(--text-sub)" }}>
            취소
          </button>
          <button onClick={onConfirm}
            className="flex-1 rounded-xl bg-blue-600 py-3 text-[14px] font-black text-white hover:bg-blue-700 transition">
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── 회원 탈퇴 모달 ────────────────────────────────── */
function WithdrawModal({ onClose, onConfirm }) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-[400px] rounded-[24px] p-8 shadow-2xl" style={{ background: "var(--surface)" }}>
        <div className="text-3xl mb-4">⚠️</div>
        <h2 className="text-[20px] font-black mb-2" style={{ color: "#ef4444" }}>회원 탈퇴</h2>
        <p className="text-[14px] mb-4" style={{ color: "var(--text-sub)" }}>
          탈퇴하면 모든 데이터(이력서, 자소서, 면접 기록)가 삭제되며 복구할 수 없습니다.
        </p>

        <div
          className="rounded-xl p-4 mb-5"
          style={{ background: "#fef2f2", border: "1px solid #fecaca" }}
        >
          <p className="text-[13px] font-bold text-red-600">삭제되는 항목</p>
          <ul className="mt-2 space-y-1 text-[12px] text-red-500">
            <li>• 작성한 이력서 및 자기소개서</li>
            <li>• 모의 면접 기록 및 리포트</li>
            <li>• 찜한 기업 목록</li>
            <li>• 멤버십 이용 이력</li>
          </ul>
        </div>

        <label className="flex items-center gap-2 cursor-pointer mb-5">
          <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
          <span className="text-[13px]" style={{ color: "var(--text-sub)" }}>위 내용을 확인했으며, 탈퇴에 동의합니다.</span>
        </label>

        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 rounded-xl border py-3 text-[14px] font-black transition hover:bg-slate-50"
            style={{ borderColor: "var(--border)", color: "var(--text-sub)" }}>
            취소
          </button>
          <button
            onClick={confirmed ? onConfirm : undefined}
            disabled={!confirmed}
            className="flex-1 rounded-xl py-3 text-[14px] font-black text-white transition"
            style={{ background: confirmed ? "#ef4444" : "#fca5a5", cursor: confirmed ? "pointer" : "not-allowed" }}
          >
            탈퇴하기
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── 메인 컴포넌트 ─────────────────────────────────── */
export default function SettingSection() {
  const navigate = useNavigate();

  const [modal, setModal] = useState(null); // "notification" | "password" | "logout" | "withdraw"
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true" || document.documentElement.classList.contains("dark")
  );

  // 다크모드 토글 — html에 class 적용 + localStorage 저장
  function toggleDark() {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", String(next));
  }

  // 로그아웃 처리
  function handleLogout() {
    localStorage.removeItem("articlue_current_user");
    setModal(null);
    navigate("/login");
  }

  // 회원 탈퇴 처리
  function handleWithdraw() {
    localStorage.clear();
    setModal(null);
    navigate("/login");
  }

  const ROW_STYLE = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    borderRadius: "16px",
    marginBottom: "8px",
    cursor: "pointer",
    transition: "background 0.15s",
    border: "1px solid var(--border)",
    background: "var(--surface)",
    color: "var(--text-main)",
  };

  return (
    <section className="section">
      {/* 모달들 */}
      {modal === "notification" && <NotificationModal onClose={() => setModal(null)} />}
      {modal === "password"     && <PasswordModal     onClose={() => setModal(null)} />}
      {modal === "logout"       && <LogoutModal       onClose={() => setModal(null)} onConfirm={handleLogout} />}
      {modal === "withdraw"     && <WithdrawModal     onClose={() => setModal(null)} onConfirm={handleWithdraw} />}

      <div className="section-head">
        <h2>설정</h2>
      </div>

      {/* 다크모드 */}
      <div style={ROW_STYLE} onClick={toggleDark}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "18px" }}>{darkMode ? "🌙" : "☀️"}</span>
          <span style={{ fontWeight: "700", fontSize: "14px" }}>다크모드</span>
        </div>
        {/* 토글 스위치 */}
        <div style={{
          width: "44px", height: "24px", borderRadius: "999px",
          background: darkMode ? "#2563eb" : "#cbd5e1",
          position: "relative", transition: "background 0.2s", flexShrink: 0,
        }}>
          <span style={{
            position: "absolute", top: "2px",
            left: darkMode ? "22px" : "2px",
            width: "20px", height: "20px",
            borderRadius: "50%", background: "white",
            transition: "left 0.2s",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }} />
        </div>
      </div>

      {/* 알림 설정 */}
      <div style={ROW_STYLE} onClick={() => setModal("notification")}
        onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-soft)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "var(--surface)"}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "18px" }}>🔔</span>
          <span style={{ fontWeight: "700", fontSize: "14px" }}>알림 설정</span>
        </div>
        <span style={{ color: "var(--text-muted)", fontSize: "18px" }}>›</span>
      </div>

      {/* 비밀번호 변경 */}
      <div style={ROW_STYLE} onClick={() => setModal("password")}
        onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-soft)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "var(--surface)"}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "18px" }}>🔒</span>
          <span style={{ fontWeight: "700", fontSize: "14px" }}>비밀번호 변경</span>
        </div>
        <span style={{ color: "var(--text-muted)", fontSize: "18px" }}>›</span>
      </div>

      {/* 로그아웃 */}
      <div style={ROW_STYLE} onClick={() => setModal("logout")}
        onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-soft)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "var(--surface)"}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "18px" }}>🚪</span>
          <span style={{ fontWeight: "700", fontSize: "14px" }}>로그아웃</span>
        </div>
        <span style={{ color: "var(--text-muted)", fontSize: "18px" }}>›</span>
      </div>

      {/* 회원 탈퇴 */}
      <div
        style={{ ...ROW_STYLE, marginBottom: 0 }}
        onClick={() => setModal("withdraw")}
        onMouseEnter={(e) => e.currentTarget.style.background = "#fef2f2"}
        onMouseLeave={(e) => e.currentTarget.style.background = "var(--surface)"}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "18px" }}>⚠️</span>
          <span style={{ fontWeight: "700", fontSize: "14px", color: "#ef4444" }}>회원 탈퇴</span>
        </div>
        <span style={{ color: "#ef4444", fontSize: "18px" }}>›</span>
      </div>
    </section>
  );
}
