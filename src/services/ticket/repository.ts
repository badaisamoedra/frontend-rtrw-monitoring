import { AxiosError, AxiosResponse } from "axios";
import { useMutation } from "react-query";
import provider from "./provider";

const useTicketRepository = () => {
  const updateTicket = useMutation<
    AxiosResponse,
    AxiosError,
    UpdateTicketPayload
  >(provider.updateTicket);

  return { updateTicket };
};

export default useTicketRepository;
