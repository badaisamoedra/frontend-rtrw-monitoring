"use client";

import { LayoutContentPage, Tables } from "@rtrw-monitoring-system/components";
import { Input, MenuProps, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { PAGE_NAME } from "@rtrw-monitoring-system/app/constants";
import { Column } from "@rtrw-monitoring-system/components/table/custom-table";

interface Customer {
  id: string;
  orderId: string;
  name: string;
  phone: string;
  email: string;
  uploadDate: string;
  package: string;
  status:
    | "Menunggu Data Pelanggan"
    | "Menunggu Validasi Data"
    | "Menunggu Instalasi"
    | "Active"
    | "Failed";
}

const data: Customer[] = [
  {
    id: "1",
    orderId: "AOx6241215082640552f17b30",
    name: "Dominic Sudirman",
    phone: "0812-2233-4455",
    email: "Dominic@gmail.com",
    uploadDate: "12 Des 2024",
    package: "EZnet 30mbps",
    status: "Menunggu Data Pelanggan",
  },
  {
    id: "2",
    orderId: "AOx6241215082640552f17b31",
    name: "Budi Sawarna",
    phone: "0812-2233-4455",
    email: "Dominic@gmail.com",
    uploadDate: "12 Des 2024",
    package: "EZnet 10mbps",
    status: "Menunggu Validasi Data",
  },
  {
    id: "3",
    orderId: "AOx6241215082640552f17b32",
    name: "Rudolf",
    phone: "0812-2233-4455",
    email: "Dominic@gmail.com",
    uploadDate: "12 Des 2024",
    package: "EZnet 30mbps",
    status: "Menunggu Instalasi",
  },
  {
    id: "4",
    orderId: "AOx6241215082640552f17b33",
    name: "Amir Marawi",
    phone: "0812-2233-4455",
    email: "Dominic@gmail.com",
    uploadDate: "12 Des 2024",
    package: "EZnet 10mbps",
    status: "Menunggu Instalasi",
  },
  {
    id: "5",
    orderId: "AOx6241215082640552f17b34",
    name: "Najih",
    phone: "0812-2233-4455",
    email: "Dominic@gmail.com",
    uploadDate: "12 Des 2024",
    package: "EZnet 30mbps",
    status: "Active",
  },
  {
    id: "6",
    orderId: "AOx6241215082640552f17b35",
    name: "Zaki Maliq",
    phone: "0812-2233-4455",
    email: "Dominic@gmail.com",
    uploadDate: "12 Des 2024",
    package: "EZnet 30mbps",
    status: "Active",
  },
  {
    id: "7",
    orderId: "AOx6241215082640552f17b36",
    name: "Soekarno",
    phone: "0812-2233-4455",
    email: "Dominic@gmail.com",
    uploadDate: "12 Des 2024",
    package: "EZnet 30mbps",
    status: "Active",
  },
  {
    id: "8",
    orderId: "AOx6241215082640552f17b37",
    name: "Hatta Maro",
    phone: "0812-2233-4455",
    email: "Dominic@gmail.com",
    uploadDate: "12 Des 2024",
    package: "EZnet 30mbps",
    status: "Active",
  },
  {
    id: "9",
    orderId: "AOx6241215082640552f17b38",
    name: "Marlo",
    phone: "0812-2233-4455",
    email: "Dominic@gmail.com",
    uploadDate: "12 Des 2024",
    package: "EZnet 30mbps",
    status: "Active",
  },
  {
    id: "10",
    orderId: "AOx6241215082640552f17b39",
    name: "Marco",
    phone: "0812-2233-4455",
    email: "Dominic@gmail.com",
    uploadDate: "12 Des 2024",
    package: "EZnet 30mbps",
    status: "Failed",
  },
];

const OrderDetailContainer = () => {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-[#EBFEF3] text-[#008E53]";
      case "Failed":
        return "bg-[#FFF5F6] text-[#B71932]";
      case "Menunggu Data Pelanggan":
      case "Menunggu Validasi Data":
      case "Menunggu Instalasi":
        return "bg-[#E9F6FF] text-[#0050AE]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const actionItems: MenuProps["items"] = [
    { key: "1", label: "Edit" },
    { key: "2", label: "View Detail" },
  ];

  const columns: Column<Customer>[] = [
    { title: "Order ID", dataIndex: "orderId" },
    { title: "Nama Pelanggan", dataIndex: "name" },
    { title: "No Handphone", dataIndex: "phone" },
    { title: "Email", dataIndex: "email" },
    { title: "Tanggal Upload", dataIndex: "uploadDate" },
    { title: "Paket Internet", dataIndex: "package" },
    { title: "Status", dataIndex: "status" },
  ];

  return (
    <LayoutContentPage className="p-6">
      <Space direction="vertical" size={"small"} className="mb-8">
        <h1 className="text-2xl font-bold">Order Detail</h1>
        <p className="text-sm font-normal text-[#4E5764]">
          Update status pemasangan
        </p>
      </Space>
      <div className="flex justify-between mb-6">
        <div>
          <p className="text-sm font-semibold text-[#0C1A30]">
            Order Number : 12345678910121213
          </p>
          <p className="text-sm font-semibold text-[#0C1A30]">
            Jumlah Order : 10 pelanggan
          </p>
          <p className="text-sm font-semibold text-[#0C1A30]">
            Pelanggan Aktif : 5 pelanggan
          </p>
        </div>

        <Input
          prefix={<SearchOutlined />}
          placeholder="Search"
          style={{ width: 250, height: 40 }}
        />
      </div>

      <Tables<Customer>
        data={data}
        columns={columns}
        showIndex={false}
        statusColorFn={getStatusColor}
        actionItems={actionItems}
        onActionClick={(record) => router.push(PAGE_NAME.activity_order)}
        pageSize={10}
        totalItems={data.length}
      />
    </LayoutContentPage>
  );
};

export default OrderDetailContainer;
