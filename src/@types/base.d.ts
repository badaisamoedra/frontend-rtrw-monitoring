interface BaseUser {
  userId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  birthPlace?: string;
  birthDate?: string;
}

interface BaseResponse<T> {
  statusCode?: number;
  data?: T;
  message?: string;
}

interface BaseResponseItem<T> {
  statusCode?: number;
  body?: {
    items?: T;
    meta?: BaseMeta;
  };
  message?: string;
}

interface BaseMeta {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number;
  page: number;
  prevPage: number;
  total: number;
  totalPages: number;
}

interface BaseFilter {
  page: number;
  limit: number;
}

interface Position {
  lat: number;
  lng: number;
  description?: string;
  province?: string;
  city?: string;
  district?: string;
}

interface BaseSelection<T = unknown> {
  value?: any;
  label?: string;
  data?: T;
}

interface JwtBaseResponse {
  sub: string;
  username: string;
  status: string;
  roles: BaseRole[];
  iat: number;
  exp: number;
}

interface BaseRole {
  roleName: string;
  tenantId: string;
}
