"use client";

import { PARAMS } from "@rtrw-monitoring-system/app/constants";
import { TICKET_SERVICE } from "@rtrw-monitoring-system/app/constants/api_url";
import {
  LayoutContentPage,
  ModalTicket,
  TitlePage,
} from "@rtrw-monitoring-system/components";
import { useDataTable } from "@rtrw-monitoring-system/hooks";
import { printDashIfNull } from "@rtrw-monitoring-system/utils";
import { Button, DatePicker, Form, Select, Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { TablePaginationConfig } from "antd/lib";
import dayjs from "dayjs";
import * as React from "react";

const TicketingContainer = () => {
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedTicket, setSelectedTicket] = React.useState<TicketingList>();

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
        record.details?.[0].createdAt
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
