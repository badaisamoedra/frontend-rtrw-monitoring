import { AxiosError, AxiosResponse } from "axios";
import { useMutation } from "react-query";
import provider from "./provider";

const useNotificationRepository = () => {
  const readNotification = useMutation<
    AxiosResponse,
    AxiosError,
    ReadNotificationPayload
  >(provider.readNotification);

  return {
    readNotification,
  };
};

export default useNotificationRepository;
