"use client";

import React from "react";
import { Input, Button, Tag } from "antd";
import { SearchOutlined, InfoCircleOutlined } from "@ant-design/icons";
import Link from "next/link";
import {
  DetailPackageModal,
  FooterNavigation,
  LayoutContentPage,
  ModalCreateOrder,
  PackageCard,
} from "@rtrw-monitoring-system/components";
import { useRouter } from "next/navigation";

const packages = [
  {
    id: 1,
    name: "EZnet 10 Mbps",
    price: "Rp130.000",
    speed: "30 Mbps",
    device: "3 Perangkat",
    promo: true,
  },
  {
    id: 2,
    name: "EZnet 30 Mbps",
    price: "Rp150.000",
    speed: "30 Mbps",
    device: "3 Perangkat",
    promo: false,
  },
];

const OrderCreationContainer = () => {
  const [openModalDetailPackage, setOpenModalDetailPackage] =
    React.useState(false);
  const [openModalCreateOrder, setOpenModalCreateOrder] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const router = useRouter();

  return (
    <LayoutContentPage className="bg-[#F1F1F4]">
      <div className="bg-white p-6 gap-2.5">
        <div className="text-[10px] text-[#000000] mb-4 font-medium">
          <span className="text-[#000000]">DASHBOARD ORDERING</span>{" "}
          &nbsp;›&nbsp;
          <span className="text-[#000000] font-semibold">ORDER CREATION</span>
        </div>

        <h1 className="text-[20px] font-bold text-[#4E5764]">Order Creation</h1>
      </div>

      <div className="p-6 min-h-screen">
        <div className="bg-white rounded-xl p-6">
          <div className="mb-6">
            <Input
              placeholder="Cari Informasi Seputar Paket (Kecepatan, Perangkat, dll)"
              prefix={<SearchOutlined className="text-gray-400" />}
              className="rounded-lg py-2"
              style={{ width: "494px" }}
              size="large"
            />
          </div>

          <div className="flex gap-6">
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                name={pkg.name}
                price={pkg.price}
                speed={pkg.speed}
                device={pkg.device}
                promo={pkg.promo}
                onDetail={() => setOpenModalDetailPackage(true)}
                onSelect={() => setOpenModalCreateOrder(true)}
              />
            ))}
          </div>
        </div>
      </div>
      <FooterNavigation
        onBack={() => router.back()}
        onNext={() => setOpenModalCreateOrder(true)}
        disableNext={false}
      />
      <DetailPackageModal
        open={openModalDetailPackage}
        onClose={() => setOpenModalDetailPackage(false)}
      />
      <ModalCreateOrder
        open={openModalCreateOrder}
        onClose={() => setOpenModalCreateOrder(false)}
      />
    </LayoutContentPage>
  );
};

export default OrderCreationContainer;
