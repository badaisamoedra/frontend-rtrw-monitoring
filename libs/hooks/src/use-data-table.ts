import { AxiosRequestConfig } from "axios";
import {
  QueryKey,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "react-query";
import {
  useQueryParams,
  DecodedValueMap,
  SetQuery,
  QueryParamConfigMap,
} from "use-query-params";
import { TablePaginationConfig } from "antd/lib/table";
import { useMemo } from "react";
import { fetcher, HttpMethod } from "@rtrw-monitoring-system/network";

interface IUseData<T, F extends QueryParamConfigMap> {
  queryResult: UseQueryResult<T>;
  filterItem: DecodedValueMap<F>;
  setFilterItem: SetQuery<F>;
  config?: TablePaginationConfig;
}

const getListData = async (options?: Omit<AxiosRequestConfig, "method">) => {
  const json = await fetcher({ ...options, method: HttpMethod.GET });
  const result = json.data;
  return result;
};

const useDataTable = <T, F extends QueryParamConfigMap>(
  fetchOptions: Omit<AxiosRequestConfig, "method" | "params">,
  queryKey: QueryKey,
  filter: F,
  options: Omit<
    UseQueryOptions<any, unknown, any, unknown[]>,
    "queryKey" | "queryFn"
  > = {
    enabled: true,
    retry: 2,
    retryDelay: 1500,
  }
): IUseData<T, F> => {
  const [filterItem, setFilterItem] = useQueryParams(filter);

  const qKey = filterItem ? [...queryKey, filterItem] : [...queryKey];

  const queryResult = useQuery(
    qKey,
    () => getListData({ ...fetchOptions, params: filterItem }),
    options
  );

  // todo: will implement this configconst
  const config: TablePaginationConfig = useMemo(() => {
    return {
      total: queryResult?.data?.body?.meta?.totalData as number,
      showSizeChanger: false,
      current: filterItem.page as any,
    };
  }, [filterItem.page, queryResult]);

  return {
    queryResult,
    filterItem,
    setFilterItem,
    config,
  };
};

export default useDataTable;
