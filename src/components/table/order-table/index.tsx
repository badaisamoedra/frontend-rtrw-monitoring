"use client";

import React from "react";
import { Button, Empty } from "antd";
import { OrderCard } from "@rtrw-monitoring-system/components";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

interface OrderItem {
  id: string | number;
  orderNumber: string;
  status: string;
  period: string;
  invoiceAmount: string;
  onDetail: () => void;
  onCopy: () => void;
}

interface OrderListTableProps {
  data: OrderItem[];
  totalItems?: number;
  pageSize?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  showIndex?: boolean;
  showTotalLabel?: boolean;
}

const OrderListTable: React.FC<OrderListTableProps> = ({
  data,
  totalItems,
  pageSize: defaultPageSize = 5,
  currentPage: externalPage,
  onPageChange,
  onPageSizeChange,
  showIndex = false,
  showTotalLabel = true,
}) => {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(defaultPageSize);

  const total = totalItems ?? data.length;
  const totalPages = Math.ceil(total / pageSize);
  const currentPage = externalPage ?? page;

  const paginatedData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePrev = () => {
    if (currentPage > 1) {
      const next = currentPage - 1;
      setPage(next);
      onPageChange?.(next);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      const next = currentPage + 1;
      setPage(next);
      onPageChange?.(next);
    }
  };

  const handlePageClick = (p: number) => {
    setPage(p);
    onPageChange?.(p);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    setPage(1);
    onPageSizeChange?.(newSize);
  };

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pages;
  };

  return (
    <>
      <div className="block md:hidden px-2 pt-0 pb-4 text-sm text-[#001A41]">
        Menampilkan <strong>{pageSize}</strong> dari{" "}
        <strong>{total} Data</strong>
      </div>
      <div className="mt-4">
        {paginatedData.length === 0 ? (
          <div className="py-10 flex justify-center items-center">
            <Empty description="Tidak ada data order" />
          </div>
        ) : (
          <div className="space-y-3">
            {paginatedData.map((item, i) => (
              <OrderCard
                key={item.id}
                orderNumber={
                  showIndex
                    ? `${(currentPage - 1) * pageSize + i + 1}. ${
                        item.orderNumber
                      }`
                    : item.orderNumber
                }
                status={item.status}
                period={item.period}
                invoiceAmount={item.invoiceAmount}
                onDetail={item.onDetail}
                onCopy={item.onCopy}
              />
            ))}
          </div>
        )}

        {/* {total > pageSize && ( */}
          <div className="flex justify-between items-center text-sm text-[#001A41] mt-6 px-2">
            {showTotalLabel && (
              <div className="hidden md:block">
                Menampilkan <strong>{pageSize}</strong> dari{" "}
                <strong>{total} Data</strong>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Button
                type="text"
                disabled={currentPage === 1}
                onClick={handlePrev}
                icon={
                  <LeftOutlined
                    className={`${
                      currentPage === 1 ? "text-gray-300" : "text-gray-600"
                    }`}
                  />
                }
              />
              <div className="flex items-center gap-2">
                {getPageNumbers().map((num, idx) =>
                  typeof num === "number" ? (
                    <button
                      key={idx}
                      onClick={() => handlePageClick(num)}
                      className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200 ${
                        num === currentPage
                          ? "bg-[#FF0025] text-white"
                          : "text-[#4B5563] hover:text-[#FF0025]"
                      }`}
                    >
                      {num}
                    </button>
                  ) : (
                    <span key={idx} className="text-gray-400">
                      {num}
                    </span>
                  )
                )}
              </div>
              <Button
                type="text"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={handleNext}
                icon={
                  <RightOutlined
                    className={`${
                      currentPage === totalPages || totalPages === 0
                        ? "text-gray-300"
                        : "text-gray-600"
                    }`}
                  />
                }
              />
            </div>
          </div>
        {/* )} */}
      </div>
    </>
  );
};

export default OrderListTable;
