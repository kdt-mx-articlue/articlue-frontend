export default function Suit() {
  return (
    <>
      {/* JACKET */}

      <path
        d="
          M105 270

          Q170 235
          235 270

          L225 405

          Q170 440
          115 405

          Z
        "
        fill="#0F2344"
        stroke="#284E84"
        strokeWidth="2"
      />

      {/* COLLAR LEFT */}

      <path
        d="
          M145 278
          L170 315
          L150 315
        "
        fill="#F5F8FF"
      />

      {/* COLLAR RIGHT */}

      <path
        d="
          M195 278
          L170 315
          L190 315
        "
        fill="#F5F8FF"
      />

      {/* SHIRT */}

      <rect
        x="156"
        y="285"
        width="28"
        height="95"
        fill="#FFFFFF"
      />

      {/* TIE */}

      <path
        d="
          M170 305

          L185 340
          L170 395
          L155 340

          Z
        "
        fill="#36D9FF"
      />

      {/* POCKET */}

      <line
        x1="205"
        y1="335"
        x2="225"
        y2="335"
        stroke="#3FDFFF"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </>
  );
}