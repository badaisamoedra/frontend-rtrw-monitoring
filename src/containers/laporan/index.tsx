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
import {
  cleanParams,
  translateStatusTicket,
} from "@rtrw-monitoring-system/utils";
import { useQuery } from "react-query";
import api from "../../../libs/network/src/api";

const COLORS = ["#DDE5F9", "#A9BDEF", "#7091E5"];

const LaporanContainer = () => {
  const [listDistrict, setListDistrict] = React.useState<BaseSelection[]>([]);
  const [listSubDistrict, setListSubDistrict] = React.useState<BaseSelection[]>(
    []
  );
  const [listVillage, setListVillage] = React.useState<BaseSelection[]>([]);
  const [listStatus, setListStatus] = React.useState<BaseSelection[]>([]);
  const [filterParams, setFilterParams] = React.useState({
    status: null,
    district: null,
    subDistrict: null,
    village: null,
    startDate: null,
    endDate: null,
  });
  const [form] = Form.useForm();

  useData<BaseResponse<Array<string>>>(
    { url: TICKET_SERVICE.district },
    [TICKET_SERVICE.district],
    null,
    {
      onSuccess: (res) => {
        const item: BaseSelection[] =
          res.data?.map((item: string) => {
            return {
              label: item,
              value: item,
            };
          }) ?? [];
        setListDistrict(item);
      },
    }
  );

  useData<BaseResponse<Array<string>>>(
    { url: TICKET_SERVICE.sub_district },
    [TICKET_SERVICE.sub_district],
    null,
    {
      onSuccess: (res) => {
        const item: BaseSelection[] =
          res.data?.map((item: string) => {
            return {
              label: item,
              value: item,
            };
          }) ?? [];
        setListSubDistrict(item);
      },
    }
  );

  useData<BaseResponse<Array<string>>>(
    { url: TICKET_SERVICE.villages },
    [TICKET_SERVICE.villages],
    null,
    {
      onSuccess: (res) => {
        const item: BaseSelection[] =
          res.data?.map((item: string) => {
            return {
              label: item,
              value: item,
            };
          }) ?? [];
        setListVillage(item);
      },
    }
  );

  useData<BaseResponse<Array<string>>>(
    { url: TICKET_SERVICE.status },
    [TICKET_SERVICE.status],
    null,
    {
      onSuccess: (res) => {
        const item: BaseSelection[] =
          res.data?.map((item: string) => {
            return {
              label: item,
              value: item,
            };
          }) ?? [];
        setListStatus(item);
      },
    }
  );

  const {
    data: reportData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [TICKET_SERVICE.ticket_report, filterParams],
    queryFn: async () => {
      const res = await api.get(TICKET_SERVICE.ticket_report, {
        params: filterParams,
      });
      return res.data as ReportResponse;
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    enabled: true,
  });

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

      <Form
        layout="vertical"
        form={form}
        onFinish={(values) => {
          setFilterParams({
            status: values.status,
            district: values.district,
            subDistrict: values.subDistrict,
            village: values.village,
            startDate: values.startDate?.format("YYYY-MM-DD"),
            endDate: values.endDate?.format("YYYY-MM-DD"),
          });
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Form.Item name="status" label="Status">
            <Select
              placeholder="-- Pilih Status Tiket --"
              options={listStatus}
              allowClear
            />
          </Form.Item>

          <Form.Item name="subDistrict" label="Kecamatan">
            <Select
              placeholder="-- Pilih Kecamatan --"
              options={listSubDistrict}
              allowClear
            />
          </Form.Item>

          <Form.Item name="district" label="Kabupaten">
            <Select
              placeholder="-- Pilih Kabupaten --"
              options={listDistrict}
              allowClear
            />
          </Form.Item>

          <Form.Item name="startDate" label="Tanggal Awal">
            <DatePicker className="w-full" format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item name="village" label="Desa">
            <Select
              placeholder="-- Pilih Desa --"
              options={listVillage}
              allowClear
            />
          </Form.Item>

          <Form.Item name="endDate" label="Tanggal Akhir">
            <DatePicker className="w-full" format="YYYY-MM-DD" />
          </Form.Item>
        </div>

        <Space className="mb-6">
          <Button type="primary" danger htmlType="submit">
            Search
          </Button>
          <Button
            onClick={() => {
              form.resetFields();
              setFilterParams({
                status: null,
                district: null,
                subDistrict: null,
                village: null,
                startDate: null,
                endDate: null,
              });
            }}
          >
            Reset
          </Button>
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
