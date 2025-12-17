import { ORDER_SERVICE } from "@rtrw-monitoring-system/app/constants/api_url";
import { fetcher, HttpMethod } from "@rtrw-monitoring-system/network";

const providers = {
  uploadOrder: (data: UploadOrderPayload) =>
    fetcher({
      url: ORDER_SERVICE.upload_create_order,
      method: HttpMethod.POST,
      data,
    }).then((res) => res),
  updateOrderActivity: ({ id, ...data }: UpdateOrderActivityPayload) =>
    fetcher({
      url: ORDER_SERVICE.order_activities_by_id(id),
      method: HttpMethod.PUT,
      data,
    }),
  updateStatusOrderDetail: ({ id, ...data }: UpdateStatusOrderDetailPayload) =>
    fetcher({
      url: ORDER_SERVICE.order_details_by_id(id),
      method: HttpMethod.PUT,
      data,
    }),
};

export default providers;
