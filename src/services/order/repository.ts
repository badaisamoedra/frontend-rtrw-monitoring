import { AxiosError, AxiosResponse } from "axios";
import { useMutation } from "react-query";
import provider from "./provider";

const useOrderRepository = () => {
  const uploadOrder = useMutation<
    AxiosResponse,
    AxiosError,
    UploadOrderPayload
  >(provider.uploadOrder);

  return { uploadOrder };
};

export default useOrderRepository;
