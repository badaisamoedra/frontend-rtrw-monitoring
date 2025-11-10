interface ResellerResponseData {
  list: ResellerList[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number;
  page: number;
  prevPage: number;
  total: number;
  totalPages: number;
}

interface ResellerList {
  id: string;
  resellerName: string;
  resellerEmail: null;
  resellerPhone: string;
  potentialRevenue: null;
  potentialThreeMonth: null;
  area: string;
  region: string;
  branch: string;
  createdBy: null;
  updatedBy: null;
  deletedBy: null;
  status: null;
  codeSf: null;
  potentialLow: null;
  potentialHigh: null;
  notes: null;
  resellerNumber: null;
  province: null;
  city: null;
  district: null;
  subdistrict: null;
  latitude: null;
  longitude: null;
  boundaryBuilding: null;
  telcoYearlySpendingIdr: null;
  highSpenderCount: null;
  mediumSpenderCount: null;
  lowSpenderCount: null;
  probabilityReseller: null;
  confidenceScore: null;
  metadata: null;
  streetviewLink: null;
  createdAt: Date;
  updatedAt: Date;
  resellerClients: any[];
}

interface ResellerMap {
  id: string;
  latitude: number;
  longitude: number;
  status: null;
  clientName: string;
  clientId: string;
  resellerNumber: string;
  boundary_building: null;
  createdAt: string;
}

interface ResellerDetail {
  id: string;
  resellerName: string;
  resellerEmail: null;
  resellerPhone: string;
  potentialRevenue: null;
  potentialThreeMonth: null;
  area: string;
  region: string;
  branch: string;
  createdBy: null;
  updatedBy: null;
  deletedBy: null;
  status: null;
  codeSf: null;
  potentialLow: null;
  potentialHigh: null;
  notes: null;
  resellerNumber: null;
  province: null;
  city: null;
  district: null;
  subdistrict: null;
  latitude: number;
  longitude: number;
  boundaryBuilding: null;
  telcoYearlySpendingIdr: null;
  highSpenderCount: null;
  mediumSpenderCount: null;
  lowSpenderCount: null;
  probabilityReseller: null;
  confidenceScore: null;
  metadata: null;
  streetviewLink: null;
  createdAt: Date;
  updatedAt: Date;
  resellerClients: ResellerClient[];
}

interface ResellerClient {
  id: string;
  clientName: string;
  clientId: null;
  resellerNumber: string;
  province: string;
  city: string;
  district: string;
  subdistrict: null;
  latitude: string;
  longitude: string;
  boundaryBuilding: null;
  telcoYearlySpendingIdr: string;
  probabilityClient: number;
  confidenceScore: number;
  status: string;
  metadata: null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
}

interface UpdateResellerPayload {
  id: string;
  potentialLow: number;
  potentialHigh: number;
  potentialRevenue: number;
  potentialThreeMonth: number;
  status: string;
  notes: string;
  createdBy: string;
  latitude: string;
  longitude: string;
}

type ListResellerParam =
  typeof import("@rtrw-monitoring-system/app/constants").PARAMS.resellerListParam;

type ListResellerFilter =
  import("use-query-params").DecodedValueMap<ListResellerParam>;

type ListResellerFilterPayload = Omit<ListResellerFilter, "page" | "limit">;

type ResellerResponse = BaseResponse<ResellerResponseData>;
type ResellerMapResponse = BaseResponse<ResellerMap[]>;
type ResellerDetail = BaseResponse<ResellerDetail>;
