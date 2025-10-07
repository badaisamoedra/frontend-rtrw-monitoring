"use client";

import { toRupiah } from "@rtrw-monitoring-system/utils";
import { Modal, Row, Col, Input, Button, Typography } from "antd";
import React from "react";

const { Text } = Typography;

interface ModalTicketProps {
  open: boolean;
  onClose: () => void;
  ticket: TicketingList;
}

const LabelInputRow = ({ label, value }: { label: string; value?: any }) => (
  <Row className="mb-3">
    <Col span={8}>
      <Text strong>{label}</Text>
    </Col>
    <Col span={16}>
      <Input value={value} disabled />
    </Col>
  </Row>
);

const ModalTicket: React.FC<ModalTicketProps> = ({ open, onClose, ticket }) => {
  return (
    <Modal
      title="View Ticket"
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
      centered
    >
      <div className="px-2">
        <LabelInputRow label="Ticket No." value={ticket?.ticketNumber} />
        <LabelInputRow label="Longitude" value={ticket?.longitude} />
        <LabelInputRow label="Latitude" value={ticket?.latitude} />
        <LabelInputRow
          label="Ticket Date"
          value={ticket?.details?.[0].createdAt}
        />
        <LabelInputRow label="Kabupaten" value={ticket?.district} />
        <LabelInputRow label="Kecamatan" value={ticket?.subDistrict} />
        <LabelInputRow label="Kelurahan / Desa" value={ticket?.subDistrict} />

        <Row className="mb-3" gutter={12}>
          <Col span={8}>
            <Text strong>Potential</Text>
          </Col>
          <Col span={8}>
            <Input
              addonBefore="High"
              value={ticket?.details?.[0].potentialHigh}
              disabled
            />
          </Col>
          <Col span={8}>
            <Input
              addonBefore="Low"
              value={ticket?.details?.[0].potentialLow}
              disabled
            />
          </Col>
        </Row>

        <LabelInputRow
          label="ARPU 3 months"
          value={toRupiah(Number(ticket?.details?.[0].threeMonth), "IDR")}
        />
        <LabelInputRow
          label="Potential Revenue"
          value={toRupiah(Number(ticket?.details?.[0].potentialRevenue), "IDR")}
        />
        <LabelInputRow label="Status" value={ticket?.status} />

        <Row className="mb-3">
          <Col span={8}>
            <Text strong>Catatan</Text>
          </Col>
          <Col span={16}>
            <Input.TextArea
              rows={3}
              value={ticket?.details?.[0].notes}
              disabled
            />
          </Col>
        </Row>

        <div className="flex justify-end">
          <Button onClick={onClose} className="bg-gray-200">
            Tutup
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalTicket;
