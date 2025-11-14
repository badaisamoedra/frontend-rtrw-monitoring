import { ORDER_SERVICE } from "@rtrw-monitoring-system/app/constants/api_url";
import { fetcher, HttpMethod } from "@rtrw-monitoring-system/network";

const providers = {
  uploadOrder: (data: UploadOrderPayload) =>
    fetcher({
      url: ORDER_SERVICE.upload_create_order,
      method: HttpMethod.POST,
      data,
    }).then((res) => res),
};

export default providers;
