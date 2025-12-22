const BASE_URL = "/";

const BASE_URL_AUTH_V1 = "/api/v1/auth";
const BASE_URL_TICKET_V1 = "/api/v1/tickets";
const BASE_URL_RESELLER_V1 = "/api/v1/resellers";
const BASE_URL_ORDER_V1 = "/api/v1/orders";
const BASE_URL_ORDER_DETAIL_V1 = "/api/v1/order-details";
const BASE_URL_ORDER_ACTIVITIES_V1 = "/api/v1/order-activities";
const BASE_URL_MASTER_PACKAGE_V1 = "/api/v1/master-packages";
const BASE_URL_NOTIFICATION_V1 = "/api/v1/notifications";

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

const RESELLER_SERVICE = {
  reseller_list: `${BASE_URL_RESELLER_V1}/paginate`,
  reseller_map: `${BASE_URL_RESELLER_V1}/map`,
  reseller_detail: (id: string) => `${BASE_URL_RESELLER_V1}/${id}`,
  update_reseller: (id: string) => `${BASE_URL_RESELLER_V1}/${id}`,
  reseller_status: `${BASE_URL_RESELLER_V1}/statuses`,
};

const ORDER_SERVICE = {
  order_list: `${BASE_URL_ORDER_V1}/paginate`,
  order_details: `${BASE_URL_ORDER_DETAIL_V1}/paginate`,
  order_activities: (id: string) =>
    `${BASE_URL_ORDER_ACTIVITIES_V1}/order-details/${id}`,
  order_details_summary: (id: string) =>
    `${BASE_URL_ORDER_DETAIL_V1}/summary/${id}`,
  order_activities_summary: (id: string) =>
    `${BASE_URL_ORDER_ACTIVITIES_V1}/summary/${id}`,
  upload_create_order: `${BASE_URL_ORDER_V1}/uploads`,
  order_activities_by_id: (id: string) =>
    `${BASE_URL_ORDER_ACTIVITIES_V1}/${id}`,
  order_details_by_id: (id: string) => `${BASE_URL_ORDER_DETAIL_V1}/${id}`,
  order_client_boundary: (id: string) =>
    `${BASE_URL_ORDER_V1}/reseller-number/${id}/details`,
};

const MASTER_SERVICE = {
  master_package: `${BASE_URL_MASTER_PACKAGE_V1}/paginate`,
  master_package_detail: (id: string) => `${BASE_URL_MASTER_PACKAGE_V1}/${id}`,
};

const NOTIFICATION_SERVICE = {
  notifications: BASE_URL_NOTIFICATION_V1,
  notifications_unread_count: `${BASE_URL_NOTIFICATION_V1}/unread-count`,
  notifications_read: (id: string) => `${BASE_URL_NOTIFICATION_V1}/${id}/read`,
};

export {
  AUTH_SERVICE,
  TICKET_SERVICE,
  RESELLER_SERVICE,
  ORDER_SERVICE,
  MASTER_SERVICE,
  NOTIFICATION_SERVICE,
};
