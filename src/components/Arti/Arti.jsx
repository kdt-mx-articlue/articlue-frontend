import ArtiFace from "./ArtiFace";

export default function Arti({
  mood = "idle",
  speaking = false,
}) {
  return (
    <div className="flex justify-center">
      <svg
        width="340"
        height="460"
        viewBox="0 0 340 460"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur
              stdDeviation="6"
              result="blur"
            />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 프로젝터 링 */}

        <ellipse
          cx="170"
          cy="420"
          rx="90"
          ry="18"
          fill="none"
          stroke="#49D1FF"
          strokeWidth="3"
          filter="url(#glow)"
        />

        {/* 홀로그램 기둥 */}

        <ellipse
          cx="170"
          cy="320"
          rx="40"
          ry="12"
          fill="#4CD9FF"
          opacity=".15"
        />

        {/* 몸통 */}

        <path
          d="
            M120 190
            Q170 170 220 190
            L220 290
            Q170 340 120 290
            Z
          "
          fill="#1A274F"
          stroke="#62D8FF"
          strokeWidth="2"
        />

        {/* 넥타이 */}

        <rect
          x="163"
          y="215"
          width="14"
          height="50"
          rx="7"
          fill="#66DFFF"
        />

        {/* 카라 */}

        <path
          d="
            M145 205
            L170 225
            L195 205
          "
          fill="none"
          stroke="#7BE5FF"
          strokeWidth="2"
        />

        {/* 머리 외곽 */}

        <circle
          cx="170"
          cy="105"
          r="82"
          fill="#DDEEFF"
          opacity=".15"
          filter="url(#glow)"
        />

        <circle
          cx="170"
          cy="105"
          r="78"
          fill="#0A1224"
          stroke="#7DE3FF"
          strokeWidth="4"
        />

        {/* OLED 얼굴 */}

        <foreignObject
          x="90"
          y="40"
          width="160"
          height="120"
        >
          <ArtiFace
            mood={mood}
            speaking={speaking}
          />
        </foreignObject>

        {/* 헤드셋 왼쪽 */}

        <circle
          cx="92"
          cy="105"
          r="22"
          fill="#233863"
          stroke="#79E3FF"
          strokeWidth="2"
        />

        {/* 헤드셋 오른쪽 */}

        <circle
          cx="248"
          cy="105"
          r="22"
          fill="#233863"
          stroke="#79E3FF"
          strokeWidth="2"
        />

        {/* 안테나 */}

        <g
          stroke="#66DDFF"
          strokeWidth="4"
        >
          <line
            x1="135"
            y1="15"
            x2="135"
            y2="45"
          />
          <line
            x1="145"
            y1="10"
            x2="145"
            y2="40"
          />
          <line
            x1="205"
            y1="15"
            x2="205"
            y2="45"
          />
          <line
            x1="215"
            y1="10"
            x2="215"
            y2="40"
          />
        </g>
      </svg>
    </div>
  );
}