"use client";

import React from "react";
import {
  MenuOutlined,
  DownOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Dropdown, Empty, Skeleton } from "antd";
import { useRouter } from "next/navigation";
import { useData } from "@rtrw-monitoring-system/hooks";
import { NOTIFICATION_SERVICE } from "@rtrw-monitoring-system/app/constants/api_url";
import { formatTimeAgo } from "@rtrw-monitoring-system/utils";
import { useNotificationRepository } from "@rtrw-monitoring-system/services/notification";

const AppHeader: React.FC<{
  userName?: string;
  onToggleSidebar?: () => void;
  collapsed?: boolean;
}> = ({ userName = "-", onToggleSidebar, collapsed }) => {
  const router = useRouter();

  const [clientUserName, setClientUserName] = React.useState<string | null>(
    null
  );
  const [notifications, setNotifications] = React.useState<NotficationList[]>(
    []
  );

  const { readNotification } = useNotificationRepository();

  const {
    queryResult: {
      data: dataNotification,
      isLoading,
      refetch: refetchNotifications,
    },
  } = useData<NotificationResponse>(
    { url: NOTIFICATION_SERVICE.notifications },
    [NOTIFICATION_SERVICE.notifications],
    null,
    { enabled: false }
  );

  const {
    queryResult: { data: notificationUnread, refetch: refetchUnread },
  } = useData<NotificationUnreadResponse>(
    { url: NOTIFICATION_SERVICE.notifications_unread_count },
    [NOTIFICATION_SERVICE.notifications_unread_count],
    null,
    { enabled: false }
  );

  React.useEffect(() => {
    if (!dataNotification?.data?.list) return;

    const mapped: NotficationList[] = dataNotification.data.list.map(
      (item) => ({
        id: item.id,
        userId: item.userId,
        title: item.title,
        message: item.message,
        createdAt: formatTimeAgo(item.createdAt),
        readAt: item.readAt,
        deeplink: item.deeplink,
        data: item.data,
      })
    );

    setNotifications(mapped);
  }, [dataNotification]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const pocUser = JSON.parse(localStorage.getItem("pocUser") || "{}");
      const nameFromStorage = pocUser?.name || userName || "-";
      setClientUserName(nameFromStorage);
    }
  }, [userName]);

  React.useEffect(() => {
    refetchUnread();
    refetchNotifications();

    const onFocus = () => {
      refetchUnread();
      refetchNotifications();
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        refetchUnread();
        refetchNotifications();
      }
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [refetchUnread, refetchNotifications]);

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadCount = dataNotification?.data?.unread ?? 0;

  const notificationMenu = {
    items: isLoading
      ? [
          {
            key: "loading",
            label: (
              <div className="py-4 px-3 w-[300px]">
                <Skeleton active paragraph={{ rows: 3 }} />
              </div>
            ),
          },
        ]
      : notifications.length === 0
      ? [
          {
            key: "empty",
            label: (
              <div className="py-4 w-[300px]">
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
                {/* <Button
                  type="link"
                  size="small"
                  disabled={unreadCount === 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    markAllAsRead();
                  }}
                >
                  Mark all as read
                </Button> */}
              </div>
            ),
          },
          {
            key: "list",
            label: (
              <div
                className="w-[300px] overflow-y-auto"
                style={{ maxHeight: 320 }}
              >
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`cursor-pointer hover:bg-gray-50 p-2 rounded ${
                      !!n.readAt ? "opacity-60" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      // markAsRead(n.id);
                      handleReadNotif(n.id, n.deeplink);
                    }}
                  >
                    <div className="flex items-start gap-2">
                      {!n.readAt && (
                        <span className="mt-[6px] w-2 h-2 min-w-[8px] min-h-[8px] rounded-full bg-[#FF002E] inline-block flex-shrink-0" />
                      )}
                      <div>
                        <p className="text-sm font-semibold text-[#0C1B36] m-0">
                          {n.title}
                        </p>
                        <p className="text-xs text-gray-600 m-0">{n.message}</p>
                        <p className="text-[10px] text-gray-400 mt-1 m-0">
                          {n.createdAt}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ),
          },
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

  const handleReadNotif = (id: string, deepLink: string) => {
    readNotification.mutate(
      { id },
      {
        onSuccess: () => {
          refetchNotifications();
          refetchUnread();

          if (deepLink) {
            setTimeout(() => {
              router.push(deepLink!);
            }, 100);
          }
        },
        onError: () => {
          refetchNotifications();
          refetchUnread();
        },
      }
    );
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
            <Badge count={unreadCount} size="small">
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
              style={{ backgroundColor: "#0C1B36" }}
            />
          </div>
        </Dropdown>
      </div>
    </header>
  );
};

export default AppHeader;
