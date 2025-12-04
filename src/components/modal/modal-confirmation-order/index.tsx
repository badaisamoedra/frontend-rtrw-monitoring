"use client";

import React from "react";
import { Modal } from "antd";
import Image from "next/image";
import ICONS from "@rtrw-monitoring-system/public/assets/icons";

interface ModalConfirmCreateOrderProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const ModalConfirmCreateOrder: React.FC<ModalConfirmCreateOrderProps> = ({
  open,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal
      open={open}
      footer={null}
      closable={true}
      onCancel={onCancel}
      centered
      width={530}
      styles={{ body: { padding: "32px 24px", borderRadius: 20 } }}
      style={{ borderRadius: 20 }}
    >
      <div className="flex flex-col items-center text-center">
        <Image src={ICONS.IconWarning} alt="warning" width={90} height={90} />

        <h2 className="text-[20px] font-bold text-[#0C1B36] mt-4">
          Anda akan menambah order baru
        </h2>

        <p className="text-[14px] text-[#6B7280] mt-1">
          Order baru akan ditambahkan. Anda yakin?
        </p>

        <div className="flex gap-4 mt-8 w-full justify-center">
          <button
            className="px-6 py-2 rounded-full border border-[#FF0025] text-[#FF0025] font-semibold hover:bg-[#FFF1F3] transition"
            onClick={onCancel}
          >
            Kembali
          </button>

          <button
            className="px-6 py-2 rounded-full bg-[#FF0025] text-white font-semibold hover:bg-[#d90020] transition"
            onClick={onConfirm}
          >
            Yakin, Tambah Order
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalConfirmCreateOrder;
