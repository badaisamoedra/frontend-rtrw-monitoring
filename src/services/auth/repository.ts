import { AxiosError, AxiosResponse } from "axios";
import { useMutation } from "react-query";
import provider from "./provider";

const useAuthRepository = () => {
  const login = useMutation<
    AxiosResponse<LoginResponse>,
    AxiosError,
    LoginPayload
  >(provider.login);

  return {
    login,
  };
};

export default useAuthRepository;
