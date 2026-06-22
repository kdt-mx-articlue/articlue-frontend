const interviewReportMock = [
  {
    resume_id: 1,

    job_posting_id: 101,

    company_name: "토스",

    job_name: "Backend Engineer",

    interview_id: 15,

    session_id:
      "INTV_20260618_00015",

    interview_summary: {
      company_name: "토스",

      job_name:
        "Backend Engineer",

      difficulty: "상",

      interviewer_type:
        "압박형",

      question_count: 10,

      interview_mode:
        "CHATBOT",

      interview_date:
        "2026-06-18 14:20:00",

      duration_seconds: 1140,

      completion_rate: 100,

      chat_log_count: 28,
    },

    scores: {
      logic_score: 92.41,

      tech_understanding_score:
        95.72,

      business_link_score:
        89.16,

      evidence_score:
        93.58,

      job_fit_score:
        94.28,

      overall_score:
        93.03,
    },

    strengths: [
      {
        title:
          "기술 질문 대응 능력",

        description:
          "Spring Boot, 트랜잭션 처리, API 설계 관련 질문에 높은 이해도를 보였습니다.",
      },

      {
        title:
          "프로젝트 경험 설명 능력",

        description:
          "프로젝트 성과를 수치와 근거 기반으로 설명하여 설득력이 높았습니다.",
      },
    ],

    weaknesses: [
      {
        title:
          "비즈니스 관점 부족",

        description:
          "기술 중심 설명은 우수했으나 서비스 성장 관점 설명이 부족했습니다.",
      },

      {
        title:
          "도메인 이해도 보완 필요",

        description:
          "핀테크 서비스 수익 구조에 대한 이해를 보완할 필요가 있습니다.",
      },
    ],

    overall_feedback:
      "기술 역량은 매우 우수하며 실무 적응 가능성이 높습니다. 다만 비즈니스 관점에서 서비스를 바라보는 시각을 보완한다면 더욱 경쟁력 있는 지원자가 될 수 있습니다.",

    feedback: [
      {
        category: "LOGIC",

        title: "논리적 사고",

        score: 92.41,

        feedback:
          "질문의 핵심을 빠르게 파악하고 논리적으로 답변했습니다.",
      },

      {
        category: "TECH",

        title: "기술 이해도",

        score: 95.72,

        feedback:
          "Spring Boot와 트랜잭션 처리 관련 질문에 정확하게 답변했습니다.",
      },

      {
        category: "BUSINESS",

        title: "비즈니스 이해도",

        score: 89.16,

        feedback:
          "핀테크 서비스에 대한 이해도가 높았습니다.",
      },

      {
        category: "EVIDENCE",

        title: "경험 근거",

        score: 93.58,

        feedback:
          "프로젝트 경험을 수치 기반으로 설명했습니다.",
      },

      {
        category: "JOB_FIT",

        title: "직무 적합성",

        score: 94.28,

        feedback:
          "채용 포지션과 높은 적합도를 보였습니다.",
      },
    ],

    chat_history: [
      {
        interview_qa_id: 1,

        question_order: 1,

        question_type: "TECH",

        interviewer_role: "기술면접관",

        question_content:
        "Spring Boot에서 DI란 무엇인가요?",

        answer_content:
        "의존성 주입으로 객체 생성 책임을 외부에서 관리하는 방식입니다.",

        follow_up_yn: "N",
       },

       {
        interview_qa_id: 2,

        question_order: 1,

        question_type: "FOLLOW_UP",

        interviewer_role: "기술면접관",

        question_content:
        "생성자 주입을 사용하는 이유는 무엇인가요?",

        answer_content:
        "불변성을 보장하고 순환 참조 문제를 방지할 수 있기 때문입니다.",

        follow_up_yn: "Y",
        },

        {
        interview_qa_id: 3,

        question_order: 2,

        question_type: "TECH",

        interviewer_role: "기술면접관",

        question_content:
        "트랜잭션이란 무엇인가요?",

        answer_content:
        "데이터베이스 작업의 논리적 단위입니다.",

        follow_up_yn: "N",
        },
    ],
  },

  {
    resume_id: 1,

    job_posting_id: 102,

    company_name: "네이버",

    job_name: "Backend Engineer",

    interview_id: 16,

    session_id:
      "INTV_20260618_00016",

    interview_summary: {
      company_name: "네이버",

      job_name:
        "Backend Engineer",

      difficulty: "중",

      interviewer_type:
        "친절형",

      question_count: 8,

      interview_mode:
        "CHATBOT",

      interview_date:
        "2026-06-18 17:40:00",

      duration_seconds: 970,

      completion_rate: 100,

      chat_log_count: 22,
    },

    scores: {
      logic_score: 88.71,

      tech_understanding_score:
        90.15,

      business_link_score:
        87.92,

      evidence_score:
        89.34,

      job_fit_score:
        91.44,

      overall_score:
        89.51,
    },

    strengths: [
      {
        title:
          "안정적인 답변 구조",

        description:
          "답변 흐름이 자연스럽고 전달력이 좋았습니다.",
      },

      {
        title:
          "기술 지식 수준",

        description:
          "백엔드 기술 질문에 대한 이해도가 높았습니다.",
      },
    ],

    weaknesses: [
      {
        title:
          "장애 대응 경험 설명 부족",

        description:
          "실제 장애 대응 사례 설명이 다소 부족했습니다.",
      },

      {
        title:
          "대규모 서비스 경험 부족",

        description:
          "트래픽 규모에 대한 설명이 제한적이었습니다.",
      },
    ],

    overall_feedback:
      "전반적으로 안정적인 면접 수행 능력을 보였습니다. 실제 서비스 운영 경험과 장애 대응 경험을 조금 더 구체적으로 준비하면 경쟁력이 더욱 높아질 것으로 보입니다.",

    feedback: [
      {
        category: "LOGIC",

        title: "논리적 사고",

        score: 88.71,

        feedback:
          "전반적으로 논리적이었으나 일부 답변의 구조화가 부족했습니다.",
      },

      {
        category: "TECH",

        title: "기술 이해도",

        score: 90.15,

        feedback:
          "백엔드 기술 질문에 안정적으로 답변했습니다.",
      },

      {
        category: "BUSINESS",

        title: "비즈니스 이해도",

        score: 87.92,

        feedback:
          "서비스 운영 관점의 설명이 좋았습니다.",
      },

      {
        category: "EVIDENCE",

        title: "경험 근거",

        score: 89.34,

        feedback:
          "실제 프로젝트 사례를 근거로 설명했습니다.",
      },

      {
        category: "JOB_FIT",

        title: "직무 적합성",

        score: 91.44,

        feedback:
          "포지션 요구사항과 높은 적합도를 보였습니다.",
      },
    ],

        chat_history: [
      {
        interview_qa_id: 1,

        question_order: 1,

        question_type: "TECH",

        interviewer_role: "기술면접관",

        question_content:
        "Spring Boot에서 DI란 무엇인가요?",

        answer_content:
        "의존성 주입으로 객체 생성 책임을 외부에서 관리하는 방식입니다.",

        follow_up_yn: "N",
       },

       {
        interview_qa_id: 2,

        question_order: 1,

        question_type: "FOLLOW_UP",

        interviewer_role: "기술면접관",

        question_content:
        "생성자 주입을 사용하는 이유는 무엇인가요?",

        answer_content:
        "불변성을 보장하고 순환 참조 문제를 방지할 수 있기 때문입니다.",

        follow_up_yn: "Y",
        },

        {
        interview_qa_id: 3,

        question_order: 2,

        question_type: "TECH",

        interviewer_role: "기술면접관",

        question_content:
        "트랜잭션이란 무엇인가요?",

        answer_content:
        "데이터베이스 작업의 논리적 단위입니다.",

        follow_up_yn: "N",
        },
    ],
  },

  {
    resume_id: 1,

    job_posting_id: 103,

    company_name: "카카오",

    job_name: "Platform Engineer",

    interview_id: 17,

    session_id:
      "INTV_20260619_00017",

    interview_summary: {
      company_name: "카카오",

      job_name:
        "Platform Engineer",

      difficulty: "상",

      interviewer_type:
        "실무형",

      question_count: 12,

      interview_mode:
        "TTS",

      interview_date:
        "2026-06-19 10:30:00",

      duration_seconds: 1380,

      completion_rate: 100,

      chat_log_count: 34,
    },

    scores: {
      logic_score: 91.28,

      tech_understanding_score:
        92.84,

      business_link_score:
        86.75,

      evidence_score:
        90.46,

      job_fit_score:
        91.12,

      overall_score:
        90.49,
    },

    strengths: [
      {
        title:
          "분산 시스템 이해도",

        description:
          "Kafka, Redis, 비동기 처리 구조에 대한 이해도가 높았습니다.",
      },

      {
        title:
          "플랫폼 운영 경험",

        description:
          "운영 과정에서 발생한 문제를 잘 설명했습니다.",
      },
    ],

    weaknesses: [
      {
        title:
          "비즈니스 연결성 부족",

        description:
          "기술 설명과 서비스 가치 연결이 부족했습니다.",
      },

      {
        title:
          "근거 제시 보완 필요",

        description:
          "일부 답변에서 수치 기반 근거가 부족했습니다.",
      },
    ],

    overall_feedback:
      "플랫폼 엔지니어 직무 적합성이 높게 평가되었습니다. 기술 역량은 우수하나 서비스 관점의 비즈니스 연결성을 보완하면 더욱 좋은 평가를 받을 수 있습니다.",

    feedback: [
      {
        category: "LOGIC",

        title: "논리적 사고",

        score: 91.28,

        feedback:
          "질문에 대한 답변 구조가 명확했습니다.",
      },

      {
        category: "TECH",

        title: "기술 이해도",

        score: 92.84,

        feedback:
          "분산 시스템 관련 질문 대응이 우수했습니다.",
      },

      {
        category: "BUSINESS",

        title: "비즈니스 이해도",

        score: 86.75,

        feedback:
          "서비스 가치 관점 설명이 다소 부족했습니다.",
      },

      {
        category: "EVIDENCE",

        title: "경험 근거",

        score: 90.46,

        feedback:
          "실제 운영 경험을 잘 녹여냈습니다.",
      },

      {
        category: "JOB_FIT",

        title: "직무 적합성",

        score: 91.12,

        feedback:
          "플랫폼 엔지니어 포지션과 높은 적합도를 보였습니다.",
      },
    ],

        chat_history: [
      {
        interview_qa_id: 1,

        question_order: 1,

        question_type: "TECH",

        interviewer_role: "기술면접관",

        question_content:
        "Spring Boot에서 DI란 무엇인가요?",

        answer_content:
        "의존성 주입으로 객체 생성 책임을 외부에서 관리하는 방식입니다.",

        follow_up_yn: "N",
       },

       {
        interview_qa_id: 2,

        question_order: 1,

        question_type: "FOLLOW_UP",

        interviewer_role: "기술면접관",

        question_content:
        "생성자 주입을 사용하는 이유는 무엇인가요?",

        answer_content:
        "불변성을 보장하고 순환 참조 문제를 방지할 수 있기 때문입니다.",

        follow_up_yn: "Y",
        },

        {
        interview_qa_id: 3,

        question_order: 2,

        question_type: "TECH",

        interviewer_role: "기술면접관",

        question_content:
        "트랜잭션이란 무엇인가요?",

        answer_content:
        "데이터베이스 작업의 논리적 단위입니다.",

        follow_up_yn: "N",
        },
    ],
  },
];

export default interviewReportMock;