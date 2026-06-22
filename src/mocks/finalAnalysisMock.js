const finalAnalysisMock = [
  {
    resume_id: 1,
    job_posting_id: 101,
    company_name: "토스",
    job_name: "Backend Engineer",

    analysis_stage: "FINAL",

    overall_score: 95.72,

    metrics: {
      business_fit: {
        score: 96.3,
        reason_text:
          "비즈니스 이해도 관련 답변이 매우 우수했습니다.",
      },

      action_result_fit: {
        score: 94.85,
        reason_text:
          "실제 문제 해결 사례를 구체적으로 설명했습니다.",
      },

      tech_stack_fit: {
        score: 96.12,
        reason_text:
          "Java/Spring 기술 질문 정답률이 높았습니다.",
      },

      requirement_fit: {
        score: 95.48,
        reason_text:
          "직무 역량 검증 결과가 우수했습니다.",
      },

      culture_fit: {
        score: 95.86,
        reason_text:
          "협업 방식과 조직 적응력이 높게 평가되었습니다.",
      },
    },
  },

  {
    resume_id: 1,
    job_posting_id: 102,
    company_name: "네이버",
    job_name: "Backend Engineer",

    analysis_stage: "FINAL",

    overall_score: 92.13,

    metrics: {
      business_fit: {
        score: 91.2,
        reason_text:
          "서비스 이해도가 우수했습니다.",
      },

      action_result_fit: {
        score: 93.11,
        reason_text:
          "문제 해결 경험 설명이 뛰어났습니다.",
      },

      tech_stack_fit: {
        score: 92.88,
        reason_text:
          "기술 질문 응답 정확도가 높았습니다.",
      },

      requirement_fit: {
        score: 91.43,
        reason_text:
          "직무 적합성이 높게 평가되었습니다.",
      },

      culture_fit: {
        score: 92.03,
        reason_text:
          "조직 협업 역량이 확인되었습니다.",
      },
    },
  },

  {
    resume_id: 1,
    job_posting_id: 103,
    company_name: "카카오",
    job_name: "Platform Engineer",

    analysis_stage: "FINAL",

    overall_score: 91.62,

    metrics: {
      business_fit: {
        score: 91.74,
        reason_text:
          "플랫폼 도메인 이해도가 높았습니다.",
      },

      action_result_fit: {
        score: 90.26,
        reason_text:
          "장애 대응 경험 설명이 우수했습니다.",
      },

      tech_stack_fit: {
        score: 92.11,
        reason_text:
          "Kafka 관련 질문 대응이 우수했습니다.",
      },

      requirement_fit: {
        score: 91.0,
        reason_text:
          "직무 적합성이 높게 평가되었습니다.",
      },

      culture_fit: {
        score: 92.98,
        reason_text:
          "협업 및 커뮤니케이션 역량이 우수했습니다.",
      },
    },
  },

  {
    resume_id: 1,
    job_posting_id: 104,
    company_name: "당근",
    job_name: "Backend Engineer",

    analysis_stage: "FINAL",

    overall_score: 86.57,

    metrics: {
      business_fit: {
        score: 87.02,
        reason_text:
          "서비스 이해도가 향상되었습니다.",
      },

      action_result_fit: {
        score: 85.33,
        reason_text:
          "실무 사례 설명이 보완되었습니다.",
      },

      tech_stack_fit: {
        score: 86.98,
        reason_text:
          "기술 질문 응답이 개선되었습니다.",
      },

      requirement_fit: {
        score: 86.21,
        reason_text:
          "직무 역량이 확인되었습니다.",
      },

      culture_fit: {
        score: 87.31,
        reason_text:
          "조직 적응력이 확인되었습니다.",
      },
    },
  },

  {
    resume_id: 1,
    job_posting_id: 105,
    company_name: "중고나라",
    job_name: "Backend Engineer",

    analysis_stage: "FINAL",

    overall_score: 84.91,

    metrics: {
      business_fit: {
        score: 84.7,
        reason_text:
          "커머스 도메인 이해도가 확인되었습니다.",
      },

      action_result_fit: {
        score: 85.43,
        reason_text:
          "문제 해결 경험 설명이 보완되었습니다.",
      },

      tech_stack_fit: {
        score: 83.77,
        reason_text:
          "기술 질문 응답률이 향상되었습니다.",
      },

      requirement_fit: {
        score: 84.36,
        reason_text:
          "직무 이해도가 개선되었습니다.",
      },

      culture_fit: {
        score: 86.29,
        reason_text:
          "협업 역량이 높게 평가되었습니다.",
      },
    },
  },
];

export default finalAnalysisMock;