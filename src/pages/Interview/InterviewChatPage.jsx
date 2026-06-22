import {
  useEffect,
  useState,
  useRef,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  startInterview,
  submitAnswer,
  forceFinishInterview,
} from "../../services/interviewService";

function streamText(
  text,
  callback,
  onEnd
) {
  let i = 0;

  const interval =
    setInterval(() => {
      callback(
        text.slice(0, i)
      );

      i++;

      if (i > text.length) {
        clearInterval(
          interval);

        onEnd?.();
      }
    }, 20);

  return interval;
}

export default function InterviewChatPage() {
  const navigate =
    useNavigate();

  const setup =
    JSON.parse(
      localStorage.getItem(
        "interviewSetup"
      )
    ) || {};

  const {
    job_posting_id,
    company_name,
    job_name,
    difficulty,
    interviewer_type,
    question_count,
  } = setup;

  const [
    interviewSessionId,
    setInterviewSessionId,
  ] = useState(null);

  const [questions, setQuestions] =
    useState([]);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [remainingQuestion,
    setRemainingQuestion] =
    useState(
      Number(
        question_count || 10
      )
    );

  const [messages, setMessages] =
    useState([]);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [
    showExitModal,
    setShowExitModal,
  ] = useState(false);

  const initializedRef =
    useRef(false);

  const inputRef =
    useRef("");

  useEffect(() => {
    if (
      initializedRef.current
    ) {
      return;
    }

    initializedRef.current =
      true;

    initializeInterview();
  }, []);

  async function initializeInterview() {
    const result =
      await startInterview(
        job_posting_id,
        question_count
      );

    if (
      !result ||
      !result.first_question
    ) {
      return;
    }

    setInterviewSessionId(
      result.interview_session_id
    );

    setQuestions(
      result.questions
    );

    addAssistantMessage(
      result.first_question
    );
  }

  function addAssistantMessage(
    question
  ) {
    if (!question) return;

    const tempId =
      Date.now();

    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        role: "assistant",
        type:
          question.question_type,
        content: "",
      },
    ]);

    streamText(
      question.content,
      (partialText) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId
              ? {
                  ...msg,
                  content:
                    partialText,
                }
              : msg
          )
        );
      }
    );
  }

  async function handleSubmit(
    forcedAnswer = null
  ) {
    if (loading) {
      return;
    }

    const answer =
      forcedAnswer ??
      inputRef.current.trim();

    if (!answer) {
      return;
    }

    setLoading(true);

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: answer,
      },
    ]);

    setInput("");
    inputRef.current = "";

    const lastAssistant =
      [...messages]
        .reverse()
        .find(
          (item) =>
            item.role ===
            "assistant"
        );

    const result =
      await submitAnswer({
        interview_session_id:
          interviewSessionId,

        questions,

        currentIndex,

        lastQuestionType:
          lastAssistant?.type,
      });

    if (
      result.finished
    ) {
      navigate(
        `/interview-report/${job_posting_id}`
      );

      return;
    }

    if (
      !result.followUp
    ) {
      setCurrentIndex(
        (prev) => prev + 1
      );

      setRemainingQuestion(
        (prev) => prev - 1
      );
    }

    addAssistantMessage(
      result.next_question
    );

    setLoading(false);
  }

  async function handleForceExit() {
    await forceFinishInterview();

    navigate(
      "/interview"
    );
  }

  return (
    <>
      <div
        className="
          mx-auto
          max-w-[1000px]
          space-y-6
        "
      >
        <section
          className="
            sticky
            top-0
            z-10
            rounded-2xl
            bg-white
            p-6
            shadow-sm
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
            "
          >
            <div>
              <h1
                className="
                  text-2xl
                  font-black
                "
              >
                {company_name}
              </h1>

              <p
                className="
                  text-slate-500
                "
              >
                {job_name}
              </p>

              <div
                className="
                  mt-3
                  flex
                  gap-3
                  text-sm
                "
              >
                <span>
                  난이도 {difficulty}
                </span>

                <span>
                  {
                    interviewer_type
                  }
                </span>

                <span>
                  남은 질문{" "}
                  {
                    remainingQuestion
                  }
                </span>
              </div>
            </div>

            <div
              className="
                flex
                items-center
                gap-4
              "
            >
              <button
                onClick={() =>
                  setShowExitModal(
                    true
                  )
                }
                className="
                  rounded-xl
                  bg-red-500
                  px-5
                  py-3
                  font-black
                  text-white
                "
              >
                면접 종료
              </button>
            </div>
          </div>
        </section>

        <section
          className="
            rounded-2xl
            bg-white
            p-6
          "
        >
          <div
            className="
              space-y-6
            "
          >
            {messages.map(
              (
                message,
                index
              ) => (
                <div
                  key={index}
                >
                  <div
                    className={`
                      flex gap-3
                      ${
                        message.role ===
                        "user"
                          ? "justify-end"
                          : ""
                      }
                    `}
                  >
                    {message.role ===
                      "assistant" && (
                      <div
                        className="
                          h-12
                          w-12
                          shrink-0
                          rounded-full
                          bg-gradient-to-br
                          from-blue-500
                          to-indigo-600
                          flex
                          items-center
                          justify-center
                          text-white
                          font-black
                        "
                      >
                        AI
                      </div>
                    )}

                    <div>
                      <div
                        className="
                          mb-1
                          text-sm
                          font-bold
                        "
                      >
                        {message.role ===
                        "assistant"
                          ? "면접관"
                          : "지원자"}
                      </div>

                      <div
                        className="
                          max-w-[700px]
                          rounded-2xl
                          border
                          bg-white
                          p-4
                          leading-7
                        "
                      >
                        {message.content}
                      </div>
                    </div>

                    {message.role ===
                      "user" && (
                      <div
                        className="
                          h-12
                          w-12
                          shrink-0
                          rounded-full
                          bg-gradient-to-br
                          from-slate-700
                          to-slate-900
                          flex
                          items-center
                          justify-center
                          text-white
                          font-black
                        "
                      >
                        나
                      </div>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </section>

        <section
          className="
            rounded-2xl
            bg-white
            p-6
          "
        >
          <textarea
            value={input}
            onChange={(e) => {
              setInput(
                e.target.value
              );

              inputRef.current =
                e.target.value;
            }}
            rows={5}
            placeholder="답변을 입력하세요."
            className="
              w-full
              rounded-xl
              border
              p-4
              outline-none
            "
          />

          <button
            onClick={() =>
              handleSubmit()
            }
            disabled={loading}
            className="
              mt-4
              w-full
              rounded-xl
              bg-blue-600
              py-4
              font-black
              text-white
            "
          >
            답변 제출
          </button>
        </section>
            </div>

            {showExitModal && (
              <div
                className="
                  fixed
                  inset-0
                  z-50
                  flex
                  items-center
                  justify-center
                  bg-black/50
                "
              >
                <div
                  className="
                    w-[500px]
                    rounded-3xl
                    bg-white
                    p-8
                    shadow-xl
                  "
                >
                  <h2
                    className="
                      text-2xl
                      font-black
                    "
                  >
                    면접 종료
                  </h2>

                  <p
                    className="
                      mt-4
                      leading-7
                      text-slate-600
                    "
                  >
                    중간에 면접을 종료하면
                    해당 면접의 리포트는
                    제공되지 않습니다.

                    <br />
                    <br />

                    면접 횟수는
                    정상 차감됩니다.

                    <br />
                    <br />

                    정말 면접을
                    종료하시겠습니까?
                  </p>

                  <div
                    className="
                      mt-8
                      flex
                      gap-3
                    "
                  >
                    <button
                      onClick={() =>
                        setShowExitModal(
                          false
                        )
                      }
                      className="
                        flex-1
                        rounded-xl
                        border
                        py-3
                        font-black
                      "
                    >
                      아니요
                    </button>

                    <button
                      onClick={
                        handleForceExit
                      }
                      className="
                        flex-1
                        rounded-xl
                        bg-red-500
                        py-3
                        font-black
                        text-white
                      "
                    >
                      예
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        );
      }