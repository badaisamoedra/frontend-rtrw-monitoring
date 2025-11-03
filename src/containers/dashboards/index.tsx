"use client";

import {
  GoogleMap,
  Marker,
  InfoWindow,
  LoadScript,
} from "@react-google-maps/api";
import { Button, Card, Input } from "antd";
import * as React from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import { ModalTicket, ToastContent } from "@rtrw-monitoring-system/components";
import { useData } from "@rtrw-monitoring-system/hooks";
import { TICKET_SERVICE } from "@rtrw-monitoring-system/app/constants/api_url";
import { useTicketRepository } from "@rtrw-monitoring-system/services/ticket";
import ModalStreetView from "@rtrw-monitoring-system/components/modal/modal-street-view";
import { useGeolocated } from "react-geolocated";
import dayjs from "dayjs";
import { printDashIfNull } from "@rtrw-monitoring-system/utils";
import { toast } from "react-toastify";

const containerStyle = {
  width: "100%",
  height: "calc(100vh - 64px)",
};

const DEFAULT = {
  lat: -6.273429747830478,
  lng: 106.822463982675,
};

type ModalProps = {
  modalOpen: "EDIT" | "STREET" | "";
  ticket?: TicketingList;
  ticket_number?: string;
  image?: string;
};

const DashboardContainer = () => {
  const mapRef = React.useRef<any>(null);
  const [selected, setSelected] = React.useState<any>(null);
  const [search, setSearch] = React.useState("");
  const [highlighted, setHighlighted] = React.useState<string | null>(null);
  const [showLegend, setShowLegend] = React.useState(false);
  const [showModal, setShowModal] = React.useState<ModalProps>({
    modalOpen: "",
  });
  const { updateTicket } = useTicketRepository();
  const { coords, isGeolocationEnabled } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
    },
    watchLocationPermissionChange: true,
    userDecisionTimeout: 5000,
  });

  const [position, setPosition] = React.useState<Position>({
    lat: DEFAULT.lat,
    lng: DEFAULT.lng,
  });

  React.useEffect(() => {
    if (isGeolocationEnabled) {
      setPosition({ lat: coords?.latitude ?? 0, lng: coords?.longitude ?? 0 });
    }
  }, [coords]);

  const {
    queryResult: { data: dataTicket, refetch },
  } = useData<TicketingAllResponse>(
    { url: TICKET_SERVICE.ticket_all },
    [TICKET_SERVICE.ticket_all],
    null
  );

  const tickets = React.useMemo(() => {
    if (!dataTicket?.data) return [];
    return dataTicket.data
      .filter((t) => {
        const lat = parseFloat(t.latitude);
        const lng = parseFloat(t.longitude);
        return !isNaN(lat) && !isNaN(lng);
      })
      .map((t) => ({
        id: t.id,
        ticketNumber: t.ticketNumber,
        ticketDesc: t.ticketDesc,
        userId: t.userId,
        lat: parseFloat(t.latitude),
        lng: parseFloat(t.longitude),
        status: t.status,
        district: t.district,
        subDistrict: t.subDistrict,
        details: t.details,
        streetView:
          "https://dev-broom-bucket.s3.ap-southeast-3.amazonaws.com/TASK_MANAGER/ENGINE-PHOTO/e7eff5b9-44b0-4a9a-94cc-02391355e1e5/0509a67a-7f22-4c96-bf80-f06c3e579851-1757591503017.jpg",
      }));
  }, [dataTicket]);

  const handleSaveTicket = async (updatedTicket: UpdateTicketPayload) => {
    try {
      const payload: UpdateTicketPayload = {
        id: updatedTicket.id,
        status: updatedTicket.status,
        district: updatedTicket.district,
        latitude: updatedTicket.lat ?? "",
        longitude: updatedTicket.lng ?? "",
        subDistrict: updatedTicket.subDistrict,
        ticketDesc: updatedTicket.ticketDesc,
        ticketNumber: updatedTicket.ticketNumber,
        details: [
          {
            id: updatedTicket.details?.[0]?.id,
            potentialHigh: updatedTicket.details?.[0]?.potentialHigh,
            potentialLow: updatedTicket.details?.[0]?.potentialLow,
            threeMonth: updatedTicket.details?.[0]?.threeMonth,
            potentialRevenue: updatedTicket.details?.[0]?.potentialRevenue,
            notes: updatedTicket.details?.[0]?.notes,
          },
        ],
      };

      await updateTicket.mutateAsync(payload);

      toast.success(
        <ToastContent description="Data user berhasil diperbarui" />
      );

      refetch();
      setShowModal({ modalOpen: "" });
    } catch (error: any) {
      toast.error(
        <ToastContent
          type="error"
          description={error.response?.data?.message}
        />
      );
    }
  };

  const fitAllMarkers = React.useCallback(
    (map: any, list = tickets) => {
      if (list.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        list.forEach((t) => bounds.extend({ lat: t.lat, lng: t.lng }));
        map.fitBounds(bounds);
      }
    },
    [tickets]
  );

  const onLoad = React.useCallback(
    (map: any) => {
      mapRef.current = map;
      map.setMapTypeId("roadmap");
      if (tickets.length > 0) fitAllMarkers(map, tickets);
    },
    [fitAllMarkers, tickets]
  );

  const handleSearch = React.useCallback(
    (value: string) => {
      setSearch(value);
      if (!value) {
        setHighlighted(null);
        if (mapRef.current) fitAllMarkers(mapRef.current, tickets);
        return;
      }
      const foundTicket = tickets.find((t) => t.ticketNumber.includes(value));
      if (foundTicket && mapRef.current) {
        mapRef.current.panTo({ lat: foundTicket.lat, lng: foundTicket.lng });
        mapRef.current.setZoom(18);
        setSelected(foundTicket);
        setHighlighted(foundTicket.ticketNumber);
      } else {
        setHighlighted(null);
      }
    },
    [fitAllMarkers, tickets]
  );

  const filteredTickets = search
    ? tickets.filter((t) => t.ticketNumber.includes(search))
    : tickets;

  const dotStatus = (value: string) => {
    switch (value) {
      case "New":
      case "OPEN":
        return (
          <span className="inline-block w-4 h-4 rounded-full bg-green-600"></span>
        );
      case "FOLLOWED_UP":
        return (
          <span className="inline-block w-4 h-4 rounded-full bg-blue-600"></span>
        );
      case "NO_RESPONSE":
        return (
          <span className="inline-block w-4 h-4 rounded-full bg-red-600"></span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="absolute top-[80px] left-2/10 z-50 w-[400px] flex gap-2">
        <Input.Search
          placeholder="Search Ticket No."
          allowClear
          enterButton
          onSearch={handleSearch}
          onChange={(e) => {
            if (!e.target.value) handleSearch("");
          }}
        />
        <Button
          onClick={() => {
            setSearch("");
            setHighlighted(null);
            if (mapRef.current) fitAllMarkers(mapRef.current, tickets);
          }}
        >
          Reset View
        </Button>
      </div>

      <div className="absolute top-[80px] right-6 z-50">
        <Button
          icon={<InfoCircleOutlined />}
          onClick={() => setShowLegend((prev) => !prev)}
        >
          Legend
        </Button>
      </div>

      {showLegend && (
        <div className="absolute top-[130px] right-6 bg-white shadow-md rounded p-3 text-sm space-y-1 z-50 w-[200px]">
          <h4 className="font-semibold mb-2">Legend Information</h4>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-green-600"></span>
            <span>Open</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-blue-600"></span>
            <span>Followed Up</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-red-600"></span>
            <span>No Response</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-yellow-400"></span>
            <span>Search Result</span>
          </div>
        </div>
      )}

      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={position}
          zoom={17}
          onLoad={onLoad}
          mapTypeId="roadmap"
          options={{ disableDefaultUI: true }}
        >
          {filteredTickets.map((ticket) => (
            <Marker
              key={ticket.id}
              position={{ lat: ticket.lat, lng: ticket.lng }}
              onClick={() => setSelected(ticket)}
              icon={{
                url:
                  highlighted === ticket.ticketNumber
                    ? "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
                    : ticket.status === "OPEN"
                    ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                    : ticket.status === "FOLLOWED_UP"
                    ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                    : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                scaledSize:
                  highlighted === ticket.ticketNumber
                    ? new google.maps.Size(50, 50)
                    : new google.maps.Size(32, 32),
              }}
              animation={
                highlighted === ticket.ticketNumber
                  ? google.maps.Animation.BOUNCE
                  : undefined
              }
            />
          ))}

          {selected && (
            <InfoWindow
              position={{ lat: selected.lat, lng: selected.lng }}
              onCloseClick={() => setSelected(null)}
            >
              <Card size="small" className="w-74">
                <div className="flex flex-row items-center gap-2 mb-2">
                  {dotStatus(selected.status)}
                  <h1 className="font-bold text-black">{`#${selected.ticketNumber}`}</h1>
                </div>
                <div className="gap-6">
                  <p>
                    <b>Longitude:</b> {selected.lng}
                  </p>
                  <p>
                    <b>Latitude:</b> {selected.lat}
                  </p>
                  <p>
                    <b>Ticket Date:</b>{" "}
                    {selected.details?.[0]?.createdAt
                      ? dayjs(selected.details?.[0]?.createdAt).format(
                          "DD-MMM-YYYY"
                        )
                      : printDashIfNull(undefined)}
                  </p>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    onClick={() =>
                      setShowModal({
                        modalOpen: "EDIT",
                        ticket: selected,
                      })
                    }
                    type="primary"
                    danger
                    size="small"
                  >
                    Edit
                  </Button>
                  <Button size="small">Get Direction</Button>
                  <Button
                    onClick={() =>
                      setShowModal({
                        modalOpen: "STREET",
                        image: selected.streetView,
                        ticket_number: selected.id,
                      })
                    }
                    type="dashed"
                    size="small"
                  >
                    Street View
                  </Button>
                </div>
              </Card>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>

      {/* <ModalStreetView
        open={showModal.modalOpen === "STREET"}
        image={showModal.image ?? ""}
        ticketNumber={showModal.ticket_number ?? ""}
        onClose={() => setShowModal({ modalOpen: "" })}
      /> */}
      <ModalTicket
        open={showModal.modalOpen === "EDIT"}
        ticket={showModal.ticket}
        section="EDIT"
        onClose={() => setShowModal({ modalOpen: "" })}
        onSave={handleSaveTicket}
      />
    </div>
  );
};

export default DashboardContainer;
