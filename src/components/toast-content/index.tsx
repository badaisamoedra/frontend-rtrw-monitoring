import * as React from "react";

import { TypeOptions } from "react-toastify";

interface ToastContentProps {
  type?: TypeOptions;
  title?: string;
  description?: string;
}

const ToastContent: React.FC<ToastContentProps> = (props) => {
  const content = {
    title: props.title,
    description: props.description,
  };

  switch (props.type) {
    case "error":
      content.title = props.title || "Gagal";
      content.description = props.description || "Data gagal diperbarui";
      break;
    case "info":
    case "warning":
    case "success":
    case "default":
    default:
      content.title = props.title || "Berhasil";
      content.description = props.description || "Data berhasil diperbarui";
  }

  return (
    <div className="flex flex-col bg-transparent w-full">
      <span className="font-semibold text-sm">{content.title}</span>
      <span className="font-normal text-xs">{content.description}</span>
    </div>
  );
};

export default ToastContent;
