"use client";

import React from "react";
import { Modal, Button, Upload } from "antd";
import {
  UploadOutlined,
  CloseOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

type TambahOrderModalProps = {
  open: boolean;
  onClose: () => void;
};

const ModalCreateOrder: React.FC<TambahOrderModalProps> = ({
  open,
  onClose,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      centered
      width={700}
      className="custom-tambah-order-modal"
    >
      <div className="flex justify-between items-start mb-6 rounded-t-2xl bg-gradient-to-r from-[#FFE5E9] to-[#FFF5F6] p-6 -mt-6 -mx-6">
        <h2 className="text-[22px] font-bold text-[#0C1A30]">Tambah Order</h2>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-[#FFE5E7] transition"
        >
          <CloseOutlined className="text-[#E31C25]" />
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-[16px] font-semibold text-[#0C1A30] mb-1">
          Cara menambah order
        </h3>
        <p className="text-[13px] text-[#555] mb-4">
          Anda harus mengupload dokumen berikut untuk melakukan order. Template
          & tutorial pengisian dapat diunduh pada file di bawah ini
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-[#E5E5E5] rounded-xl flex justify-between items-center p-4 bg-white transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#E6F7E9] flex items-center justify-center">
                <FileExcelOutlined className="text-[#33A854] text-lg" />
              </div>
              <div>
                <p className="text-[#0C1A30] text-[13px] font-semibold">
                  Customer.xls
                </p>
                <p className="text-[12px] text-gray-500">XLS • 2.5 MB</p>
              </div>
            </div>
            <DownloadOutlined className="text-gray-400 text-lg cursor-pointer hover:text-[#E31C25]" />
          </div>

          <div className="border border-[#E5E5E5] rounded-xl flex justify-between items-center p-4 bg-white transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FFECEC] flex items-center justify-center">
                <FilePdfOutlined className="text-[#E31C25] text-lg" />
              </div>
              <div>
                <p className="text-[#0C1A30] text-[13px] font-semibold">
                  Tutorial pengisian
                </p>
                <p className="text-[12px] text-gray-500">PDF • 2.5 MB</p>
              </div>
            </div>
            <DownloadOutlined className="text-gray-400 text-lg cursor-pointer hover:text-[#E31C25]" />
          </div>
        </div>
      </div>

      <div className="border-t border-[#EAEAEA] pt-5">
        <h3 className="text-[15px] font-semibold text-[#0C1A30] mb-2">
          Customer Information Document
        </h3>
        <p className="text-[13px] text-[#555] mb-3">
          Upload dokumen yang sudah berisikan data customer sesuai template di
          atas
        </p>

        <div className="border-2 border-dashed border-[#D9D9D9] rounded-xl p-5 text-center bg-[#FAFAFA]">
          <Upload showUploadList={false}>
            <Button
              type="link"
              icon={<UploadOutlined className="text-[#1A3CCE]" />}
              className="text-[#1A3CCE] font-semibold"
            >
              Upload File
            </Button>
          </Upload>
          <p className="text-[12px] text-gray-400 mt-2 flex justify-center items-center gap-1">
            <span>ⓘ</span> Max 2mb
          </p>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Button
          type="primary"
          shape="round"
          size="large"
          disabled
          style={{
            backgroundColor: "#E5E5E5",
            border: "none",
            width: "100%",
            fontWeight: 600,
            fontSize: 15,
            height: 48,
            color: "#A3A3A3",
          }}
        >
          Tambah Order
        </Button>
      </div>
    </Modal>
  );
};

export default ModalCreateOrder;
