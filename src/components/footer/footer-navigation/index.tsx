"use client";

import React from "react";
import { Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";

type FooterNavigationProps = {
  onBack?: () => void;
  onNext?: () => void;
  showNext?: boolean;
  nextText?: string;
  backText?: string;
  disableNext?: boolean;
  variant?: "next" | "finish";
  align?: "center" | "between";
};

const FooterNavigation: React.FC<FooterNavigationProps> = ({
  onBack,
  onNext,
  showNext = true,
  nextText = "Selanjutnya",
  backText = "Kembali",
  disableNext = false,
  variant = "next",
  align = "between",
}) => {
  const buttonStyle =
    variant === "finish"
      ? {
          backgroundColor: disableNext ? "#E5E5E5" : "#28A745",
          color: disableNext ? "#A3A3A3" : "#FFFFFF",
        }
      : {
          backgroundColor: disableNext ? "#E5E5E5" : "#FF002E",
          color: disableNext ? "#A3A3A3" : "#FFFFFF",
        };

  return (
    <div className="sticky bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E5E5E5] shadow-[0_-2px_8px_rgba(0,0,0,0.05)] w-full">
      <div
        className={`flex ${
          align === "center" ? "justify-center" : "justify-between"
        } items-center py-5 px-6`}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#E31C25] font-semibold text-[14px] hover:opacity-80 transition"
        >
          <LeftOutlined className="text-[14px]" />
          {backText}
        </button>

        {showNext && (
          <Button
            type="primary"
            shape="round"
            size="large"
            disabled={disableNext}
            style={{
              ...buttonStyle,
              border: "none",
              fontWeight: 600,
              fontSize: 14,
              padding: "0 40px",
              height: 48,
              transition: "all 0.2s ease",
            }}
            onClick={onNext}
          >
            {nextText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default FooterNavigation;
