# Stage 1: Vite 빌드
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Docker 빌드 시 기본값 /api/ (nginx 프록시 경유)
ARG VITE_API_BASE_URL=/api/
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# 소셜 로그인 공개 키 (빌드 시점에 번들에 포함됨 — 비밀값 아님)
ARG VITE_KAKAO_JS_KEY=
ARG VITE_NAVER_CLIENT_ID=
ENV VITE_KAKAO_JS_KEY=$VITE_KAKAO_JS_KEY
ENV VITE_NAVER_CLIENT_ID=$VITE_NAVER_CLIENT_ID

RUN npm run build

# Stage 2: nginx로 정적 파일 서빙 + API 프록시
FROM nginx:1.27-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
