"use client";

import { Drawer, Layout, Menu, Skeleton } from "antd";
import Image from "next/image";
import * as React from "react";
import { FileSearchOutlined, HomeOutlined } from "@ant-design/icons";
import ICONS from "@rtrw-monitoring-system/public/assets/icons";
import { usePathname, useRouter } from "next/navigation";
import PAGE_NAME from "../constants/page_name";
import { COLORS } from "../../../libs/utils/src";
import { AppHeader } from "@rtrw-monitoring-system/components";
import { WINDOW_HELPER } from "@rtrw-monitoring-system/utils";

const { Sider, Header, Content } = Layout;

interface AuthLayoutProps {
  children?: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const pocUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("pocUser") || "{}")
      : {};

  const selectedKey = React.useMemo(() => {
    if (pathname?.includes("/dashboard")) return "1";
    if (pathname?.includes("/reseller-management")) return "2";
    return "";
  }, [pathname]);

  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => setIsClient(true), []);

  const { isMobile, windowWidth } = WINDOW_HELPER.useWindowResize();
  const [mobileVisible, setMobileVisible] = React.useState(false);

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
      {!isMobile ? (
        <Sider
          collapsible
          collapsed={collapsed}
          trigger={null}
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
            transition: "all 0.25s ease-in-out",
          }}
        >
          <div
            style={{
              width: "100%",
              backgroundColor: "#fff",
              zIndex: 1000,
              padding: collapsed ? "20px 0" : "16px 0",
              textAlign: "center",
              transition: "all 0.3s ease-in-out",
            }}
          >
            {isClient && collapsed ? (
              <Image
                src={ICONS.IconSmallTelkomsel}
                alt="telkomsel logo"
                width={30}
                height={30}
                style={{
                  transition: "all 0.3s ease-in-out",
                  margin: "0 auto",
                }}
              />
            ) : (
              <div className="flex justify-center items-center">
                <Image
                  src={ICONS.TelkomselLogo}
                  width={200}
                  height={100}
                  alt="telkomsel logo"
                  className="flex justify-center items-center"
                />
              </div>
            )}
          </div>

          {!collapsed && (
            <div className="text-[14px] font-semibold leading-tight text-black px-4 py-5 text-center">
              RT RW NET Monitoring System
            </div>
          )}

          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            style={{
              borderRight: 0,
              transition: "all 0.3s ease-in-out",
            }}
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
                label: "Reseller Management",
                onClick: () => router.push(PAGE_NAME.reseller_management),
              },
            ]}
          />
        </Sider>
      ) : (
        <Drawer
          placement="left"
          closable
          onClose={() => setMobileVisible(false)}
          open={mobileVisible}
          width={Math.min(windowWidth * 0.8, 250)}
          styles={{ body: { padding: 0 } }}
        >
          <div
            style={{
              width: "100%",
              backgroundColor: "#fff",
              zIndex: 1000,
              padding: "20px 0 16px 16px",
              textAlign: "center",
              transition: "all 0.3s ease-in-out",
            }}
          >
            <Image
              src={ICONS.TelkomselLogo}
              alt="telkomsel logo"
              width={180}
              height={60}
            />
          </div>

          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            style={{
              borderRight: 0,
              transition: "all 0.3s ease-in-out",
            }}
            items={[
              {
                key: "1",
                icon: <HomeOutlined />,
                label: "Dashboard",
                onClick: () => {
                  router.push(PAGE_NAME.dashboard);
                  setMobileVisible(false);
                },
              },
              {
                key: "2",
                icon: <FileSearchOutlined />,
                label: "Reseller Management",
                onClick: () => {
                  router.push(PAGE_NAME.reseller_management);
                  setMobileVisible(false);
                },
              },
            ]}
          />
        </Drawer>
      )}

      <Layout
        style={{
          marginLeft: !isMobile ? (collapsed ? 80 : 280) : 0,
          minHeight: "100vh",
          backgroundColor: "#fff",
          transition: "all 0.25s ease-in-out",
        }}
      >
        <Header
          style={{
            backgroundColor: "#fff",
            padding: 0,
            height: 64,
            lineHeight: "64px",
            borderBottom: "1px solid #f0f0f0",
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}
        >
          <AppHeader
            userName={pocUser.username ?? "-"}
            onToggleSidebar={() =>
              isMobile ? setMobileVisible(true) : setCollapsed(!collapsed)
            }
            collapsed={collapsed && !isMobile}
          />
        </Header>

        <Content
          style={{
            backgroundColor: COLORS.white,
            height: "calc(100vh - 64px)",
            overflowY: "auto",
            transition: "all 0.3s ease-in-out",
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
