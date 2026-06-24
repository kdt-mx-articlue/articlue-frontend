/**
 * ArtiCharacter
 * arti-base.png 위에 SVG 표정을 오버레이하는 캐릭터 컴포넌트
 *
 * Props:
 *   mood      - "idle" | "thinking" | "question" | "followup" | "good" | "final"
 *   mouthOpen - boolean  (말할 때 입 토글)
 *   size      - 너비 px (기본 280, 높이 자동 1.5배)
 *
 * ── 좌표 기준: 280×420 표시 크기 ──
 *   헬멧 중심: (140, 99)  rx≈56  ry≈47
 *   → 눈 Y: 85  왼눈 X: 113  오른눈 X: 167
 *   → 입 중심: (140, 115)
 */
import artiBase from "./arti-base.png";

/* ── 공통 좌표 ── */
const LX = 119;   // 왼눈 cx
const RX = 161;   // 오른눈 cx
const EY = 90;    // 눈 cy
const R  = 11;    // 눈 반지름
const MX = 140;   // 입 cx
const MY = 113;   // 입 cy
const MW = 17;    // 입 반폭(기본)

/* ── 4-포인트 별 SVG path (Final 오른눈) ── */
function StarPath({ cx, cy, r = 12, color = "#fbbf24" }) {
  const o = r * 0.38; // inner radius
  return (
    <path
      d={`M${cx} ${cy-r}
          L${cx+o} ${cy-o}
          L${cx+r} ${cy}
          L${cx+o} ${cy+o}
          L${cx} ${cy+r}
          L${cx-o} ${cy+o}
          L${cx-r} ${cy}
          L${cx-o} ${cy-o}Z`}
      fill={color}
    />
  );
}

/* ── 눈 표정 ── */
function Eyes({ mood }) {
  const S = "#60e8ff";
  const W = 2.4;

  switch (mood) {

    /* Thinking: 눈 살짝 감음 (아래로 볼록한 ⌣ 호) */
    case "thinking":
      return (
        <>
          <path d={`M${LX-R+1} ${EY-2} Q${LX} ${EY+11} ${LX+R-1} ${EY-2}`}
            fill="none" stroke={S} strokeWidth={W} strokeLinecap="round" />
          <path d={`M${RX-R+1} ${EY-2} Q${RX} ${EY+11} ${RX+R-1} ${EY-2}`}
            fill="none" stroke={S} strokeWidth={W} strokeLinecap="round" />
        </>
      );

    /* Question: 왼눈 원, 오른눈 원 + 아래 눈물방울 */
    case "question":
      return (
        <>
          <circle cx={LX} cy={EY} r={R} fill="none" stroke={S} strokeWidth={W} />
          <circle cx={RX} cy={EY} r={R} fill="none" stroke={S} strokeWidth={W} />
        </>
      );

    /* Followup: 원 + 점(왼쪽 상단) / 원 + 점·스파클(오른쪽 상단) */
    case "followup":
      return (
        <>
          {/* 왼눈 원 */}
          <circle cx={LX} cy={EY} r={R} fill="none" stroke={S} strokeWidth={W} />
          {/* 왼눈 작은 점 (10시 방향) */}
          <circle cx={LX - 6} cy={EY - 8} r="2.5" fill={S} />

          {/* 오른눈 원 */}
          <circle cx={RX} cy={EY} r={R} fill="none" stroke={S} strokeWidth={W} />
          {/* 오른눈 작은 점 (2시 방향) */}
          <circle cx={RX + 5} cy={EY - 9} r="2.5" fill={S} />
          {/* 스파클 점 3개 */}
          <circle cx={RX + 14} cy={EY - 12} r="1.8" fill={S} opacity="0.9" />
          <circle cx={RX + 17} cy={EY -  7} r="1.2" fill={S} opacity="0.7" />
          <circle cx={RX + 18} cy={EY - 15} r="1.0" fill={S} opacity="0.6" />
        </>
      );

    /* Good: 위로 볼록한 ⌢ 호 (행복 윙크) */
    case "good":
      return (
        <>
          <path d={`M${LX-R} ${EY+5} Q${LX} ${EY-8} ${LX+R} ${EY+5}`}
            fill="none" stroke={S} strokeWidth={W} strokeLinecap="round" />
          <path d={`M${RX-R} ${EY+5} Q${RX} ${EY-8} ${RX+R} ${EY+5}`}
            fill="none" stroke={S} strokeWidth={W} strokeLinecap="round" />
        </>
      );

    /* Final: 작은 원(왼) + 황금 별(오) */
    case "final":
      return (
        <>
          <circle cx={LX} cy={EY} r="11" fill="none" stroke={S} strokeWidth={W} />
          <StarPath cx={RX} cy={EY} r={13} color="#fbbf24" />
        </>
      );

    /* Idle (default): 양쪽 큰 원 */
    default:
      return (
        <>
          <circle cx={LX} cy={EY} r={R} fill="none" stroke={S} strokeWidth={W} />
          <circle cx={RX} cy={EY} r={R} fill="none" stroke={S} strokeWidth={W} />
        </>
      );
  }
}

/* ── 입 표정 ── */
function Mouth({ mood, open }) {
  const S = "#60e8ff";

  /* Thinking: 입 없음(무표정 호를 아주 작게) */
  if (mood === "thinking") {
    return (
      <path d={`M${MX-8} ${MY+4} Q${MX} ${MY+7} ${MX+8} ${MY+4}`}
        fill="none" stroke={S} strokeWidth="1.6" strokeLinecap="round" opacity="0.4" />
    );
  }

  /* Question: O 모양 (열림/닫힘) */
  if (mood === "question") {
    return open
      ? <ellipse cx={MX} cy={MY+2} rx="10" ry="8.5"
          fill="none" stroke={S} strokeWidth="2.3" />
      : <ellipse cx={MX} cy={MY+2} rx="7"  ry="4"
          fill="none" stroke={S} strokeWidth="2.1" />;
  }

  /* Followup: O 모양 (열림/닫힘) */
  if (mood === "followup") {
    return open
      ? <ellipse cx={MX} cy={MY+2} rx="10" ry="8.5"
          fill="none" stroke={S} strokeWidth="2.3" />
      : <ellipse cx={MX} cy={MY+2} rx="7"  ry="4"
          fill="none" stroke={S} strokeWidth="2.1" />;
  }

  /* Good: 활짝 웃음 */
  if (mood === "good") {
    return open
      ? <path d={`M${MX-MW-5} ${MY-2} Q${MX} ${MY+16} ${MX+MW+5} ${MY-2}`}
          fill="none" stroke={S} strokeWidth="2.5" strokeLinecap="round" />
      : <path d={`M${MX-MW-3} ${MY}   Q${MX} ${MY+12} ${MX+MW+3} ${MY}`}
          fill="none" stroke={S} strokeWidth="2.4" strokeLinecap="round" />;
  }

  /* 나머지 (idle / followup / final): 기본 미소 */
  return open
    ? <path d={`M${MX-MW}   ${MY-1} Q${MX} ${MY+11} ${MX+MW}   ${MY-1}`}
        fill="none" stroke={S} strokeWidth="2.4" strokeLinecap="round" />
    : <path d={`M${MX-MW+3} ${MY}   Q${MX} ${MY+7}  ${MX+MW-3} ${MY}`}
        fill="none" stroke={S} strokeWidth="2.1" strokeLinecap="round" />;
}

/* ── 컴포넌트 ── */
export default function ArtiCharacter({ mood = "idle", mouthOpen = false, size = 280 }) {
  const H = size * 1.5;

  return (
    <div style={{ position: "relative", width: size, height: H }}>
      {/* 베이스 PNG */}
      <img
        src={artiBase}
        alt="Arti"
        draggable={false}
        style={{ width: size, height: H, display: "block", userSelect: "none", pointerEvents: "none" }}
      />

      {/* 표정 SVG 오버레이 */}
      <svg
        viewBox="0 0 280 420"
        style={{ position: "absolute", top: 0, left: 0, width: size, height: H, overflow: "visible" }}
      >
        <defs>
          <filter id="faceGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter="url(#faceGlow)" opacity="0.95">
          <Eyes  mood={mood} />
          <Mouth mood={mood} open={mouthOpen} />
        </g>
      </svg>
    </div>
  );
}
