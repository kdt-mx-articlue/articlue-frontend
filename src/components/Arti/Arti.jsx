import "./Arti.css";

import ArtiFace from "./ArtiFace";
import ArtiVoiceWave from "./ArtiVoiceWave";
import ArtiParticles from "./ArtiParticles";

export default function Arti({
  expression = "neutral",
  speaking = false,
  size = "md",
}) {
  return (
    <div className={`arti-wrapper arti-${size}`}>
      <div className="arti-floating">
        <ArtiParticles />

        <div className="arti-antenna left">
          <span />
          <span />
          <span />
        </div>

        <div className="arti-antenna right">
          <span />
          <span />
          <span />
        </div>

        <ArtiFace
          expression={expression}
          speaking={speaking}
        />

        <div className="arti-body">
          <div className="arti-collar" />
          <div className="arti-tie" />
        </div>

        <ArtiVoiceWave speaking={speaking} />

        <div className="arti-ring" />
      </div>
    </div>
  );
}