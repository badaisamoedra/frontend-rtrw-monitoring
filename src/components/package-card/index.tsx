"use client";

import React from "react";
import { Button } from "antd";
import { InfoCircleOutlined, RightOutlined } from "@ant-design/icons";
import Link from "next/link";
import { numberWithDots } from "@rtrw-monitoring-system/utils";

type PackageCardProps = {
  promo?: boolean;
  name: string;
  price: number;
  speed?: string;
  device?: string;
  onSelect?: () => void;
  onDetail?: () => void;
  selected?: boolean;
};

const PackageCard: React.FC<PackageCardProps> = ({
  promo,
  name,
  price,
  speed,
  device,
  onSelect,
  onDetail,
  selected = false,
}) => {
  return (
    <div
      className={`relative w-[418px] rounded-2xl p-5 transition-all cursor-pointer
        ${
          selected
            ? "border-2 border-[#00A86B] bg-[#F0FFF6] shadow-md"
            : "border border-[#A1A1AA] bg-[#F9FAFB]"
        }
      `}
      onClick={onSelect}
      style={{
        boxShadow: selected
          ? "0 0 0 2px rgba(0,168,107,0.1)"
          : "0 1px 3px rgba(0,0,0,0.05)",
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
          Rp. {numberWithDots(price) ?? 0}
          <span className="text-[#0C1A30] text-sm font-normal">/bulan</span>
        </p>

        <div className="mt-3 space-y-2 text-[13px] text-[#0C1A30] font-medium">
          <p className="flex items-center">
            <InfoCircleOutlined className="text-gray-500 mr-2 text-[15px]" />
            Kecepatan internet hingga{" "}
            <span className="font-bold text-[#0C1A30] ml-1">{"30"} Mbps</span>
          </p>
          <p className="flex items-center">
            <InfoCircleOutlined className="text-gray-500 mr-2 text-[15px]" />
            Optimum untuk{" "}
            <span className="font-bold text-[#0C1A30] ml-1">
              {"3"} Perangkat
            </span>
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
              backgroundColor: selected ? "#00A86B" : "#FF0025",
              border: "none",
              fontWeight: 600,
              height: "40px",
            }}
            onClick={onSelect}
          >
            {selected ? "Paket Dipilih ✓" : "Pilih Paket"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
