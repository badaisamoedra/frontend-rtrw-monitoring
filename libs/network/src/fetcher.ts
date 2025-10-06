import {AxiosRequestConfig} from "axios";
import api from "./api";

const fetcher = async <T = any, Z = AxiosRequestConfig>(config: Z) => {
  return api.request<T>(config as AxiosRequestConfig);
};

export {fetcher};
