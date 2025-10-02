"use client";

import * as React from "react";

import { ToastContainer } from "react-toastify";
import { QueryParamProvider } from "use-query-params";
import { ConfigProvider } from "antd";
import { QueryClient, QueryClientProvider } from "react-query";
import NextAdapterApp from "next-query-params/app";
import "react-toastify/dist/ReactToastify.css";
import VALIDATE_MESSAGES from "./app/constants/validate_messages";
import config from "../theme.config";

type ProviderProps = {
  children?: React.ReactNode;
};

const queryClient = new QueryClient();

const Providers: React.FC<ProviderProps> = (props) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <QueryParamProvider adapter={NextAdapterApp}>
          <ConfigProvider
            theme={config}
            form={{
              validateMessages: VALIDATE_MESSAGES,
              requiredMark: false,
            }}
          >
            {props.children}
          </ConfigProvider>
        </QueryParamProvider>
      </QueryClientProvider>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
};

export default Providers
