export default function Headset() {
  return (
    <>
      {/* LEFT */}

      <g>
        <circle
          cx="65"
          cy="150"
          r="34"
          fill="#DCEFFF"
        />

        <circle
          cx="65"
          cy="150"
          r="20"
          fill="#173055"
          stroke="#6EE8FF"
          strokeWidth="4"
        />
      </g>

      {/* RIGHT */}

      <g>
        <circle
          cx="275"
          cy="150"
          r="34"
          fill="#DCEFFF"
        />

        <circle
          cx="275"
          cy="150"
          r="20"
          fill="#173055"
          stroke="#6EE8FF"
          strokeWidth="4"
        />
      </g>
    </>
  );
}