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
  direction: "forward",
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
  direction: StringParam,
};
