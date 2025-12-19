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

  const updateStatusOrderDetail = useMutation<
    AxiosResponse,
    AxiosError,
    UpdateStatusOrderDetailPayload
  >(provider.updateStatusOrderDetail);

  const updateOrderDetail = useMutation<
    AxiosResponse,
    AxiosError,
    UpdateOrderDetailPayload
  >(provider.updateOrderDetail);

  return {
    uploadOrder,
    updateOrderActivity,
    updateStatusOrderDetail,
    updateOrderDetail,
  };
};

export default useOrderRepository;
