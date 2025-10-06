"use client";

import { Modal, Row, Col, Input, Button, Typography } from "antd";
import React from "react";

const { Text } = Typography;

interface ModalTicketProps {
  open: boolean;
  onClose: () => void;
  ticket: any;
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
        <LabelInputRow label="Ticket No." value={ticket?.ticketId} />
        <LabelInputRow label="Longitude" value={ticket?.longitude} />
        <LabelInputRow label="Latitude" value={ticket?.latitude} />
        <LabelInputRow label="Ticket Date" value={ticket?.date} />
        <LabelInputRow label="Kabupaten" value={ticket?.kabupaten} />
        <LabelInputRow label="Kecamatan" value={ticket?.kecamatan} />
        <LabelInputRow label="Kelurahan / Desa" value={ticket?.desa} />

        <Row className="mb-3" gutter={12}>
          <Col span={8}>
            <Text strong>Potential</Text>
          </Col>
          <Col span={8}>
            <Input addonBefore="High" value={ticket?.potentialHigh} disabled />
          </Col>
          <Col span={8}>
            <Input addonBefore="Low" value={ticket?.potentialLow} disabled />
          </Col>
        </Row>

        <LabelInputRow label="ARPU 3 months" value={`IDR ${ticket?.arpu}`} />
        <LabelInputRow
          label="Potential Revenue"
          value={`IDR ${ticket?.revenue}`}
        />
        <LabelInputRow label="Status" value={ticket?.status} />

        <Row className="mb-3">
          <Col span={8}>
            <Text strong>Catatan</Text>
          </Col>
          <Col span={16}>
            <Input.TextArea rows={3} value={ticket?.notes} disabled />
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
