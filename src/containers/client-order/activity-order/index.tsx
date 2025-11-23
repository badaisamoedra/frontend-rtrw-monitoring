"use client";

import {
  FooterNavigation,
  LayoutContentPage,
} from "@rtrw-monitoring-system/components";
import { Space, Tag, Timeline, Empty, Button } from "antd";
import React from "react";
import { CheckCircleFilled, LeftOutlined } from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { useData } from "@rtrw-monitoring-system/hooks";
import { ORDER_SERVICE } from "@rtrw-monitoring-system/app/constants/api_url";
import dayjs from "dayjs";
import { WINDOW_HELPER } from "@rtrw-monitoring-system/utils";

const ActivityOrderContainer = () => {
  const router = useRouter();
  const params = useSearchParams();
  const orderDetailId = params.get("id");
  const { isMobile } = WINDOW_HELPER.useWindowResize();

  const {
    queryResult: { data: orderActivities, isLoading },
  } = useData<OrderActivitiesResponse>(
    { url: ORDER_SERVICE.order_activities(orderDetailId ?? "") },
    [ORDER_SERVICE.order_activities(orderDetailId ?? "")],
    null,
    { enabled: !!orderDetailId }
  );

  const {
    queryResult: { data: orderActivitiesSummary },
  } = useData<OrderActivitiesSummaryResponse>(
    { url: ORDER_SERVICE.order_activities_summary(orderDetailId ?? "") },
    [ORDER_SERVICE.order_activities_summary(orderDetailId ?? "")],
    null,
    { enabled: !!orderDetailId }
  );

  const list: any[] = Array.isArray(orderActivities)
    ? orderActivities
    : orderActivities?.data || [];

  const activityMap: Record<string, { title: string; desc: string }> = {
    DEVICE_ACTIVE: {
      title: "Perangkat Aktif",
      desc: "Selesai! Perangkat sudah tersambung dengan jaringan internet.",
    },
    DEVICE_INSTALLATION: {
      title: "Instalasi Perangkat",
      desc: "Selesai! Instalasi perangkat berhasil.",
    },
    USER_VALIDATION: {
      title: "Validasi Data Pelanggan",
      desc: "Selesai! Validasi data pelanggan berhasil.",
    },
    USER_INPUT: {
      title: "Penginputan Data Pelanggan",
      desc: "Data pelanggan telah dikirim.",
    },
    USER_REGISTRATION: {
      title: "Registrasi & Validasi Data",
      desc: "Data kamu sudah tervalidasi.",
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
          title: activity.title,
          desc: activity.desc,
          updatedAt: item.createdAt,
        };
      });
  }, [list]);

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
          className={`min-h-[60vh] flex justify-center ${
            isMobile ? "p-2" : "p-8"
          }`}
        >
          <div className={`w-full ${isMobile ? "max-w-full" : "max-w-3xl"}`}>
            {timelineItems.length === 0 ? (
              <Empty description="Belum ada aktivitas untuk order ini" />
            ) : (
              <Timeline
                mode="left"
                items={timelineItems.map((item) => ({
                  dot: (
                    <CheckCircleFilled
                      style={{
                        color: "#009C5E",
                        fontSize: isMobile ? 16 : 18,
                      }}
                    />
                  ),
                  children: (
                    <div
                      key={item.id}
                      className={`rounded-xl shadow-sm mb-2 transition-all duration-300 ${
                        isMobile ? "px-4 py-3" : "px-6 py-4"
                      } bg-[#FFFFFF] text-black`}
                      // } bg-[#009C5E] text-white`}
                      style={{ width: "100%", borderColor: "#009C5E", borderWidth: 1 }}
                    >
                      <h3
                        className={`font-semibold mb-1 ${
                          isMobile ? "text-[14px]" : "text-[15px]"
                        }`}
                      >
                        {item.title}
                      </h3>

                      <p
                        className={`text-sm opacity-90 mb-3 ${
                          isMobile ? "text-[12px]" : ""
                        }`}
                      >
                        {item.desc}
                      </p>

                      <Tag
                        style={{
                          borderRadius: "20px",
                          fontSize: isMobile ? "9px" : "10px",
                          border: "none",
                          padding: isMobile ? "1px 8px" : "2px 10px",
                          backgroundColor: "#FFFFFF80",
                          color: "#353941",
                          fontWeight: "600",
                        }}
                      >
                        {dayjs(item.updatedAt).isValid()
                          ? dayjs(item.updatedAt).format(
                              "DD MMMM YYYY, HH:mm:ss"
                            )
                          : "-"}
                      </Tag>

                      {/* {item.title === "Validasi Data Pelanggan" && ( */}
                      <div
                        className="flex gap-3 mt-4 justify-start"
                        style={{ marginTop: isMobile ? 12 : 16 }}
                      >
                        <Button
                          style={{
                            backgroundColor: "#16A34A",
                            borderColor: "#16A34A",
                            borderRadius: 9999,
                            padding: isMobile ? "0 18px" : "0 24px",
                            fontWeight: 600,
                            fontSize: isMobile ? 12 : 13,
                            color: "white",
                          }}
                          onClick={() => console.log("Approve clicked")}
                        >
                          Approve
                        </Button>

                        <Button
                          danger
                          type="primary"
                          style={{
                            borderRadius: 9999,
                            padding: isMobile ? "0 18px" : "0 24px",
                            fontWeight: 600,
                            fontSize: isMobile ? 12 : 13,
                          }}
                          onClick={() => console.log("Reject clicked")}
                        >
                          Reject
                        </Button>
                      </div>
                      {/* )} */}
                    </div>
                  ),
                }))}
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
    </>
  );
};

export default ActivityOrderContainer;
