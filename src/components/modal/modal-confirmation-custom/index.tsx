import { Modal, ModalProps } from "antd";
import * as React from "react";

interface ModalConfirmationCustomProps extends ModalProps {
  title: string;
  subTitle: string;
  children?: React.ReactNode;
}

const ModalConfirmationCustom: React.FC<ModalConfirmationCustomProps> = ({
  title,
  subTitle,
  children,
  open,
  cancelText,
  okText,
  onCancel,
  onOk,
  ...props
}) => {
  return (
    <Modal
      {...props}
      open={open}
      closable={false}
      footer={null}
      centered
      width={props.width ?? 530}
    >
      <div className="flex flex-col items-center">
        <h2 className="text-[20px] font-bold text-[#0C1B36] mt-4">{title}</h2>
        <p className="text-[14px] text-[#6B7280] my-1 text-center">
          {subTitle}
        </p>
        <div className="w-full">{children}</div>
        <div className="flex w-full flex-1 flex-row justify-between gap-4s">
          <button
            className="px-6 py-2 rounded-full border border-[#FF0025] text-[#FF0025] font-semibold hover:bg-[#FFF1F3] transition flex flex-1 items-center justify-center"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <div className="w-4"></div>
          <button
            className="px-6 py-2 rounded-full bg-[#FF0025] text-white font-semibold hover:bg-[#d90020] transition flex flex-1 items-center justify-center"
            onClick={onOk}
          >
            {okText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalConfirmationCustom;
