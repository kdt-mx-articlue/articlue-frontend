const moods = {
  idle: {
    leftEye: "○",
    rightEye: "○",
    mouth: "◡",
  },

  thinking: {
    leftEye: "◔",
    rightEye: "◔",
    mouth: "—",
  },

  question: {
    leftEye: "○",
    rightEye: "○",
    mouth: "o",
  },

  followup: {
    leftEye: "◉",
    rightEye: "◉",
    mouth: "–",
  },

  good: {
    leftEye: "⌒",
    rightEye: "⌒",
    mouth: "◡",
  },

  final: {
    leftEye: "★",
    rightEye: "○",
    mouth: "◡",
  },
};

export default function ArtiFace({
  mood,
}) {
  const face =
    moods[mood] || moods.idle;

  return (
    <div
      className="
        w-full
        h-full
        flex
        flex-col
        items-center
        justify-center
        text-cyan-300
      "
    >
      <div className="flex gap-8 text-4xl">
        <span>{face.leftEye}</span>
        <span>{face.rightEye}</span>
      </div>

      <div className="text-3xl mt-3">
        {face.mouth}
      </div>
    </div>
  );
}