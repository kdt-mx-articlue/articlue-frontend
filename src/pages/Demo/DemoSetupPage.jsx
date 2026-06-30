import { useNavigate } from "react-router-dom";
import { useResumeStore } from "../../store/resumeStore";

/* ───────────────────────────────────────────────────────────
   역할별 이력서 프리셋 (제공 데이터 기준)
   github / portfolios 는 사용자 직접 입력
─────────────────────────────────────────────────────────── */

const PRESETS = {

  /* ── AI 개발자 ── */
  ai: {
    resumeId: null,
    resumeInfo: {
      resumeTitle: "RAG와 LLM 기반 서비스 구현 경험을 갖춘 AI 백엔드 개발자 이력서",
      desiredJob: "AI 개발자 / AI 백엔드 개발자 / LLM 서비스 개발자",
      introduction:
        "Python, FastAPI, LangChain, RAG, Vector DB를 활용해 문서 기반 질의응답과 AI 분석 서비스를 구현한 AI 개발자입니다.",
      resumeStatus: "DRAFT",
      representativeYn: "N",
    },
    desiredLocations: ["서울", "경기", "광주"],
    techStack: {
      languages: ["Python", "JavaScript", "SQL"],
      techs: [
        { techCategoryCode: "langchain", techName: "LangChain" },
        { techCategoryCode: "langgraph", techName: "LangGraph" },
        { techCategoryCode: "openai", techName: "OpenAI API" },
        { techCategoryCode: "huggingface", techName: "Hugging Face" },
        { techCategoryCode: "sklearn", techName: "Scikit-learn" },
        { techCategoryCode: "pandas", techName: "Pandas/NumPy" },
        { techCategoryCode: "fastapi", techName: "FastAPI" },
        { techCategoryCode: "chromadb", techName: "ChromaDB" },
        { techCategoryCode: "faiss", techName: "FAISS" },
        { techCategoryCode: "docker", techName: "Docker" },
      ],
    },
    education: {
      educationType: "university",
      highschool: {
        educationId: null, isGed: false, schoolType: "고등학교",
        schoolName: "", track: "", major: "", graduationStatus: "졸업",
        gpa: "", startYm: "", endYm: "",
      },
      universities: [
        {
          educationId: null,
          schoolType: "대학교",
          schoolName: "광주○○대학교",
          major: "인공지능융합학과",
          graduationStatus: "졸업예정",
          gpa: "",
          gpaScale: "4.5",
          startYm: "2020-03",
          endYm: "2026-02",
        },
      ],
      graduates: [],
    },
    experiences: [
      {
        experienceId: null,
        experienceType: "교육",
        experienceName: "AI 서비스 개발자 양성 과정",
        context:
          "Python 기반 데이터 처리, 머신러닝, 딥러닝, FastAPI 서버 개발, RAG 기반 AI 서비스 구현 과정을 학습했습니다. 단순 모델 학습뿐만 아니라 실제 서비스에서 AI 기능을 API 형태로 제공하는 구조를 경험했습니다.\n\n특히 문서 업로드 후 요약, 키워드 추출, 질문 생성, 답변 평가를 수행하는 AI 서버를 구현하면서 LLM을 단순 호출하는 것보다 프롬프트 설계, 응답 형식 고정, 예외 처리, 처리 시간 관리가 중요하다는 점을 배웠습니다.\n\n프로젝트에서는 FastAPI를 기반으로 AI 분석 API를 만들고, 백엔드 서버가 해당 API를 호출하는 구조를 구현했습니다. AI 서버의 응답이 지연될 수 있기 때문에 일반 API와 분석 API의 timeout 정책을 분리했고, 실패 시 명확한 오류 메시지를 반환하도록 처리했습니다.",
        startYm: "2025-06",
        endYm: "2025-12",
      },
      {
        experienceId: null,
        experienceType: "프로젝트",
        experienceName: "이력서 기반 AI 면접 질문 생성 서비스",
        context:
          "사용자의 이력서, 자기소개서, 포트폴리오 내용을 분석하여 직무 맞춤형 면접 질문을 생성하고, 사용자의 답변에 대해 후속 질문과 피드백을 제공하는 AI 면접 서비스입니다.\n\n담당 역할: AI 서버 개발 / RAG 파이프라인 설계\n사용 기술: Python, FastAPI, LangChain, LangGraph, ChromaDB, OpenAI API, Pydantic, Docker\n\n주요 구현:\n- 이력서 텍스트 요약 API 및 자기소개서 기반 핵심 경험 추출 구현\n- RAG 기반 면접 질문 생성 및 LangGraph 기반 질문 생성 흐름 설계\n- 꼬리 질문 무한 생성 방지 로직 구현 (세션 단위 횟수 제한)\n- Pydantic Schema를 활용한 응답 형식 검증으로 파싱 오류 감소\n- Vector DB 검색 품질 개선: 기술스택·프로젝트명·직무 키워드에 가중치 적용",
        startYm: "2025-10",
        endYm: "2025-12",
      },
    ],
    careers: [
      {
        careerId: null,
        companyName: "○○문서관리센터",
        department: "자료 정리팀",
        position: "계약직",
        startYm: "2023-03",
        endYm: "2023-12",
        mainAchievement:
          "문서 분류, 스캔 파일 검수, 메타데이터 입력 업무를 담당했습니다. 반복적인 문서 분류 작업을 하면서 문서 제목, 본문 키워드, 카테고리 정보가 검색 품질에 큰 영향을 준다는 점을 체감했습니다. 이 경험은 이후 RAG 기반 문서 검색 서비스를 구현할 때 적절한 단위로 문서를 나누고 메타데이터를 함께 저장해야 검색 정확도를 높일 수 있다는 점을 이해하는 데 도움이 되었습니다.",
      },
    ],
    coverLetter: {
      coverLetterId: null,
      items: [
        {
          questionOrder: 1,
          subTitle: "LLM을 서비스에 적용하는 과정에서 구조화의 중요성을 배웠습니다.",
          content:
            "AI 개발을 시작했을 때는 좋은 모델을 사용하면 좋은 결과가 나온다고 생각했습니다. 하지만 실제 프로젝트에서 LLM을 서비스에 적용해 보니 모델 성능만큼 중요한 것이 입력 데이터 정리, 프롬프트 설계, 응답 형식 검증, 예외 처리라는 점을 알게 되었습니다.\n\n이력서 기반 면접 질문 생성 프로젝트에서 초기에는 이력서 전체 내용을 그대로 LLM에 전달했습니다. 그 결과 질문이 너무 일반적이거나, 사용자의 핵심 프로젝트 경험을 반영하지 못하는 문제가 있었습니다. 이를 해결하기 위해 이력서를 학력, 프로젝트, 기술스택, 자기소개서 항목으로 분리하고, 각 항목에서 핵심 정보를 먼저 추출한 뒤 질문 생성 단계에 전달했습니다.\n\n또한 LLM 응답이 매번 다른 형식으로 반환되어 백엔드 서버에서 파싱 오류가 발생했습니다. 이를 해결하기 위해 응답 형식을 JSON으로 고정하고, Pydantic Schema를 활용해 응답값을 검증했습니다. 이 경험을 통해 AI 기능은 단순한 모델 호출이 아니라 서비스에 안정적으로 연결될 수 있도록 구조화되어야 한다는 점을 배웠습니다.",
        },
        {
          questionOrder: 2,
          subTitle: "검색 품질과 답변 품질을 함께 고민하는 AI 개발자가 되고 싶습니다.",
          content:
            "RAG 기반 서비스를 구현하면서 사용자의 질문에 좋은 답변을 제공하기 위해서는 LLM뿐만 아니라 검색 품질이 중요하다는 것을 배웠습니다. 문서를 어떤 기준으로 나눌지, 어떤 메타데이터를 함께 저장할지, 어떤 chunk를 검색 결과로 선택할지에 따라 최종 답변의 품질이 달라졌습니다.\n\n프로젝트에서는 이력서와 채용 공고를 벡터화하여 유사도를 계산했습니다. 처음에는 단순히 문장 임베딩 결과만 사용했지만, 기술스택이나 직무 키워드가 정확히 반영되지 않는 문제가 있었습니다. 이후 기술명, 직무명, 프로젝트명을 별도 키워드로 추출하고 검색 조건에 반영하여 더 관련성 높은 문서를 가져오도록 개선했습니다.\n\n저는 앞으로도 AI 모델을 사용하는 데 그치지 않고, 데이터 흐름과 검색 구조, 백엔드 연동까지 함께 고려하는 AI 개발자로 성장하고 싶습니다.",
        },
      ],
    },
    certificates: [
      { certificateId: null, certificateName: "ADsP", acquiredYm: "2025-08", issuer: "한국데이터산업진흥원" },
      { certificateId: null, certificateName: "SQLD", acquiredYm: "2025-11", issuer: "한국데이터산업진흥원" },
    ],
    portfolios: [],
    github: { connected: false, githubAccountId: null, githubUserId: null, login: "", htmlUrl: "", repositories: [] },
  },

  /* ── 프론트엔드 개발자 ── */
  frontend: {
    resumeId: null,
    resumeInfo: {
      resumeTitle: "사용자 흐름과 API 연동을 고려하는 React 프론트엔드 개발자 이력서",
      desiredJob: "프론트엔드 개발자 / React 개발자",
      introduction:
        "React, TypeScript, 상태 관리, REST API 연동 경험을 바탕으로 사용자 중심의 웹 화면을 구현하는 프론트엔드 개발자입니다.",
      resumeStatus: "DRAFT",
      representativeYn: "N",
    },
    desiredLocations: ["서울", "경기", "광주"],
    techStack: {
      languages: ["JavaScript", "TypeScript", "HTML", "CSS"],
      techs: [
        { techCategoryCode: "react", techName: "React" },
        { techCategoryCode: "vite", techName: "Vite" },
        { techCategoryCode: "reactrouter", techName: "React Router" },
        { techCategoryCode: "zustand", techName: "Zustand" },
        { techCategoryCode: "tanstack", techName: "TanStack Query" },
        { techCategoryCode: "axios", techName: "Axios" },
        { techCategoryCode: "tailwind", techName: "Tailwind CSS" },
        { techCategoryCode: "figma", techName: "Figma" },
        { techCategoryCode: "git", techName: "Git" },
      ],
    },
    education: {
      educationType: "university",
      highschool: {
        educationId: null, isGed: false, schoolType: "고등학교",
        schoolName: "", track: "", major: "", graduationStatus: "졸업",
        gpa: "", startYm: "", endYm: "",
      },
      universities: [
        {
          educationId: null,
          schoolType: "대학교",
          schoolName: "○○대학교",
          major: "소프트웨어학과",
          graduationStatus: "졸업예정",
          gpa: "",
          gpaScale: "4.5",
          startYm: "2020-03",
          endYm: "2026-02",
        },
      ],
      graduates: [],
    },
    experiences: [
      {
        experienceId: null,
        experienceType: "동아리",
        experienceName: "웹 서비스 개발 동아리",
        context:
          "교내 웹 개발 동아리에서 React 기반 프로젝트를 진행했습니다. 초기에는 정적인 화면 구현을 주로 담당했지만, 이후 API 연동, 상태 관리, 로그인 유지, 페이지 라우팅까지 담당 범위를 넓혔습니다.\n\n프로젝트 진행 중 백엔드 API 응답 구조가 변경될 때마다 화면 오류가 발생하는 경험을 했습니다. 이를 계기로 API 명세의 중요성을 느꼈고, Swagger와 Postman을 확인하며 프론트엔드에서 필요한 데이터 구조를 먼저 정리한 뒤 개발하는 습관을 갖게 되었습니다. 또한 Figma 디자인을 그대로 구현하는 것에서 끝나지 않고, 사용자가 실제로 어떤 순서로 기능을 사용할지 생각하며 버튼 위치, 입력 검증 메시지, 로딩 상태, 빈 데이터 화면을 함께 고려했습니다.",
        startYm: "2024-03",
        endYm: "2025-02",
      },
      {
        experienceId: null,
        experienceType: "프로젝트",
        experienceName: "이력서 작성 및 채용 공고 추천 웹 서비스",
        context:
          "사용자가 이력서를 작성하고, 등록된 이력서를 기반으로 채용 공고 추천 결과를 확인할 수 있는 웹 서비스입니다.\n\n담당 역할: 프론트엔드 개발\n사용 기술: React, TypeScript, Vite, Zustand, TanStack Query, Axios, Tailwind CSS\n\n주요 구현:\n- 이력서 작성 폼 구현 (학력, 경력, 자격증, 자기소개서 동적 입력 UI)\n- 기술스택 선택 컴포넌트 및 채용 공고 목록·상세 페이지 구현\n- Axios 기반 API 연동 모듈 구성 (baseURL, 인증 헤더, 공통 에러 처리)\n- TanStack Query로 서버 상태 관리 및 불필요한 API 호출 감소\n- 로딩, 에러, 빈 데이터, 권한 없음 화면 분리 구현\n- Vite proxy 설정 누락으로 발생한 404 오류 해결 경험",
        startYm: "2025-09",
        endYm: "2025-12",
      },
      {
        experienceId: null,
        experienceType: "프로젝트",
        experienceName: "스터디 모집 플랫폼",
        context:
          "사용자가 스터디를 생성하고, 관심 있는 스터디에 지원할 수 있는 웹 서비스입니다. 모집 중인 스터디 목록 조회, 상세 조회, 지원, 승인 상태 확인 기능을 제공합니다.\n\n담당 역할: 프론트엔드 개발\n사용 기술: React, JavaScript, React Router, Styled-components, Axios\n\n주요 구현:\n- 메인 페이지, 스터디 목록·상세 페이지, 생성·수정 폼 구현\n- 지원 상태에 따른 버튼 UI 분기 처리\n- 새로고침 시 state 소실 문제 해결: URL parameter 기반으로 서버에서 재조회하도록 구조 변경",
        startYm: "2025-04",
        endYm: "2025-06",
      },
    ],
    careers: [
      {
        careerId: null,
        companyName: "○○온라인쇼핑몰",
        department: "고객 운영팀",
        position: "아르바이트",
        startYm: "2023-05",
        endYm: "2024-01",
        mainAchievement:
          "상품 정보 등록, 주문 상태 확인, 고객 문의 응대 업무를 담당했습니다. 고객이 상품 옵션을 잘못 선택하거나 결제 상태를 이해하지 못해 문의하는 경우가 많았습니다. 이 경험을 통해 화면에서 사용자가 헷갈리지 않도록 명확한 안내와 상태 표시가 중요하다는 점을 알게 되었습니다. 이후 프론트엔드 프로젝트를 진행할 때 로딩, 성공, 실패, 빈 목록, 권한 없음 화면을 구분해서 구현하려고 노력했습니다.",
      },
    ],
    coverLetter: {
      coverLetterId: null,
      items: [
        {
          questionOrder: 1,
          subTitle: "사용자가 막히지 않는 화면을 만드는 개발자가 되고 싶습니다.",
          content:
            "프론트엔드 개발을 시작했을 때는 디자인과 동일하게 화면을 구현하는 것이 가장 중요하다고 생각했습니다. 하지만 프로젝트를 진행하면서 실제 사용자는 예상하지 못한 입력을 하거나, 네트워크 지연 상황을 겪거나, 빈 데이터 화면을 마주할 수 있다는 점을 알게 되었습니다.\n\n이력서 작성 서비스 프로젝트에서는 입력 항목이 많아 사용자가 어디까지 작성했는지 헷갈릴 수 있었습니다. 이를 해결하기 위해 섹션별 제목과 설명을 명확히 표시하고, 필수 입력값이 누락되었을 때 어떤 항목을 수정해야 하는지 안내 메시지를 제공했습니다. 또한 API 요청 중에는 로딩 상태를 표시하고, 저장이 완료되었을 때는 성공 메시지를 보여주어 사용자가 현재 상태를 이해할 수 있도록 했습니다.\n\n저는 프론트엔드 개발자가 단순히 화면을 만드는 사람이 아니라 사용자의 흐름을 설계하는 사람이라고 생각합니다. 앞으로도 기능 구현뿐만 아니라 사용자가 자연스럽게 서비스를 이용할 수 있는 화면을 만드는 개발자로 성장하고 싶습니다.",
        },
        {
          questionOrder: 2,
          subTitle: "API 연동 과정에서 백엔드와의 약속이 중요하다는 것을 배웠습니다.",
          content:
            "프론트엔드 프로젝트를 진행하면서 가장 많이 부딪힌 부분은 API 연동이었습니다. 화면은 정상적으로 구현했지만, 실제 API와 연결했을 때 요청 경로가 잘못되었거나 응답 데이터 구조가 예상과 달라 오류가 발생하는 경우가 있었습니다.\n\n이 경험을 통해 API 명세를 먼저 확인하고 개발하는 습관을 갖게 되었습니다. Swagger에서 요청 URL, HTTP Method, Request Body, Response Body를 확인하고, Postman으로 실제 응답을 확인한 뒤 화면에 연결했습니다. 또한 API 요청 실패 시 단순히 콘솔에 오류를 출력하는 것이 아니라 사용자에게 보여줄 메시지와 개발자가 확인할 로그를 구분하려고 노력했습니다.\n\n저는 백엔드 구조를 완전히 구현하지는 않더라도, 프론트엔드 개발자로서 HTTP 상태 코드, 인증 방식, CORS, 프록시 설정, 토큰 저장 방식은 이해하고 있어야 한다고 생각합니다. 이러한 이해를 바탕으로 협업 과정에서 문제를 빠르게 파악하고 해결하는 프론트엔드 개발자가 되고 싶습니다.",
        },
      ],
    },
    certificates: [
      { certificateId: null, certificateName: "웹디자인기능사", acquiredYm: "2024-11", issuer: "한국산업인력공단" },
      { certificateId: null, certificateName: "정보처리기사 필기 합격", acquiredYm: "2025-08", issuer: "한국산업인력공단" },
    ],
    portfolios: [],
    github: { connected: false, githubAccountId: null, githubUserId: null, login: "", htmlUrl: "", repositories: [] },
  },

  /* ── 백엔드 개발자 ── */
  backend: {
    resumeId: null,
    resumeInfo: {
      resumeTitle: "DB 설계와 트랜잭션 처리 경험을 갖춘 Java 백엔드 개발자 이력서",
      desiredJob: "백엔드 개발자 / Java Spring 백엔드 개발자",
      introduction:
        "Spring Boot 기반 REST API 개발, 데이터베이스 설계, 트랜잭션 처리, 서버 간 API 연동 경험을 갖춘 백엔드 개발자입니다.",
      resumeStatus: "DRAFT",
      representativeYn: "N",
    },
    desiredLocations: ["서울", "경기", "광주"],
    techStack: {
      languages: ["Java", "JavaScript", "SQL"],
      techs: [
        { techCategoryCode: "spring", techName: "Spring Boot" },
        { techCategoryCode: "springmvc", techName: "Spring MVC" },
        { techCategoryCode: "springsecurity", techName: "Spring Security" },
        { techCategoryCode: "jpa", techName: "JPA" },
        { techCategoryCode: "mybatis", techName: "MyBatis" },
        { techCategoryCode: "oracle", techName: "Oracle" },
        { techCategoryCode: "mysql", techName: "MySQL" },
        { techCategoryCode: "redis", techName: "Redis" },
        { techCategoryCode: "docker", techName: "Docker" },
        { techCategoryCode: "aws", techName: "AWS EC2" },
      ],
    },
    education: {
      educationType: "university",
      highschool: {
        educationId: null, isGed: false, schoolType: "고등학교",
        schoolName: "", track: "", major: "", graduationStatus: "졸업",
        gpa: "", startYm: "", endYm: "",
      },
      universities: [
        {
          educationId: null,
          schoolType: "대학교",
          schoolName: "○○대학교",
          major: "컴퓨터공학과",
          graduationStatus: "졸업예정",
          gpa: "",
          gpaScale: "4.5",
          startYm: "2020-03",
          endYm: "2026-02",
        },
      ],
      graduates: [],
    },
    experiences: [
      {
        experienceId: null,
        experienceType: "팀 프로젝트",
        experienceName: "채용 공고 기반 이력서 매칭 서비스 개발",
        context:
          "사용자가 이력서를 등록하면 채용 공고의 요구 기술스택과 비교해 직무 적합도를 계산하는 서비스를 개발했습니다. 백엔드 개발과 데이터베이스 설계를 담당했습니다.\n\n이력서 등록 기능은 학력, 경력, 자격증, 기술스택, 자기소개서, 포트폴리오 등 여러 하위 테이블이 함께 저장되는 구조였습니다. 일부 데이터만 저장되는 문제를 방지하기 위해 Service 계층에서 트랜잭션 범위를 관리했습니다. 또한 API 명세를 Swagger와 Postman 기준으로 정리하여 프론트엔드와 협업했습니다.",
        startYm: "2025-09",
        endYm: "2025-12",
      },
      {
        experienceId: null,
        experienceType: "프로젝트",
        experienceName: "이력서 기반 채용 공고 추천 백엔드 API",
        context:
          "사용자가 등록한 이력서 정보와 채용 공고 데이터를 비교하여 직무 적합도, 기술스택 매칭 점수, 추천 기업 목록을 제공하는 백엔드 API 서비스입니다.\n\n담당 역할: 백엔드 개발 / DB 설계 / API 명세 작성\n사용 기술: Java, Spring Boot, MyBatis, Oracle, Redis, Docker, Swagger, Postman\n\n주요 구현:\n- 회원 이력서 등록 API 및 학력·경력·자격증·자기소개서 저장 API 개발\n- Oracle DB 테이블 설계 및 시퀀스 기반 PK 생성 구조 적용\n- Service 계층에서 트랜잭션 통합 관리 (commit/rollback)\n- 기술스택 카테고리 코드화로 이력서-공고 간 매칭 일관성 확보\n- Swagger 기반 API 명세 작성",
        startYm: "2025-09",
        endYm: "2025-12",
      },
      {
        experienceId: null,
        experienceType: "프로젝트",
        experienceName: "온라인 도서 대여 서비스",
        context:
          "사용자가 도서를 검색하고 대여 신청을 할 수 있는 온라인 도서 대여 서비스입니다. 관리자는 도서 등록, 재고 관리, 대여 승인, 반납 처리를 할 수 있습니다.\n\n담당 역할: 백엔드 개발\n사용 기술: Java, Spring Boot, Spring Security, JPA, MySQL, Redis, AWS EC2, Docker\n\n주요 구현:\n- JWT 기반 인증 기능 구현 및 도서 대여·반납·승인 API 개발\n- 재고 차감 로직 동시성 문제 해결 (트랜잭션 범위 명확화)\n- Redis 캐싱 적용으로 인기 도서 목록 DB 부하 감소\n- AWS EC2 + Docker 기반 배포, profile별 환경변수 분리",
        startYm: "2025-04",
        endYm: "2025-06",
      },
    ],
    careers: [
      {
        careerId: null,
        companyName: "○○제조공장",
        department: "생산관리팀",
        position: "계약직",
        startYm: "2022-12",
        endYm: "2023-08",
        mainAchievement:
          "생산 수량 입력, 불량 수량 확인, 출고 전 검수 보조 업무를 담당했습니다. 생산 현장에서는 작은 수량 오류도 재고와 출고 일정에 영향을 줄 수 있었기 때문에 데이터 입력과 검증을 꼼꼼하게 수행해야 했습니다. 이 경험은 백엔드 개발에서 데이터 정합성을 중요하게 생각하는 계기가 되었습니다.",
      },
      {
        careerId: null,
        companyName: "○○편의점",
        department: "매장 운영",
        position: "아르바이트",
        startYm: "2021-09",
        endYm: "2022-05",
        mainAchievement:
          "상품 진열, 재고 확인, 고객 응대, 마감 정산 업무를 담당했습니다. 재고와 판매 데이터가 실제 상황과 맞지 않으면 업무 혼란이 발생하는 것을 경험하며, 데이터가 정확히 저장되고 관리되는 것이 서비스 운영의 기본이라는 점을 알게 되었습니다.",
      },
    ],
    coverLetter: {
      coverLetterId: null,
      items: [
        {
          questionOrder: 1,
          subTitle: "데이터 정합성을 지키는 백엔드 개발자가 되고 싶습니다.",
          content:
            "백엔드 개발을 공부하면서 가장 중요하게 생각하게 된 부분은 데이터 정합성입니다. 사용자는 화면에서 단순히 저장 버튼을 누르지만, 서버 내부에서는 여러 테이블에 데이터가 저장되고 다양한 예외 상황이 발생할 수 있습니다. 이 과정에서 일부 데이터만 저장되거나 중복 데이터가 발생하면 서비스 신뢰도가 떨어질 수 있다고 생각합니다.\n\n이력서 기반 채용 공고 추천 프로젝트에서 이력서 등록 기능을 구현할 때 이러한 문제를 직접 경험했습니다. 이력서 기본 정보는 저장되었지만, 자기소개서나 기술스택 저장 중 오류가 발생하면 불완전한 이력서가 DB에 남을 수 있었습니다. 이를 해결하기 위해 Service 계층에서 트랜잭션을 통합 관리하고, 모든 저장이 성공했을 때만 commit되도록 처리했습니다.\n\n이 경험을 통해 백엔드 개발자는 단순히 API를 만드는 것이 아니라 데이터가 올바른 상태로 유지되도록 책임져야 한다는 점을 배웠습니다. 앞으로도 트랜잭션, 제약 조건, 예외 처리, 로그 관리를 함께 고려하는 백엔드 개발자로 성장하고 싶습니다.",
        },
        {
          questionOrder: 2,
          subTitle: "API 흐름을 명확히 설계하는 개발자가 되겠습니다.",
          content:
            "프로젝트를 진행하면서 API 명세가 명확하지 않으면 프론트엔드와 백엔드 모두 불필요한 수정이 많아진다는 것을 경험했습니다. 요청값 이름이 바뀌거나 응답 구조가 달라지면 화면 개발에 바로 영향을 주었고, 오류 상황에 대한 응답 형식이 통일되지 않으면 문제 원인을 파악하기 어려웠습니다.\n\n이후 API를 개발할 때는 Swagger와 Postman을 활용해 요청 URL, Method, Request Body, Response Body, Error Response를 먼저 정리했습니다. 또한 성공 응답뿐만 아니라 필수값 누락, 권한 없음, 중복 데이터, 서버 오류 상황까지 응답 형식을 통일하려고 노력했습니다.\n\n저는 좋은 백엔드 API는 기능만 제공하는 것이 아니라 협업자가 예측 가능하게 사용할 수 있어야 한다고 생각합니다. 입사 후에도 서비스 흐름과 도메인을 빠르게 이해하고, 안정적이고 유지보수하기 쉬운 API를 개발하는 백엔드 개발자가 되겠습니다.",
        },
      ],
    },
    certificates: [
      { certificateId: null, certificateName: "SQLD", acquiredYm: "2025-06", issuer: "한국데이터산업진흥원" },
      { certificateId: null, certificateName: "정보처리기사 필기 합격", acquiredYm: "2025-08", issuer: "한국산업인력공단" },
    ],
    portfolios: [],
    github: { connected: false, githubAccountId: null, githubUserId: null, login: "", htmlUrl: "", repositories: [] },
  },
};

const ROLES = [
  {
    key: "frontend",
    label: "프론트엔드 개발자",
    icon: "🖥️",
    color: "#3b82f6",
    bg: "#eff6ff",
    tags: ["React", "TypeScript", "Tailwind CSS"],
    desc: "사용자 흐름과 API 연동을 고려하는 React 프론트엔드 개발자",
  },
  {
    key: "backend",
    label: "백엔드 개발자",
    icon: "⚙️",
    color: "#10b981",
    bg: "#f0fdf4",
    tags: ["Spring Boot", "Oracle", "Redis"],
    desc: "DB 설계와 트랜잭션 처리 경험을 갖춘 Java 백엔드 개발자",
  },
  {
    key: "ai",
    label: "AI 개발자",
    icon: "🤖",
    color: "#8b5cf6",
    bg: "#f5f3ff",
    tags: ["LangChain", "FastAPI", "RAG"],
    desc: "RAG와 LLM 기반 서비스 구현 경험을 갖춘 AI 백엔드 개발자",
  },
  {
    key: "custom",
    label: "직접 입력하기",
    icon: "✏️",
    color: "#64748b",
    bg: "#f8fafc",
    tags: ["나만의 이력서"],
    desc: "직접 이력서를 처음부터 작성하고 싶은 경우 선택하세요.",
  },
];

export default function DemoSetupPage() {
  const navigate = useNavigate();
  const setResume = useResumeStore((s) => s.setResume);

  function handleSelect(key) {
    if (key === "custom") {
      navigate("/resume");
      return;
    }
    setResume(PRESETS[key]);
    navigate("/resume");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8faff 0%, #f0fdf4 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 20px",
        fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif",
      }}
    >
      {/* 헤더 */}
      <div style={{ textAlign: "center", marginBottom: "52px" }}>
        <div
          style={{
            display: "inline-block",
            background: "#dbeafe",
            color: "#1d4ed8",
            fontSize: "13px",
            fontWeight: 700,
            padding: "6px 18px",
            borderRadius: "999px",
            marginBottom: "20px",
            letterSpacing: "0.05em",
          }}
        >
          ✨ 시연 준비
        </div>
        <h1
          style={{
            fontSize: "34px",
            fontWeight: 900,
            color: "#0f172a",
            marginBottom: "14px",
            lineHeight: 1.2,
          }}
        >
          어떤 직군으로 시작할까요?
        </h1>
        <p style={{ fontSize: "15px", color: "#64748b", lineHeight: 1.8 }}>
          역할을 선택하면 이력서가 자동으로 채워집니다.
          <br />
          <span style={{ color: "#3b82f6", fontWeight: 700 }}>GitHub 연동</span>과{" "}
          <span style={{ color: "#3b82f6", fontWeight: 700 }}>포트폴리오</span>는
          이후 직접 입력해 주세요.
        </p>
      </div>

      {/* 카드 그리드 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
          gap: "24px",
          maxWidth: "1000px",
          width: "100%",
        }}
      >
        {ROLES.map((role) => (
          <button
            key={role.key}
            type="button"
            onClick={() => handleSelect(role.key)}
            style={{
              background: "#ffffff",
              border: `2px solid #e2e8f0`,
              borderRadius: "28px",
              padding: "36px 28px 28px",
              textAlign: "left",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = role.color;
              e.currentTarget.style.boxShadow = `0 12px 32px ${role.color}25`;
              e.currentTarget.style.transform = "translateY(-6px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e2e8f0";
              e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {/* 아이콘 배경 */}
            <div
              style={{
                width: "64px",
                height: "64px",
                background: role.bg,
                borderRadius: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                marginBottom: "20px",
              }}
            >
              {role.icon}
            </div>

            <div
              style={{
                fontSize: "20px",
                fontWeight: 900,
                color: "#0f172a",
                marginBottom: "8px",
              }}
            >
              {role.label}
            </div>

            <p
              style={{
                fontSize: "13px",
                color: "#64748b",
                marginBottom: "20px",
                lineHeight: 1.6,
              }}
            >
              {role.desc}
            </p>

            {/* 태그 */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
              {role.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    background: role.bg,
                    color: role.color,
                    fontSize: "12px",
                    fontWeight: 700,
                    padding: "4px 12px",
                    borderRadius: "999px",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div
              style={{
                background: role.color,
                color: "#fff",
                fontSize: "14px",
                fontWeight: 700,
                padding: "13px",
                borderRadius: "14px",
                textAlign: "center",
              }}
            >
              이 역할로 이력서 채우기 →
            </div>
          </button>
        ))}
      </div>

      <p style={{ marginTop: "44px", fontSize: "13px", color: "#94a3b8" }}>
        이력서 저장 후 AI 분석 · 자소서 생성 · 면접 시뮬레이션을 이용할 수 있습니다.
      </p>
    </div>
  );
}
