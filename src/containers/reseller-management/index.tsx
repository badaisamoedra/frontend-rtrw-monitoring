"use client";

import React from "react";
import { Input, DatePicker, MenuProps, Space, Select } from "antd";
import { SearchOutlined, DownOutlined } from "@ant-design/icons";
import {
  LayoutContentPage,
  ModalConfirmationCustom,
  ResellerStatus,
  Tables,
  ToastContent,
} from "@rtrw-monitoring-system/components";
import { useRouter } from "next/navigation";
import { PAGE_NAME, PARAMS } from "@rtrw-monitoring-system/app/constants";
import { Column } from "@rtrw-monitoring-system/components/table/custom-table";
import { useData, useDataTable } from "@rtrw-monitoring-system/hooks";
import { RESELLER_SERVICE } from "@rtrw-monitoring-system/app/constants/api_url";
import dayjs from "dayjs";
import {
  formatEnumLabel,
  numberWithDots,
  WINDOW_HELPER,
} from "@rtrw-monitoring-system/utils";
import { useResellerRepository } from "@rtrw-monitoring-system/services/reseller";
import { toast } from "react-toastify";

const { RangePicker } = DatePicker;

type Reseller = {
  id: string;
  name: string;
  code: string;
  partner: string;
  area: string;
  region: string;
  branch: string;
  status: string;
  cluster: string;
  data_ip: string;
  phone: string;
  potential_sales: string;
  acquisition_progress: string;
  next_progress: string;
  acq_month: string;
  q_acq: string;
  semester: string;
  acquired_sales_ytd: string;
  sales_ratio: string;
  alamat_point_sales: string;
  address: string;
  detail: string;
  high_income: string;
  low_income: string;
};

const columns: Column<Reseller>[] = [
  { title: "Reseller Name", dataIndex: "name" },
  { title: "Reseller ID", dataIndex: "code" },
  { title: "PIC Reseller", dataIndex: "partner" },
  { title: "Area", dataIndex: "area" },
  { title: "Region", dataIndex: "region" },
  { title: "Branch", dataIndex: "branch" },
  { title: "Status", dataIndex: "status" },
  { title: "No HP PIC Reseller", dataIndex: "phone" },
  { title: "Potential Sales", dataIndex: "potential_sales" },
  { title: "Acquisition Progress", dataIndex: "acquisition_progress" },
  { title: "Next Progress", dataIndex: "next_progress" },
  { title: "Acq Month", dataIndex: "acq_month" },
  { title: "Q Acq", dataIndex: "q_acq" },
  { title: "Semester", dataIndex: "semester" },
  { title: "Acquired Sales YTD", dataIndex: "acquired_sales_ytd" },
  { title: "Sales Ratio", dataIndex: "sales_ratio" },
  { title: "Alamat Point of Sales", dataIndex: "alamat_point_sales" },
  { title: "Total High Income", dataIndex: "high_income" },
  { title: "Total Low Income", dataIndex: "low_income" },
];

type ModalType = {
  modalOpen: "UPDATE_STATUS" | "";
  id: string;
  status?: string;
};

const RESELLER_STATUS = [
  { label: "Reseller Active", value: "RESELLER_ACTIVE" },
  { label: "Reseller Not Active", value: "RESELLER_NOT_ACTIVE" },
  { label: "Negotiation", value: "NEGOTIATION" },
  { label: "Signed PKS", value: "SIGNED_PKS" },
  { label: "Not Deal", value: "NOT_DEAL" },
];

const ResellerManagementContainer = () => {
  const {
    queryResult: {
      data: listReseller,
      refetch: refetchListReseller,
      isLoading,
    },
    setFilterItem,
    filterItem,
  } = useDataTable<ResellerResponse, ListResellerParam>(
    {
      url: RESELLER_SERVICE.reseller_list,
    },
    [RESELLER_SERVICE.reseller_list],
    PARAMS.resellerListParam
  );

  const {
    queryResult: { data: totalStatusReseller, refetch: refetchStatusReseller },
  } = useData<TotalResellerStatusResponse>(
    { url: RESELLER_SERVICE.reseller_status },
    [RESELLER_SERVICE.reseller_status],
    null,
    { enabled: true }
  );

  const [modal, setModal] = React.useState<ModalType>({
    modalOpen: "",
    status: "",
    id: "",
  });
  const [status, setStatus] = React.useState("");
  const [statusError, setStatusError] = React.useState("");

  const { updateStatusReseller } = useResellerRepository();

  const totalStatus: TotalResellerStatus = totalStatusReseller?.data ?? {
    RESELLER_ACTIVE: 0,
    RESELLER_NOT_ACTIVE: 0,
    NEGOTIATION: 0,
    SIGNED_PKS: 0,
    NOT_DEAL: 0,
  };

  const resellerData: Reseller[] = React.useMemo(() => {
    const list = listReseller?.data?.list || [];
    return list.map((item: any) => ({
      id: item.id,
      name: item.resellerName || "-",
      phone: item.resellerPhone || "-",
      code: item.codeSf || "-",
      partner: item.picReseller || "-",
      area: item.area || "-",
      region: item.region || "-",
      branch: item.branch || "-",
      status: formatEnumLabel(item.status) || "Not Active",
      cluster: "-",
      data_ip: "-",
      hp_pic_reseller: "-",
      potential_sales: item.potentialSales || "-",
      acquisition_progress: item.acquisitionProgress || "-",
      next_progress: item.nextProgress || "-",
      acq_month: item.acquisitionMonth || "-",
      q_acq: item.Qacquisition || "-",
      semester: item.semester || "-",
      acquired_sales_ytd: item.acquiredSalesYTD || "-",
      sales_ratio: item.salesRatio || "-",
      alamat_point_sales: item.isTelkom
        ? item.address
        : `${item.latitude}, ${item.longitude}` || "-",
      detail: "-",
      address: item.address || "-",
      high_income: item.totalHighIncome
        ? `Rp. ${numberWithDots(item.totalHighIncome)}`
        : "-",
      low_income: item.totalLowIncome
        ? `Rp. ${numberWithDots(item.totalLowIncome)}`
        : "-",
    }));
  }, [listReseller]);

  const totalItems = listReseller?.data?.total ?? 0;
  const currentPage = filterItem?.page ?? 1;
  const pageSize = filterItem?.limit ?? 10;

  const handlePageChange = (page: number) => {
    setFilterItem((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (size: number) => {
    setFilterItem((prev) => ({ ...prev, limit: size, page: 1 }));
  };

  const handleDateChange = (dates: any) => {
    if (Array.isArray(dates) && dates[0] && dates[1]) {
      const start = dayjs(dates[0]);
      const end = dayjs(dates[1]);

      if (start.isValid() && end.isValid()) {
        setFilterItem((prev) => ({
          ...prev,
          startDate: start.format("YYYY-MM-DD"),
          endDate: end.format("YYYY-MM-DD"),
          page: 1,
        }));
        return;
      }
    }

    setFilterItem((prev) => ({
      ...prev,
      startDate: undefined,
      endDate: undefined,
      page: 1,
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Reseller Active":
      case "Signed PKS":
        return "bg-[#EBFEF3] text-[#008E53]";
      case "Negotiation":
        return "bg-[#FFFBEC] text-[#FC9003]";
      case "Reseller Not Active":
        return "bg-[#FFF5F6] text-[#B71932]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const actionItems: MenuProps["items"] = [
    { key: "detail", label: "Details" },
    { key: "update_status", label: "Update Status" },
  ];

  const router = useRouter();
  const { isMobile } = WINDOW_HELPER.useWindowResize();

  const disabledDate = (current: any) => {
    return current && current > dayjs().endOf("day");
  };

  const updateResellerStatus = async () => {
    if (!status) {
      setStatusError("Status wajib dipilih");
      return;
    }

    try {
      const payload = {
        id: modal.id,
        status,
      };

      await updateStatusReseller.mutateAsync(payload);

      toast.success(
        <ToastContent description="Status reseller berhasil diubah" />
      );

      setStatus("");
      setStatusError("");
      setModal({ modalOpen: "", id: "", status: "" });
      refetchListReseller();
      refetchStatusReseller();
    } catch (error: any) {
      toast.error(
        <ToastContent
          type="error"
          description={
            error?.response?.data?.error?.message || "Gagal update status"
          }
        />
      );
    }
  };

  return (
    <LayoutContentPage>
      <Space direction="vertical" className="mb-4 px-6 pt-6">
        <h1 className="text-2xl font-bold">Reseller Management</h1>
        <p className="text-sm font-normal text-[#4E5764]">Edit List Reseller</p>
      </Space>
      <ResellerStatus status={totalStatus} />

      {isMobile ? (
        <div className="px-6 pt-6 mb-4 flex flex-col gap-3">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search"
            style={{ width: "100%" }}
            onChange={(e) =>
              setFilterItem((prev) => ({
                ...prev,
                search: e.target.value,
                page: 1,
              }))
            }
          />

          <div className="flex flex-row items-center gap-2 w-full">
            <RangePicker
              format="DD-MM-YYYY"
              disabledDate={disabledDate}
              onChange={handleDateChange}
              value={
                filterItem?.startDate && filterItem?.endDate
                  ? [
                      dayjs(filterItem.startDate, "YYYY-MM-DD"),
                      dayjs(filterItem.endDate, "YYYY-MM-DD"),
                    ]
                  : null
              }
              classNames={{
                popup: {
                  root: "mobile-calendar-popup",
                },
              }}
              style={{ width: "70%" }}
            />

            <Select
              placeholder="All Area"
              suffixIcon={<DownOutlined />}
              value={filterItem?.branch ?? undefined}
              options={[{ value: "JEMBER", label: "Jember" }]}
              onChange={(value) =>
                setFilterItem((prev) => ({
                  ...prev,
                  branch: value,
                  page: 1,
                }))
              }
              style={{ width: "28%" }}
            />
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center mb-4 px-6 pt-6">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search"
            style={{ width: 250 }}
            onChange={(e) =>
              setFilterItem((prev) => ({
                ...prev,
                search: e.target.value,
                page: 1,
              }))
            }
          />
          <div className="flex items-center gap-3">
            <RangePicker
              format="DD-MM-YYYY"
              disabledDate={disabledDate}
              onChange={handleDateChange}
              value={
                filterItem?.startDate && filterItem?.endDate
                  ? [
                      dayjs(filterItem.startDate, "YYYY-MM-DD"),
                      dayjs(filterItem.endDate, "YYYY-MM-DD"),
                    ]
                  : null
              }
            />
            <Select
              placeholder="All Area"
              suffixIcon={<DownOutlined />}
              value={filterItem?.branch ?? undefined}
              options={[{ value: "JEMBER", label: "Jember" }]}
              onChange={(value) =>
                setFilterItem((prev) => ({
                  ...prev,
                  branch: value,
                  page: 1,
                }))
              }
            />
          </div>
        </div>
      )}
      <div className="p-6">
        <Tables<Reseller>
          data={resellerData}
          columns={columns}
          actionItems={actionItems}
          onActionClick={(record, actionKey) => {
            if (actionKey === "detail") {
              router.push(
                `${PAGE_NAME.client_order}?resellerNumber=${record.id}`
              );
            }
            if (actionKey === "update_status") {
              setModal({ modalOpen: "UPDATE_STATUS", id: record.id });
            }
          }}
          statusColorFn={getStatusColor}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          currentPage={currentPage}
          showIndex
        />
      </div>
      <ModalConfirmationCustom
        open={modal.modalOpen === "UPDATE_STATUS"}
        title="Update Status"
        subTitle="Apakah Anda ingin mengubah status?"
        cancelText="Kembali"
        okText="Submit"
        onCancel={() => setModal({ modalOpen: "", status: "", id: "" })}
        onOk={updateResellerStatus}
      >
        <div className="my-4">
          <Space direction="vertical" size={4} className="w-full">
            <label className="text-darkGunmetal text-sm font-semibold text-left">
              Status
            </label>
            <Select
              value={status || undefined}
              onChange={(value) => {
                setStatus(value);
                setStatusError("");
              }}
              style={{ width: "100%" }}
              options={RESELLER_STATUS}
              status={statusError ? "error" : ""}
              placeholder="Pilih Status"
            />

            {statusError && (
              <span className="text-red-500 text-xs font-medium">
                {statusError}
              </span>
            )}
          </Space>
        </div>
      </ModalConfirmationCustom>
    </LayoutContentPage>
  );
};

export default ResellerManagementContainer;
