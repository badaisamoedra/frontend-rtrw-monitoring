import { Button, Modal } from "antd";
import * as React from "react";

interface ModalStreetViewProps {
  open: boolean;
  onClose: () => void;
  reseller: any;
}
const ModalStreetView: React.FC<ModalStreetViewProps> = ({
  open,
  onClose,
  reseller,
}) => {
  return (
    <Modal
      title={
        <span className="font-semibold text-base text-gray-800">
          Street View – #{reseller?.resellerNumber ?? ""}
        </span>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={900}
      maskClosable
      className="p-0 rounded-xl overflow-hidden bg-black"
    >
      <div className="w-full h-[500px] bg-black">
        {reseller?.latitude && reseller?.longitude ? (
          <iframe
            src={`https://www.google.com/maps/embed?pb=!4v0!6m8!1m7!1sCAoSLEFGMVFpcE5ZcXcyRGZsMUtOS0lsdHBNZVh0Mmt6ZWNBWWpDZlZ4RVNaMnJk!2m2!1d${reseller?.latitude}!2d${reseller?.longitude}!3f0!4f0!5f0.7820865974627469`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white text-sm">
            Street View not available for this location
          </div>
        )}
      </div>

      <div className="flex justify-end items-center px-4 py-3 border-t bg-gray-50">
        <Button
          type="primary"
          size="middle"
          onClick={() =>
            window.open(
              `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${reseller?.latitude},${reseller?.longitude}`,
              "_blank"
            )
          }
        >
          Open in Google Maps
        </Button>
      </div>
    </Modal>
  );
};

export default ModalStreetView;
