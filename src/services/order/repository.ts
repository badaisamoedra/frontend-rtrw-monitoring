import { AxiosError, AxiosResponse } from "axios";
import { useMutation } from "react-query";
import provider from "./provider";

const useOrderRepository = () => {
  const uploadOrder = useMutation<
    AxiosResponse,
    AxiosError,
    UploadOrderPayload
  >(provider.uploadOrder);

  const updateOrderActivity = useMutation<
    AxiosResponse,
    AxiosError,
    UpdateOrderActivityPayload
  >(provider.updateOrderActivity);

  return { uploadOrder, updateOrderActivity };
};

export default useOrderRepository;
