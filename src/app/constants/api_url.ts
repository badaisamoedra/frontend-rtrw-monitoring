const BASE_URL = "/";

const BASE_URL_AUTH_V1 = "/api/v1/auth";
const BASE_URL_TICKET_V1 = "/api/v1/tickets";

const AUTH_SERVICE = {
  login: `${BASE_URL_AUTH_V1}/login`,
};

const TICKET_SERVICE = {
  ticket_list: `${BASE_URL_TICKET_V1}/paginate`,
  ticket_report: `${BASE_URL_TICKET_V1}/report`,
  ticket_all: `${BASE_URL_TICKET_V1}`,
  update_ticket: (id: string) => `${BASE_URL_TICKET_V1}/${id}`,
  district: `${BASE_URL_TICKET_V1}/dropdown/districts`,
  sub_district: `${BASE_URL_TICKET_V1}/dropdown/subdistricts`,
  villages: `${BASE_URL_TICKET_V1}/dropdown/villages`,
  status: `${BASE_URL_TICKET_V1}/dropdown/statuses`,
};

export { AUTH_SERVICE, TICKET_SERVICE };
