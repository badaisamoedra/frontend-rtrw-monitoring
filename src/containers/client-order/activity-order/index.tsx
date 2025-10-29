"use client";

import { LayoutContentPage } from "@rtrw-monitoring-system/components";
import { Space, Tag, Timeline } from "antd";
import React from "react";
import { CheckCircleFilled } from "@ant-design/icons";

const timelineData = [
  {
    title: "Perangkat Aktif",
    desc: "Selesai! Perangkat sudah tersambung dengan jaringan internet",
    date: "12 Desember 2024, 12:00:00",
  },
  {
    title: "Instalasi Perangkat",
    desc: "Selesai! Instalasi perangkat berhasil",
    date: "12 Desember 2024, 12:00:00",
  },
  {
    title: "Validasi Data Pelanggan",
    desc: "Selesai! Validasi data berhasil",
    date: "12 Desember 2024, 12:00:00",
  },
  {
    title: "Penginputan Data Pelanggan",
    desc: "Selesai! Data sudah di kirim oleh pelanggan.",
    date: "12 Desember 2024, 12:00:00",
  },
  {
    title: "Registrasi & Validasi Data",
    desc: "Selesai! Data kamu sudah tervalidasi.",
    date: "12 Desember 2024, 12:00:00",
  },
];

const ActivityOrderContainer = () => {
  return (
    <LayoutContentPage className="p-6">
      <Space direction="vertical" size={"small"} className="mb-8">
        <h1 className="text-2xl font-bold">Order Detail</h1>
        <p className="text-sm font-normal text-[#4E5764]">
          Update status pemasangan
        </p>
      </Space>
      <div className="mb-6">
        <p className="text-sm font-semibold text-[#0C1A30]">
          Order Number : 12345678910121213
        </p>
        <p className="text-sm font-semibold text-[#0C1A30]">
          Nama Pelanggan : Boaz Sanadi
        </p>
        <p className="text-sm font-semibold text-[#0C1A30]">
          Nama Produk : EZnet 10 mbps
        </p>
        <p className="text-sm font-semibold text-[#0C1A30]">Kode SF : PKU-02</p>
        <p className="text-sm font-semibold text-[#0C1A30]">
          Branch : Pekanbaru
        </p>
      </div>

      <div className="min-h-screen p-8 flex">
        <div className="w-full max-w-4xl">
          <Timeline
            items={timelineData.map((item, index) => ({
              dot: (
                <CheckCircleFilled style={{ color: "#00A86B", fontSize: 18 }} />
              ),
              children: (
                <div
                  className="bg-[#009C5E] text-white rounded-xl px-6 py-4 shadow-sm mb-2"
                  style={{ width: "100%" }}
                >
                  <h3 className="text-[15px] font-semibold mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm opacity-90 mb-3">{item.desc}</p>
                  <Tag
                    color="#00784B"
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
                    {item.date}
                  </Tag>
                </div>
              ),
            }))}
            mode="left"
          />
        </div>
      </div>
    </LayoutContentPage>
  );
};

export default ActivityOrderContainer;
