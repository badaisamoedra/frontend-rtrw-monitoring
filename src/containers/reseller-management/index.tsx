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
} from "@rtrw-monitoring-system/components";
import { useRouter } from "next/navigation";
import { PAGE_NAME } from "@rtrw-monitoring-system/app/constants";
const { RangePicker } = DatePicker;

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
        <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#FF0025] text-white text-left">
                <th className="py-3 px-4 w-[40px]">No.</th>
                <th className="py-3 px-4">Nama Reseller</th>
                <th className="py-3 px-4">Kode SF</th>
                <th className="py-3 px-4">Nama Partner</th>
                <th className="py-3 px-4">Area</th>
                <th className="py-3 px-4">Region</th>
                <th className="py-3 px-4">Branch</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => (
                <tr
                  key={item.id}
                  className={`${
                    i % 2 === 0 ? "bg-[#fafafa]" : "bg-white"
                  } hover:bg-gray-50 transition-all duration-150`}
                >
                  <td className="py-3 px-4 text-gray-700">{i + 1}</td>
                  <td className="py-3 px-4 font-medium text-gray-800">
                    {item.name}
                  </td>
                  <td className="py-3 px-4 text-gray-700">{item.code}</td>
                  <td className="py-3 px-4 text-gray-700">{item.partner}</td>
                  <td className="py-3 px-4 text-gray-700">{item.area}</td>
                  <td className="py-3 px-4 text-gray-700">{item.region}</td>
                  <td className="py-3 px-4 text-gray-700">{item.branch}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-[4px] rounded-full text-xs font-medium ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Dropdown
                      menu={{ items: actionItems }}
                      placement="bottomRight"
                      arrow
                    >
                      <Button
                        onClick={() => router.push(PAGE_NAME.client_order)}
                        type="text"
                        icon={<MoreOutlined />}
                        className="hover:text-red-500 text-gray-600"
                      />
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-500 mt-6">
          <div>
            Menampilkan{" "}
            <select className="border rounded px-1">
              <option>10</option>
              <option>20</option>
            </select>{" "}
            dari 10 Data
          </div>
          <div className="flex gap-3 items-center">
            <Button size="small">‹</Button>
            <span>1</span>
            <Button size="small">›</Button>
          </div>
        </div>
      </div>
    </LayoutContentPage>
  );
};

export default ResellerManagementContainer;
