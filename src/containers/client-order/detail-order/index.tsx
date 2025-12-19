"use client";

import {
  LayoutContentPage,
  ModalConfirmation,
  ModalConfirmationCustom,
  Tables,
  ToastContent,
} from "@rtrw-monitoring-system/components";
import { Input, MenuProps, Select, Space, Tooltip } from "antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { PAGE_NAME, PARAMS } from "@rtrw-monitoring-system/app/constants";
import { Column } from "@rtrw-monitoring-system/components/table/custom-table";
import { useData, useDataTable } from "@rtrw-monitoring-system/hooks";
import {
  MASTER_SERVICE,
  ORDER_SERVICE,
} from "@rtrw-monitoring-system/app/constants/api_url";
import React from "react";
import {
  getDiffDayHour,
  validatePhoneNumber,
  WINDOW_HELPER,
} from "@rtrw-monitoring-system/utils";
import Image from "next/image";
import ICONS from "@rtrw-monitoring-system/public/assets/icons";
import { toast } from "react-toastify";
import { useOrderRepository } from "@rtrw-monitoring-system/services/order";

interface Customer {
  id: string;
  orderId: string;
  name: string;
  phone: string;
  email: string;
  uploadDate: string;
  package: string;
  status: string;
  timeAging: string;
  address: string;
  packageId?: string;
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
  { title: "Time Aging", dataIndex: "timeAging" },
  { title: "Alamat", dataIndex: "address" },
];

type ModalType = {
  modalOpen: "CANCELED" | "EDIT" | "";
  id: string;
};

const OrderDetailContainer = () => {
  const router = useRouter();
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const { isMobile } = WINDOW_HELPER.useWindowResize();
  const [modal, setModal] = React.useState<ModalType>({
    modalOpen: "",
    id: "",
  });
  const [selectedRecord, setSelectedRecord] = React.useState<Customer | null>(
    null
  );
  const [formEdit, setFormEdit] = React.useState({
    clientName: "",
    email: "",
    phoneNumber: "",
    address: "",
    packageId: "",
  });
  const [phoneError, setPhoneError] = React.useState<string>("");

  const { updateStatusOrderDetail, updateOrderDetail } = useOrderRepository();

  const {
    queryResult: { data: listOrderDetail, refetch },
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

  const {
    queryResult: { data: listPackage },
  } = useData<MasterPackageResponse>(
    { url: MASTER_SERVICE.master_package },
    [MASTER_SERVICE.master_package],
    null,
    { enabled: modal.modalOpen === "EDIT" }
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

  React.useEffect(() => {
    if (modal.modalOpen !== "EDIT" || !selectedRecord) return;

    setFormEdit({
      clientName: selectedRecord.name ?? "",
      email: selectedRecord.email ?? "",
      phoneNumber: selectedRecord.phone
        ? selectedRecord.phone.replace(/^(\+62|62|0)/, "")
        : "",
      address: selectedRecord.address ?? "",
      packageId: selectedRecord.packageId ?? "",
    });

    setPhoneError("");
  }, [modal.modalOpen, selectedRecord]);

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
      timeAging: getDiffDayHour(item.createdAt),
      address: item.address || "-",
      packageId: item.packageId,
    }));
  }, [listOrderDetail]);

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
      case "Cancelled":
        return "bg-[#FFF5F6] text-[#B71932]";
      default:
        return "bg-[#E9F6FF] text-[#0050AE]";
    }
  };

  const cancelStatus = async () => {
    try {
      const payload: {
        id: string;
        status: string;
      } = {
        id: modal.id,
        status: "Cancelled",
      };

      await updateStatusOrderDetail.mutateAsync(payload);
      setModal({ modalOpen: "", id: "" });
      toast.success(<ToastContent description="Order berhasil di batalkan" />);
      refetch();
    } catch (error: any) {
      setModal({ modalOpen: "", id: "" });
      toast.error(
        <ToastContent
          type="error"
          description={error?.response?.data?.error?.messsage}
        />
      );
    }
  };

  const isAllFieldEmpty = React.useMemo(() => {
    return Object.values(formEdit).every((val) => !val || val.trim() === "");
  }, [formEdit]);

  const handleSubmitEdit = async () => {
    try {
      const payload: UpdateOrderDetailPayload = {
        id: modal.id,
      };

      Object.entries(formEdit).forEach(([key, value]) => {
        if (!value || value.trim() === "") return;

        if (key === "phoneNumber") {
          payload.phoneNumber = `+62${value}`;
        } else {
          payload[key as keyof UpdateOrderDetailPayload] = value;
        }
      });

      await updateOrderDetail.mutateAsync(payload);

      toast.success(
        <ToastContent description="Data pelanggan berhasil diperbarui" />
      );

      setModal({ modalOpen: "", id: "" });
      setFormEdit({
        clientName: "",
        email: "",
        phoneNumber: "",
        address: "",
        packageId: "",
      });
      refetch();
    } catch (error: any) {
      toast.error(
        <ToastContent
          type="error"
          description={error?.response?.data?.error?.message}
        />
      );
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
          pageSize={pageSize}
          totalItems={totalItems}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          customActionRender={(record) => (
            <div className="flex items-center justify-center gap-3">
              <Tooltip title="Edit" placement="top">
                <button
                  onClick={() => {
                    setSelectedRecord(record);
                    setModal({ modalOpen: "EDIT", id: record.id });
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-[#FFF5F6] hover:bg-[#ffdfe3] transition"
                >
                  <Image src={ICONS.IconDetail} alt="icon detail" />
                </button>
              </Tooltip>

              {record?.status !== "Active" &&
                record?.status !== "Cancelled" && (
                  <Tooltip title="Cancel Order" placement="top">
                    <button
                      onClick={() =>
                        setModal({
                          modalOpen: "CANCELED",
                          id: record.id,
                        })
                      }
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-[#FFF5F6] hover:bg-[#ffdfe3] transition"
                    >
                      <Image src={ICONS.IconCancel} alt="icon cancel" />
                    </button>
                  </Tooltip>
                )}

              {record.status !== "Cancelled" ? (
                <Tooltip title="Detail" placement="top">
                  <button
                    onClick={() =>
                      router.push(`${PAGE_NAME.activity_order}?id=${record.id}`)
                    }
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-[#EBFEF3] hover:bg-[#d2f7e2] transition"
                  >
                    <EyeOutlined style={{ color: "#0050AE", fontSize: 20 }} />
                  </button>
                </Tooltip>
              ) : (
                <Tooltip title="Detail" placement="top">
                  <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[#FFF5F6] cursor-not-allowed">
                    <EyeOutlined style={{ color: "#9F9898", fontSize: 20 }} />
                  </button>
                </Tooltip>
              )}
            </div>
          )}
        />
      </div>

      <ModalConfirmation
        title="Anda akan membatalkan order"
        subTitle="Apakah anda yakin membatalkan order ini?"
        cancelText="Kembali"
        confirmText="Yakin, Batalkan Order"
        open={modal.modalOpen === "CANCELED"}
        onCancel={() => setModal({ modalOpen: "", id: "" })}
        onConfirm={cancelStatus}
      />

      <ModalConfirmationCustom
        open={modal.modalOpen === "EDIT"}
        title="Edit Data Order"
        subTitle="Perbarui informasi pelanggan di bawah ini"
        cancelText="Kembali"
        okText="Submit"
        onCancel={() => {
          setModal({ modalOpen: "", id: "" });
          setSelectedRecord(null);
          setPhoneError("");
          setFormEdit({
            clientName: "",
            email: "",
            phoneNumber: "",
            address: "",
            packageId: "",
          });
        }}
        onOk={handleSubmitEdit}
        okButtonDisabled={isAllFieldEmpty}
      >
        <div className="my-4 space-y-4 mb-8">
          <Space direction="vertical" size={4} className="w-full">
            <label className="text-sm font-semibold">Nama Pelanggan</label>
            <Input
              placeholder="Masukkan nama pelanggan"
              value={formEdit.clientName}
              onChange={(e) =>
                setFormEdit((prev) => ({ ...prev, clientName: e.target.value }))
              }
            />
          </Space>

          <Space direction="vertical" size={4} className="w-full">
            <label className="text-sm font-semibold">Email</label>
            <Input
              placeholder="example@email.com"
              value={formEdit.email}
              onChange={(e) =>
                setFormEdit((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </Space>

          <Space direction="vertical" size={4} className="w-full">
            <label className="text-sm font-semibold">No Handphone</label>
            <Input
              prefix="+62"
              placeholder="8xxxxxxxxxx"
              value={formEdit.phoneNumber}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, "");
                const error = validatePhoneNumber(raw);

                setPhoneError(error);
                setFormEdit((prev) => ({
                  ...prev,
                  phoneNumber: raw,
                }));
              }}
            />

            {phoneError && (
              <span className="text-xs text-red-500">{phoneError}</span>
            )}
          </Space>

          <Space direction="vertical" size={4} className="w-full">
            <label className="text-sm font-semibold">Alamat</label>
            <Input.TextArea
              rows={3}
              placeholder="Alamat lengkap pelanggan"
              value={formEdit.address}
              onChange={(e) =>
                setFormEdit((prev) => ({ ...prev, address: e.target.value }))
              }
            />
          </Space>

          <Space direction="vertical" size={4} className="w-full">
            <label className="text-sm font-semibold">Paket Internet</label>
            <Select
              placeholder="Pilih paket"
              value={formEdit.packageId}
              style={{ width: "100%" }}
              onChange={(value) =>
                setFormEdit((prev) => ({ ...prev, packageId: value }))
              }
              options={
                listPackage?.data?.list?.map((pkg) => ({
                  label: pkg.name,
                  value: pkg.id,
                })) ?? []
              }
            />
          </Space>
          {isAllFieldEmpty && (
            <p className="text-xs text-gray-400 mt-2">
              Isi minimal satu field untuk melanjutkan
            </p>
          )}
        </div>
      </ModalConfirmationCustom>
    </LayoutContentPage>
  );
};

export default OrderDetailContainer;
