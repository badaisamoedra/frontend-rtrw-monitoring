"use client";

import {
  FooterNavigation,
  LayoutContentPage,
  ModalConfirmation,
  ModalConfirmationCustom,
  ToastContent,
} from "@rtrw-monitoring-system/components";
import { Space, Tag, Timeline, Empty, Button, Input } from "antd";
import React from "react";
import { CheckCircleFilled, LeftOutlined } from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { useData } from "@rtrw-monitoring-system/hooks";
import { ORDER_SERVICE } from "@rtrw-monitoring-system/app/constants/api_url";
import dayjs from "dayjs";
import { getDiffDayHour, WINDOW_HELPER } from "@rtrw-monitoring-system/utils";
import { useOrderRepository } from "@rtrw-monitoring-system/services/order";
import { toast } from "react-toastify";

type ModalType = {
  modalOpen: "APPROVED" | "REJECTED" | "";
  activityName: string;
  id: string;
  notes?: string;
};

const ActivityOrderContainer = () => {
  const router = useRouter();
  const params = useSearchParams();
  const orderDetailId = params.get("id");
  const { isMobile } = WINDOW_HELPER.useWindowResize();
  const [modal, setModal] = React.useState<ModalType>({
    modalOpen: "",
    activityName: "",
    id: "",
    notes: "",
  });

  const {
    queryResult: {
      data: orderActivities,
      isLoading,
      refetch: refetchOrderActivity,
    },
  } = useData<OrderActivitiesResponse>(
    { url: ORDER_SERVICE.order_activities(orderDetailId ?? "") },
    [ORDER_SERVICE.order_activities(orderDetailId ?? "")],
    null,
    { enabled: !!orderDetailId }
  );

  const {
    queryResult: { data: orderActivitiesSummary, refetch: refetchOrderSummary },
  } = useData<OrderActivitiesSummaryResponse>(
    { url: ORDER_SERVICE.order_activities_summary(orderDetailId ?? "") },
    [ORDER_SERVICE.order_activities_summary(orderDetailId ?? "")],
    null,
    { enabled: !!orderDetailId }
  );

  const { updateOrderActivity } = useOrderRepository();
  const [rejectNotes, setRejectNotes] = React.useState("");
  const [rejectError, setRejectError] = React.useState("");

  const list: any[] = Array.isArray(orderActivities)
    ? orderActivities
    : orderActivities?.data || [];

  const activityMap: Record<string, { title: string; desc: string }> = {
    "Validasi Data Pelanggan": {
      title: "Validasi Data Pelanggan",
      desc: "Menunggu Aksi Untuk Melanjutkan Proses",
    },
    "Penandatanganan Kontrak Berlangganan Pelanggan": {
      title: "Penandatanganan Kontrak Berlangganan Pelanggan",
      desc: "Menunggu Validasi Data Pelanggan",
    },
    "Pembuatan Akun Pelanggan": {
      title: "Pembuatan Akun Pelanggan",
      desc: "Menunggu Penandatanganan Kontrak",
    },
    "Instalasi Perangkat Pelanggan": {
      title: "Instalasi Perangkat Pelanggan",
      desc: "Menunggu Pembuatan Akun Pelanggan",
    },
    "First Usage Pelanggan": {
      title: "First Usage Pelanggan",
      desc: "Menunggu Instalasi Perangkat",
    },
  };

  const timelineItems = React.useMemo(() => {
    if (!list?.length) return [];

    return list
      .filter((x) => x.activityName)
      .sort((a, b) => a.sequence - b.sequence)
      .map((item) => {
        const activity = activityMap[item.activityName] || {
          title: item.activityName ?? "Aktivitas Tidak Dikenal",
          desc: "Belum ada deskripsi.",
        };

        return {
          id: item.id,
          activityName: item.activityName,
          status: item.status,
          title: activity.title,
          desc: activity.desc,
          updatedAt: item.createdAt,
          notes: item.notes,
          createdAt: item.createdAt
        };
      });
  }, [list]);

  const updateActivity = async () => {
    try {
      const payload: {
        id: string;
        status: "" | "APPROVED" | "REJECTED";
        activityName: string;
        notes?: string;
      } = {
        id: modal.id,
        status: modal.modalOpen,
        activityName: modal.activityName,
      };

      if (modal.modalOpen === "REJECTED") {
        payload.notes = rejectNotes;
      }

      await updateOrderActivity.mutateAsync(payload);
      setRejectNotes("");
      setModal({ modalOpen: "", activityName: "", id: "" });
      toast.success(
        <ToastContent description="Activity order berhasil diubah" />
      );
      refetchOrderActivity();
      refetchOrderSummary();
    } catch (error: any) {
      setModal({ modalOpen: "", activityName: "", id: "" });
      toast.error(
        <ToastContent
          type="error"
          description={error?.response?.data?.messsage}
        />
      );
    }
  };

  if (isLoading)
    return (
      <LayoutContentPage className="p-6">
        <p className="text-center mt-20 text-gray-500">
          Memuat aktivitas order...
        </p>
      </LayoutContentPage>
    );

  return (
    <>
      <LayoutContentPage className={isMobile ? "p-4" : "p-6"}>
        {isMobile ? (
          <div className="mb-4 flex flex-col items-start space-y-2">
            <Button
              type="text"
              onClick={() => router.back()}
              icon={<LeftOutlined />}
              style={{ color: "#FF4D4F", fontWeight: 600 }}
              className="!px-0 !ml-0"
            >
              Kembali
            </Button>
            <h1 className="text-xl font-bold">Order Activity</h1>
            <p className="text-xs text-[#4E5764]">
              Lihat progres aktivitas pemasangan pelanggan
            </p>
          </div>
        ) : (
          <Space direction="vertical" size={"small"} className="mb-8">
            <h1 className="text-2xl font-bold">Order Activity</h1>
            <p className="text-sm font-normal text-[#4E5764]">
              Lihat progres aktivitas pemasangan pelanggan
            </p>
          </Space>
        )}

        <div className="mb-6 flex flex-col space-y-2">
          <p
            className={
              isMobile
                ? "text-xs font-semibold text-[#0C1A30]"
                : "text-sm font-semibold text-[#0C1A30]"
            }
          >
            Order Number : {orderActivitiesSummary?.data?.orderNumber ?? "-"}
          </p>
          <p
            className={
              isMobile
                ? "text-xs font-semibold text-[#0C1A30]"
                : "text-sm font-semibold text-[#0C1A30]"
            }
          >
            Nama Pelanggan : {orderActivitiesSummary?.data?.clientName ?? "-"}
          </p>
          <p
            className={
              isMobile
                ? "text-xs font-semibold text-[#0C1A30]"
                : "text-sm font-semibold text-[#0C1A30]"
            }
          >
            Nama Produk : {orderActivitiesSummary?.data?.packageName ?? "-"}
          </p>
          <p
            className={
              isMobile
                ? "text-xs font-semibold text-[#0C1A30]"
                : "text-sm font-semibold text-[#0C1A30]"
            }
          >
            Kode SF : {orderActivitiesSummary?.data?.codeSf ?? "-"}
          </p>
          <p
            className={
              isMobile
                ? "text-xs font-semibold text-[#0C1A30]"
                : "text-sm font-semibold text-[#0C1A30]"
            }
          >
            Branch : {orderActivitiesSummary?.data?.branch ?? "-"}
          </p>
        </div>

        <div
          className={`min-h-[60vh] flex ${
            isMobile ? "p-2 justify-center" : "p-8 justify-start"
          }`}
        >
          <div className={`w-full ${isMobile ? "max-w-full" : "max-w-3xl"}`}>
            {timelineItems.length === 0 ? (
              <Empty description="Belum ada aktivitas untuk order ini" />
            ) : (
              <Timeline
                mode="left"
                // className="[&_.ant-timeline-item-head]:!bg-transparent [&_.ant-timeline-item-head]:!border-none [&_.ant-timeline-item-head]:!shadow-none"
                items={timelineItems.map((item, index) => {
                  const isApproved = item.status === "APPROVED";
                  const isPending = item.status === "PENDING";
                  const isRejected = item.status === "REJECTED";

                  const eligibleActions =
                    isPending &&
                    (index === 0 || list[index - 1]?.status === "APPROVED");

                  const disabled =
                    index !== 0 && list[index - 1]?.status !== "APPROVED";

                  return {
                    dot: (
                      <CheckCircleFilled
                        style={{
                          color: isApproved ? "#009C5E" : "#d1d5db",
                          fontSize: isMobile ? 16 : 18,
                        }}
                      />
                    ),
                    children: (
                      <div
                        key={item.id}
                        className={`rounded-xl shadow-sm mb-2 transition-all duration-300 ${
                          isApproved
                            ? "bg-[#009C5E] text-white"
                            : disabled
                            ? "bg-[#E5E5E5] text-black"
                            : isRejected
                            ? "bg-[#FF383C] text-white"
                            : "bg-white text-black"
                        } p-6 border`}
                        style={{
                          width: "100%",
                          borderColor: isApproved ? "#009C5E" : "#D1D5DB",
                          borderWidth: 1,
                        }}
                      >
                        <h3 className="font-semibold mb-1">{item.title}</h3>

                        <p
                          className={`text-sm mb-3 ${
                            isApproved
                              ? "text-white opacity-90"
                              : isPending
                              ? "text-[#0C1A30]"
                              : isRejected
                              ? "text-white font-normal"
                              : "text-[#6B7280]"
                          }`}
                        >
                          {isApproved
                            ? item.desc
                            : isPending && !disabled
                            ? "Menunggu Aksi Untuk Melanjutkan Proses"
                            : isRejected
                            ? `Reason: ${item.notes ?? "-"}`
                            : `Menunggu ${item.title}`}
                        </p>

                        {isPending && !disabled && (
                          <p className="text-xs font-normal text-[#EC221F] italic">
                            {`(${getDiffDayHour(item.createdAt)})`}
                          </p>
                        )}

                        {(isApproved || isRejected) && (
                          <Tag
                            style={{
                              borderRadius: "20px",
                              fontSize: 11,
                              border: "none",
                              backgroundColor: "#FFFFFF40",
                              color: "#353941",
                              fontWeight: "600",
                            }}
                          >
                            {dayjs(item.updatedAt).isValid()
                              ? dayjs(item.updatedAt).format(
                                  "DD MMMM YYYY, HH:mm"
                                )
                              : "-"}
                          </Tag>
                        )}

                        {eligibleActions && (
                          <div className="flex gap-3 mt-4">
                            <Button
                              style={{
                                backgroundColor: "#16A34A",
                                borderColor: "#16A34A",
                                borderRadius: 9999,
                                color: "white",
                                fontWeight: 600,
                              }}
                              onClick={() =>
                                setModal({
                                  modalOpen: "APPROVED",
                                  activityName: item.activityName,
                                  id: item.id,
                                })
                              }
                            >
                              Approve
                            </Button>

                            <Button
                              danger
                              type="primary"
                              style={{
                                borderRadius: 9999,
                                fontWeight: 600,
                              }}
                              onClick={() =>
                                setModal({
                                  modalOpen: "REJECTED",
                                  activityName: item.activityName,
                                  id: item.id,
                                })
                              }
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    ),
                  };
                })}
              />
            )}
          </div>
        </div>
      </LayoutContentPage>

      {!isMobile && (
        <FooterNavigation
          onBack={() => router.back()}
          showNext={false}
          align="center"
        />
      )}

      <ModalConfirmation
        title="Anda akan mengubah status activity"
        subTitle="Apakah anda yakin menyetujui activity ini?"
        cancelText="Kembali"
        confirmText="Yakin, Ubah Activity"
        open={modal.modalOpen === "APPROVED"}
        onCancel={() => setModal({ modalOpen: "", activityName: "", id: "" })}
        onConfirm={updateActivity}
      />

      <ModalConfirmationCustom
        open={modal.modalOpen === "REJECTED"}
        title="Tolak"
        subTitle="Apakah Anda akan menolak pengajuan ini? Bila iya, harap isi alasan penolakan"
        cancelText="Kembali"
        okText="Submit"
        onCancel={() => setModal({ modalOpen: "", activityName: "", id: "" })}
        onOk={() => {
          if (!rejectNotes.trim()) {
            setRejectError("Alasan penolakan wajib diisi");
            return;
          }
          setRejectError("");
          updateActivity();
        }}
      >
        <div className="my-4">
          <Space direction="vertical" size={4} className="w-full">
            <label className="text-darkGunmetal text-sm font-semibold text-left">
              Alasan Penolakan
            </label>
            <Input.TextArea
              rows={6}
              value={rejectNotes}
              onChange={(e) => {
                setRejectNotes(e.target.value);
                if (e.target.value.trim()) setRejectError("");
              }}
              status={rejectError ? "error" : ""}
            />
            {rejectError && (
              <span className="text-red-500 text-xs font-medium">
                {rejectError}
              </span>
            )}
          </Space>
        </div>
      </ModalConfirmationCustom>
    </>
  );
};

export default ActivityOrderContainer;
