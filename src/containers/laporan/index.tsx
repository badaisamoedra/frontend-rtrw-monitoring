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
import { useData } from "@rtrw-monitoring-system/hooks";
import { TICKET_SERVICE } from "@rtrw-monitoring-system/app/constants/api_url";
import { translateStatusTicket } from "@rtrw-monitoring-system/utils";

const COLORS = ["#DDE5F9", "#A9BDEF", "#7091E5"];

const LaporanContainer = () => {
  const {
    queryResult: { data: reportData },
  } = useData<ReportResponse>(
    { url: TICKET_SERVICE.ticket_report },
    [TICKET_SERVICE.ticket_report],
    null,
    { enabled: true }
  );

  const report = reportData?.data;
  const reportByStatus = report?.reportByStatus.map((item) => ({
    name: translateStatusTicket(item.status),
    value: item.count,
  }));
  const reportByDistrict = report?.reportByDistrict.map((item) => ({
    name: item.district,
    value: item.count,
  }));
  const reportByDistrictStatus = React.useMemo(() => {
    if (!report?.reportByDistrictStatus) return [];
    return Object.entries(report.reportByDistrictStatus).map(
      ([district, arr]) => {
        const obj: any = { district, OPEN: 0, FOLLOWED_UP: 0, NO_RESPONSE: 0 };
        arr.forEach((item: any) => {
          obj[item.status] = item.count;
        });
        return obj;
      }
    );
  }, [report]);

  const reportByDistrictRevenue = React.useMemo(() => {
    if (!report?.reportByDistrictRevenue) return [];

    return Object.entries(report?.reportByDistrictRevenue).map(
      ([district, arr]) => {
        const obj: any = { district, "<5jt": 0, "5-10jt": 0, ">10jt": 0 };

        arr.forEach((item: any) => {
          if (item.category.includes("<5")) obj["<5jt"] = item.count;
          else if (item.category.includes("5.000.001"))
            obj["5-10jt"] = item.count;
          else if (item.category.includes(">")) obj[">10jt"] = item.count;
        });

        return obj;
      }
    );
  }, [report]);

  return (
    <LayoutContentPage>
      <TitlePage title="Laporan Tiket" />
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
        <div className="p-4">
          <h2 className="font-semibold mb-4 text-center">
            Laporan Tiket per Status
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={reportByStatus}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {reportByStatus?.map((_, index) => (
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

        <div className="p-4">
          <h2 className="font-semibold mb-4 text-center">
            Laporan Tiket per Kecamatan
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={reportByDistrict}
                dataKey="value"
                nameKey="name"
                innerRadius={40}
                outerRadius={80}
                label
              >
                {reportByDistrict?.map((_, index) => (
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

        <div className="p-4">
          <h2 className="font-semibold mb-4 text-center">
            Laporan Tiket per Status & Kecamatan
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportByDistrictStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="district" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="OPEN" stackId="a" fill="#DDE5F9" />
              <Bar dataKey="FOLLOWED" stackId="a" fill="#A9BDEF" />
              <Bar dataKey="NO_RESPONSE" stackId="a" fill="#7091E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4">
          <h2 className="font-semibold mb-4 text-center">
            Rataan Potential Revenue per Kecamatan
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportByDistrictRevenue} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis
                type="category"
                dataKey="district"
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
