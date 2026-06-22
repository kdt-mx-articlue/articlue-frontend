const resumeAnalysisMock = [
  {
    resume_id: 1,
    job_posting_id: 101,
    company_name: "토스",
    job_name: "Backend Engineer",

    analysis_stage: "RESUME",

    overall_score: 91.28,

    metrics: {
      business_fit: {
        score: 92.15,
        reason_text:
          "핀테크 서비스 개발 경험과 결제 시스템 프로젝트 경험이 확인됩니다.",
      },

      action_result_fit: {
        score: 88.42,
        reason_text:
          "트래픽 개선 및 성능 최적화 경험을 구체적으로 기술했습니다.",
      },

      tech_stack_fit: {
        score: 95.6,
        reason_text:
          "Java, Spring Boot, MySQL 기술 스택이 요구사항과 매우 유사합니다.",
      },

      requirement_fit: {
        score: 89.17,
        reason_text:
          "REST API 설계 및 운영 경험이 채용 요구사항과 부합합니다.",
      },

      culture_fit: {
        score: 91.08,
        reason_text:
          "협업 중심 개발 문화와 적합한 경험이 존재합니다.",
      },
    },
  },

  {
    resume_id: 1,
    job_posting_id: 102,
    company_name: "네이버",
    job_name: "Backend Engineer",

    analysis_stage: "RESUME",

    overall_score: 88.64,

    metrics: {
      business_fit: {
        score: 87.31,
        reason_text:
          "대규모 서비스 경험은 일부 부족하나 도메인 이해도가 높습니다.",
      },

      action_result_fit: {
        score: 89.12,
        reason_text:
          "장애 대응 및 문제 해결 경험이 확인됩니다.",
      },

      tech_stack_fit: {
        score: 90.28,
        reason_text:
          "Spring Boot, Redis 경험이 확인됩니다.",
      },

      requirement_fit: {
        score: 88.43,
        reason_text:
          "백엔드 설계 경험이 요구사항과 부합합니다.",
      },

      culture_fit: {
        score: 88.06,
        reason_text:
          "협업 경험과 코드 리뷰 경험이 확인됩니다.",
      },
    },
  },

  {
    resume_id: 1,
    job_posting_id: 103,
    company_name: "카카오",
    job_name: "Platform Engineer",

    analysis_stage: "RESUME",

    overall_score: 88.64,

    metrics: {
      business_fit: {
        score: 89.41,
        reason_text:
          "플랫폼 개발 경험이 존재합니다.",
      },

      action_result_fit: {
        score: 86.12,
        reason_text:
          "운영 환경 장애 대응 경험이 있습니다.",
      },

      tech_stack_fit: {
        score: 91.52,
        reason_text:
          "Kafka, Redis 활용 경험이 확인됩니다.",
      },

      requirement_fit: {
        score: 87.23,
        reason_text:
          "플랫폼 운영 경험이 일부 요구사항과 부합합니다.",
      },

      culture_fit: {
        score: 88.92,
        reason_text:
          "조직 협업 경험이 우수합니다.",
      },
    },
  },

  {
    resume_id: 1,
    job_posting_id: 104,
    company_name: "당근",
    job_name: "Backend Engineer",

    analysis_stage: "RESUME",

    overall_score: 82.43,

    metrics: {
      business_fit: {
        score: 83.71,
        reason_text:
          "커뮤니티 서비스 경험이 일부 존재합니다.",
      },

      action_result_fit: {
        score: 80.15,
        reason_text:
          "문제 해결 경험은 있으나 규모가 작습니다.",
      },

      tech_stack_fit: {
        score: 84.2,
        reason_text:
          "Spring 기반 경험이 존재합니다.",
      },

      requirement_fit: {
        score: 82.44,
        reason_text:
          "서비스 운영 경험이 일부 존재합니다.",
      },

      culture_fit: {
        score: 81.65,
        reason_text:
          "협업 경험은 충분합니다.",
      },
    },
  },

  {
    resume_id: 1,
    job_posting_id: 105,
    company_name: "중고나라",
    job_name: "Backend Engineer",

    analysis_stage: "RESUME",

    overall_score: 78.67,

    metrics: {
      business_fit: {
        score: 78.17,
        reason_text:
          "커머스 경험은 존재하나 규모가 제한적입니다.",
      },

      action_result_fit: {
        score: 68,
        reason_text:
          "트러블슈팅 경험이 부족합니다.",
      },

      tech_stack_fit: {
        score: 42.5,
        reason_text:
          "Redis 및 Kafka 경험이 부족합니다.",
      },

      requirement_fit: {
        score: 43.67,
        reason_text:
          "일부 요구사항 경험이 부족합니다.",
      },

      culture_fit: {
        score: 85,
        reason_text:
          "협업 경험은 충분히 확인됩니다.",
      },
    },
  },
];

export default resumeAnalysisMock;