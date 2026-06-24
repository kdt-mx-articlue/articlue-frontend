import Face from "./Face";
import Headset from "./Headset";
import Antenna from "./Antenna";

export default function Head({
  mood,
  speaking,
}) {
  return (
    <svg
      viewBox="0 0 340 300"
      className="w-full h-full"
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur
            stdDeviation="8"
            result="blur"
          />

          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <radialGradient
          id="shell"
          cx="50%"
          cy="40%"
        >
          <stop
            offset="0%"
            stopColor="#FFFFFF"
          />

          <stop
            offset="100%"
            stopColor="#D7E8F5"
          />
        </radialGradient>
      </defs>

      <Antenna />

      <Headset />

      {/* HEAD SHELL */}

      <circle
        cx="170"
        cy="150"
        r="105"
        fill="url(#shell)"
      />

      {/* OLED PANEL */}

      <ellipse
        cx="170"
        cy="150"
        rx="82"
        ry="66"
        fill="#050A13"
        filter="url(#glow)"
      />

      {/* REFLECTION */}

      <ellipse
        cx="170"
        cy="98"
        rx="28"
        ry="6"
        fill="#7DEBFF"
        opacity="0.45"
      />

      <Face
        mood={mood}
        speaking={speaking}
      />
    </svg>
  );
}