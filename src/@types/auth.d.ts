interface LoginPayload {
  username: string;
  password: string;
}

interface LoginResponseData {
  id: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  accessToken: string;
  refreshToken: string;
}

type LoginResponse = BaseResponse<LoginResponseData>;
