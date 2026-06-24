import Head from "./Head";
import Suit from "./Suit";
import Arms from "./Arms";

export default function Arti({
  mood = "idle",
  speaking = false,
}) {
  return (
    <div
      className="
        w-[340px]
        h-[460px]
      "
    >
      <svg
        viewBox="0 0 340 460"
        className="w-full h-full"
      >
        <Suit />

        <Arms />

        <foreignObject
          x="0"
          y="0"
          width="340"
          height="300"
        >
          <Head
            mood={mood}
            speaking={speaking}
          />
        </foreignObject>
      </svg>
    </div>
  );
}