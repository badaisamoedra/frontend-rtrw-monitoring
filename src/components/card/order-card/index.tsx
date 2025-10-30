"use client";

import React from "react";
import { Button } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import clsx from "clsx";

type InvoiceCardProps = {
  orderNumber: string;
  status: "Active" | "Not Active";
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
  const statusColor = {
    Active: "text-[#28A745]",
    "Not Active": "text-[#E31C25]",
    Pending: "text-[#FFB800]",
    Rejected: "text-[#E31C25]",
  }[status];

  const dotColor = {
    Active: "bg-[#28A745]",
    "Not Active": "bg-[#E31C25]",
    Pending: "bg-[#FFB800]",
    Rejected: "bg-[#E31C25]",
  }[status];

  const backgroundStyle =
    status === "Active"
      ? "linear-gradient(90deg, rgba(40,167,69,0.08) 0%, rgba(255,255,255,1) 100%)"
      : "linear-gradient(90deg, rgba(255,0,46,0.05) 0%, rgba(255,255,255,1) 100%)";

  return (
    <div
      className="flex justify-between items-center gap-6 rounded-2xl bg-[#FAFAFA] shadow-[0_2px_10px_rgba(0,0,0,0.06)] 
      px-6 py-4 mb-4 hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] transition-all duration-200 border border-[#E5E5E5]"
      style={{
        background: backgroundStyle,
      }}
    >
      <div className="flex flex-col w-1/4">
        <p className="text-[13px] font-semibold text-[#1A1A1A]">Order Number</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[#0C1B36] font-medium">{orderNumber}</span>
          <CopyOutlined
            onClick={onCopy}
            className="text-[#8C8C8C] cursor-pointer hover:text-[#FF002E] transition"
          />
        </div>
      </div>

      <div className="flex flex-col w-1/4">
        <p className="text-[13px] font-semibold text-[#1A1A1A]">Order Status</p>
        <div className="flex items-center gap-2 mt-1">
          <span
            className={clsx(
              "w-[8px] h-[8px] rounded-full inline-block",
              dotColor
            )}
          ></span>
          <span className={clsx("text-[14px] font-semibold", statusColor)}>
            {status}
          </span>
        </div>
      </div>

      <div className="flex flex-col w-1/4">
        <p className="text-[13px] font-semibold text-[#1A1A1A]">Period</p>
        <span className="mt-1 text-[14px] text-[#0C1B36] font-medium">
          {period}
        </span>
      </div>

      <div className="flex flex-col w-1/4">
        <p className="text-[13px] font-semibold text-[#1A1A1A]">
          Invoice Amount
        </p>
        <span className="mt-1 text-[14px] font-semibold text-[#0C1B36]">
          {invoiceAmount}
        </span>
      </div>

      <Button
        type="default"
        shape="round"
        onClick={onDetail}
        style={{
          borderWidth: 2,
          fontSize: 14,
          fontWeight: 600,
          padding: "0 24px",
        }}
      >
        Order Detail
      </Button>
    </div>
  );
};

export default OrderCard;
