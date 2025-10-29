"use client";

import React from "react";
import { Modal, Button } from "antd";
import { CheckCircleOutlined, CloseOutlined } from "@ant-design/icons";

type DetailPackageModalProps = {
  open: boolean;
  onClose: () => void;
};

const DetailPackageModal: React.FC<DetailPackageModalProps> = ({
  open,
  onClose,
}) => {
  const details = [
    "Bebas Biaya Pasang (Nominal Rp 500.000)",
    "Speed Up to 50 Mbps",
    "Maksimal perangkat 5",
    "Kuota keluarga 15GB untuk 6 nomor",
    "Kuota Orbit 20 GB (belum termasuk modem Orbit Rp 425.000)",
    "Paket TV 81 Channel",
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      centered
      width={1080}
      className="custom-detail-modal"
    >
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-[22px] font-bold text-[#0C1A30]">Detail Package</h2>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center hover:bg-[#FFE5E7] transition"
        >
          <CloseOutlined className="text-[#E31C25]" />
        </button>
      </div>

      <h3 className="text-[16px] font-semibold text-[#001A41] mb-3">
        EZnet 30 Mbps
      </h3>
      <div className="bg-[#F8F8FA] rounded-2xl p-6 mb-6">
        <p className="text-[16px] font-bold text-[#001A41] mb-1">Total Harga</p>
        <p className="text-[32px] font-bold text-[#FF0025] leading-none">
          Rp 150.000
          <span className="text-[#0C1A30] text-[15px] font-medium">/bulan</span>
        </p>
      </div>

      <div className="bg-[#F8F8FA] rounded-2xl p-6">
        <h3 className="text-[16px] font-semibold text-[#0C1A30] mb-4">
          Detail Paket
        </h3>
        <ul className="space-y-3">
          {details.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-[#0C1A30] text-[14px]"
            >
              <CheckCircleOutlined className="text-[#0056B3] text-[16px] mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex justify-center">
        <Button
          type="primary"
          shape="round"
          size="large"
          onClick={onClose}
          style={{
            backgroundColor: "#E31C25",
            border: "none",
            width: "95%",
            fontWeight: 600,
            fontSize: 15,
            height: 48,
          }}
        >
          Tutup
        </Button>
      </div>
    </Modal>
  );
};

export default DetailPackageModal;
