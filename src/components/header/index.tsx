"use client";

import React from "react";
import {
  MenuOutlined,
  DownOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Button, Dropdown, Empty } from "antd";
import { useRouter } from "next/navigation";

type NotificationItem = {
  id: number;
  title: string;
  desc: string;
  time: string;
  isRead: boolean;
};

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    title: "Order Baru",
    desc: "Order #12345 menunggu approval",
    time: "5 menit lalu",
    isRead: false,
  },
  {
    id: 2,
    title: "Reseller Update",
    desc: "Reseller A memperbarui data lokasi",
    time: "1 jam lalu",
    isRead: false,
  },
];

const AppHeader: React.FC<{
  userName?: string;
  onToggleSidebar?: () => void;
  collapsed?: boolean;
}> = ({ userName = "-", onToggleSidebar, collapsed }) => {
  const router = useRouter();
  const [clientUserName, setClientUserName] = React.useState<string | null>(
    null
  );
  const [notifications, setNotifications] =
    React.useState<NotificationItem[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const pocUser = JSON.parse(localStorage.getItem("pocUser") || "{}");
      const nameFromStorage = pocUser?.name || userName || "-";
      setClientUserName(nameFromStorage);
    }
  }, [userName]);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const notificationMenu = {
    items:
      notifications.length === 0
        ? [
            {
              key: "empty",
              label: (
                <div className="py-4">
                  <Empty description="Tidak ada notifikasi" />
                </div>
              ),
            },
          ]
        : [
            {
              key: "header",
              label: (
                <div className="flex items-center justify-between w-[300px]">
                  <span className="font-semibold text-[#0C1B36]">
                    Notifications
                  </span>
                  <Button
                    type="link"
                    size="small"
                    disabled={unreadCount === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      markAllAsRead();
                    }}
                  >
                    Mark all as read
                  </Button>
                </div>
              ),
            },
            ...notifications.map((n) => ({
              key: n.id,
              label: (
                <div
                  className={`w-[300px] cursor-pointer hover:bg-gray-50 p-2 rounded ${
                    n.isRead ? "opacity-60" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    markAsRead(n.id);
                  }}
                >
                  <div className="flex items-start gap-2">
                    {!n.isRead && (
                      <span className="mt-[6px] w-2 h-2 rounded-full bg-[#FF002E]" />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-[#0C1B36] m-0">
                        {n.title}
                      </p>
                      <p className="text-xs text-gray-600 m-0">{n.desc}</p>
                      <p className="text-[10px] text-gray-400 mt-1 m-0">
                        {n.time}
                      </p>
                    </div>
                  </div>
                </div>
              ),
            })),
          ],
  };

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

      <div className="flex items-center gap-6">
        <Dropdown
          menu={notificationMenu}
          placement="bottomRight"
          trigger={["click"]}
          arrow
        >
          <div className="cursor-pointer">
            <Badge dot={unreadCount > 0} size="small">
              <BellOutlined className="text-[#FF0025] text-[18px]" />
            </Badge>
          </div>
        </Dropdown>
        <Dropdown menu={menu} placement="bottomRight" arrow>
          <div className="flex items-center gap-4 cursor-pointer">
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
