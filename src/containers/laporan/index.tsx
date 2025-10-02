"use client";

import {
  LayoutContentPage,
  TitlePage,
} from "@rtrw-monitoring-system/components";
import { Button, DatePicker, Form, Select, Space } from "antd";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import * as React from "react";

const COLORS = ["#DDE5F9", "#A9BDEF", "#7091E5"];

const dataStatus = [
  { name: "New", value: 10 },
  { name: "Followed Up", value: 20 },
  { name: "No Response", value: 30 },
];

const dataKecamatan = [
  { name: "Kecamatan 1", value: 37 },
  { name: "Kecamatan 2", value: 53 },
  { name: "Kecamatan 3", value: 10 },
];

const dataStatusKecamatan = [
  { kecamatan: "Kecamatan 1", NEW: 10, FOLLOWED: 15, NO_RESPONSE: 12 },
  { kecamatan: "Kecamatan 2", NEW: 7, FOLLOWED: 10, NO_RESPONSE: 8 },
  { kecamatan: "Kecamatan 3", NEW: 9, FOLLOWED: 7, NO_RESPONSE: 10 },
  { kecamatan: "Kecamatan 4", NEW: 15, FOLLOWED: 20, NO_RESPONSE: 12 },
];

const dataRevenue = [
  { kecamatan: "Kecamatan 1", "<5jt": 20, "5-10jt": 15, ">10jt": 5 },
  { kecamatan: "Kecamatan 2", "<5jt": 10, "5-10jt": 10, ">10jt": 10 },
  { kecamatan: "Kecamatan 3", "<5jt": 5, "5-10jt": 20, ">10jt": 8 },
  { kecamatan: "Kecamatan 4", "<5jt": 8, "5-10jt": 12, ">10jt": 25 },
];

const LaporanContainer = () => {
  return (
    <LayoutContentPage>
      <TitlePage title="Daftar Laporan" />
      <Form layout="vertical">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Form.Item label="Status">
            <Select placeholder="-- Pilih Status Tiket --">
              <Select.Option value="new">New</Select.Option>
              <Select.Option value="followed">Followed Up</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Kecamatan">
            <Select placeholder="-- Pilih Kecamatan --">
              <Select.Option value="lowokwaru">Lowokwaru</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Kabupaten">
            <Select placeholder="-- Pilih Kabupaten --">
              <Select.Option value="malang">Kota Malang</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Tanggal Tiket">
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item label="Desa">
            <Select placeholder="-- Pilih Desa --">
              <Select.Option value="tulusrejo">Tulusrejo</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Sampai">
            <DatePicker className="w-full" />
          </Form.Item>
        </div>

        <Space className="mb-6">
          <Button type="primary" danger>
            Search
          </Button>
          <Button>Reset</Button>
        </Space>
      </Form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart Status */}
        <div className="p-4">
          <h2 className="font-semibold mb-4 text-center">
            Laporan Tiket per Status
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={dataStatus}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {dataStatus.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Donut Chart Kecamatan */}
        <div className="p-4">
          <h2 className="font-semibold mb-4 text-center">
            Laporan Tiket per Kecamatan
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={dataKecamatan}
                dataKey="value"
                nameKey="name"
                innerRadius={40}
                outerRadius={80}
                label
              >
                {dataKecamatan.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart Status & Kecamatan */}
        <div className="p-4">
          <h2 className="font-semibold mb-4 text-center">
            Laporan Tiket per Status & Kecamatan
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataStatusKecamatan}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="kecamatan" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="NEW" stackId="a" fill="#DDE5F9" />
              <Bar dataKey="FOLLOWED" stackId="a" fill="#A9BDEF" />
              <Bar dataKey="NO_RESPONSE" stackId="a" fill="#7091E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Horizontal Bar Revenue */}
        <div className="p-4">
          <h2 className="font-semibold mb-4 text-center">
            Rataan Potential Revenue per Kecamatan
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataRevenue} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis
                type="category"
                dataKey="kecamatan"
                width={120} 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                interval={0}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey="<5jt" stackId="a" fill="#DDE5F9" />
              <Bar dataKey="5-10jt" stackId="a" fill="#A9BDEF" />
              <Bar dataKey=">10jt" stackId="a" fill="#7091E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </LayoutContentPage>
  );
};

export default LaporanContainer;
