interface TicketingResponseData {
  list: TicketingList[];
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

type ListTicketParam =
  typeof import("@rtrw-monitoring-system/app/constants").PARAMS.ticketingListParam;

type ListTicketFilter =
  import("use-query-params").DecodedValueMap<ListTicketParam>;

type ListTicketFilterPayload = Omit<ListTicketFilter, "limit" | "direction">;

type TicketingResponse = BaseResponse<TicketingResponseData>;
