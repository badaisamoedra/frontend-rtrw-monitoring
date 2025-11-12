"use client";

import React from "react";
import { Input, DatePicker, MenuProps, Space, Select } from "antd";
import { SearchOutlined, DownOutlined } from "@ant-design/icons";
import {
  LayoutContentPage,
  ResellerStatus,
  Tables,
} from "@rtrw-monitoring-system/components";
import { useRouter } from "next/navigation";
import { PAGE_NAME, PARAMS } from "@rtrw-monitoring-system/app/constants";
import { Column } from "@rtrw-monitoring-system/components/table/custom-table";
import { useData, useDataTable } from "@rtrw-monitoring-system/hooks";
import { RESELLER_SERVICE } from "@rtrw-monitoring-system/app/constants/api_url";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;

type Reseller = {
  id: number;
  name: string;
  code: string;
  partner: string;
  area: string;
  region: string;
  branch: string;
  status: string;
};

const columns: Column<Reseller>[] = [
  { title: "Nama Reseller", dataIndex: "name" },
  { title: "Kode SF", dataIndex: "code" },
  { title: "Nama Partner", dataIndex: "partner" },
  { title: "Area", dataIndex: "area" },
  { title: "Region", dataIndex: "region" },
  { title: "Branch", dataIndex: "branch" },
  { title: "Status", dataIndex: "status" },
];

const ResellerManagementContainer = () => {
  const {
    queryResult: { data: listReseller, isLoading },
    setFilterItem,
    filterItem,
  } = useDataTable<ResellerResponse, ListResellerParam>(
    {
      url: RESELLER_SERVICE.reseller_list,
    },
    [RESELLER_SERVICE.reseller_list],
    PARAMS.resellerListParam
  );

  const {
    queryResult: { data: totalStatusReseller },
  } = useData<TotalResellerStatusResponse>(
    { url: RESELLER_SERVICE.reseller_status },
    [RESELLER_SERVICE.reseller_status],
    null,
    { enabled: true }
  );

  const totalStatus: TotalResellerStatus = totalStatusReseller?.data ?? {
    ACTIVE: 0,
    PENDING: 0,
    INACTIVE: 0,
    REJECT: 0,
  };

  const resellerData: Reseller[] = React.useMemo(() => {
    const list = listReseller?.data?.list || [];
    return list.map((item: any) => ({
      id: item.id,
      name: item.resellerName || "-",
      phone: item.resellerPhone || "-",
      code: item.codeSf || "-",
      partner: item.partnerName || "-",
      area: item.area || "-",
      region: item.region || "-",
      branch: item.branch || "-",
      status: item.status || "Not Active",
    }));
  }, [listReseller]);

  const totalItems = listReseller?.data?.total ?? 0;
  const currentPage = filterItem?.page ?? 1;
  const pageSize = filterItem?.limit ?? 10;

  const handlePageChange = (page: number) => {
    setFilterItem((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (size: number) => {
    setFilterItem((prev) => ({ ...prev, limit: size, page: 1 }));
  };

  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    if (dates && dateStrings[0] && dateStrings[1]) {
      setFilterItem((prev) => ({
        ...prev,
        startDate: dayjs(dateStrings[0]).format("YYYY-MM-DD"),
        endDate: dayjs(dateStrings[1]).format("YYYY-MM-DD"),
        page: 1,
      }));
    } else {
      setFilterItem((prev) => ({
        ...prev,
        startDate: undefined,
        endDate: undefined,
        page: 1,
      }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-[#EBFEF3] text-[#008E53]";
      case "PENDING":
        return "bg-[#FFFBEC] text-[#FC9003]";
      case "REJECT":
        return "bg-[#FFF5F6] text-[#B71932]";
      case "INACTIVE":
        return "bg-[#FFF5F6] text-[#B71932]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const actionItems: MenuProps["items"] = [{ key: "detail", label: "Details" }];

  const router = useRouter();

  return (
    <LayoutContentPage>
      <Space direction="vertical" className="mb-4 px-6 pt-6">
        <h1 className="text-2xl font-bold">Reseller Management</h1>
        <p className="text-sm font-normal text-[#4E5764]">Edit List Reseller</p>
      </Space>
      <ResellerStatus status={totalStatus} />
      <div className="flex justify-between items-center mb-4 px-6 pt-6">
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
            value={
              filterItem?.startDate && filterItem?.endDate
                ? [
                    dayjs(filterItem.startDate, "YYYY-MM-DD"),
                    dayjs(filterItem.endDate, "YYYY-MM-DD"),
                  ]
                : null
            }
          />
          <Select
            placeholder="All Area"
            suffixIcon={<DownOutlined />}
            options={[{ key: "JEMBER", label: "Jember" }]}
            onChange={(value) =>
              setFilterItem((prev) => ({
                ...prev,
                area: value,
                page: 1,
              }))
            }
          />
        </div>
      </div>
      <div className="p-6">
        <Tables<Reseller>
          data={resellerData}
          columns={columns}
          actionItems={actionItems}
          onActionClick={(record, actionKey) => {
            if (actionKey === "detail") {
              router.push(`${PAGE_NAME.client_order}?id=${record.id}`);
            }
          }}
          statusColorFn={getStatusColor}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          showIndex
        />
      </div>
    </LayoutContentPage>
  );
};

export default ResellerManagementContainer;
