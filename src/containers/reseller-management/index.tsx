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
import { PAGE_NAME } from "@rtrw-monitoring-system/app/constants";
import { Column } from "@rtrw-monitoring-system/components/table/custom-table";
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
  const data = [
    {
      id: 1,
      name: "Dominic Sudirman",
      code: "111222333",
      partner: "PT Funura Jaya",
      area: "Area 1",
      region: "Sumbagteng",
      branch: "Pekanbaru",
      status: "Pending Deactivated",
    },
    {
      id: 2,
      name: "Budi Sawarna",
      code: "111222333",
      partner: "PT Inkom 1",
      area: "Area 2",
      region: "Jateng",
      branch: "Solo",
      status: "Pending Reactivated",
    },
    {
      id: 3,
      name: "Rudolf",
      code: "111222333",
      partner: "PT Inkom 1",
      area: "Area 3",
      region: "Bali",
      branch: "Denpasar",
      status: "Active",
    },
    {
      id: 4,
      name: "Amir Marawi",
      code: "111222333",
      partner: "PT Inkom 1",
      area: "Area 4",
      region: "Papua",
      branch: "Papua",
      status: "Active",
    },
    {
      id: 5,
      name: "Najih",
      code: "111222333",
      partner: "PT Inkom 1",
      area: "Area 1",
      region: "Sumbagut",
      branch: "Medan",
      status: "Active",
    },
    {
      id: 6,
      name: "Zaki Maliq",
      code: "111222333",
      partner: "PT Inkom 1",
      area: "Area 1",
      region: "Sumbagut",
      branch: "Medan",
      status: "Active",
    },
    {
      id: 7,
      name: "Soekarno",
      code: "111222333",
      partner: "PT Inkom 1",
      area: "Area 1",
      region: "Sumbagut",
      branch: "Medan",
      status: "Not Active",
    },
    {
      id: 8,
      name: "Hatta Maro",
      code: "111222333",
      partner: "PT Inkom 1",
      area: "Area 1",
      region: "Sumbagut",
      branch: "Medan",
      status: "Reject",
    },
    {
      id: 9,
      name: "Marlo",
      code: "111222333",
      partner: "PT Inkom 1",
      area: "Area 1",
      region: "Sumbagut",
      branch: "Medan",
      status: "Reject",
    },
    {
      id: 10,
      name: "Marco",
      code: "111222333",
      partner: "PT Inkom 1",
      area: "Area 1",
      region: "Sumbagut",
      branch: "Medan",
      status: "Reject",
    },
  ];

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
        />
        <div className="flex items-center gap-3">
          <RangePicker />
          <Select
            placeholder="All Area"
            suffixIcon={<DownOutlined />}
            options={[
              { key: "1", label: "All Area" },
              { key: "2", label: "Area 1" },
              { key: "3", label: "Area 2" },
            ]}
          />
        </div>
      </div>
      <div className="p-6">
        <Tables<Reseller>
          data={data}
          columns={columns}
          actionItems={[{ key: "1", label: "Details" }]}
          onActionClick={() => router.push(PAGE_NAME.client_order)}
          statusColorFn={getStatusColor}
          pageSize={10}
          totalItems={data.length}
          onPageChange={(page) => console.log("Page:", page)}
          onPageSizeChange={(size) => console.log("New page size:", size)}
        />
      </div>
    </LayoutContentPage>
  );
};

export default ResellerManagementContainer;
