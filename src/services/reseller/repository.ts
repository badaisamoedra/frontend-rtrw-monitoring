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

  const renderBbox = useMutation<AxiosResponse, AxiosError, BboxPayload>(
    provider.renderBbox
  );

  return { updateReseller, updateStatusReseller, renderBbox };
};

export default useResellerRepository;
