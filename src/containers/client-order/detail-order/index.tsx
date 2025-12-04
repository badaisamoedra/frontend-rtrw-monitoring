"use client";

import { LayoutContentPage, Tables } from "@rtrw-monitoring-system/components";
import { Input, MenuProps, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { PAGE_NAME, PARAMS } from "@rtrw-monitoring-system/app/constants";
import { Column } from "@rtrw-monitoring-system/components/table/custom-table";
import { useData, useDataTable } from "@rtrw-monitoring-system/hooks";
import { ORDER_SERVICE } from "@rtrw-monitoring-system/app/constants/api_url";
import React from "react";
import { WINDOW_HELPER } from "@rtrw-monitoring-system/utils";

interface Customer {
  id: string;
  orderId: string;
  name: string;
  phone: string;
  email: string;
  uploadDate: string;
  package: string;
  // status:
  //   | "Menunggu Data Pelanggan"
  //   | "Menunggu Validasi Data"
  //   | "Menunggu Instalasi"
  //   | "ACTIVE"
  //   | "PENDING"
  //   | "INACTIVE"
  //   | "REJECT"
  status: string;
}

const actionItems: MenuProps["items"] = [
  { key: "edit", label: "Edit" },
  { key: "detail", label: "View Detail" },
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

const OrderDetailContainer = () => {
  const router = useRouter();
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const { isMobile } = WINDOW_HELPER.useWindowResize();

  const {
    queryResult: { data: listOrderDetail },
    setFilterItem,
    filterItem,
  } = useDataTable<ListOrderDetailRespone, ListOrderDetailParam>(
    {
      url: ORDER_SERVICE.order_details,
    },
    [ORDER_SERVICE.order_list],
    PARAMS.orderDetailListParam
  );

  const {
    queryResult: { data: orderDetailSummary },
  } = useData<OrderDetailSummaryResponse>(
    { url: ORDER_SERVICE.order_details_summary(orderId ?? "") },
    [ORDER_SERVICE.order_details_summary(orderId ?? "")],
    null,
    { enabled: !!orderId }
  );

  React.useEffect(() => {
    if (orderId) {
      setFilterItem((prev) => ({
        ...prev,
        orderId: orderId,
        page: 1,
      }));
    }
  }, [orderId, setFilterItem]);

  const orderDetailData = React.useMemo(() => {
    const list = listOrderDetail?.data?.list || [];
    return list.map((item) => ({
      id: item.id,
      orderId: item.id || "-",
      name: item.clientName || "-",
      phone: item.phoneNumber || "-",
      email: item.email || "-",
      uploadDate: item.updatedAt
        ? new Date(item.updatedAt).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "-",
      package: item.package_name || "-",
      status: item.status || "Menunggu Data Pelanggan",
    }));
  }, [listOrderDetail, router]);

  const totalItems = listOrderDetail?.data?.total ?? 0;
  const currentPage = filterItem?.page ?? 1;
  const pageSize = filterItem?.limit ?? 5;

  const handlePageChange = (page: number) => {
    setFilterItem((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (size: number) => {
    setFilterItem((prev) => ({ ...prev, limit: size, page: 1 }));
  };

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

  return (
    <LayoutContentPage className={isMobile ? "p-4" : "p-6"}>
      {isMobile ? (
        <div className="mb-4 flex flex-col items-start space-y-2">
          <h1 className="text-xl font-bold">Order Detail</h1>
          <p className="text-xs text-[#4E5764]">Update status pemasangan</p>
        </div>
      ) : (
        <Space direction="vertical" size={"small"} className="mb-8">
          <h1 className="text-2xl font-bold">Order Detail</h1>
          <p className="text-sm font-normal text-[#4E5764]">
            Update status pemasangan
          </p>
        </Space>
      )}
      <div
        className={
          isMobile ? "flex flex-col gap-3 mb-6" : "flex justify-between mb-6"
        }
      >
        <div className={"flex flex-col gap-2 mb-4"}>
          <p
            className={
              isMobile
                ? "text-xs font-semibold text-[#0C1A30]"
                : "text-sm font-semibold text-[#0C1A30]"
            }
          >
            Order Number : {orderDetailSummary?.data?.orderNumber ?? "-"}
          </p>
          <p
            className={
              isMobile
                ? "text-xs font-semibold text-[#0C1A30]"
                : "text-sm font-semibold text-[#0C1A30]"
            }
          >
            Jumlah Order : {orderDetailSummary?.data?.totalCount ?? "0"}{" "}
            pelanggan
          </p>
          <p
            className={
              isMobile
                ? "text-xs font-semibold text-[#0C1A30]"
                : "text-sm font-semibold text-[#0C1A30]"
            }
          >
            Pelanggan Aktif : {orderDetailSummary?.data?.activeCount ?? "0"}{" "}
            pelanggan
          </p>
        </div>

        <Input
          prefix={<SearchOutlined />}
          placeholder="Search"
          style={{
            width: isMobile ? "100%" : 250,
            height: 40,
            marginTop: isMobile ? 0 : 20,
          }}
          onChange={(e) =>
            setFilterItem((prev) => ({
              ...prev,
              search: e.target.value,
              page: 1,
            }))
          }
        />
      </div>

      <div className={isMobile ? "overflow-x-auto" : ""}>
        <Tables<Customer>
          data={orderDetailData}
          columns={columns}
          showIndex={false}
          statusColorFn={getStatusColor}
          actionItems={actionItems}
          onActionClick={(record, actionKey) => {
            if (actionKey === "detail") {
              router.push(`${PAGE_NAME.activity_order}?id=${record.id}`);
            }
          }}
          pageSize={pageSize}
          totalItems={totalItems}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </LayoutContentPage>
  );
};

export default OrderDetailContainer;
