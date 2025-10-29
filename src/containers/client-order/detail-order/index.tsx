"use client";

import { LayoutContentPage } from "@rtrw-monitoring-system/components";
import { Button, Dropdown, Input, MenuProps, Space, Table, Tag } from "antd";
import { MoreOutlined, SearchOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { PAGE_NAME } from "@rtrw-monitoring-system/app/constants";

interface Customer {
  key: string;
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
    key: "1",
    orderId: "AOx6241215082640552f17b30",
    name: "Dominic Sudirman",
    phone: "0812-2233-4455",
    email: "Dominic@gmail.com",
    uploadDate: "12 Des 2024",
    package: "EZnet 30mbps",
    status: "Menunggu Data Pelanggan",
  },
  {
    key: "2",
    orderId: "AOx6241215082640552f17b31",
    name: "Budi Sawarna",
    phone: "0812-2233-4455",
    email: "Dominic@gmail.com",
    uploadDate: "12 Des 2024",
    package: "EZnet 10mbps",
    status: "Menunggu Validasi Data",
  },
  {
    key: "3",
    orderId: "AOx6241215082640552f17b32",
    name: "Rudolf",
    phone: "0812-2233-4455",
    email: "Dominic@gmail.com",
    uploadDate: "12 Des 2024",
    package: "EZnet 30mbps",
    status: "Menunggu Instalasi",
  },
  {
    key: "4",
    orderId: "AOx6241215082640552f17b33",
    name: "Amir Marawi",
    phone: "0812-2233-4455",
    email: "Dominic@gmail.com",
    uploadDate: "12 Des 2024",
    package: "EZnet 10mbps",
    status: "Menunggu Instalasi",
  },
  {
    key: "5",
    orderId: "AOx6241215082640552f17b34",
    name: "Najih",
    phone: "0812-2233-4455",
    email: "Dominic@gmail.com",
    uploadDate: "12 Des 2024",
    package: "EZnet 30mbps",
    status: "Active",
  },
  {
    key: "6",
    orderId: "AOx6241215082640552f17b35",
    name: "Zaki Maliq",
    phone: "0812-2233-4455",
    email: "Dominic@gmail.com",
    uploadDate: "12 Des 2024",
    package: "EZnet 30mbps",
    status: "Active",
  },
  {
    key: "7",
    orderId: "AOx6241215082640552f17b36",
    name: "Soekarno",
    phone: "0812-2233-4455",
    email: "Dominic@gmail.com",
    uploadDate: "12 Des 2024",
    package: "EZnet 30mbps",
    status: "Active",
  },
  {
    key: "8",
    orderId: "AOx6241215082640552f17b37",
    name: "Hatta Maro",
    phone: "0812-2233-4455",
    email: "Dominic@gmail.com",
    uploadDate: "12 Des 2024",
    package: "EZnet 30mbps",
    status: "Active",
  },
  {
    key: "9",
    orderId: "AOx6241215082640552f17b38",
    name: "Marlo",
    phone: "0812-2233-4455",
    email: "Dominic@gmail.com",
    uploadDate: "12 Des 2024",
    package: "EZnet 30mbps",
    status: "Active",
  },
  {
    key: "10",
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

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      render: (text: string) => (
        <span className="font-medium text-[#0C1A30]">{text}</span>
      ),
    },
    {
      title: "Nama Pelanggan",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "No Handphone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Tanggal Upload",
      dataIndex: "uploadDate",
      key: "uploadDate",
    },
    {
      title: "Paket Internet",
      dataIndex: "package",
      key: "package",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: Customer["status"]) => {
        let color = "";
        let bg = "";
        switch (status) {
          case "Active":
            color = "#0F9D58";
            bg = "#E6F4EA";
            break;
          case "Failed":
            color = "#D93025";
            bg = "#FCE8E6";
            break;
          default:
            color = "#1A73E8";
            bg = "#E8F0FE";
        }
        return (
          <Tag
            color="transparent"
            style={{
              borderRadius: 8,
              backgroundColor: bg,
              color,
              fontWeight: 500,
              padding: "2px 12px",
            }}
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: () => (
        <Dropdown
          menu={{
            items: [
              { key: "1", label: "Edit" },
              { key: "2", label: "View Detail" },
            ],
          }}
        >
          <Button
            onClick={() => router.push(PAGE_NAME.activity_order)}
            shape="circle"
            icon={<MoreOutlined style={{ color: "#D93025", fontSize: 18 }} />}
          />
        </Dropdown>
      ),
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-[#EBFEF3] text-[#008E53]";
      case "Menunggu Data Pelanggan":
      case "Menunggu Validasi Data":
      case "Menunggu Instalasi":
        return "bg-[#E9F6FF] text-[#0050AE]";
      case "Failed":
        return "bg-[#FFF5F6] text-[#B71932]";
      default:
        break;
    }
  };

  const actionItems: MenuProps["items"] = [{ key: "1", label: "Details" }];

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

      {/* <Table
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 10,
          position: ["bottomRight"],
          showTotal: (total, range) => (
            <span className="text-gray-500 text-sm">
              Menampilkan {range[0]}-{range[1]} dari {total} data
            </span>
          ),
        }}
        bordered={false}
        rowClassName={() => "hover:bg-[#FAFAFA]"}
      /> */}
      <div>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#FF0025] text-white text-left">
                <th className="py-3 px-4 w-[40px]">Order ID</th>
                <th className="py-3 px-4">Nama Pelanggan</th>
                <th className="py-3 px-4">No Handphone</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Tanggal Upload</th>
                <th className="py-3 px-4">Paket Internet</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => (
                <tr
                  key={item.key}
                  className={`${
                    i % 2 === 0 ? "bg-[#fafafa]" : "bg-white"
                  } hover:bg-gray-50 transition-all duration-150`}
                >
                  <td className="py-3 px-4 text-gray-700">{i + 1}</td>
                  <td className="py-3 px-4 font-medium text-gray-800">
                    {item.name}
                  </td>
                  <td className="py-3 px-4 text-gray-700">{item.phone}</td>
                  <td className="py-3 px-4 text-gray-700">{item.email}</td>
                  <td className="py-3 px-4 text-gray-700">{item.uploadDate}</td>
                  <td className="py-3 px-4 text-gray-700">{item.package}</td>
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
                        onClick={() => router.push(PAGE_NAME.activity_order)}
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

        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
          <p>
            menampilkan <b>10</b> dari <b>800</b> data
          </p>
          <div className="flex gap-2 items-center">
            <button className="px-3 py-1 border border-gray-300 rounded-4xl text-gray-700">
              {"<"}
            </button>
            <button className="px-3 py-1 bg-[#C00000] text-white rounded-4xl">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-4xl text-gray-700">
              2
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-4xl text-gray-700">
              3
            </button>
            <span className="px-3">...</span>
            <button className="px-3 py-1 border border-gray-300 rounded-4xl text-gray-700">
              9
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-4xl text-gray-700">
              {">"}
            </button>
          </div>
        </div>
      </div>
    </LayoutContentPage>
  );
};

export default OrderDetailContainer;
