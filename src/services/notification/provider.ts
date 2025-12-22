import { NOTIFICATION_SERVICE } from "@rtrw-monitoring-system/app/constants/api_url";
import { fetcher, HttpMethod } from "@rtrw-monitoring-system/network";

const providers = {
  readNotification: ({ id, ...data }: ReadNotificationPayload) =>
    fetcher({
      url: NOTIFICATION_SERVICE.notifications_read(id),
      method: HttpMethod.POST,
      data,
    }).then((res) => res),
};

export default providers;
