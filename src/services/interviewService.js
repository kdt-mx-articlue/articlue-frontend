import interviewQuestionMock, {
  followUpQuestions,
} from "../mocks/interviewQuestionMock";

/*
  면접 시작
*/
export async function startInterview(
  job_posting_id,
  question_count
) {
  const questions =
    interviewQuestionMock[
      Number(job_posting_id)
    ] || [];

  const selectedQuestions =
    questions.slice(
      0,
      Number(question_count)
    );

  return {
    interview_session_id:
      Date.now(),

    questions:
      selectedQuestions,

    first_question:
      selectedQuestions[0],
  };
}

/*
  답변 제출
*/
export async function submitAnswer({
  questions,
  currentIndex,
  lastQuestionType,
}) {
  const currentQuestion =
    questions?.[currentIndex];

  /*
    질문이 없으면 종료
  */
  if (!currentQuestion) {
    return {
      finished: true,

      result_id:
        Date.now(),
    };
  }

  /*
    FOLLOW_UP은
    연속 생성 금지
  */
  const canFollowUp =
    lastQuestionType !==
    "FOLLOW_UP";

  const isFollowUp =
    canFollowUp &&
    Math.random() > 0.6;

  /*
    꼬리질문
  */
  if (isFollowUp) {
    const randomFollowUp =
      followUpQuestions[
        Math.floor(
          Math.random() *
            followUpQuestions.length
        )
      ];

    return {
      finished: false,

      followUp: true,

      next_question: {
        question_id:
          Date.now(),

        question_order:
          currentQuestion.question_order,

        question_type:
          "FOLLOW_UP",

        content:
          randomFollowUp,
      },
    };
  }

  /*
    다음 일반 질문
  */
  const nextIndex =
    currentIndex + 1;

  /*
    마지막 질문이면 종료
  */
  if (
    nextIndex >=
    questions.length
  ) {
    return {
      finished: true,

      result_id:
        Date.now(),
    };
  }

  return {
    finished: false,

    followUp: false,

    next_question:
      questions[nextIndex],
  };
}

/*
  강제 종료
*/
export async function forceFinishInterview() {
  return {
    success: true,
  };
}