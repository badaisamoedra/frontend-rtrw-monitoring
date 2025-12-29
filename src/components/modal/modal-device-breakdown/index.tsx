import { Modal } from "antd";
import * as React from "react";

interface ModalStreetViewProps {
  open: boolean;
  onClose: () => void;
  deviceBreakDown: DeviceBreakdown | null;
  id: string;
}

const ModalDeviceBreakdown: React.FC<ModalStreetViewProps> = ({
  open,
  onClose,
  deviceBreakDown,
  id,
}) => {
  return (
    <Modal
      title={
        <span className="font-semibold text-base text-gray-800">
          {`Device Break Down (${id})`}
        </span>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={700}
      maskClosable
      className="p-0 rounded-xl overflow-hidden"
    >
      <div className="flex flex-col">
        <pre className="text-xs bg-gray-100 p-3 rounded whitespace-pre-wrap break-words">
          {deviceBreakDown
            ? JSON.stringify(deviceBreakDown, null, 2)
            : "No device data"}
        </pre>
      </div>
    </Modal>
  );
};

export default ModalDeviceBreakdown;
