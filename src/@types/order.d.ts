interface ListOrderResponseData {
  list: ListOrder[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number;
  page: number;
  prevPage: number;
  total: number;
  totalPages: number;
}

interface ListOrder {
  id: string;
  resellerNumber: string;
  orderNumber: string;
  status: string;
  periode: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  deletedBy: null;
  countOrder: number;
  sources: string;
}

interface ListOrderDetail {
  id: string;
  clientId: string;
  orderId: string;
  email: string;
  clientName: string;
  status: string;
  phoneNumber: string;
  package_name: string;
  packageId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  createdBy: string;
  updatedBy: string;
  deletedBy: null;
  address: string;
  packageId: string;
}

interface ListOrderDetailResponseData {
  list: ListOrderDetail[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number;
  page: number;
  prevPage: number;
  total: number;
  totalPages: number;
}

interface OrderActivitiesResponseData {
  id: string;
  activityName: string;
  status: string;
  sequence: number;
  orderDetailId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  createdBy: string;
  updatedBy: string;
  deletedBy: null;
}

interface OrderDetailSummary {
  orderNumber: string;
  totalCount: number;
  activeCount: number;
}

interface OrderActivitiesSummary {
  orderNumber: string;
  clientName: string;
  packageName: string;
  codeSf: null;
  branch: string;
}

interface UploadOrderPayload {
  package_id: string;
  reseller_id: string;
  file_type: string;
  base64: string;
}

interface UpdateOrderActivityPayload {
  id: string;
  activityName: string;
  status: string;
  notes?: string;
}

interface UpdateStatusOrderDetailPayload {
  id: string;
  status: string;
}

interface UpdateOrderDetailPayload {
  id: string;
  clientName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  packageId?: string;
}

type ListOrderParam =
  typeof import("@rtrw-monitoring-system/app/constants").PARAMS.orderListParam;
type ListOrderFilter =
  import("use-query-params").DecodedValueMap<ListOrderParam>;
type ListOrderFilterPayload = Omit<ListOrderFilter, "page" | "limit">;

type ListOrderDetailParam =
  typeof import("@rtrw-monitoring-system/app/constants").PARAMS.orderDetailListParam;
type ListOrderDetailFilter =
  import("use-query-params").DecodedValueMap<ListOrderDetailParam>;
type ListOrderDetailFilterPayload = Omit<
  ListOrderDetailFilter,
  "page" | "limit"
>;

type ListOrderResponse = BaseResponse<ListOrderResponseData>;
type ListOrderDetailRespone = BaseResponse<ListOrderDetailResponseData>;
type OrderActivitiesResponse = BaseResponse<OrderActivitiesResponseData[]>;
type OrderDetailSummaryResponse = BaseResponse<OrderDetailSummary>;
type OrderActivitiesSummaryResponse = BaseResponse<OrderActivitiesSummary>;
