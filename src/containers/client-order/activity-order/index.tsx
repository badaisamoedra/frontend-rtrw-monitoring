"use client";

import {
  FooterNavigation,
  LayoutContentPage,
} from "@rtrw-monitoring-system/components";
import { Space, Tag, Timeline, Empty } from "antd";
import React from "react";
import { CheckCircleFilled } from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { useData } from "@rtrw-monitoring-system/hooks";
import { ORDER_SERVICE } from "@rtrw-monitoring-system/app/constants/api_url";
import dayjs from "dayjs";

const ActivityOrderContainer = () => {
  const router = useRouter();
  const params = useSearchParams();
  const orderDetailId = params.get("id");

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

  console.log("SUMMARY ACTIVITIES :", orderActivitiesSummary);

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
      <LayoutContentPage className="p-6">
        <Space direction="vertical" size={"small"} className="mb-8">
          <h1 className="text-2xl font-bold">Order Activity</h1>
          <p className="text-sm font-normal text-[#4E5764]">
            Lihat progres aktivitas pemasangan pelanggan
          </p>
        </Space>

        <div className="mb-6 flex-col">
          <p className="text-sm font-semibold text-[#0C1A30]">
            Order Number : {orderActivitiesSummary?.data?.orderNumber ?? "-"}
          </p>
          <p className="text-sm font-semibold text-[#0C1A30]">
            Nama Pelanggan : {orderActivitiesSummary?.data?.clientName ?? "-"}
          </p>
          <p className="text-sm font-semibold text-[#0C1A30]">
            Nama Produk : {orderActivitiesSummary?.data?.packageName ?? "-"}
          </p>
          <p className="text-sm font-semibold text-[#0C1A30]">
            Kode SF : {orderActivitiesSummary?.data?.codeSf ?? "-"}
          </p>
          <p className="text-sm font-semibold text-[#0C1A30]">
            Branch : {orderActivitiesSummary?.data?.branch ?? "-"}
          </p>
        </div>

        <div className="min-h-[60vh] p-8 flex">
          <div className="w-full max-w-3xl">
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
                        fontSize: 18,
                      }}
                    />
                  ),
                  children: (
                    <div
                      key={item.id}
                      className="rounded-xl px-6 py-4 shadow-sm mb-2 transition-all duration-300 bg-[#009C5E] text-white"
                      style={{ width: "100%" }}
                    >
                      <h3 className="text-[15px] font-semibold mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm opacity-90 mb-3">{item.desc}</p>
                      <Tag
                        style={{
                          borderRadius: "20px",
                          fontSize: "10px",
                          border: "none",
                          padding: "2px 10px",
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
                    </div>
                  ),
                }))}
              />
            )}
          </div>
        </div>
      </LayoutContentPage>

      <FooterNavigation
        onBack={() => router.back()}
        showNext={false}
        align="center"
      />
    </>
  );
};

export default ActivityOrderContainer;
