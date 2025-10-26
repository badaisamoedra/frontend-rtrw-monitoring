"use client";

import { Layout, Menu, Skeleton } from "antd";
import Image from "next/image";
import * as React from "react";
import {
  FileTextOutlined,
  FileSearchOutlined,
  LogoutOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import ICONS from "@rtrw-monitoring-system/public/assets/icons";
import { usePathname, useRouter } from "next/navigation";
import PAGE_NAME from "../constants/page_name";
import { COLORS, localStorageExt } from "../../../libs/utils/src";

const { Sider, Header, Content } = Layout;

interface AuthLayoutProps {
  children?: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const selectedKey = React.useMemo(() => {
    if (pathname?.includes("/dashboard")) return "1";
    if (pathname?.includes("/ticketing")) return "2";
    if (pathname?.includes("/laporan")) return "3";
    return "";
  }, [pathname]);

  return (
    <Layout
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        overflow: "hidden",
        backgroundColor: "#fff",
      }}
      suppressHydrationWarning
    >
      <Sider
        width={280}
        style={{
          overflow: "auto",
          height: "100vh",
          borderRight: "1px solid #f0f0f0",
          backgroundColor: "#fff",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            width: "100%",
            backgroundColor: "#fff",
            zIndex: 1000,
            padding: "16px 0",
            textAlign: "center",
          }}
        >
          <Image
            src={ICONS.TelkomselLogo}
            alt="telkomsel logo"
          />
        </div>

        <div className="text-[14px] font-semibold leading-tight text-black px-4 py-5">
          RT RW NET Monitoring System
        </div>

        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{ borderRight: 0 }}
          items={[
            {
              key: "1",
              icon: <HomeOutlined />,
              label: "Dashboard",
              onClick: () => router.push(PAGE_NAME.dashboard),
            },
            {
              key: "2",
              icon: <FileSearchOutlined />,
              label: "Ticketing",
              onClick: () => router.push(PAGE_NAME.ticketing),
            },
            {
              key: "3",
              icon: <FileTextOutlined />,
              label: "Laporan",
              onClick: () => router.push(PAGE_NAME.laporan),
            },
            {
              key: "4",
              icon: <LogoutOutlined />,
              label: "Logout",
              onClick: () => {
                localStorageExt.clearLocalStorage();
                router.replace(PAGE_NAME.login)
              },
            },
          ]}
        />
      </Sider>

      <Layout
        style={{ marginLeft: 280, minHeight: "100vh", backgroundColor: "#fff" }}
      >
        <Header
          style={{
            backgroundColor: COLORS.red80,
            color: "#fff",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: "0 24px",
            fontWeight: "500",
            height: 64,
            lineHeight: "64px",
            position: "sticky",
            top: 0,
            zIndex: 100,
            fontSize: 16,
          }}
        >
          Welcome, Varel
        </Header>

        <Content
          style={{
            backgroundColor: COLORS.white,
            height: "calc(100vh - 64px)",
            overflowY: "auto",
            // padding: 24,
          }}
        >
          {children || (
            <div style={{ textAlign: "center", marginTop: 50 }}>
              <Skeleton active paragraph={{ rows: 6 }} />
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AuthLayout;
