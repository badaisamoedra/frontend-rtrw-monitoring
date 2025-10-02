"use client";

import ICONS from "@rtrw-monitoring-system/public/assets/icons";
import { Button, Form, Input } from "antd";
import Image from "next/image";
import * as React from "react";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import PAGE_NAME from "../constants/page_name";

const LoginPage = () => {
  const [form] = Form.useForm();
  const router = useRouter();

  const handleSubmit = (values: any) => {
    const { username, password } = values;
    router.push(PAGE_NAME.dashboard);
    alert(`Username: ${username}\nPassword: ${password}`);
  };
  return (
    <div className="flex min-h-screen">
      <div className="w-4/5 flex flex-col bg-[#28497C]">
        <Image src={ICONS.BannerLogin} alt="Ben Logo" className="h-[100vh]" />
      </div>

      <div className="w-2/5 flex flex-col justify-center items-center bg-white p-10">
        <Image
          src={ICONS.TelkomselLogo}
          alt="icon Telkomsel"
          className="mb-6"
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
              className="w-full bg-red-600 hover:bg-red-700 border-none text-white text-base h-14"
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
