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
  const parsedDeviceBreakdown = React.useMemo(() => {
    if (!deviceBreakDown) return null;

    if (typeof deviceBreakDown === "string") {
      try {
        return JSON.parse(deviceBreakDown);
      } catch (e) {
        console.error("Invalid deviceBreakDown JSON", e);
        return null;
      }
    }

    return deviceBreakDown;
  }, [deviceBreakDown]);

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
      className="rounded-xl"
    >
      <div className="flex flex-col gap-4 text-sm">
        {!parsedDeviceBreakdown && <p className="text-gray-500">No device data</p>}

        <Section title="IOS">
          {parsedDeviceBreakdown?.IOS?.length ? (
            parsedDeviceBreakdown?.IOS?.map((item: any, idx: number) => (
              <div key={idx} className="ml-3">
                <p className="font-medium">
                  {item.manufacturer} : ({item.total_devices})
                </p>
                <ul className="list-disc ml-6">
                  {item.details.map((d: Detail, i: number) => (
                    <li key={i}>
                      {d.model} — <b>{d.count}</b>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <EmptyText />
          )}
        </Section>

        <Section title="ANDROID">
          {parsedDeviceBreakdown?.ANDROID?.length ? (
            parsedDeviceBreakdown?.ANDROID?.map((item: Android, idx: number) => (
              <div key={idx} className="ml-3">
                <p className="font-medium">
                  {item.manufacturer} : ({item.total_devices})
                </p>
                <ul className="list-disc ml-6">
                  {item.details.map((d: Detail, i: number) => (
                    <li key={i}>
                      {d.model} — <b>{d.count}</b>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <EmptyText />
          )}
        </Section>

        <Section title="OTHERS">
          {parsedDeviceBreakdown?.OTHERS?.length ? (
            parsedDeviceBreakdown?.OTHERS?.map((item: any, idx: number) => (
              <div key={idx} className="ml-3">
                <p className="font-medium">
                  {item.manufacturer} : ({item.total_devices})
                </p>
                <ul className="list-disc ml-6">
                  {item.details.map((d: Detail, i: number) => (
                    <li key={i}>
                      {d.model} — <b>{d.count}</b>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <EmptyText />
          )}
        </Section>

        <Section title="UNKNOWN">
          {parsedDeviceBreakdown?.UNKNOWN?.length ? (
            parsedDeviceBreakdown?.UNKNOWN?.map((item: any, idx: number) => (
              <div key={idx} className="ml-3">
                <p className="font-medium">
                  {item.manufacturer} : ({item.total_devices})
                </p>
                <ul className="list-disc ml-6">
                  {item.details.map((d: Detail, i: number) => (
                    <li key={i}>
                      {d.model} — <b>{d.count}</b>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <EmptyText />
          )}
        </Section>
      </div>
    </Modal>
  );
};

export default ModalDeviceBreakdown;

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="bg-gray-50 rounded-md p-3">
    <p className="font-semibold mb-2">{title}</p>
    {children}
  </div>
);

const EmptyText = () => <p className="text-gray-400 italic">No data</p>;
