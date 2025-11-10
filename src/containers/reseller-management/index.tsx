"use client";

import React from "react";
import {
  Input,
  DatePicker,
  Button,
  Dropdown,
  MenuProps,
  Space,
  Select,
} from "antd";
import { SearchOutlined, DownOutlined, MoreOutlined } from "@ant-design/icons";
import {
  LayoutContentPage,
  ResellerStatus,
  Tables,
} from "@rtrw-monitoring-system/components";
import { useRouter } from "next/navigation";
import { PAGE_NAME, PARAMS } from "@rtrw-monitoring-system/app/constants";
import { Column } from "@rtrw-monitoring-system/components/table/custom-table";
import { useDataTable } from "@rtrw-monitoring-system/hooks";
import {
  RESELLER_SERVICE,
} from "@rtrw-monitoring-system/app/constants/api_url";
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
    queryResult: { data: listReseller },
    config,
    setFilterItem,
    filterItem,
  } = useDataTable<ResellerResponse, ListResellerParam>(
    { url: RESELLER_SERVICE.reseller_list },
    [RESELLER_SERVICE.reseller_list],
    PARAMS.resellerListParam
  );

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
    setFilterItem((prev: any) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (size: number) => {
    setFilterItem((prev: any) => ({ ...prev, limit: size, page: 1 }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Pending Reactivated":
        return "bg-blue-100 text-blue-700";
      case "Pending Deactivated":
        return "bg-yellow-100 text-yellow-700";
      case "Reject":
        return "bg-red-100 text-red-600";
      case "Not Active":
        return "bg-pink-100 text-pink-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const actionItems: MenuProps["items"] = [{ key: "1", label: "Details" }];

  const router = useRouter();

  return (
    <LayoutContentPage>
      <Space direction="vertical" className="mb-4 px-6 pt-6">
        <h1 className="text-2xl font-bold">Reseller Management</h1>
        <p className="text-sm font-normal text-[#4E5764]">Edit List Reseller</p>
      </Space>
      <ResellerStatus />
      <div className="flex justify-between items-center mb-4 px-6 pt-6">
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search"
          style={{ width: 250 }}
          onChange={(e) =>
            setFilterItem((prev: any) => ({
              ...prev,
              search: e.target.value,
              page: 1,
            }))
          }
        />
        <div className="flex items-center gap-3">
          <RangePicker />
          <Select
            placeholder="All Area"
            suffixIcon={<DownOutlined />}
            options={[{ key: "JEMBER", label: "Jember" }]}
            onChange={(value) =>
              setFilterItem((prev: any) => ({
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
          onActionClick={() => router.push(PAGE_NAME.client_order)}
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
