"use client";

import {
  numberWithDots,
  removeNonNumeric,
} from "@rtrw-monitoring-system/utils";
import { Modal, Row, Col, Input, Button, Typography, Select } from "antd";
import dayjs from "dayjs";
import React from "react";

const { Text } = Typography;

interface ModalTicketProps {
  open: boolean;
  onClose: () => void;
  onSave?: (updatedReseller: UpdateResellerPayload) => void;
  ticket?: any;
  section: "VIEW" | "EDIT";
}

const ListStatus = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "In Active" },
  { value: "REJECT", label: "Reject" },
  { value: "PENDING", label: "Pending" },
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
    potentialThreeMonth: "",
    potentialRevenue: "",
    status: "",
    notes: "",
  });

  React.useEffect(() => {
    setEditedTicket(ticket);
    setErrors({
      potentialHigh: "",
      potentialLow: "",
      potentialThreeMonth: "",
      potentialRevenue: "",
      status: "",
      notes: "",
    });
  }, [ticket]);

  const handleChange = (field: string, value: any) => {
    setEditedTicket((prev: any) => {
      const updated = { ...prev, [field]: value };

      if (field === "potentialLow" && updated.potentialHigh !== undefined) {
        if (Number(value) > Number(updated.potentialHigh)) {
          setErrors((prev) => ({
            ...prev,
            potentialLow: "Nilai Low tidak boleh lebih besar dari High.",
          }));
        } else {
          setErrors((prev) => ({ ...prev, potentialLow: "" }));
        }
      }

      if (field === "potentialHigh" && updated.potentialLow !== undefined) {
        if (Number(updated.potentialLow) > Number(value)) {
          setErrors((prev) => ({
            ...prev,
            potentialLow: "Nilai Low tidak boleh lebih besar dari High.",
          }));
        } else {
          setErrors((prev) => ({ ...prev, potentialLow: "" }));
        }
      }

      if (!value || value === "") {
        setErrors((prev) => ({ ...prev, [field]: "Field ini wajib diisi." }));
      } else if (field !== "potentialLow" && field !== "potentialHigh") {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }

      return updated;
    });
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
    !errors.potentialThreeMonth &&
    !errors.potentialRevenue &&
    !errors.status &&
    !errors.notes &&
    editedTicket?.potentialHigh &&
    editedTicket?.potentialLow &&
    editedTicket?.potentialThreeMonth &&
    editedTicket?.potentialRevenue &&
    editedTicket?.status &&
    editedTicket?.notes;

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
            <Input value={editedTicket?.resellerNumber ?? "-"} disabled />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col span={8}>
            <Text strong>Longitude</Text>
          </Col>
          <Col span={16}>
            <Input value={editedTicket?.longitude ?? "-"} disabled />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col span={8}>
            <Text strong>Latitude</Text>
          </Col>
          <Col span={16}>
            <Input value={editedTicket?.latitude ?? "-"} disabled />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col span={8}>
            <Text strong>Ticket Date</Text>
          </Col>
          <Col span={16}>
            <Input
              value={dayjs(editedTicket?.createdAt).format(
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
            <Input value={editedTicket?.province ?? "-"} disabled />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col span={8}>
            <Text strong>Kecamatan</Text>
          </Col>
          <Col span={16}>
            <Input value={editedTicket?.district ?? "-"} disabled />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col span={8}>
            <Text strong>Kelurahan / Desa</Text>
          </Col>
          <Col span={16}>
            <Input value={editedTicket?.city ?? "-"} disabled />
          </Col>
        </Row>

        <Row className="mb-3" gutter={12}>
          <Col span={8}>
            <Text strong>Potential</Text>
          </Col>
          <Col span={8}>
            <Input
              addonBefore="High"
              value={editedTicket?.potentialHigh ?? 0}
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
              value={editedTicket?.potentialLow ?? 0}
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
              value={numberWithDots(editedTicket?.potentialThreeMonth)}
              onChange={(e) =>
                handleChange(
                  "potentialThreeMonth",
                  removeNonNumeric(e.target.value)
                )
              }
            />
            {errors.potentialThreeMonth && (
              <Text type="danger" style={{ color: "red" }}>
                {errors.potentialThreeMonth}
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
              value={numberWithDots(editedTicket?.potentialRevenue)}
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
              value={editedTicket?.notes}
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
