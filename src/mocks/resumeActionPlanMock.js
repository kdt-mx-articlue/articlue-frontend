const resumeActionPlanMock = [
  {
    resume_id: 1,

    job_posting_id: 101,

    company_name: "토스",

    weaknesses: [
      {
        category: "SKILL",

        title: "Redis 경험 부족",

        description:
          "캐시 서버 활용 경험이 확인되지 않습니다.",

        priority: 1,
      },

      {
        category: "SKILL",

        title: "Kafka 경험 부족",

        description:
          "대용량 메시지 처리 경험이 부족합니다.",

        priority: 2,
      },
    ],

    recommendations: [
      {
        category: "SKILL",

        title: "Redis 학습 추천",

        description:
          "캐시 서버 구축 및 활용 프로젝트 진행",

        priority: 1,
      },

      {
        category: "SKILL",

        title: "Kafka 학습 추천",

        description:
          "이벤트 기반 아키텍처 실습 진행",

        priority: 2,
      },
    ],
  },

  {
    resume_id: 1,

    job_posting_id: 102,

    company_name: "네이버",

    weaknesses: [
      {
        category: "PROJECT",

        title: "대규모 트래픽 경험 부족",

        description:
          "실제 서비스 규모 경험이 부족합니다.",

        priority: 1,
      },
    ],

    recommendations: [
      {
        category: "PROJECT",

        title: "대규모 서비스 아키텍처 학습",

        description:
          "MSA 및 대규모 트래픽 처리 사례 학습",

        priority: 1,
      },
    ],
  },

  {
    resume_id: 1,

    job_posting_id: 103,

    company_name: "카카오",

    weaknesses: [
      {
        category: "SKILL",

        title: "분산 시스템 경험 부족",

        description:
          "대규모 플랫폼 운영 경험이 부족합니다.",

        priority: 1,
      },
    ],

    recommendations: [
      {
        category: "SKILL",

        title: "분산 시스템 학습",

        description:
          "Kafka, RabbitMQ 프로젝트 수행",

        priority: 1,
      },
    ],
  },

  {
    resume_id: 1,

    job_posting_id: 104,

    company_name: "당근",

    weaknesses: [
      {
        category: "PROJECT",

        title: "서비스 운영 경험 부족",

        description:
          "실서비스 배포 경험이 제한적입니다.",

        priority: 1,
      },
    ],

    recommendations: [
      {
        category: "PROJECT",

        title: "배포 프로젝트 수행",

        description:
          "AWS 기반 운영 경험 확보",

        priority: 1,
      },
    ],
  },

  {
    resume_id: 1,

    job_posting_id: 105,

    company_name: "중고나라",

    weaknesses: [
      {
        category: "SKILL",

        title: "Redis 부족",

        description:
          "캐시 서버 경험 부족",

        priority: 1,
      },

      {
        category: "SKILL",

        title: "Kafka 부족",

        description:
          "메시지 큐 경험 부족",

        priority: 2,
      },
    ],

    recommendations: [
      {
        category: "SKILL",

        title: "Redis 학습",

        description:
          "Redis 캐시 서버 실습 진행",

        priority: 1,
      },

      {
        category: "SKILL",

        title: "Kafka 학습",

        description:
          "이벤트 기반 메시징 프로젝트 진행",

        priority: 2,
      },
    ],
  },
];

export default resumeActionPlanMock;