// src/pages/Interview/InterviewTTSPage.jsx

import { useNavigate } from "react-router-dom";

export default function InterviewTTSPage() {
  const navigate = useNavigate();

  return (
    <div
      className="
        mx-auto
        max-w-[1120px]
        space-y-8
      "
    >
      <section
        className="
          rounded-[28px]
          bg-white
          p-10
          text-center
        "
      >
        <div
          className="
            text-sm
            font-bold
            text-blue-600
          "
        >
          TTS 면접
        </div>

        <h1
          className="
            mt-4
            text-4xl
            font-black
          "
        >
          음성 면접 준비 중
        </h1>

        <p
          className="
            mt-4
            text-slate-500
          "
        >
          현재는 ChatBot 면접만
          제공되고 있습니다.
        </p>

        <div
          className="
            mt-8
            flex
            justify-center
          "
        >
          <button
            onClick={() =>
              navigate("/interview")
            }
            className="
              rounded-xl
              bg-blue-600
              px-8
              py-4
              font-black
              text-white
            "
          >
            면접 메인으로
          </button>
        </div>
      </section>
    </div>
  );
}