"use client";

import {
  LayoutContentPage,
  OrderCard,
} from "@rtrw-monitoring-system/components";
import { Button, DatePicker, Input, Select, Space } from "antd";
import React from "react";
const { RangePicker } = DatePicker;
import {
  SearchOutlined,
  DownOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useRouter } from "next/navigation";
import { PAGE_NAME } from "@rtrw-monitoring-system/app/constants";

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

  return (
    <LayoutContentPage className="p-6">
      <div className="mb-4 flex flex-row justify-between">
        <Space direction="vertical" size={"small"}>
          <h1 className="text-2xl font-bold">End-Client Activation Order</h1>
          <p className="text-sm font-normal text-[#4E5764]">
            Tambar order RTRW
          </p>
        </Space>
        <Space direction="horizontal" size={"small"} className="gap-4">
          <Button
            // onClick={() => router.push(PAGE_NAME.create_order)}
            type="default"
            shape="round"
            danger
            className="border-[#FF0025] text-[#FF0025] hover:!bg-[#FF0025] hover:!text-white"
            style={{ borderWidth: 2, fontSize: 14, fontWeight: "600" }}
          >
            Download Template
          </Button>
          <Button
            onClick={() => router.push(PAGE_NAME.create_order)}
            type="default"
            shape="round"
            danger
            className="border-[#FF0025] hover:!bg-white hover:!text-[#FF0025]"
            style={{
              borderWidth: 2,
              fontSize: 14,
              fontWeight: "600",
              backgroundColor: "#FF0025",
              color: "#FFFFFF",
            }}
          >
            Tambah Order
          </Button>
        </Space>
      </div>
      <div className="flex justify-between items-center py-6">
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
      <div className="border border-[#E9EEF6] rounded-xl p-6 mb-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#0C1A30]">
            End-Client Acquisition
          </h2>
          <p className="text-sm text-gray-500">Data Penjualan RTRW</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-[#E9EEF6] rounded-xl p-5">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-semibold text-[#D93025]">
                TARGET SALES
              </p>
              <InfoCircleOutlined className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-[#0C1A30]">5.300 User</h2>
          </div>

          <div className="bg-white border border-[#E9EEF6] rounded-xl p-5">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-semibold text-[#D93025]">
                SALES ACHIEVEMENT (USER)
              </p>
              <InfoCircleOutlined className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-[#0C1A30]">2.345</h2>
            <div className="bg-[#F6F7FB] mt-3 px-2 py-1 rounded-lg inline-block text-xs text-[#0F9D58]">
              +9% Month to Date
            </div>
          </div>

          <div className="bg-white border border-[#E9EEF6] rounded-xl p-5">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-semibold text-[#D93025]">
                SALES ACHIEVEMENT (%)
              </p>
              <InfoCircleOutlined className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-[#0C1A30]">62.14%</h2>
            <div className="bg-[#F6F7FB] mt-3 px-2 py-1 rounded-lg inline-block text-xs text-[#0F9D58]">
              +9% Month to Date
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-end mb-8 gap-2">
            <Button
              type={mode === "daily" ? "primary" : "default"}
              onClick={() => setMode("daily")}
            >
              Daily
            </Button>
            <Button
              type={mode === "monthly" ? "primary" : "default"}
              onClick={() => setMode("monthly")}
            >
              Monthly
            </Button>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#A16AE8"
                strokeWidth={2}
                dot={{ fill: "#000", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="space-y-3">
        {[
          { status: "Not Active", active: false },
          { status: "Active", active: true },
          { status: "Active", active: true },
          { status: "Active", active: true },
          { status: "Active", active: true },
        ].map((item, idx) => (
          <OrderCard
            key={idx}
            orderNumber="12345678910121213"
            status={item.status}
            period="November 2024"
            invoiceAmount="Rp. 500.000"
            onDetail={() => router.push(PAGE_NAME.order_detail)}
            onCopy={() => navigator.clipboard.writeText("12345678910121213")}
          />
        ))}
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
    </LayoutContentPage>
  );
};

export default ListOrderContainer;
