"use client";

import {
  LayoutContentPage,
  OrderListTable,
} from "@rtrw-monitoring-system/components";
import { Button, DatePicker, Input, Space } from "antd";
import React from "react";
const { RangePicker } = DatePicker;
import { SearchOutlined, InfoCircleOutlined } from "@ant-design/icons";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useRouter, useSearchParams } from "next/navigation";
import { PAGE_NAME, PARAMS } from "@rtrw-monitoring-system/app/constants";
import { useDataTable } from "@rtrw-monitoring-system/hooks";
import { ORDER_SERVICE } from "@rtrw-monitoring-system/app/constants/api_url";
import dayjs from "dayjs";
import { WINDOW_HELPER } from "@rtrw-monitoring-system/utils";

const data = [
  { date: "8 Jan", value: 20 },
  { date: "9 Jan", value: 18 },
  { date: "10 Jan", value: 25 },
  { date: "11 Jan", value: 30 },
  { date: "12 Jan", value: 28 },
  { date: "13 Jan", value: 22 },
  { date: "14 Jan", value: 26 },
];

const ListOrderContainer = () => {
  const [mode, setMode] = React.useState<"daily" | "monthly">("daily");
  const router = useRouter();
  const params = useSearchParams();
  const resellerNumber = params.get("resellerNumber");
  const { isMobile } = WINDOW_HELPER.useWindowResize();

  const {
    queryResult: { data: listOrder },
    setFilterItem,
    filterItem,
  } = useDataTable<ListOrderResponse, ListOrderParam>(
    {
      url: ORDER_SERVICE.order_list,
    },
    [ORDER_SERVICE.order_list],
    PARAMS.orderListParam,
  );

  React.useEffect(() => {
    if (resellerNumber) {
      setFilterItem((prev) => ({
        ...prev,
        resellerNumber: resellerNumber,
        page: 1,
      }));
    }
  }, [resellerNumber, setFilterItem]);

  const copyText = async (text: string) => {
    try {
      if (!text) return;

      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return;
      }

      const el = document.createElement("textarea");
      el.value = text;
      el.style.position = "fixed";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      el.focus();
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    } catch (e) {
      console.error("Copy failed:", e);
    }
  };

  const orderData = React.useMemo(() => {
    const list = listOrder?.data?.list || [];
    return list.map((item) => ({
      id: item.id,
      orderNumber: item.orderNumber || "-",
      status: item.status || "-",
      period: item.periode ? dayjs(item.periode).format("MMMM YYYY") : "-",
      invoiceAmount: item.amount
        ? `Rp ${item.amount.toLocaleString("id-ID")}`
        : "-",
      countOrder: item.countOrder || "-",
      sources: item.sources || "-",
      onDetail: () =>
        router.push(`${PAGE_NAME.order_detail}?orderId=${item.id}`),
      onCopy: () => copyText(item.orderNumber || ""),
    }));
  }, [listOrder, router]);

  const totalItems = listOrder?.data?.total ?? 0;
  const currentPage = filterItem?.page ?? 1;
  const pageSize = filterItem?.limit ?? 5;

  const handlePageChange = (page: number) => {
    setFilterItem((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (size: number) => {
    setFilterItem((prev) => ({ ...prev, limit: size, page: 1 }));
  };

  const handleDateChange = (dates: any) => {
    if (Array.isArray(dates) && dates[0] && dates[1]) {
      const start = dayjs(dates[0]);
      const end = dayjs(dates[1]);

      if (start.isValid() && end.isValid()) {
        setFilterItem((prev) => ({
          ...prev,
          startDate: start.format("YYYY-MM-DD"),
          endDate: end.format("YYYY-MM-DD"),
          page: 1,
        }));
        return;
      }
    }

    setFilterItem((prev) => ({
      ...prev,
      startDate: undefined,
      endDate: undefined,
      page: 1,
    }));
  };

  const disabledDate = (current: any) => {
    return current && current > dayjs().endOf("day");
  };

  return (
    <LayoutContentPage className="p-6">
      <div
        className={`mb-4 flex ${
          isMobile ? "flex-col gap-4" : "flex-row justify-between"
        }`}
      >
        <Space direction="vertical" size={"small"}>
          <h1 className="text-2xl font-bold">End-Client Activation Order</h1>
          <p className="text-sm font-normal text-[#4E5764]">
            Tambah order RTRW
          </p>
        </Space>
        <Space direction={"horizontal"} size={"small"} className={"gap-4"}>
          <Button
            onClick={() => {
              window.open(
                process.env["NEXT_PUBLIC_FILE_TEMPLATE_ORDER"],
                "_blank",
              );
            }}
            type="default"
            shape="round"
            danger
            className="border-[#FF0025] text-[#FF0025]"
            style={{
              borderWidth: 2,
              fontSize: isMobile ? 12 : 14,
              fontWeight: "600",
            }}
          >
            Download Template
          </Button>
          <Button
            onClick={() =>
              router.push(
                `${PAGE_NAME.create_order}?resellerNumber=${resellerNumber}`,
              )
            }
            type="default"
            shape="round"
            danger
            className="border-[#FF0025]"
            style={{
              borderWidth: 2,
              fontSize: isMobile ? 12 : 14,
              fontWeight: "600",
              backgroundColor: "#FF0025",
              color: "#FFFFFF",
            }}
          >
            Tambah Order
          </Button>
        </Space>
      </div>

      {isMobile ? (
        <div className="pt-4 mb-4 flex flex-col gap-3">
          <div className="flex flex-row items-center gap-2 w-full">
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search"
              style={{ width: "50%" }}
              onChange={(e) =>
                setFilterItem((prev) => ({
                  ...prev,
                  search: e.target.value,
                  page: 1,
                }))
              }
            />
            <RangePicker
              format="DD-MM-YYYY"
              onChange={handleDateChange}
              disabledDate={disabledDate}
              value={
                filterItem?.startDate && filterItem?.endDate
                  ? [
                      dayjs(filterItem.startDate, "YYYY-MM-DD"),
                      dayjs(filterItem.endDate, "YYYY-MM-DD"),
                    ]
                  : null
              }
              classNames={{
                popup: {
                  root: "mobile-calendar-popup",
                },
              }}
              style={{ width: "50%" }}
            />
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center py-6">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search"
            style={{ width: 250 }}
            onChange={(e) =>
              setFilterItem((prev) => ({
                ...prev,
                search: e.target.value,
                page: 1,
              }))
            }
          />
          <div className="flex items-center gap-3">
            <RangePicker
              format="DD-MM-YYYY"
              onChange={handleDateChange}
              disabledDate={disabledDate}
              value={
                filterItem?.startDate && filterItem?.endDate
                  ? [
                      dayjs(filterItem.startDate, "YYYY-MM-DD"),
                      dayjs(filterItem.endDate, "YYYY-MM-DD"),
                    ]
                  : null
              }
            />
          </div>
        </div>
      )}
      <OrderListTable
        data={orderData}
        totalItems={totalItems}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </LayoutContentPage>
  );
};

export default ListOrderContainer;
