export default function ArtiFace({
  expression,
  speaking,
}) {
  return (
    <div className="arti-head">

      <div
        className={`arti-face ${expression}`}
      >
        <div className="eye left-eye" />
        <div className="eye right-eye" />

        <div
          className={`mouth ${
            speaking
              ? "speaking"
              : ""
          }`}
        />
      </div>

    </div>
  );
}