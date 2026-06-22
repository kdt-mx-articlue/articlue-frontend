import {
  useMemo,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  openAddressSearch,
} from "../../utils/postcode";

import {
  signup,
} from "../../services/authService";

export default function SignupPage() {
  const navigate =
    useNavigate();

  const [loginId, setLoginId] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    passwordConfirm,
    setPasswordConfirm,
  ] = useState("");

  const [name, setName] =
    useState("");

  const [nickname, setNickname] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [gender, setGender] =
    useState("");

  const [birth, setBirth] =
    useState("");

  const [military, setMilitary] =
    useState("");

  const [postcode, setPostcode] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [
    detailAddress,
    setDetailAddress,
  ] = useState("");

  const [
    agreeTerms,
    setAgreeTerms,
  ] = useState(false);

  const [
    agreePrivacy,
    setAgreePrivacy,
  ] = useState(false);

  const [
    agreeMarketing,
    setAgreeMarketing,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [toast, setToast] =
    useState("");

  const passwordStatus =
    useMemo(() => {
      return {
        length:
          password.length >= 8,

        lower:
          /[a-z]/.test(
            password
          ),

        number:
          /[0-9]/.test(
            password
          ),

        special:
          /[^A-Za-z0-9]/.test(
            password
          ),
      };
    }, [password]);

  const passedCount =
    Object.values(
      passwordStatus
    ).filter(Boolean).length;

  const isStrongPassword =
    Object.values(
      passwordStatus
    ).every(Boolean);

  const isPasswordMatched =
    password ===
      passwordConfirm &&
    passwordConfirm.length > 0;

  const strength =
    useMemo(() => {
      if (passedCount <= 1) {
        return {
          width: "25%",
          text:
            "비밀번호 강도: 매우 약함",
          color:
            "bg-red-500",
        };
      }

      if (passedCount === 2) {
        return {
          width: "50%",
          text:
            "비밀번호 강도: 보통",
          color:
            "bg-yellow-500",
        };
      }

      if (passedCount === 3) {
        return {
          width: "75%",
          text:
            "비밀번호 강도: 좋음",
          color:
            "bg-blue-600",
        };
      }

      return {
        width: "100%",
        text:
          "비밀번호 강도: 안전함",
        color:
          "bg-green-600",
      };
    }, [passedCount]);

  const inputClass =
    "h-[52px] w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 outline-none focus:border-blue-600";

  function showToast(
    message
  ) {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2500);
  }

  function handleAddressSearch() {
    openAddressSearch(
      (data) => {
        setPostcode(
          data.zonecode
        );

        setAddress(
          data.address
        );
      }
    );
  }

  async function handleSignup(
    e
  ) {
    e.preventDefault();

    if (!agreeTerms) {
      return showToast(
        "이용약관에 동의해주세요."
      );
    }

    if (!agreePrivacy) {
      return showToast(
        "개인정보 수집 및 이용에 동의해주세요."
      );
    }

    if (
      !isStrongPassword
    ) {
      return showToast(
        "비밀번호 조건을 충족해주세요."
      );
    }

    if (
      password !==
      passwordConfirm
    ) {
      return showToast(
        "비밀번호가 일치하지 않습니다."
      );
    }

    const payload = {
      loginId,
      password,
      passwordConfirm,

      name,
      nickname,

      email,
      phone,

      birth,
      gender,
      military,

      postcode,

      address:
        `${address} ${detailAddress}`,

      baseAddress:
        address,

      detailAddress,

      marketingAgree:
        agreeMarketing,
    };

    try {
      setLoading(true);

      await signup(
        payload
      );

      showToast(
        "회원가입이 완료되었습니다."
      );

      setTimeout(() => {
        navigate(
          "/login"
        );
      }, 1000);
    } catch (error) {
      showToast(
        error?.userMessage ||
          "회원가입 실패"
      );
    } finally {
      setLoading(false);
    }
  }

  const PasswordRule = ({
    valid,
    children,
  }) => (
    <p
      className={`text-sm font-bold ${
        valid
          ? "text-green-600"
          : "text-red-500"
      }`}
    >
      {children}
    </p>
  );

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="mx-auto max-w-[760px] rounded-[32px] bg-white p-10 shadow-sm">

        <Link
          to="/"
          className="block text-center text-[30px] font-black text-blue-600 no-underline"
        >
          Articlue.
        </Link>

        <h1 className="mt-4 text-center text-[36px] font-black">
          회원가입
        </h1>

        <p className="mt-4 text-center text-slate-500">
          회원가입이 완료되면 로그인 화면으로 이동합니다.
        </p>

        <form
          onSubmit={
            handleSignup
          }
          className="mt-10"
        >

                  {/* 아이디 */}

          <div className="mb-6">
            <label className="mb-2 block font-black">
              아이디
            </label>

            <input
              type="text"
              value={loginId}
              onChange={(e) =>
                setLoginId(
                  e.target.value
                )
              }
              className={
                inputClass
              }
              placeholder="아이디 입력"
            />
          </div>

          {/* 비밀번호 */}

          <div className="mb-6">
            <label className="mb-2 block font-black">
              비밀번호
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className={
                inputClass
              }
              placeholder="비밀번호 입력"
            />
          </div>

          {/* 비밀번호 조건 */}

          <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="mb-4 font-black">
              안전한 비밀번호 조건
            </h3>

            <PasswordRule
              valid={
                passwordStatus.length
              }
            >
              • 8자 이상 입력
            </PasswordRule>

            <PasswordRule
              valid={
                passwordStatus.lower
              }
            >
              • 영문 소문자 포함
            </PasswordRule>

            <PasswordRule
              valid={
                passwordStatus.number
              }
            >
              • 숫자 포함
            </PasswordRule>

            <PasswordRule
              valid={
                passwordStatus.special
              }
            >
              • 특수문자 포함
            </PasswordRule>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full ${strength.color}`}
                style={{
                  width:
                    strength.width,
                }}
              />
            </div>

            <p className="mt-3 text-sm font-black text-slate-600">
              {strength.text}
            </p>
          </div>

          {/* 비밀번호 확인 */}

          <div className="mb-10">
            <label className="mb-2 block font-black">
              비밀번호 확인
            </label>

            <input
              type="password"
              value={
                passwordConfirm
              }
              onChange={(e) =>
                setPasswordConfirm(
                  e.target.value
                )
              }
              className={
                inputClass
              }
              placeholder="비밀번호 확인"
            />

            {passwordConfirm &&
              !isPasswordMatched && (
                <p className="mt-2 text-sm font-bold text-red-500">
                  비밀번호가 일치하지 않습니다.
                </p>
              )}

            {isPasswordMatched && (
              <p className="mt-2 text-sm font-bold text-green-600">
                비밀번호가 일치합니다.
              </p>
            )}
          </div>

          {/* 개인정보 */}

          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="mb-2 block font-black">
                이름
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
                className={
                  inputClass
                }
              />
            </div>

            <div>
              <label className="mb-2 block font-black">
                닉네임
              </label>

              <input
                type="text"
                value={nickname}
                onChange={(e) =>
                  setNickname(
                    e.target.value
                  )
                }
                className={
                  inputClass
                }
              />
            </div>

            <div>
              <label className="mb-2 block font-black">
                전화번호
              </label>

              <input
                type="text"
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value
                  )
                }
                className={
                  inputClass
                }
              />
            </div>

            <div>
              <label className="mb-2 block font-black">
                이메일
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                className={
                  inputClass
                }
              />
            </div>

            <div>
              <label className="mb-2 block font-black">
                성별
              </label>

              <select
                value={gender}
                onChange={(e) =>
                  setGender(
                    e.target.value
                  )
                }
                className={
                  inputClass
                }
              >
                <option value="">
                  선택
                </option>

                <option value="남성">
                  남성
                </option>

                <option value="여성">
                  여성
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-black">
                생년월일
              </label>

              <input
                type="date"
                value={birth}
                onChange={(e) =>
                  setBirth(
                    e.target.value
                  )
                }
                className={
                  inputClass
                }
              />
            </div>

            <div>
              <label className="mb-2 block font-black">
                병역여부
              </label>

              <select
                value={military}
                onChange={(e) =>
                  setMilitary(
                    e.target.value
                  )
                }
                className={
                  inputClass
                }
              >
                <option value="">
                  선택
                </option>

                <option value="군필">
                  군필
                </option>

                <option value="미필">
                  미필
                </option>

                <option value="해당없음">
                  해당없음
                </option>
              </select>
            </div>

          </div>

          {/* 주소 */}

          <div className="mt-10">

            <label className="mb-2 block font-black">
              우편번호
            </label>

            <div className="flex gap-3">

                <input
                    value={postcode}
                    readOnly
                    placeholder="주소 검색"
                    className="
                    h-[52px]
                    w-[220px]
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-100
                    px-4
                    outline-none
                    "
                />

                <button
                    type="button"
                    onClick={handleAddressSearch}
                    className="
                    h-[52px]
                    w-[120px]
                    rounded-2xl
                    bg-slate-900
                    font-black
                    text-white
                    transition
                    hover:bg-slate-800
                    "
                >
                    주소 검색
                </button>

                </div>

            <label className="mt-5 mb-2 block font-black">
              주소
            </label>

            <input
              value={address}
              readOnly
              className={
                inputClass
              }
            />

            <label className="mt-5 mb-2 block font-black">
              상세주소
            </label>

            <input
              value={
                detailAddress
              }
              onChange={(e) =>
                setDetailAddress(
                  e.target.value
                )
              }
              className={
                inputClass
              }
            />

          </div>

          {/* 약관 */}

          <div className="mt-10 rounded-2xl border border-slate-200 p-6">

            <label className="flex items-center gap-3 font-black">
              <input
                type="checkbox"
                checked={
                  agreeTerms &&
                  agreePrivacy &&
                  agreeMarketing
                }
                onChange={(e) => {
                  const checked =
                    e.target.checked;

                  setAgreeTerms(
                    checked
                  );

                  setAgreePrivacy(
                    checked
                  );

                  setAgreeMarketing(
                    checked
                  );
                }}
              />

              전체 동의
            </label>

            <hr className="my-4" />

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={
                  agreeTerms
                }
                onChange={(e) =>
                  setAgreeTerms(
                    e.target.checked
                  )
                }
              />

              이용약관 동의
              (필수)
            </label>

            <label className="mt-3 flex items-center gap-3">
              <input
                type="checkbox"
                checked={
                  agreePrivacy
                }
                onChange={(e) =>
                  setAgreePrivacy(
                    e.target.checked
                  )
                }
              />

              개인정보 수집 및 이용 동의
              (필수)
            </label>

            <label className="mt-3 flex items-center gap-3">
              <input
                type="checkbox"
                checked={
                  agreeMarketing
                }
                onChange={(e) =>
                  setAgreeMarketing(
                    e.target.checked
                  )
                }
              />

              마케팅 정보 수신 동의
              (선택)
            </label>

          </div>

          {/* 버튼 */}

          <button
            type="submit"
            disabled={loading}
            className="mt-10 h-[56px] w-full rounded-full bg-blue-600 font-black text-white"
          >
            {loading
              ? "회원가입 중..."
              : "회원가입 완료하기"}
          </button>

          <div className="mt-5 text-center">

            <span className="text-slate-500">
              이미 계정이 있으신가요?
            </span>

            <Link
              to="/login"
              className="ml-2 font-black text-blue-600"
            >
              로그인
            </Link>

          </div>

        </form>

      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 rounded-full bg-slate-900 px-5 py-3 text-white font-bold">
          {toast}
        </div>
      )}

    </main>
  );
}