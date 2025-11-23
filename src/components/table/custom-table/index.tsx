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
      setMaxPagesToShow(mobile ? 7 : 5);
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

  const tableWrapperRef = React.useRef<HTMLDivElement | null>(null);
  const [scrollPos, setScrollPos] = React.useState({ left: 0, max: 0 });

  React.useEffect(() => {
    const el = tableWrapperRef.current;
    if (!el) return;
    const handleScroll = () => {
      setScrollPos({
        left: el.scrollLeft,
        max: el.scrollWidth - el.clientWidth,
      });
    };
    handleScroll();
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const getPageNumbers = () => {
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
          <div ref={tableWrapperRef} className="overflow-auto max-h-[600px]">
            <table
              className="w-full text-sm"
              style={{
                borderCollapse: "separate",
                borderSpacing: 0,
                tableLayout: "fixed",
              }}
            >
              <thead>
                <tr className="bg-[#FF0025] text-white text-left">
                  {showIndex && (
                    <th
                      className="py-3 px-4 font-semibold"
                      style={{
                        position: "sticky",
                        left: 0,
                        top: 0,
                        zIndex: 5,
                        background: "#FF0025",
                        width: 80,
                        minWidth: 80,
                        maxWidth: 80,
                        borderRight:
                          scrollPos.left > 2 ? "1px solid #d9d9d9" : "none",
                        boxShadow:
                          scrollPos.left > 2
                            ? "4px 0 6px -2px rgba(0,0,0,0.08)"
                            : "none",
                      }}
                    >
                      No.
                    </th>
                  )}

                  {columns.map((col, idx) => {
                    const colWidth =
                      typeof col.width === "number" ||
                      typeof col.width === "string"
                        ? col.width
                        : 160;

                    const isBeforeAction =
                      actionItems.length > 0 && idx === columns.length - 1;

                    return (
                      <th
                        key={idx}
                        className="py-3 px-4 font-semibold whitespace-normal break-words"
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 4,
                          background: "#FF0025",
                          textAlign: col.align || "left",
                          width: isBeforeAction
                            ? (Number(colWidth) || 160) + 35
                            : colWidth,
                          minWidth: isBeforeAction
                            ? (Number(colWidth) || 160) + 35
                            : colWidth,
                        }}
                      >
                        {col.title}
                      </th>
                    );
                  })}

                  {actionItems.length > 0 && (
                    <th
                      className="py-3 px-4 text-center font-semibold"
                      style={{
                        position: "sticky",
                        right: 0,
                        top: 0,
                        zIndex: 6,
                        background: "#FF0025",
                        width: 110,
                        minWidth: 110,
                        maxWidth: 110,
                        borderLeft:
                          scrollPos.left < scrollPos.max - 2
                            ? "1px solid #d9d9d9"
                            : "none",
                        boxShadow:
                          scrollPos.left < scrollPos.max - 2
                            ? "-4px 0 6px -2px rgba(0,0,0,0.08)"
                            : "none",
                      }}
                    >
                      Action
                    </th>
                  )}
                </tr>
              </thead>

              <tbody>
                {paginatedData.map((record, index) => {
                  const bgColor = index % 2 === 0 ? "#fafafa" : "#ffffff";

                  return (
                    <tr
                      key={record.id}
                      className="hover:bg-gray-50 transition-all"
                      style={{ backgroundColor: bgColor }}
                    >
                      {showIndex && (
                        <td
                          className="py-3 px-4"
                          style={{
                            position: "sticky",
                            left: 0,
                            zIndex: 3,
                            backgroundColor: bgColor,
                            width: 80,
                            minWidth: 80,
                            borderRight:
                              scrollPos.left > 2 ? "1px solid #e5e5e5" : "none",
                            boxShadow:
                              scrollPos.left > 2
                                ? "4px 0 6px -2px rgba(0,0,0,0.08)"
                                : "none",
                          }}
                        >
                          {(currentPage - 1) * pageSize + index + 1}
                        </td>
                      )}

                      {columns.map((col, idx) => {
                        const value = record[col.dataIndex];
                        const colWidth =
                          typeof col.width === "number" ||
                          typeof col.width === "string"
                            ? col.width
                            : 160;

                        const isBeforeAction =
                          actionItems.length > 0 && idx === columns.length - 1;

                        return (
                          <td
                            key={idx}
                            className="py-3 px-4 text-gray-700 whitespace-normal break-words"
                            style={{
                              width: isBeforeAction
                                ? (Number(colWidth) || 160) + 35
                                : colWidth,
                              minWidth: isBeforeAction
                                ? (Number(colWidth) || 160) + 35
                                : colWidth,
                              backgroundColor: bgColor,
                            }}
                          >
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
                        <td
                          className="py-3 px-4 text-center"
                          style={{
                            position: "sticky",
                            right: 0,
                            zIndex: 2,
                            backgroundColor: bgColor,
                            width: 110,
                            minWidth: 110,
                            maxWidth: 110,
                            borderLeft:
                              scrollPos.left < scrollPos.max - 2
                                ? "1px solid #e5e5e5"
                                : "none",
                            boxShadow:
                              scrollPos.left < scrollPos.max - 2
                                ? "-4px 0 6px -2px rgba(0,0,0,0.08)"
                                : "none",
                          }}
                        >
                          <Dropdown
                            menu={{
                              items: actionItems.map((item) => ({
                                ...item,
                                onClick: () =>
                                  onActionClick?.(record, item.key),
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center text-sm text-[#001A41] px-4 py-3">
        <div className="hidden md:block">
          Menampilkan <strong>{pageSize}</strong> dari{" "}
          <strong>{total} Data</strong>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="text"
            disabled={currentPage === 1}
            onClick={handlePrev}
            icon={
              <LeftOutlined
                className={
                  currentPage === 1 ? "text-gray-300" : "text-gray-600"
                }
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
                className={
                  currentPage === totalPages ? "text-gray-300" : "text-gray-600"
                }
              />
            }
          />
        </div>
      </div>
    </>
  );
};

export default Tables;
