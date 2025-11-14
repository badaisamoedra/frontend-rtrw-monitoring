"use client";

import ICONS from "@rtrw-monitoring-system/public/assets/icons";
import { Button, Form, Input } from "antd";
import Image from "next/image";
import * as React from "react";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useAuthRepository } from "@rtrw-monitoring-system/services/auth";
import { localStorageExt } from "../../../libs/utils/src/local-storage";
import { LOCAL_STORAGE_KEYS } from "@rtrw-monitoring-system/utils";
import { toast } from "react-toastify";
import { ToastContent } from "@rtrw-monitoring-system/components";
import { PAGE_NAME } from "../constants";
import IMAGES from "@rtrw-monitoring-system/public/assets/images";

const LoginPage = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { login: loginMutate } = useAuthRepository();

  const handleSubmit = (values: LoginPayload) => {
    const { username, password } = values;

    loginMutate.mutate(
      {
        username: username,
        password: password,
      },
      {
        onSuccess: (res) => {
          localStorageExt.setLocalStorage(
            LOCAL_STORAGE_KEYS.USER_INFO,
            res?.data?.data ?? ""
          );
          router.push(PAGE_NAME.dashboard);
          toast.success(
            <ToastContent description="Data user berhasil diperbarui" />
          );
        },
        onError: (err: any) => {
          toast.error(
            <ToastContent
              type="error"
              description={err.response?.data?.message}
            />
          );
        },
      }
    );
  };
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white text-black">
      {/* desktop thumbnail */}
      <div className="hidden md:flex w-4/5 flex-col bg-[#28497C]">
        <Image
          src={IMAGES.ThumbnailTelkomsel}
          alt="Telkomsel Banner"
          className="h-[100vh]"
        />
      </div>

      {/* mobile thumbnail */}
      <div className="flex md:hidden relative w-full h-[30vh] bg-[#28497C]">
        <Image
          src={IMAGES.ThumbnailTelkomsel}
          alt="Telkomsel Banner"
          fill
          className="object-cover object-[100%_center]"
          priority
        />
      </div>

      {/* form section */}
      <div className="w-full md:w-2/5 flex flex-col justify-center items-center p-6 md:p-10">
        <Image
          src={ICONS.NewTelkomselLogo}
          alt="Telkomsel Logo"
          className="w-[55vw] max-w-[220px] h-auto mb-3 md:mb-6"
          priority
        />
        <h2 className="text-sm md:text-lg font-semibold text-black md:text-black mb-4 text-center">
          RT RW NET Monitoring System
        </h2>

        <Form
          form={form}
          name="login_form"
          onFinish={handleSubmit}
          layout="vertical"
          className="w-full max-w-sm"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Masukkan username kamu" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
              size="large"
              className="rounded-lg text-base"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Masukkan password kamu" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
              className="rounded-lg text-base"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-[#AD0808] hover:bg-[#AD0808] border-none text-white text-base h-12 md:h-14 rounded-lg"
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
