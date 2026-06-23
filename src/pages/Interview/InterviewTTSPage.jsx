// // src/pages/Interview/InterviewTTSPage.jsx

// import { useNavigate } from "react-router-dom";

// export default function InterviewTTSPage() {
//   const navigate = useNavigate();

//   return (
//     <div
//       className="
//         mx-auto
//         max-w-[1120px]
//         space-y-8
//       "
//     >
//       <section
//         className="
//           rounded-[28px]
//           bg-white
//           p-10
//           text-center
//         "
//       >
//         <div
//           className="
//             text-sm
//             font-bold
//             text-blue-600
//           "
//         >
//           TTS 면접
//         </div>

//         <h1
//           className="
//             mt-4
//             text-4xl
//             font-black
//           "
//         >
//           음성 면접 준비 중
//         </h1>

//         <p
//           className="
//             mt-4
//             text-slate-500
//           "
//         >
//           현재는 ChatBot 면접만
//           제공되고 있습니다.
//         </p>

//         <div
//           className="
//             mt-8
//             flex
//             justify-center
//           "
//         >
//           <button
//             onClick={() =>
//               navigate("/interview")
//             }
//             className="
//               rounded-xl
//               bg-blue-600
//               px-8
//               py-4
//               font-black
//               text-white
//             "
//           >
//             면접 메인으로
//           </button>
//         </div>
//       </section>
//     </div>
//   );
// }



// src/pages/Interview/InterviewTTSPage.jsx

import { useNavigate } from "react-router-dom";
import Arti from "../../components/Arti/Arti";

export default function InterviewTTSPage() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-[1200px]">

      <section
        className="
          rounded-[32px]
          bg-slate-950
          p-12
          text-white
          shadow-2xl
          relative
          overflow-hidden
        "
      >
        {/* 상단 상태 */}

        <div className="flex items-center justify-between">

          <div>
            <p
              className="
                text-cyan-400
                font-bold
                tracking-widest
              "
            >
              ARTI AI INTERVIEWER
            </p>

            <h1
              className="
                mt-2
                text-4xl
                font-black
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
              text-cyan-300
              font-bold
            "
          >
            질문 1 / 10
          </div>

        </div>

        {/* 캐릭터 */}

        <div
          className="
            mt-10
            flex
            justify-center
          "
        >
          <Arti
            expression="question"
            speaking={true}
            size="sm"
          />
        </div>

        {/* 질문창 */}

        <div
          className="
            mt-8
            mx-auto
            max-w-[800px]
            rounded-3xl
            border
            border-cyan-500/30
            bg-slate-900/80
            p-8
            backdrop-blur
          "
        >
          <div
            className="
              text-cyan-300
              text-sm
              font-bold
            "
          >
            ARTI 질문
          </div>

          <p
            className="
              mt-4
              text-2xl
              font-bold
              leading-relaxed
            "
          >
            Kafka를 도입하셨다고
            작성하셨는데,

            대규모 트래픽 상황에서

            Consumer Lag 문제가
            발생했을 때

            어떤 방식으로 대응하셨나요?
          </p>
        </div>

        {/* 음성 상태 */}

        <div
          className="
            mt-8
            flex
            justify-center
          "
        >
          <div
            className="
              flex
              items-center
              gap-3

              rounded-full
              bg-cyan-500/20

              px-6
              py-3
            "
          >
            <div
              className="
                h-3
                w-3
                rounded-full
                bg-cyan-400
                animate-pulse
              "
            />

            <span
              className="
                font-semibold
                text-cyan-200
              "
            >
              아티가 답변을 듣고 있습니다...
            </span>
          </div>
        </div>

        {/* 하단 버튼 */}

        <div
          className="
            mt-12
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
              text-slate-950
            "
          >
            면접 메인
          </button>
        </div>

      </section>
    </div>
  );
}