import axiosInstance from "./axios";

export const githubAuthLogin =
  async () => {
    const { data } =
      await axiosInstance.post(
        "/github/auth/login",
        {
          scope:
            "read:user user:email repo",
        }
      );

    return data;
  };

export const githubAuthToken = async (
  deviceCode
) => {
  const { data } =
    await axiosInstance.post(
      "/github/auth/token",
      {
        device_code: deviceCode,
      }
    );

  return data;
};

export const githubStorage =
  async (
    memberId,
    githubSessionId
  ) => {
    const { data } =
      await axiosInstance.post(
        "/github/storage",
        {
          memberId,
        },
        {
          headers: {
            "X-GitHub-Session-Id":
              githubSessionId,
          },
        }
      );

    return data;
  };