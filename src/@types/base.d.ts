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
  totalData: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

interface BaseFilter {
  page: number;
  limit: number;
}
