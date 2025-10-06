const BASE_URL = "/";

const BASE_URL_AUTH_V1 = "/api/v1/auth";
const BASE_URL_TICKET_V1 = "/api/v1/tickets";

const AUTH_SERVICE = {
  login: `${BASE_URL_AUTH_V1}/login`,
};

const TICKET_SERVICE = {
  ticket_list: `${BASE_URL_TICKET_V1}/paginate`,
};

export { AUTH_SERVICE, TICKET_SERVICE };
