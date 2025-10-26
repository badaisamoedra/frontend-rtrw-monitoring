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
          toast.success(
            <ToastContent description="Data user berhasil diperbarui" />
          );
          router.push(PAGE_NAME.dashboard);
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
    <div className="flex min-h-screen">
      <div className="w-4/5 flex flex-col bg-[#28497C]">
        <Image
          src={IMAGES.ThumbnailTelkomsel}
          alt="Ben Logo"
          className="h-[100vh]"
        />
      </div>

      <div className="w-2/5 flex flex-col justify-center items-center bg-white p-10">
        <Image
          src={ICONS.NewTelkomselLogo}
          alt="icon Telkomsel"
        />
        <h2 className="text-lg font-semibold mb-4 text-black">
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
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-[#AD0808] hover:bg-[#AD0808] border-none text-white text-base h-14"
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
