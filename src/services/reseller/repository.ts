import { AxiosError, AxiosResponse } from "axios";
import { useMutation } from "react-query";
import provider from "./provider";

const useResellerRepository = () => {
  const updateReseller = useMutation<
    AxiosResponse,
    AxiosError,
    UpdateResellerPayload
  >(provider.updateReseller);

  const updateStatusReseller = useMutation<
    AxiosResponse,
    AxiosError,
    UpdateStatusResellerPayload
  >(provider.updateStatusReseller);

  return { updateReseller, updateStatusReseller };
};

export default useResellerRepository;
