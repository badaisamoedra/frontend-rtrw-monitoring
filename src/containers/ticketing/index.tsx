"use client";

import {
  LayoutContentPage,
  ModalTicket,
  TitlePage,
} from "@rtrw-monitoring-system/components";
import { Button, DatePicker, Form, Select, Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import * as React from "react";

interface Ticket {
  key: string;
  ticketId: string;
  longitude: number;
  latitude: number;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  date: string;
  status: string;
  potential: number;
}

const data: Ticket[] = [
  {
    key: "1",
    ticketId: "14337210129",
    longitude: 112.64653,
    latitude: -7.9282192,
    desa: "Tulusrejo",
    kecamatan: "Lowokwaru",
    kabupaten: "Kota Malang",
    date: "25-09-2025",
    status: "New",
    potential: 143,
  },
  {
    key: "2",
    ticketId: "14337210188",
    longitude: 114.11253,
    latitude: -7.729212,
    desa: "Tulusrejo",
    kecamatan: "Lowokwaru",
    kabupaten: "Kota Malang",
    date: "24-09-2025",
    status: "Followed Up",
    potential: 57,
  },
  {
    key: "3",
    ticketId: "14337210117",
    longitude: 115.66789,
    latitude: -7.8829381,
    desa: "Tulusrejo",
    kecamatan: "Lowokwaru",
    kabupaten: "Kota Malang",
    date: "22-09-2025",
    status: "Followed Up",
    potential: 62,
  },
];

const TicketingContainer = () => {
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedTicket, setSelectedTicket] = React.useState<any>(null);

  const columns: ColumnsType<Ticket> = [
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
    { title: "Ticket ID", dataIndex: "ticketId", key: "ticketId" },
    { title: "Longitude", dataIndex: "longitude", key: "longitude" },
    { title: "Latitude", dataIndex: "latitude", key: "latitude" },
    { title: "Desa", dataIndex: "desa", key: "desa" },
    { title: "Kecamatan", dataIndex: "kecamatan", key: "kecamatan" },
    { title: "Kabupaten", dataIndex: "kabupaten", key: "kabupaten" },
    { title: "Ticket Date", dataIndex: "date", key: "date" },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Total Potential", dataIndex: "potential", key: "potential" },
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
      <Table columns={columns} dataSource={data} bordered />
      <ModalTicket
        open={openModal}
        onClose={() => setOpenModal(false)}
        ticket={selectedTicket}
      />
    </LayoutContentPage>
  );
};

export default TicketingContainer;
