"use client";

import {
  numberWithDots,
  removeNonNumeric,
  toRupiah,
} from "@rtrw-monitoring-system/utils";
import { Modal, Row, Col, Input, Button, Typography, Select } from "antd";
import dayjs from "dayjs";
import React from "react";

const { Text } = Typography;

interface ModalTicketProps {
  open: boolean;
  onClose: () => void;
  onSave?: (updatedTicket: TicketingList) => void;
  ticket?: TicketingList;
  section: "VIEW" | "EDIT";
}

const ListStatus = [
  { value: "OPEN", label: "Open" },
  { value: "FOLLOWED_UP", label: "Followed Up" },
  { value: "NO_RESPONSE", label: "No Response" },
];

const ModalTicket: React.FC<ModalTicketProps> = ({
  open,
  onClose,
  onSave,
  ticket,
  section,
}) => {
  const [editedTicket, setEditedTicket] = React.useState(ticket);
  const [errors, setErrors] = React.useState({
    potentialHigh: "",
    potentialLow: "",
    threeMonth: "",
    potentialRevenue: "",
    status: "",
    notes: "",
  });

  React.useEffect(() => {
    setEditedTicket(ticket);
    setErrors({
      potentialHigh: "",
      potentialLow: "",
      threeMonth: "",
      potentialRevenue: "",
      status: "",
      notes: "",
    });
  }, [ticket]);

  const handleChange = (field: string, value: any) => {
    setEditedTicket((prev: any) => ({
      ...prev,
      details: [
        {
          ...prev.details?.[0],
          [field]: value,
        },
      ],
    }));

    if (!value || value === "") {
      setErrors((prev) => ({ ...prev, [field]: "Field ini wajib diisi." }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleStatusChange = (val: string) => {
    setEditedTicket((prev: any) => ({ ...prev, status: val }));
    setErrors((prev) => ({
      ...prev,
      status: val ? "" : "Field ini wajib diisi.",
    }));
  };

  const isFormValid =
    !errors.potentialHigh &&
    !errors.potentialLow &&
    !errors.status &&
    !errors.notes &&
    editedTicket?.details?.[0]?.potentialHigh &&
    editedTicket?.details?.[0]?.potentialLow &&
    editedTicket?.status &&
    editedTicket?.details?.[0]?.notes;

  const handleSave = () => {
    if (!isFormValid) return;
    if (onSave) onSave(editedTicket);
    onClose();
  };

  return (
    <Modal
      title={section === "EDIT" ? "Edit Ticket" : "View Ticket"}
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
      centered
    >
      <div className="px-2">
        <Row className="mb-3">
          <Col span={8}>
            <Text strong>Ticket No.</Text>
          </Col>
          <Col span={16}>
            <Input value={editedTicket?.ticketNumber} disabled />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col span={8}>
            <Text strong>Longitude</Text>
          </Col>
          <Col span={16}>
            <Input
              value={
                section === "EDIT" ? editedTicket?.lng : editedTicket?.longitude
              }
              disabled
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col span={8}>
            <Text strong>Latitude</Text>
          </Col>
          <Col span={16}>
            <Input
              value={
                section === "EDIT" ? editedTicket?.lat : editedTicket?.latitude
              }
              disabled
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col span={8}>
            <Text strong>Ticket Date</Text>
          </Col>
          <Col span={16}>
            <Input
              value={dayjs(editedTicket?.details?.[0]?.createdAt).format(
                "DD-MMM-YYYY HH:mm:ss"
              )}
              disabled
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col span={8}>
            <Text strong>Kabupaten</Text>
          </Col>
          <Col span={16}>
            <Input value={editedTicket?.district} disabled />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col span={8}>
            <Text strong>Kecamatan</Text>
          </Col>
          <Col span={16}>
            <Input value={editedTicket?.subDistrict} disabled />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col span={8}>
            <Text strong>Kelurahan / Desa</Text>
          </Col>
          <Col span={16}>
            <Input value={editedTicket?.subDistrict} disabled />
          </Col>
        </Row>

        <Row className="mb-3" gutter={12}>
          <Col span={8}>
            <Text strong>Potential</Text>
          </Col>
          <Col span={8}>
            <Input
              addonBefore="High"
              value={editedTicket?.details?.[0]?.potentialHigh}
              disabled={section === "VIEW"}
              onChange={(e) =>
                handleChange("potentialHigh", Number(e.target.value))
              }
            />
            {errors.potentialHigh && (
              <Text type="danger" style={{ color: "red" }}>
                {errors.potentialHigh}
              </Text>
            )}
          </Col>
          <Col span={8}>
            <Input
              addonBefore="Low"
              value={editedTicket?.details?.[0]?.potentialLow}
              disabled={section === "VIEW"}
              onChange={(e) =>
                handleChange("potentialLow", Number(e.target.value))
              }
            />
            {errors.potentialLow && (
              <Text type="danger" style={{ color: "red" }}>
                {errors.potentialLow}
              </Text>
            )}
          </Col>
        </Row>

        <Row className="mb-3">
          <Col span={8}>
            <Text strong>ARPU 3 months</Text>
          </Col>
          <Col span={16}>
            <Input
              addonBefore="IDR"
              value={numberWithDots(editedTicket?.details?.[0]?.threeMonth)}
              onChange={(e) =>
                handleChange("threeMonth", removeNonNumeric(e.target.value))
              }
            />
            {errors.threeMonth && (
              <Text type="danger" style={{ color: "red" }}>
                {errors.threeMonth}
              </Text>
            )}
          </Col>
        </Row>

        <Row className="mb-3">
          <Col span={8}>
            <Text strong>Potential Revenue</Text>
          </Col>
          <Col span={16}>
            <Input
              addonBefore="IDR"
              value={numberWithDots(
                editedTicket?.details?.[0]?.potentialRevenue
              )}
              disabled={section === "VIEW"}
              onChange={(e) =>
                handleChange(
                  "potentialRevenue",
                  removeNonNumeric(e.target.value)
                )
              }
            />
            {errors.potentialRevenue && (
              <Text type="danger" style={{ color: "red" }}>
                {errors.potentialRevenue}
              </Text>
            )}
          </Col>
        </Row>

        <Row className="mb-3">
          <Col span={8}>
            <Text strong>Status</Text>
          </Col>
          <Col span={16}>
            <Select
              value={editedTicket?.status}
              onChange={handleStatusChange}
              style={{ width: "100%" }}
              options={ListStatus}
              disabled={section === "VIEW"}
            />
            {errors.status && (
              <Text type="danger" style={{ color: "red" }}>
                {errors.status}
              </Text>
            )}
          </Col>
        </Row>

        <Row className="mb-3">
          <Col span={8}>
            <Text strong>Catatan</Text>
          </Col>
          <Col span={16}>
            <Input.TextArea
              rows={3}
              value={editedTicket?.details?.[0]?.notes}
              disabled={section === "VIEW"}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
            {errors.notes && (
              <Text type="danger" style={{ color: "red" }}>
                {errors.notes}
              </Text>
            )}
          </Col>
        </Row>

        {section === "EDIT" ? (
          <div className="flex justify-end gap-2 mt-4">
            <Button type="primary" onClick={handleSave} disabled={!isFormValid}>
              Simpan
            </Button>
            <Button onClick={onClose}>Batal</Button>
          </div>
        ) : (
          <div className="flex justify-end mt-4">
            <Button onClick={onClose}>Tutup</Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ModalTicket;
