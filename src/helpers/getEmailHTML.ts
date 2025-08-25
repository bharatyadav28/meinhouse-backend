import { adminPanelURL } from "./utils";

export const getResetPasswordHTML = (
  email: string,
  token: string,
  role: string
) => {
  const frontend_url =
    role === "admin" ? adminPanelURL : process.env.FRONTEND_URL;
  return `
    <div>
      <h1>Reset Your Password</h1>
      <p>Please click the link below to reset your password:</p>
      <a href="${frontend_url}/reset-password?token=${token}">Reset Password</a>
    </div>
  `;
};
