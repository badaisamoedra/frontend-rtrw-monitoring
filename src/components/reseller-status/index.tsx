"use client";

import React from "react";
import Image from "next/image";
import ICONS from "@rtrw-monitoring-system/public/assets/icons";

interface ResellerStatusProps {
  status: TotalResellerStatus;
}

const ResellerStatus: React.FC<ResellerStatusProps> = ({ status }) => {
  return (
    <div className="bg-[#F1F1F4] p-6 py-4">
      <div className="p-4 rounded-xl bg-white">
        <div className="flex items-center gap-2 mb-4">
          <Image src={ICONS.IconResellerStatus} alt="icon reseller" />
          <h3 className="font-semibold text-[#1C1C1E]">Reseller Status</h3>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-[#E6F4EA] bg-[linear-gradient(135deg,_#FFFFFF_70%,_rgba(15,157,88,0.1)_100%)] relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                  <circle cx="60" cy="60" r="60" fill="url(#gradA)" />
                  <defs>
                    <linearGradient id="gradA" x1="0" y1="0" x2="120" y2="120">
                      <stop stopColor="white" stopOpacity="0.3" />
                      <stop stopColor="white" stopOpacity="0" offset="1" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="relative p-6">
                <h4 className="text-3xl font-bold text-[#0F9D58]">
                  {status.RESELLER_ACTIVE}
                </h4>
                <p className="text-[#0C1A30] text-sm font-medium mt-2">
                  Reseller Active
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-[#FCE8E6] bg-[linear-gradient(135deg,_#FFFFFF_70%,_rgba(217,48,37,0.1)_100%)] relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                  <circle cx="60" cy="60" r="60" fill="url(#gradB)" />
                  <defs>
                    <linearGradient id="gradB" x1="0" y1="0" x2="120" y2="120">
                      <stop stopColor="white" stopOpacity="0.3" />
                      <stop stopColor="white" stopOpacity="0" offset="1" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="relative p-6">
                <h4 className="text-3xl font-bold text-[#D93025]">
                  {status.RESELLER_NOT_ACTIVE}
                </h4>
                <p className="text-[#0C1A30] text-sm font-medium mt-2">
                  Reseller Not Active
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-[#E8F0FE] bg-[linear-gradient(135deg,_#FFFFFF_70%,_rgba(252,144,3,0.1)_100%)] relative overflow-hidden">
              <div className="relative p-6">
                <h4 className="text-3xl font-bold text-[#FC9003]">
                  {status.NEGOTIATION}
                </h4>
                <p className="text-[#0C1A30] text-sm font-medium mt-2">
                  Negotiation
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-[#FCE8E6] bg-[linear-gradient(135deg,_#FFFFFF_70%,_rgba(217,48,37,0.1)_100%)] relative overflow-hidden">
              <div className="relative p-6">
                <h4 className="text-3xl font-bold text-[#D93025]">
                  {status.NOT_DEAL}
                </h4>
                <p className="text-[#0C1A30] text-sm font-medium mt-2">
                  Not Deal
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-[#E6F4EA] bg-[linear-gradient(135deg,_#FFFFFF_70%,_rgba(15,157,88,0.1)_100%)] relative overflow-hidden">
              <div className="relative p-6">
                <h4 className="text-3xl font-bold text-[#0F9D58]">
                  {status.SIGNED_PKS}
                </h4>
                <p className="text-[#0C1A30] text-sm font-medium mt-2">
                  Signed PKS
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResellerStatus;
