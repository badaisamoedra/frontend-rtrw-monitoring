import { AUTH_SERVICE } from "@rtrw-monitoring-system/app/constants/api_url";
import { fetcher, HttpMethod } from "@rtrw-monitoring-system/network";

const providers = {
  login: (data: LoginPayload) =>
    fetcher({
      url: AUTH_SERVICE.login,
      method: HttpMethod.POST,
      data,
    }).then((res) => res),
};

export default providers;
