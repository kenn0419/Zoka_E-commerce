interface IAuthSignInRequest {
  email: string;
  password: string;
}

interface IAuthSignupRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  birthday: string;
  gender: string;
}

interface IAuthVerifyEmailRequest {
  email: string;
  token: string;
}

interface IAuthResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  sessionId: string;
  user: IUserResponse;
}
