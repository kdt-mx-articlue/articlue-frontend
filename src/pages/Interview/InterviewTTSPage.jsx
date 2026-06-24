import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Arti from "../../components/Arti/Arti";

export default function InterviewTTSPage() {
  const navigate = useNavigate();

  const [mood, setMood] = useState("question");
  const [speaking, setSpeaking] = useState(true);

  return (
    <div className="mx-auto max-w-[1200px]">
      <section
        className="
          relative
          overflow-hidden
          rounded-[32px]
          bg-[#050B1A]
          px-10
          py-8
          shadow-[0_20px_60px_rgba(0,0,0,0.35)]
        "
      >
        {/* Header */}

        <div className="flex items-start justify-between">
          <div>
            <div
              className="
                text-sm
                font-black
                tracking-widest
                text-cyan-400
              "
            >
              ARTI AI INTERVIEWER
            </div>

            <h1
              className="
                mt-2
                text-5xl
                font-black
                text-white
              "
            >
              실전 TTS 면접
            </h1>
          </div>

          <div
            className="
              rounded-full
              bg-cyan-500/20
              px-5
              py-2
              text-sm
              font-bold
              text-cyan-300
            "
          >
            질문 1 / 10
          </div>
        </div>

        {/* 캐릭터 */}

        <div
          className="
            mt-6
            flex
            justify-center
          "
        >
          <Arti
            mood={mood}
            speaking={speaking}
          />
        </div>

        {/* 질문 카드 */}

        <div
          className="
            mx-auto
            mt-6
            max-w-[760px]
            rounded-[24px]
            border
            border-cyan-500/30
            bg-[#0D162D]
            p-8
          "
        >
          <div
            className="
              text-sm
              font-black
              text-cyan-400
            "
          >
            ARTI 질문
          </div>

          <p
            className="
              mt-4
              text-3xl
              font-bold
              leading-relaxed
              text-white
            "
          >
            Kafka를 도입하셨다고 작성하셨는데,
            대규모 트래픽 상황에서 Consumer Lag
            문제가 발생했을 때 어떤 방식으로
            대응하셨나요?
          </p>
        </div>

        {/* 상태 표시 */}

        <div className="mt-6 flex justify-center">
          <div
            className="
              rounded-full
              bg-cyan-500/20
              px-6
              py-3
              text-sm
              font-bold
              text-cyan-300
            "
          >
            ● 아티가 질문을 읽고 있습니다...
          </div>
        </div>

        {/* 테스트 버튼 */}

        <div
          className="
            mt-8
            flex
            flex-wrap
            justify-center
            gap-3
          "
        >
          <button
            onClick={() => setMood("idle")}
            className="
              rounded-xl
              bg-slate-700
              px-4
              py-2
              text-white
            "
          >
            기본
          </button>

          <button
            onClick={() => setMood("thinking")}
            className="
              rounded-xl
              bg-slate-700
              px-4
              py-2
              text-white
            "
          >
            분석
          </button>

          <button
            onClick={() => setMood("question")}
            className="
              rounded-xl
              bg-blue-600
              px-4
              py-2
              text-white
            "
          >
            질문
          </button>

          <button
            onClick={() => setMood("followup")}
            className="
              rounded-xl
              bg-purple-600
              px-4
              py-2
              text-white
            "
          >
            꼬리질문
          </button>

          <button
            onClick={() => setMood("good")}
            className="
              rounded-xl
              bg-green-600
              px-4
              py-2
              text-white
            "
          >
            좋은답변
          </button>

          <button
            onClick={() => setMood("final")}
            className="
              rounded-xl
              bg-yellow-500
              px-4
              py-2
              font-bold
              text-black
            "
          >
            최종평가
          </button>

          <button
            onClick={() =>
              setSpeaking((prev) => !prev)
            }
            className="
              rounded-xl
              bg-cyan-500
              px-4
              py-2
              font-bold
              text-black
            "
          >
            Speaking ON/OFF
          </button>
        </div>

        {/* 하단 버튼 */}

        <div
          className="
            mt-10
            flex
            justify-center
            gap-4
          "
        >
          <button
            className="
              rounded-xl
              bg-red-500
              px-8
              py-4
              font-black
              text-white
            "
          >
            면접 종료
          </button>

          <button
            onClick={() =>
              navigate("/interview")
            }
            className="
              rounded-xl
              bg-cyan-500
              px-8
              py-4
              font-black
              text-black
            "
          >
            면접 메인
          </button>
        </div>
      </section>
    </div>
  );
}