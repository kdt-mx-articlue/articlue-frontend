import { useEffect, useState } from "react";
import loadingVideo from "../../assets/videos/Arti_Loading.mp4";

const LABELS = ["로딩중", "분석중"];

export default function LoadingOverlay() {
  const [labelIdx, setLabelIdx] = useState(0);
  const [dots,     setDots]     = useState(0);

  /* 텍스트 라벨 2초마다 교체 */
  useEffect(() => {
    const t = setInterval(() => {
      setLabelIdx((prev) => (prev + 1) % LABELS.length);
      setDots(0);
    }, 2000);
    return () => clearInterval(t);
  }, []);

  /* 점 0→1→2→3→0 400ms마다 */
  useEffect(() => {
    const t = setInterval(() => {
      setDots((prev) => (prev + 1) % 4);
    }, 400);
    return () => clearInterval(t);
  }, []);

  const dotStr = ".".repeat(dots);

  return (
    <div
      style={{
        position:        "fixed",
        inset:           0,
        zIndex:          9999,
        display:         "flex",
        flexDirection:   "column",
        alignItems:      "center",
        justifyContent:  "center",
        background:      "rgba(10, 15, 30, 0.85)",
        backdropFilter:  "blur(6px)",
      }}
    >
      {/* 영상 */}
      <video
        src={loadingVideo}
        autoPlay
        loop
        muted
        playsInline
        style={{
          width:        "340px",
          maxWidth:     "80vw",
          borderRadius: "24px",
        }}
      />

      {/* 텍스트 */}
      <p
        style={{
          marginTop:   "28px",
          fontSize:    "22px",
          fontWeight:  "900",
          color:       "#ffffff",
          letterSpacing: "0.04em",
          minWidth:    "140px",
          textAlign:   "center",
        }}
      >
        {LABELS[labelIdx]}
        <span style={{ display: "inline-block", width: "36px", textAlign: "left" }}>
          {dotStr}
        </span>
      </p>
    </div>
  );
}
