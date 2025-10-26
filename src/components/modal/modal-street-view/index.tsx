import { Button, Image, Modal } from "antd";
import * as React from "react";

interface ModalStreetViewProps {
  open: boolean;
  onClose: () => void;
  image: string;
  ticketNumber: string;
}
const ModalStreetView: React.FC<ModalStreetViewProps> = ({
  open,
  onClose,
  image,
  ticketNumber,
}) => {
  return (
    <Modal
      title={`Street View - ${ticketNumber}`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={1000}
      centered
    >
      <div className="px-2">
        <Image src={image} alt="img street view" width={"100%"} height={600} />
        <div className="flex justify-end items-center gap-2 mt-2">
          <Button type="primary" className="bg-red-700">Print</Button>
          <Button className="bg-gray-200" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalStreetView;
