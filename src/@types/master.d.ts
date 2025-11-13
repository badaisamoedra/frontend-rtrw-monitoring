interface MasterPackage {
  id: string;
  name: string;
  price: number;
  detail: string;
  periode: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  createdBy: string;
  updatedBy: string;
  deletedBy: string;
}

interface MasterPackageResponseData {
  list: MasterPackage[];
}

type MasterPackageResponse = BaseResponse<MasterPackageResponseData>;
type MasterPackageDetailResponse = BaseResponse<MasterPackage>;
