"use client";

import React from "react";
import { Dropdown, Button, Empty } from "antd";
import { MoreOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";

export interface Column<T> {
  title: string;
  dataIndex: keyof T;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  width?: string | number;
  align?: "left" | "center" | "right";
}

interface GeneralTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onActionClick?: (record: T, actionKey: string) => void;
  actionItems?: any[];
  showIndex?: boolean;
  statusColorFn?: (status: string) => string;
  pageSize?: number;
  totalItems?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

const Tables = <T extends { id: string | number }>({
  data,
  columns,
  onActionClick,
  actionItems = [],
  showIndex = true,
  statusColorFn,
  pageSize: defaultPageSize = 10,
  totalItems,
  currentPage: externalPage,
  onPageChange,
  onPageSizeChange,
}: GeneralTableProps<T>) => {
  const [internalPage, setInternalPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(defaultPageSize);

  const currentPage = externalPage ?? internalPage;
  const total = totalItems ?? data.length;
  const totalPages = Math.ceil(total / pageSize);

  const paginatedData =
    onPageChange && totalItems && totalItems > data.length
      ? data
      : data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const [isMobile, setIsMobile] = React.useState(false);
  const [maxPagesToShow, setMaxPagesToShow] = React.useState(7);

  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (mobile) {
        const approxButtonWidth = 40;
        const containerWidth = window.innerWidth - 100;
        const maxButtons = Math.floor(containerWidth / approxButtonWidth);
        setMaxPagesToShow(Math.max(maxButtons, 5));
      } else {
        setMaxPagesToShow(5);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePrev = () => {
    const next = Math.max(currentPage - 1, 1);
    setInternalPage(next);
    onPageChange?.(next);
  };

  const handleNext = () => {
    const next = Math.min(currentPage + 1, totalPages || 1);
    setInternalPage(next);
    onPageChange?.(next);
  };

  const handlePageClick = (page: number) => {
    setInternalPage(page);
    onPageChange?.(page);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    setInternalPage(1);
    onPageSizeChange?.(newSize);
  };

  const getDesktopPageNumbers = () => {
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

  const getMobilePageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const sideCount = Math.floor((maxPagesToShow - 3) / 2);
      let start = currentPage - sideCount;
      let end = currentPage + sideCount;

      if (start <= 2) {
        start = 2;
        end = maxPagesToShow - 2;
      }
      if (end >= totalPages - 1) {
        end = totalPages - 1;
        start = totalPages - (maxPagesToShow - 2);
      }

      pages.push(1);
      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const getPageNumbers = () =>
    isMobile ? getMobilePageNumbers() : getDesktopPageNumbers();

  return (
    <>
      <div className="block md:hidden px-2 pt-0 pb-4 text-sm text-[#001A41]">
        Menampilkan <strong>{pageSize}</strong> dari{" "}
        <strong>{total} Data</strong>
      </div>

      <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
        {data.length === 0 ? (
          <div className="py-10 flex justify-center items-center">
            <Empty description="No data available" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#FF0025] text-white text-left">
                  {showIndex && <th className="py-3 px-4 w-[40px]">No.</th>}
                  {columns.map((col, idx) => (
                    <th
                      key={idx}
                      className="py-3 px-4 font-semibold"
                      style={{
                        width: col.width,
                        textAlign: col.align || "left",
                      }}
                    >
                      {col.title}
                    </th>
                  ))}
                  {actionItems.length > 0 && (
                    <th className="py-3 px-4 text-center">Action</th>
                  )}
                </tr>
              </thead>

              <tbody>
                {paginatedData.map((record, index) => (
                  <tr
                    key={record.id}
                    className={`${
                      index % 2 === 0 ? "bg-[#fafafa]" : "bg-white"
                    } hover:bg-gray-50 transition-all duration-150`}
                  >
                    {showIndex && (
                      <td className="py-3 px-4 text-gray-700">
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>
                    )}

                    {columns.map((col, idx) => {
                      const value = record[col.dataIndex];
                      return (
                        <td key={idx} className="py-3 px-4 text-gray-700">
                          {col.render ? (
                            col.render(value, record, index)
                          ) : statusColorFn && col.dataIndex === "status" ? (
                            <span
                              className={`px-3 py-[4px] rounded-full text-xs font-medium ${statusColorFn(
                                String(value)
                              )}`}
                            >
                              {String(value)}
                            </span>
                          ) : (
                            String(value)
                          )}
                        </td>
                      );
                    })}

                    {actionItems.length > 0 && (
                      <td className="py-3 px-4 text-center">
                        <Dropdown
                          menu={{
                            items: actionItems.map((item) => ({
                              ...item,
                              onClick: () => onActionClick?.(record, item.key),
                            })),
                          }}
                          placement="bottomRight"
                          arrow
                          trigger={["click"]}
                        >
                          <Button
                            type="text"
                            icon={<MoreOutlined />}
                            className="hover:text-red-500 text-gray-600"
                          />
                        </Dropdown>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center text-sm text-[#001A41] px-4 py-3">
        <div className="hidden md:block">
          Menampilkan <strong>{pageSize}</strong>{" "}
          {/* this component for the customize limit data */}
          {/* <select
            className="border rounded px-1 cursor-pointer"
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>{" "} */}
          dari <strong>{total} Data</strong>
        </div>

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
                  currentPage === totalPages ? "text-gray-300" : "text-gray-600"
                }`}
              />
            }
          />
        </div>
      </div>
    </>
  );
};

export default Tables;
