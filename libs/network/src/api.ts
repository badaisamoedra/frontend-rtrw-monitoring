import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { localStorageExt } from "../../utils/src/local-storage";
import { LOCAL_STORAGE_KEYS } from "../../utils/src";
// import {
//   localStorageExt,
//   LOCAL_STORAGE_KEYS,
//   datadogUserProperty,
// } from "@broom-web-backoffice/utils";

// const baseUrl = "http://108.136.232.41:3333"
//
export enum HttpMethod {
  GET = "get",
  POST = "post",
  PUT = "put",
  PATCH = "patch",
  PURGE = "purge",
  LINK = "link",
  UNLINK = "unlink",
  DELETE = "delete",
  HEAD = "head",
}

const baseURL = process.env["NEXT_PUBLIC_API_URL"];

const baseConfig = {
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
  baseURL,
};

const client = axios.create(baseConfig);

const interceptorOnFulfilledRequest = (
  config: InternalAxiosRequestConfig<any>
) => {
  const token = localStorageExt.getLocalStorage(
    LOCAL_STORAGE_KEYS.USER_INFO as string
  )?.access_token;

  if (token) {
    if (config.headers) {
      config.headers["Authorization"] = "Bearer " + token;
    }
  }

  return config;
};

const interceptorOnFulfilledResponse = (response: AxiosResponse) => {
  return response;
};

const interceptorOnRejectedResponse = async (err: AxiosError) => {
  if (err.response?.status === 401) {
    localStorageExt.clearLocalStorage();
    window.location.href = "/login";
  }
  return Promise.reject(err);
};
client.interceptors.request.use(interceptorOnFulfilledRequest);
client.interceptors.response.use(
  interceptorOnFulfilledResponse,
  interceptorOnRejectedResponse
);

export default client;
