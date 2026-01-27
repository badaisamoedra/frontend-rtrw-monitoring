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
  onClick?: (resellerNumber: string) => void;
}

const ListStatus = [
  { value: "RESELLER_ACTIVE", label: "Reseller Active" },
  { value: "RESELLER_NOT_ACTIVE", label: "Reseller Not Active" },
  { value: "NEGOTIATION", label: "Negotiation" },
  { value: "NOT_DEAL", label: "Not Deal" },
  { value: "SIGNED_PKS", label: "Signed PKS" },
];

const ModalTicket: React.FC<ModalTicketProps> = ({
  open,
  onClose,
  onSave,
  ticket,
  section,
  onClick,
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

  const marketShareBreakDown = ticket?.marketshareBreakdown;
  const validateLowHigh = React.useCallback((data: any) => {
    const next = {
      potentialHigh: "",
      potentialLow: "",
    };

    const low = data?.potentialLow;
    const high = data?.potentialHigh;

    if (
      low !== undefined &&
      low !== null &&
      low !== "" &&
      high !== undefined &&
      high !== null &&
      high !== ""
    ) {
      if (Number(low) > Number(high)) {
        next.potentialLow = "Nilai Low tidak boleh lebih besar dari High.";
      }
    }

    return next;
  }, []);

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

    const lh = validateLowHigh(ticket);
    setErrors((prev) => ({
      ...prev,
      potentialHigh: lh.potentialHigh,
      potentialLow: lh.potentialLow,
    }));
  }, [ticket]);

  const handleChange = (field: string, value: any) => {
    setEditedTicket((prev: any) => {
      const updated = { ...prev, [field]: value };

      if (field === "potentialLow" && updated.potentialHigh !== undefined) {
        if (Number(value) > Number(updated.potentialHigh)) {
          setErrors((prev) => ({
            ...prev,
            potentialHigh: "Nilai High tidak boleh lebih besar dari Low.",
          }));
        } else {
          setErrors((prev) => ({ ...prev, potentialHigh: "" }));
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

      if (value === null || value === undefined || value === "") {
        setErrors((prev) => ({
          ...prev,
          [field]: "Field ini wajib diisi.",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
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
      title={section === "EDIT" ? "Edit Reseller" : "View Ticket"}
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
      centered
    >
      <div className="px-2">
        <Row gutter={12} className="mb-3">
          <Col span={12}>
            <Text strong>Reseller No.</Text>
            <Input value={editedTicket?.resellerNumber ?? "-"} disabled />
          </Col>
          <Col span={12}>
            <Text strong>Tanggal</Text>
            <Input
              value={dayjs(editedTicket?.createdAt).format(
                "DD-MMM-YYYY HH:mm:ss",
              )}
              disabled
            />
          </Col>
        </Row>

        <Row gutter={12} className="mb-3">
          <Col span={12}>
            <Text strong>Longitude</Text>
            <Input value={editedTicket?.longitude ?? "-"} disabled />
          </Col>
          <Col span={12}>
            <Text strong>Latitude</Text>
            <Input value={editedTicket?.latitude ?? "-"} disabled />
          </Col>
        </Row>

        <Row gutter={12} className="mb-3">
          <Col span={12}>
            <Text strong>Data IP</Text>
            <Input value="-" disabled />
          </Col>
          <Col span={12}>
            <Text strong>Alamat Point of Sales (PoS)</Text>
            <Input value="-" disabled />
          </Col>
        </Row>

        <Row gutter={12} className="mb-3">
          <Col span={12}>
            <Text strong>Area</Text>
            <Input value="-" disabled />
          </Col>
          <Col span={12}>
            <Text strong>Region</Text>
            <Input value="-" disabled />
          </Col>
        </Row>

        <Row gutter={12} className="mb-3">
          <Col span={12}>
            <Text strong>Branch</Text>
            <Input value="-" disabled />
          </Col>
          <Col span={12}>
            <Text strong>Cluster</Text>
            <Input value="-" disabled />
          </Col>
        </Row>

        <Row gutter={12} className="mb-3">
          <Col span={12}>
            <Text strong>Kabupaten</Text>
            <Input value={editedTicket?.province ?? "-"} disabled />
          </Col>
          <Col span={12}>
            <Text strong>Kecamatan</Text>
            <Input value={editedTicket?.district ?? "-"} disabled />
          </Col>
        </Row>

        <Row gutter={12} className="mb-3">
          <Col span={12}>
            <Text strong>Kelurahan / Desa</Text>
            <Input value={editedTicket?.city ?? "-"} disabled />
          </Col>

          <Col span={12}>
            <Text strong>Status</Text>
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

        <Row gutter={12} className="mb-3">
          <Col span={12}>
            <Text strong>Potential High</Text>
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

          <Col span={12}>
            <Text strong>Potential Low</Text>
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

        <Row gutter={12} className="mb-3">
          <Col span={12}>
            <Text strong>ARPU 3 Months</Text>
            <Input
              addonBefore="IDR"
              value={numberWithDots(editedTicket?.potentialThreeMonth)}
              disabled={section === "VIEW"}
              onChange={(e) =>
                handleChange(
                  "potentialThreeMonth",
                  removeNonNumeric(e.target.value),
                )
              }
            />
            {errors.potentialThreeMonth && (
              <Text type="danger" style={{ color: "red" }}>
                {errors.potentialThreeMonth}
              </Text>
            )}
          </Col>

          <Col span={12}>
            <Text strong>Potential Revenue</Text>
            <Input
              addonBefore="IDR"
              value={numberWithDots(editedTicket?.potentialRevenue)}
              disabled={section === "VIEW"}
              onChange={(e) =>
                handleChange(
                  "potentialRevenue",
                  removeNonNumeric(e.target.value),
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

        <Row gutter={[12, 12]} className="mb-3">
          <Col span={24}>
            <Text strong>Market Share Breakdown</Text>
          </Col>

          {marketShareBreakDown?.isp_breakdown?.map(
            (item: any, index: number) => (
              <Col key={index} span={24}>
                <div className="flex gap-3 items-center">
                  <Input value={item.isp_name} disabled style={{ flex: 2 }} />
                  <Input
                    value={`${item.device_count} Device`}
                    disabled
                    style={{ flex: 1, textAlign: "center" }}
                  />
                  <Input
                    value={`${item.isp_home_marketshare}%`}
                    disabled
                    style={{ flex: 1, textAlign: "center" }}
                  />
                </div>
              </Col>
            ),
          )}
        </Row>

        <Row className="mb-3">
          <Col span={24}>
            <Text strong>Catatan</Text>
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
          <div className="flex justify-between mt-4">
            <Button
              onClick={() => onClick?.(editedTicket?.resellerNumber)}
              style={{
                borderWidth: 1,
                borderColor: "#000000",
                color: "#000000",
              }}
            >
              Data Pelanggan
            </Button>
            <div className="flex justify-end gap-2">
              <Button
                type="primary"
                onClick={handleSave}
                disabled={!isFormValid}
              >
                Simpan
              </Button>
              <Button onClick={onClose}>Batal</Button>
            </div>
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
