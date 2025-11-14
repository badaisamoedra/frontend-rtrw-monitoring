"use client";

import React from "react";
import { Button } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import clsx from "clsx";

type InvoiceCardProps = {
  orderNumber: string;
  status: "Active" | "Not Active" | string;
  period: string;
  invoiceAmount: string;
  onDetail?: () => void;
  onCopy?: () => void;
};

const OrderCard: React.FC<InvoiceCardProps> = ({
  orderNumber,
  status,
  period,
  invoiceAmount,
  onDetail,
  onCopy,
}) => {
  const statusColor =
    {
      SUCCESS: "text-[#007C4C]",
      PENDING: "text-[#FC9003]",
      CANCELLED: "text-[#B71932]",
      FAILED: "text-[#B71932]",
    }[status] || "text-[#6B7280]";

  const dotColor =
    {
      SUCCESS: "bg-[#007C4C]",
      PENDING: "bg-[#FC9003]",
      CANCELLED: "bg-[#B71932]",
      FAILED: "bg-[#B71932]",
    }[status] || "bg-gray-400";

  const backgroundStyle =
    status === "SUCCESS"
      ? "linear-gradient(90deg, rgba(0,124,76,0.08) 0%, rgba(255,255,255,1) 100%)"
      : status === "PENDING"
      ? "linear-gradient(90deg, rgba(252,144,3,0.08) 0%, rgba(255,255,255,1) 100%)"
      : status === "CANCELLED" || status === "FAILED"
      ? "linear-gradient(90deg, rgba(183,25,50,0.08) 0%, rgba(255,255,255,1) 100%)"
      : "linear-gradient(90deg, rgba(0,0,0,0.03) 0%, rgba(255,255,255,1) 100%)";

  const formattedStatus = (() => {
    const s = String(status);
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  })();

  return (
    <div
      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 rounded-2xl bg-[#FAFAFA] shadow-[0_2px_10px_rgba(0,0,0,0.06)] 
      px-4 py-4 mb-4 hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] transition-all duration-200 border border-[#E5E5E5]"
      style={{
        background: backgroundStyle,
      }}
    >
      <div className="flex flex-col sm:w-1/4 w-full">
        <p className="text-[12px] sm:text-[13px] font-semibold text-[#1A1A1A]">Order Number</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[#0C1B36] font-medium truncate">{orderNumber}</span>
          <CopyOutlined
            onClick={onCopy}
            className="text-[#8C8C8C] cursor-pointer hover:text-[#FF002E] transition"
          />
        </div>
      </div>

      <div className="flex flex-col sm:w-1/4 w-full">
        <p className="text-[12px] sm:text-[13px] font-semibold text-[#1A1A1A]">Order Status</p>
        <div className="flex items-center gap-2 mt-1">
          <span className={clsx("w-[8px] h-[8px] rounded-full inline-block", dotColor)}></span>
          <span className={clsx("text-[13px] sm:text-[14px] font-semibold", statusColor)}>
            {formattedStatus}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:w-1/4 w-full">
        <p className="text-[12px] sm:text-[13px] font-semibold text-[#1A1A1A]">Period</p>
        <span className="mt-1 text-[13px] sm:text-[14px] text-[#0C1B36] font-medium">{period}</span>
      </div>

      <div className="flex flex-col sm:w-1/4 w-full">
        <p className="text-[12px] sm:text-[13px] font-semibold text-[#1A1A1A]">Invoice Amount</p>
        <span className="mt-1 text-[13px] sm:text-[14px] font-semibold text-[#0C1B36]">{invoiceAmount}</span>
      </div>

      <Button
        type="default"
        shape="round"
        onClick={onDetail}
        className="border-[#FF0025] text-[#FF0025] hover:!bg-[#FF0025] hover:!text-white mt-3 sm:mt-0 w-full sm:w-auto"
        style={{
          borderWidth: 2,
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        Order Detail
      </Button>
    </div>
  );
};

export default OrderCard;
