export default function ArtiVoiceWave({
  speaking,
}) {
  return (
    <div
      className={`voice-wave ${
        speaking
          ? "active"
          : ""
      }`}
    >
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}