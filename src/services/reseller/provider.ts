import {
  BUILDING_FOOTPRINTS_SERVICE,
  RESELLER_SERVICE,
  TICKET_SERVICE,
} from "@rtrw-monitoring-system/app/constants/api_url";
import { fetcher, HttpMethod } from "@rtrw-monitoring-system/network";

const providers = {
  updateReseller: ({ id, ...data }: UpdateResellerPayload) =>
    fetcher({
      url: RESELLER_SERVICE.update_reseller(id),
      method: HttpMethod.PUT,
      data,
    }).then((res) => res),

  updateStatusReseller: ({ id, ...data }: UpdateStatusResellerPayload) =>
    fetcher({
      url: RESELLER_SERVICE.update_reseller(id),
      method: HttpMethod.PUT,
      data,
    }).then((res) => res),
  renderBbox: (data: BboxPayload) =>
    fetcher({
      url: BUILDING_FOOTPRINTS_SERVICE.building_footprints_bbox,
      method: HttpMethod.POST,
      data,
    }).then((res) => res),
};

export default providers;
