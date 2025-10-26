interface ReportResponseData {
  reportByStatus: ReportByStatus[];
  reportByDistrict: ReportByDistrict[];
  reportByDistrictStatus: ReportByDistrictStatus;
  reportByDistrictRevenue: ReportByDistrictRevenue;
}

interface ReportByDistrict {
  district: string;
  count: number;
}

interface ReportByDistrictRevenue {
  "Jakarta Pusat": JakartaPusat[];
}

interface JakartaPusat {
  category: string;
  count: number;
  total: string;
}

interface ReportByDistrictStatus {
  "Jakarta Pusat": ReportByStatus[];
}

interface ReportByStatus {
  status: string;
  count: number;
}

type ReportResponse = BaseResponse<ReportResponseData>;
