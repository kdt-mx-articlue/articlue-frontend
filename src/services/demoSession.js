import { login, signup } from "./authApi";
import { saveAuthUser } from "../utils/auth";

/**
 * 체험용 임시 계정을 만들고 로그인 상태로 전환
 *
 * 방문자(면접관 등)가 아이디/비밀번호를 몰라도 바로 서비스를 써볼 수 있게
 * 매번 새 계정을 만든다. 공용 계정 하나를 쓰면 방문자끼리 이력서·면접 기록이 섞인다.
 */
export async function createDemoSession() {
  const suffix =
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 6);
  const loginId = `demo_${suffix}`;
  // 백엔드 비밀번호 규칙: 소문자 + 숫자 + 특수문자, 8자 이상
  const password = `demo${suffix}1!`;

  await signup({
    loginId,
    password,
    passwordConfirm: password,
    email: `${loginId}@demo.articlue.local`,
    name: "체험 사용자",
    nickname: "체험 사용자",
    phone: "010-0000-0000",
    birth: "2000-01-01",
    address: "서울",
    gender: "남성",
    military: "해당없음",
  });

  const data = await login({ loginId, password });
  const user = data?.data || data?.member || data?.user || data;

  saveAuthUser({
    ...user,
    loginType: "local",
  });

  return user;
}
