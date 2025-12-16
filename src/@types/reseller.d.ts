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
  locationPoint?: LocationPoint;
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
  resellerName: string;
  resellerEmail: null;
  picReseller: null;
  resellerPhone: null;
  potentialRevenue: null;
  potentialThreeMonth: null;
  potentialSales: null;
  acquisitionProgress: null;
  acquisitionMonth: null;
  Qacquisition: null;
  semester: null;
  area: null;
  region: null;
  branch: null;
  address: null;
  createdBy: null;
  updatedBy: null;
  deletedBy: null;
  status: null;
  codeSf: string;
  potentialLow: null;
  potentialHigh: null;
  notes: null;
  resellerNumber: string;
  province: null;
  city: null;
  district: null;
  subdistrict: null;
  isTelkom: boolean;
  latitude: number;
  longitude: number;
  locationPoint: LocationPoint;
  probabilityScore: null;
  confidenceScore: number;
  finalVerdict: string;
  totalSuspectedClients: number;
  directEvidenceClients: number;
  indirectEvidenceClients: number;
  metadataDirect: MetadataDirect;
  deviceBreakdownDirect: DeviceBreakdownDirect;
  metadataIndirect: MetadataIndirect;
  deviceBreakdownIndirect: DeviceBreakdownDirect;
  totalUniqueDevices: number;
  totalHighIncome: number;
  totalAverageIncome: number;
  totalLowIncome: number;
  totalUnknown: number;
  dominantIncomeSegment: string;
  dominantIsp: string;
  dominantIspSharePct: number;
  marketshareBreakdown: MarketshareBreakdown;
  nextProgress: null;
  acquiredSalesYTD: null;
  salesRatio: null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  resellerClients: any[];
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

interface TotalResellerStatus {
  ACTIVE: number;
  INACTIVE: number;
  PENDING: number;
  REJECT: number;
}

interface LocationPoint {
  type: string;
  coordinates: Array<Array<number[]>>;
}

interface DeviceBreakdownDirect {
  IOS: Android[];
  OTHERS: Android[];
  ANDROID: Android[];
  UNKNOWN: any[];
}

interface Android {
  details: Detail[];
  manufacturer: string;
  total_devices: number;
}

interface Detail {
  count: number;
  model: string;
}

interface LocationPoint {
  type: string;
  coordinates: Array<Array<number[]>>;
}

interface MarketshareBreakdown {
  isp_breakdown: ISPBreakdown[];
}

interface ISPBreakdown {
  isp_name: string;
  device_count: number;
  isp_home_marketshare: number;
}

interface MetadataDirect {
  direct_device_id: string[];
  detected_ips_direct: string[];
  device_count_direct: number;
  session_count_direct: number;
  username_client_direct: string[];
}

interface MetadataIndirect {
  indirect_device_id: string[];
  detected_ips_indirect: string[];
  device_count_indirect: number;
  session_count_indirect: number;
  username_client_indirect: string[];
}

type ListResellerParam =
  typeof import("@rtrw-monitoring-system/app/constants").PARAMS.resellerListParam;
type ListResellerFilter =
  import("use-query-params").DecodedValueMap<ListResellerParam>;
type ListResellerFilterPayload = Omit<ListResellerFilter, "page" | "limit">;

type ResellerResponse = BaseResponse<ResellerResponseData>;
type ResellerMapResponse = BaseResponse<ResellerMap[]>;
type ResellerDetail = BaseResponse<ResellerDetail>;
type TotalResellerStatusResponse = BaseResponse<TotalResellerStatus>;
