"use client";

import React from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
  DetailPackageModal,
  FooterNavigation,
  LayoutContentPage,
  ModalConfirmCreateOrder,
  ModalCreateOrder,
  PackageCard,
  ToastContent,
} from "@rtrw-monitoring-system/components";
import { useRouter, useSearchParams } from "next/navigation";
import { useData } from "@rtrw-monitoring-system/hooks";
import { MASTER_SERVICE } from "@rtrw-monitoring-system/app/constants/api_url";
import { useOrderRepository } from "@rtrw-monitoring-system/services/order";
import { toast } from "react-toastify";
import { PAGE_NAME } from "@rtrw-monitoring-system/app/constants";

// const packages = [
//   {
//     id: 1,
//     name: "EZnet 10 Mbps",
//     price: "Rp130.000",
//     speed: "30 Mbps",
//     device: "3 Perangkat",
//     promo: true,
//   },
//   {
//     id: 2,
//     name: "EZnet 30 Mbps",
//     price: "Rp150.000",
//     speed: "30 Mbps",
//     device: "3 Perangkat",
//     promo: false,
//   },
// ];

const OrderCreationContainer = () => {
  const [openModalDetailPackage, setOpenModalDetailPackage] =
    React.useState(false);
  const [openModalCreateOrder, setOpenModalCreateOrder] = React.useState(false);
  const router = useRouter();
  const [selectIdPackage, setSelectIdPackage] = React.useState<string | null>(
    null
  );

  const [search, setSearch] = React.useState("");
  const params = useSearchParams();
  const resellerNumber = params.get("resellerNumber");
  const { uploadOrder } = useOrderRepository();
  const [openConfirmModal, setOpenConfirmModal] = React.useState(false);
  const [pendingPayload, setPendingPayload] = React.useState<{
    base64: string;
    fileType: string;
  } | null>(null);

  const {
    queryResult: { data: listPackage },
  } = useData<MasterPackageResponse>(
    { url: MASTER_SERVICE.master_package },
    [MASTER_SERVICE.master_package],
    null,
    { enabled: true }
  );

  const {
    queryResult: { data: packageDetail },
  } = useData<MasterPackageDetailResponse>(
    { url: MASTER_SERVICE.master_package_detail(selectIdPackage ?? "") },
    [MASTER_SERVICE.master_package_detail(selectIdPackage ?? "")],
    null,
    { enabled: !!selectIdPackage }
  );

  const filteredPackage = React.useMemo(() => {
    if (!listPackage?.data?.list) return [];

    return listPackage?.data?.list.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [listPackage, search]);

  const handleConfirmSubmit = async () => {
    if (!pendingPayload) return;

    await submitCreateOrder(pendingPayload.base64, pendingPayload.fileType);

    setOpenConfirmModal(false);
    setOpenModalCreateOrder(false);
  };

  const submitCreateOrder = async (base64: string, fileType: string) => {
    try {
      const cleanBase64 = base64.split(",")[1];
      const payload = {
        package_id: selectIdPackage ?? "",
        reseller_id: resellerNumber ?? "",
        file_type: fileType,
        base64: cleanBase64,
      };

      await uploadOrder.mutateAsync(payload);
      toast.success(
        <ToastContent description="Data user berhasil diperbarui" />
      );
      router.back();
    } catch (error: any) {
      toast.error(
        <ToastContent
          type="error"
          description={error.response?.data?.message}
        />
      );
    }
  };

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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-6">
            {filteredPackage?.map((pkg) => (
              <PackageCard
                key={pkg.id}
                name={pkg.name}
                price={pkg.price}
                // speed={pkg.speed}
                // device={pkg.device}
                // promo={pkg.promo}
                selected={selectIdPackage === pkg.id}
                onDetail={() => {
                  setSelectIdPackage(pkg.id);
                  setOpenModalDetailPackage(true);
                }}
                onSelect={() => {
                  setSelectIdPackage(pkg.id);
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <FooterNavigation
        onBack={() => router.back()}
        onNext={() => setOpenModalCreateOrder(true)}
        disableNext={!selectIdPackage}
      />
      <DetailPackageModal
        open={openModalDetailPackage}
        onClose={() => setOpenModalDetailPackage(false)}
        price={packageDetail?.data?.price ?? 0}
        name={packageDetail?.data?.name ?? ""}
      />
      <ModalCreateOrder
        open={openModalCreateOrder}
        onClose={() => setOpenModalCreateOrder(false)}
        onSubmitCreateOrder={(base64, fileType) => {
          setPendingPayload({ base64, fileType });
          setOpenConfirmModal(true);
        }}
        downloadTemplate={() => {
          window.open(process.env["NEXT_PUBLIC_FILE_TEMPLATE_ORDER"], "_blank");
        }}
      />
      <ModalConfirmCreateOrder
        open={openConfirmModal}
        onCancel={() => setOpenConfirmModal(false)}
        onConfirm={handleConfirmSubmit}
      />
    </LayoutContentPage>
  );
};

export default OrderCreationContainer;
