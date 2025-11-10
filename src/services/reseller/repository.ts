import { AxiosError, AxiosResponse } from "axios";
import { useMutation } from "react-query";
import provider from "./provider";

const useResellerRepository = () => {
  const updateReseller = useMutation<
    AxiosResponse,
    AxiosError,
    UpdateResellerPayload
  >(provider.updateReseller);

  return { updateReseller };
};

export default useResellerRepository;
