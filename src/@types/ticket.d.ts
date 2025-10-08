interface TicketingResponseData {
  list: TicketingList[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number;
  page: number;
  prevPage: number;
  total: number;
  totalPages: number;
}

interface TicketingList {
  id: string;
  ticketNumber: string;
  ticketDesc: string;
  userId: string;
  district: string;
  subDistrict: string;
  longitude: string;
  latitude: string;
  status: string;
  details: TickectingDetail[];
}

interface TickectingDetail {
  id: string;
  potentialHigh: number;
  potentialLow: number;
  threeMonth: string;
  potentialRevenue: string;
  notes: string;
  ticketId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UpdateTicketPayload extends TicketingList {}

type ListTicketParam =
  typeof import("@rtrw-monitoring-system/app/constants").PARAMS.ticketingListParam;

type ListTicketFilter =
  import("use-query-params").DecodedValueMap<ListTicketParam>;

type ListTicketFilterPayload = Omit<ListTicketFilter, "page" | "limit">;

type TicketingResponse = BaseResponse<TicketingResponseData>;
type TicketingAllResponse = BaseResponse<TicketingList[]>;
