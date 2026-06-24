const moodMap = {
  idle: {
    mouth: "smile",
  },

  thinking: {
    mouth: "flat",
  },

  question: {
    mouth: "o",
  },

  followup: {
    mouth: "flat",
  },

  good: {
    mouth: "smile",
  },

  final: {
    mouth: "star",
  },
};

export default function Face({
  mood = "idle",
  speaking = false,
}) {
  const current =
    moodMap[mood] || moodMap.idle;

  return (
    <>
      {/* LEFT EYE */}

      <circle
        cx="130"
        cy="150"
        r="14"
        fill="none"
        stroke="#6EE8FF"
        strokeWidth="4"
      />

      {/* RIGHT EYE */}

      <circle
        cx="210"
        cy="150"
        r="14"
        fill="none"
        stroke="#6EE8FF"
        strokeWidth="4"
      />

      {/* FINAL MODE */}

      {mood === "final" && (
        <text
          x="210"
          y="156"
          fontSize="20"
          fill="#6EE8FF"
          textAnchor="middle"
        >
          ★
        </text>
      )}

      {/* MOUTH */}

      {speaking ? (
        <ellipse
          cx="170"
          cy="205"
          rx="12"
          ry="18"
          fill="#6EE8FF"
        />
      ) : current.mouth === "o" ? (
        <circle
          cx="170"
          cy="205"
          r="8"
          fill="none"
          stroke="#6EE8FF"
          strokeWidth="4"
        />
      ) : current.mouth === "flat" ? (
        <line
          x1="155"
          y1="205"
          x2="185"
          y2="205"
          stroke="#6EE8FF"
          strokeWidth="4"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="
            M150 200
            Q170 220
            190 200
          "
          fill="none"
          stroke="#6EE8FF"
          strokeWidth="4"
          strokeLinecap="round"
        />
      )}
    </>
  );
}