import { start } from "repl";
import {
  ArrayParam,
  BooleanParam,
  NumberParam,
  StringParam,
  withDefault,
} from "use-query-params";

export const defaultParam = {
  limit: withDefault(NumberParam, 10),
  page: withDefault(NumberParam, 1),
};

export const defaultDateParam = {
  start_date: StringParam,
  end_date: StringParam,
};

export const inventoryVerificationListParam = {
  ...defaultParam,
  license_plate: StringParam,
  inventory_status: ArrayParam,
  inventory_verify_status: ArrayParam,
  is_pool: StringParam || BooleanParam,
  start_created_at: StringParam,
  end_created_at: StringParam,
  start_year: NumberParam,
  end_year: NumberParam,
};

export const ticketingListParam = {
  ...defaultParam,
  status: StringParam,
  village: StringParam,
  district: StringParam,
  subDistrict: StringParam,
  startDate: StringParam,
  endDate: StringParam,
};

export const resellerListParam = {
  ...defaultParam,
  search: StringParam,
  startDate: StringParam,
  endDate: StringParam,
  area: StringParam,
};
