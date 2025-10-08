import { TICKET_SERVICE } from "@rtrw-monitoring-system/app/constants/api_url";
import { fetcher, HttpMethod } from "@rtrw-monitoring-system/network";

const providers = {
  updateTicket: (data: UpdateTicketPayload) =>
    fetcher({
      url: TICKET_SERVICE.update_ticket,
      method: HttpMethod.PUT,
      data,
    }).then((res) => res),
};

export default providers;
