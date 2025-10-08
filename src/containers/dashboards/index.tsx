"use client";

import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { Button, Card, Input } from "antd";
import * as React from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import { ModalTicket } from "@rtrw-monitoring-system/components";
import { useData } from "@rtrw-monitoring-system/hooks";
import { TICKET_SERVICE } from "@rtrw-monitoring-system/app/constants/api_url";

const containerStyle = {
  width: "100%",
  height: "calc(100vh - 64px)",
};

// center default
const center = {
  lat: 35.6668952,
  lng: 139.6720165,
};

// mock data tiket (nanti dari backend)
const tickets = [
  {
    id: "14337210188",
    lat: 35.666952,
    lng: 139.67214,
    status: "New",
    date: "25-Sep-2025",
  },
  {
    id: "14337210129",
    lat: 35.666972,
    lng: 139.6733636,
    status: "Followed Up",
    date: "24-Sep-2025",
  },
  {
    id: "14337210326",
    lat: 35.666972,
    lng: 139.6733636,
    status: "No Response",
    date: "22-Sep-2025",
  },
];

const DashboardContainer = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const mapRef = React.useRef<any>(null);
  const [selected, setSelected] = React.useState<any>(null);
  const [search, setSearch] = React.useState("");
  const [highlighted, setHighlighted] = React.useState<string | null>(null);
  const [showLegend, setShowLegend] = React.useState(false);
  const [showModalEdit, setShowModalEdit] = React.useState(false);

  const {
    queryResult: { data: dataTicket },
  } = useData<TicketingAllResponse>(
    { url: TICKET_SERVICE.ticket_all },
    [TICKET_SERVICE.ticket_all],
    null
  );

  console.log("DATA TICKET: ", dataTicket?.data);

  const fitAllMarkers = React.useCallback((map: any, list = tickets) => {
    if (list.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      list.forEach((t) => bounds.extend({ lat: t.lat, lng: t.lng }));
      map.fitBounds(bounds);
    }
  }, []);

  const onLoad = React.useCallback(
    (map: any) => {
      mapRef.current = map;
      fitAllMarkers(map, tickets);
    },
    [fitAllMarkers]
  );

  const handleSearch = React.useCallback(
    (value: string) => {
      setSearch(value);

      if (!value) {
        setHighlighted(null);
        if (mapRef.current) fitAllMarkers(mapRef.current, tickets);
        return;
      }

      const foundTicket = tickets.find((t) => t.id.includes(value));
      if (foundTicket && mapRef.current) {
        mapRef.current.panTo({ lat: foundTicket.lat, lng: foundTicket.lng });
        mapRef.current.setZoom(18);
        setSelected(foundTicket);
        setHighlighted(foundTicket.id);
      } else {
        setHighlighted(null);
      }
    },
    [fitAllMarkers]
  );

  const filteredTickets = search
    ? tickets.filter((t) => t.id.includes(search))
    : tickets;

  React.useEffect(() => {
    if (mapRef.current && filteredTickets.length > 0) {
      fitAllMarkers(mapRef.current, filteredTickets);
    }
  }, [filteredTickets, fitAllMarkers]);

  const dotStatus = (value: string) => {
    switch (value) {
      case "New":
        return (
          <span className="inline-block w-4 h-4 rounded-full bg-green-600"></span>
        );
      case "Followed Up":
        return (
          <span className="inline-block w-4 h-4 rounded-full bg-blue-600"></span>
        );
      case "No Response":
        return (
          <span className="inline-block w-4 h-4 rounded-full bg-red-600"></span>
        );
      default:
        break;
    }
  };

  if (!isLoaded) return <div className="p-4">Loading Maps...</div>;

  return (
    <div className="flex flex-col h-full w-full">
      {/* Search + Reset View */}
      <div className="absolute top-[80px] left-2/10 z-50 w-[400px] flex gap-2">
        <Input.Search
          placeholder="Search Ticket No."
          allowClear
          enterButton
          onSearch={handleSearch}
          onChange={(e) => {
            if (!e.target.value) {
              handleSearch("");
            }
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

      {/* Legend Toggle Button */}
      <div className="absolute top-[80px] right-6 z-50">
        <Button
          icon={<InfoCircleOutlined />}
          onClick={() => setShowLegend((prev) => !prev)}
        >
          Legend
        </Button>
      </div>

      {/* Legend Popup */}
      {showLegend && (
        <div className="absolute top-[130px] right-6 bg-white shadow-md rounded p-3 text-sm space-y-1 z-50 w-[200px]">
          <h4 className="font-semibold mb-2">Legend Information</h4>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-green-600"></span>
            <span>New</span>
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

      {/* Google Map */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={17}
        onLoad={onLoad}
        options={{ disableDefaultUI: true }}
      >
        {filteredTickets.map((ticket) => (
          <Marker
            key={ticket.id}
            position={{ lat: ticket.lat, lng: ticket.lng }}
            onClick={() => setSelected(ticket)}
            icon={{
              url:
                highlighted === ticket.id
                  ? "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
                  : ticket.status === "New"
                  ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                  : ticket.status === "Followed Up"
                  ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                  : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
              scaledSize:
                highlighted === ticket.id
                  ? new google.maps.Size(50, 50)
                  : new google.maps.Size(32, 32),
            }}
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
                <h1 className="font-bold text-black">{`#${selected.id}`}</h1>
              </div>
              <div className="gap-6">
                <p>
                  <b>Longitude:</b> {selected.lng}
                </p>
                <p>
                  <b>Latitude:</b> {selected.lat}
                </p>
                <p>
                  <b>Ticket Date:</b> {selected.date}
                </p>
              </div>
              <div className="flex gap-2 mt-2">
                <Button type="primary" danger size="small">
                  Edit
                </Button>
                <Button size="small">Get Direction</Button>
                <Button type="dashed" size="small">
                  Street View
                </Button>
              </div>
            </Card>
          </InfoWindow>
        )}
      </GoogleMap>
      {/* <ModalTicket
        open={showModalEdit}
        onClose={() => setShowModalEdit(false)}
        ticket={selectedTicket}
        section="EDIT"
      /> */}
    </div>
  );
};

export default DashboardContainer;
