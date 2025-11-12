"use client";

import React from "react";
import {
  MenuOutlined,
  DownOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown } from "antd";
import { useRouter } from "next/navigation";

const AppHeader: React.FC<{
  userName?: string;
  onToggleSidebar?: () => void;
  collapsed?: boolean;
}> = ({ userName = "-", onToggleSidebar, collapsed }) => {
  const router = useRouter();
  const [clientUserName, setClientUserName] = React.useState<string | null>(
    null
  );

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const pocUser = JSON.parse(localStorage.getItem("pocUser") || "{}");
      const nameFromStorage = pocUser?.name || userName || "-";
      setClientUserName(nameFromStorage);
    }
  }, [userName]);

  const handleLogout = () => {
    localStorage.clear();
    router.replace("/login");
  };

  const menu = {
    items: [
      {
        key: "1",
        label: (
          <div className="flex items-center gap-2 font-semibold">
            <LogoutOutlined /> Logout
          </div>
        ),
        onClick: handleLogout,
      },
    ],
  };

  return (
    <header
      className="flex items-center justify-between px-6 py-3 bg-white border-b border-[#E6E6E6] shadow-sm"
      style={{ height: 64 }}
    >
      <div
        className="flex items-center gap-4 cursor-pointer"
        onClick={onToggleSidebar}
      >
        <MenuOutlined
          className={`text-[#0C1B36] text-xl transition-transform ${
            collapsed ? "rotate-180" : ""
          }`}
        />
      </div>

      <div className="flex items-center gap-3">
        <Dropdown menu={menu} placement="bottomRight" arrow>
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="flex flex-col justify-center leading-none text-right gap-2">
              <span className="text-[12px] text-[#8C8C8C] m-0 p-0">
                Selamat Datang
              </span>
              <div className="flex items-center self-end gap-1">
                <span className="text-[14px] font-semibold text-[#FF002E]">
                  {clientUserName ?? "-"}
                </span>
                <DownOutlined
                  style={{ color: "#FF002E" }}
                  className="text-xs"
                />
              </div>
            </div>
            <Avatar
              size={36}
              icon={<UserOutlined />}
              style={{
                backgroundColor: "#0C1B36",
              }}
            />
          </div>
        </Dropdown>
      </div>
    </header>
  );
};

export default AppHeader;
