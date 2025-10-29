"use client";

import React from "react";
import { Button } from "antd";
import { InfoCircleOutlined, RightOutlined } from "@ant-design/icons";
import Link from "next/link";

type PackageCardProps = {
  promo?: boolean;
  name: string;
  price: string;
  speed: string;
  device: string;
  onSelect?: () => void;
  onDetail?: () => void;
};

const PackageCard: React.FC<PackageCardProps> = ({
  promo,
  name,
  price,
  speed,
  device,
  onSelect,
  onDetail,
}) => {
  return (
    <div
      className="relative w-[418px] border border-[#A1A1AA] rounded-2xl bg-[#F9FAFB] p-5 hover:shadow-md transition-all"
      style={{
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      {promo && (
        <div className="absolute top-0 left-0 rounded-tl-2xl rounded-br-2xl bg-[#EEF2FF] text-[#14278C] text-[12px] font-semibold px-4 py-1">
          Promo Bulanan
        </div>
      )}

      <div className="mt-4">
        <h3 className="text-[15px] font-medium text-[#0C1A30] mb-1">{name}</h3>
        <p className="text-[20px] font-extrabold text-[#E31C25] mb-1 leading-tight">
          {price}
          <span className="text-[#0C1A30] text-sm font-normal">/bulan</span>
        </p>

        <div className="mt-3 space-y-2 text-[13px] text-[#0C1A30] font-medium">
          <p className="flex items-center">
            <InfoCircleOutlined className="text-gray-500 mr-2 text-[15px]" />
            Kecepatan internet hingga{" "}
            <span className="font-bold text-[#0C1A30] ml-1">{speed}</span>
          </p>
          <p className="flex items-center">
            <InfoCircleOutlined className="text-gray-500 mr-2 text-[15px]" />
            Optimum untuk{" "}
            <span className="font-bold text-[#0C1A30] ml-1">{device}</span>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link href="#" onClick={onDetail}>
            <div className="text-[#E31C25] text-[13px] font-semibold hover:underline">
              Detail Paket <RightOutlined className="text-[11px]" />
            </div>
          </Link>
        </div>

        <div className="mt-3">
          <Button
            type="primary"
            shape="round"
            block
            size="large"
            style={{
              backgroundColor: "#FF0025",
              border: "none",
              fontWeight: 600,
              height: "40px",
            }}
            onClick={onSelect}
          >
            Pilih Paket
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
