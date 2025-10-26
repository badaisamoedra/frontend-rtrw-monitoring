"use client";

import { PARAMS } from "@rtrw-monitoring-system/app/constants";
import { TICKET_SERVICE } from "@rtrw-monitoring-system/app/constants/api_url";
import {
  LayoutContentPage,
  ModalTicket,
  TitlePage,
} from "@rtrw-monitoring-system/components";
import { useData, useDataTable } from "@rtrw-monitoring-system/hooks";
import { printDashIfNull } from "@rtrw-monitoring-system/utils";
import { Button, DatePicker, Form, Select, Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { TablePaginationConfig } from "antd/lib";
import dayjs from "dayjs";
import * as React from "react";

const TicketingContainer = () => {
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedTicket, setSelectedTicket] = React.useState<TicketingList>();
  const [listDistrict, setListDistrict] = React.useState<BaseSelection[]>([]);
  const [listSubDistrict, setListSubDistrict] = React.useState<BaseSelection[]>(
    []
  );
  const [listVillage, setListVillage] = React.useState<BaseSelection[]>([]);
  const [listStatus, setListStatus] = React.useState<BaseSelection[]>([]);

  const {
    queryResult: { data: listTicket },
    config,
    setFilterItem,
    filterItem,
  } = useDataTable<TicketingResponse, ListTicketParam>(
    { url: TICKET_SERVICE.ticket_list },
    [TICKET_SERVICE.ticket_list],
    PARAMS.ticketingListParam
  );

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

  const columns: ColumnsType<TicketingList> = [
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          onClick={() => {
            setSelectedTicket(record);
            setOpenModal(true);
          }}
          type="primary"
          danger
          size="small"
        >
          View
        </Button>
      ),
    },
    { title: "Ticket ID", dataIndex: "ticketNumber", key: "ticketNumber" },
    { title: "Longitude", dataIndex: "longitude", key: "longitude" },
    { title: "Latitude", dataIndex: "latitude", key: "latitude" },
    { title: "Desa", dataIndex: "subDistrict", key: "subDistrict" },
    { title: "Kecamatan", dataIndex: "district", key: "district" },
    { title: "Kabupaten", dataIndex: "district", key: "district" },
    {
      title: "Ticket Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_, record) =>
        record.details?.[0]?.createdAt
          ? dayjs(record.details?.[0].createdAt).format("DD/MM/YYYY HH:mm")
          : printDashIfNull(undefined),
    },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Total Potential",
      dataIndex: "potentialHigh",
      key: "potentialHigh",
      render: (_, record) => {
        const high = record.details?.[0]?.potentialHigh ?? 0;
        const low = record.details?.[0]?.potentialLow ?? 0;
        const total = high + low;

        return total ? total : "-";
      },
    },
  ];
  return (
    <LayoutContentPage>
      <TitlePage title="Daftar Tiket" />

      <Form
        layout="vertical"
        onFinish={(values) => {
          setFilterItem({
            ...filterItem,
            page: 1,
            status: values.status,
            subDistrict: values.subDistrict,
            district: values.district,
            startDate: values.startDate?.format("YYYY-MM-DD"),
            endDate: values.endDate?.format("YYYY-MM-DD"),
          });
        }}
        onReset={() => {
          setFilterItem({
            page: 1,
            limit: 10,
            status: null,
            subDistrict: null,
            district: null,
            startDate: null,
            endDate: null,
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

          <Form.Item name="startDate" label="Tanggal Tiket">
            <DatePicker className="w-full" format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item name="village" label="Desa">
            <Select
              placeholder="-- Pilih Desa --"
              options={listVillage}
              allowClear
            />
          </Form.Item>

          <Form.Item name="endDate" label="Sampai">
            <DatePicker className="w-full" format="YYYY-MM-DD" />
          </Form.Item>
        </div>

        <Space className="mb-6">
          <Button type="primary" danger htmlType="submit">
            Search
          </Button>
          <Button htmlType="reset">Reset</Button>
        </Space>
      </Form>
      <Table
        columns={columns}
        dataSource={listTicket?.data?.list ?? []}
        bordered
        pagination={{
          pageSize: filterItem.limit,
          current: filterItem.page,
          total: listTicket?.data?.total,
        }}
        onChange={(pagination: TablePaginationConfig) => {
          setFilterItem({
            ...filterItem,
            page: pagination.current,
          });
        }}
      />
      <ModalTicket
        open={openModal}
        onClose={() => setOpenModal(false)}
        ticket={selectedTicket}
        section="VIEW"
      />
    </LayoutContentPage>
  );
};

export default TicketingContainer;
