"use client";

import React from "react";
import {
  MenuOutlined,
  MailOutlined,
  BellOutlined,
  DownOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, Menu } from "antd";
import { useRouter } from "next/navigation";

const AppHeader: React.FC<{
  userName?: string;
  onToggleSidebar?: () => void;
  collapsed?: boolean;
}> = ({ userName = "Varelandito Caesar", onToggleSidebar, collapsed }) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.replace("/login");
  };

  const menu = (
    <Menu
      items={[
        {
          key: "1",
          label: (
            <div className="flex items-center gap-2 font-semibold">
              <LogoutOutlined /> Logout
            </div>
          ),
          onClick: handleLogout,
        },
      ]}
    />
  );

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

      <div className="flex items-center gap-6">
        {/* <div className="flex items-center gap-5">
          <MailOutlined className="text-[#0C1B36] text-lg cursor-pointer relative" />
          <BellOutlined className="text-[#0C1B36] text-lg cursor-pointer relative" />
        </div> */}

        <div className="flex items-center gap-3">
          <Dropdown overlay={menu} placement="bottomRight" arrow>
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="flex flex-col justify-center leading-none text-right gap-2">
                <span className="text-[12px] text-[#8C8C8C] m-0 p-0">
                  Selamat Datang
                </span>
                <div className="flex items-center self-end gap-1">
                  <span className="text-[14px] font-semibold text-[#FF002E]">
                    {userName}
                  </span>
                  <DownOutlined
                    color="#FF002E"
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
      </div>
    </header>
  );
};

export default AppHeader;
