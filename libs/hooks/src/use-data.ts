import { fetcher, HttpMethod } from "@rtrw-monitoring-system/network";
import { AxiosRequestConfig } from "axios";
import { Dispatch, SetStateAction, useState } from "react";
import {
  QueryKey,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "react-query";

interface IUseData<T, F = unknown> {
  queryResult: UseQueryResult<T>;
  filterItem?: F;
  setFilterItem: Dispatch<SetStateAction<F | undefined>>;
}

export const getListData = async (
  options?: Omit<AxiosRequestConfig, "method">
) => {
  const json = await fetcher({ ...options, method: HttpMethod.GET });
  const result = json.data;
  return result;
};

const useData = <T, F = unknown>(
  fetchOptions: Omit<AxiosRequestConfig, "method" | "params">,
  queryKey: QueryKey,
  filter?: F,
  options: Omit<
    UseQueryOptions<any, unknown, any, unknown[]>,
    "queryKey" | "queryFn"
  > = {
    enabled: true,
    retry: 2,
    retryDelay: 1500,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: false,
  },
  /**
   * @param {boolean} useFilterState - Flag untuk mengaktifkan state filter
   * ketika useFilterState adalah true, maka param 'filter' akan di inject ke filterItem state
   * ketika useFilterState adalah false, maka param 'filter' tidak akan diinject ke filterItem state
   */
  useFilterState = true
): IUseData<T, F> => {
  const [filterItem, setFilterItem] = useState(filter);

  const qKey = filterItem ? [...queryKey, filterItem] : [...queryKey];

  const queryResult = useQuery(
    qKey,
    () =>
      getListData({
        ...fetchOptions,
        params: useFilterState ? filterItem : filter,
      }),
    {
      enabled: true,
      retry: 2,
      retryDelay: 1500,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchIntervalInBackground: false,
      ...options,
    }
  );

  return {
    queryResult,
    filterItem,
    setFilterItem,
  };
};

export default useData;
