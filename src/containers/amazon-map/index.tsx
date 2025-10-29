"use client";

import * as React from "react";
import maplibregl from "maplibre-gl";
import { Button, Input } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useData } from "@rtrw-monitoring-system/hooks";
import { TICKET_SERVICE } from "@rtrw-monitoring-system/app/constants/api_url";
import { useGeolocated } from "react-geolocated";

const DEFAULT = { lat: -6.273429747830478, lng: 106.822463982675 };

const DashboardAmazonContainer = () => {
  const region = process.env.NEXT_PUBLIC_AWS_REGION || "ap-southeast-1";
  const mapName = process.env.NEXT_PUBLIC_AWS_MAP_NAME || "brainet_map";
  const apiKey = process.env.NEXT_PUBLIC_AWS_MAPS_API_KEY || "";

  const mapContainer = React.useRef<HTMLDivElement | null>(null);
  const mapRef = React.useRef<maplibregl.Map | null>(null);
  const markersRef = React.useRef<maplibregl.Marker[]>([]);

  const [selected, setSelected] = React.useState<any>(null);
  const [search, setSearch] = React.useState("");
  const [showLegend, setShowLegend] = React.useState(false);
  const [isMapReady, setIsMapReady] = React.useState(false);

  const { coords, isGeolocationEnabled } = useGeolocated({
    positionOptions: { enableHighAccuracy: true },
    userDecisionTimeout: 5000,
  });

  const [position, setPosition] = React.useState(DEFAULT);

  React.useEffect(() => {
    if (isGeolocationEnabled && coords) {
      setPosition({ lat: coords.latitude, lng: coords.longitude });
    }
  }, [coords, isGeolocationEnabled]);

  const {
    queryResult: { data: ticketData, isLoading },
  } = useData<TicketingAllResponse>(
    { url: TICKET_SERVICE.ticket_all },
    [TICKET_SERVICE.ticket_all],
    null,
    { enabled: true }
  );

  const tickets = React.useMemo(() => {
    if (!ticketData?.data) return [];
    return ticketData.data
      .filter(
        (t) => !isNaN(parseFloat(t.latitude)) && !isNaN(parseFloat(t.longitude))
      )
      .map((t) => ({
        id: t.id,
        ticketNumber: t.ticketNumber,
        lat: parseFloat(t.latitude),
        lng: parseFloat(t.longitude),
        status: t.status,
        district: t.district,
        subDistrict: t.subDistrict,
        potentialRevenue: t.details?.[0]?.potentialRevenue ?? 0,
        date: new Date(t.details?.[0]?.createdAt ?? "").toLocaleDateString(),
      }));
  }, [ticketData]);

  const initializeMap = React.useCallback(() => {
    if (!mapContainer.current || !region || !mapName || !apiKey) return;

    if (mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current!,
      style: `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${mapName}/style-descriptor?key=${apiKey}`,
      center: [position.lng, position.lat],
      zoom: 13,
    });

    mapRef.current = map;

    map.on("load", () => {
      console.log("✅ Amazon map loaded successfully");
      setIsMapReady(true);
      renderMarkers(map);
    });

    map.on("error", (e) => {
      console.error("❌ Map initialization error:", e);
    });
  }, [region, mapName, apiKey, position]);

  React.useLayoutEffect(() => {
    const timer = setTimeout(() => {
      initializeMap();
    }, 300);

    return () => clearTimeout(timer);
  }, [initializeMap]);

  React.useEffect(() => {
    if (!mapRef.current && mapContainer.current) {
      initializeMap();
    }
  }, [initializeMap]);

  React.useEffect(() => {
    if (isMapReady && mapRef.current) {
      renderMarkers(mapRef.current);
    }
  }, [isMapReady, tickets]);

  const renderMarkers = (map: maplibregl.Map) => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (!tickets.length) return;

    const bounds = new maplibregl.LngLatBounds();

    tickets.forEach((ticket) => {
      const el = document.createElement("div");
      el.className = "custom-marker";
      el.style.cssText = `
        width: 18px;
        height: 18px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 6px rgba(0,0,0,0.4);
        background-color: ${
          ticket.status === "OPEN"
            ? "#22c55e"
            : ticket.status === "FOLLOWED_UP"
            ? "#2563eb"
            : "#dc2626"
        };
        cursor: pointer;
        transition: transform 0.2s ease;
      `;

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([ticket.lng, ticket.lat])
        .addTo(map);

      markersRef.current.push(marker);
      bounds.extend([ticket.lng, ticket.lat]);

      el.addEventListener("click", () => {
        setSelected(ticket);
        map.flyTo({
          center: [ticket.lng, ticket.lat],
          zoom: 15,
          duration: 800,
        });
        scrollToCard(ticket.id);
      });
    });

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, { padding: 80, maxZoom: 14, duration: 1000 });
    }
  };

  const scrollToCard = (ticketId: string | number) => {
    const el = document.getElementById(`card-${ticketId}`);
    const container = document.getElementById("ticket-card-scroll");
    if (el && container) {
      el.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  };

  const handleCardClick = (ticket: any) => {
    setSelected(ticket);
    mapRef.current?.flyTo({
      center: [ticket.lng, ticket.lat],
      zoom: 15,
      duration: 800,
    });
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    const found = tickets.find((t) =>
      t.ticketNumber.toLowerCase().includes(value.toLowerCase())
    );
    if (found) {
      handleCardClick(found);
      scrollToCard(found.id);
    }
  };

  if (isLoading) return <div className="p-4">Loading tickets...</div>;

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden">
      <div className="absolute top-[50px] left-1/14 z-50 w-[400px] flex gap-2">
        <Input.Search
          placeholder="Search Ticket No."
          allowClear
          enterButton
          onSearch={handleSearch}
        />
        <Button
          onClick={() => {
            setSearch("");
            setSelected(null);
            mapRef.current?.flyTo({
              center: [DEFAULT.lng, DEFAULT.lat],
              zoom: 11,
            });
          }}
        >
          Reset View
        </Button>
      </div>

      <div className="absolute top-[50px] right-6 z-50">
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
            <span>Closed</span>
          </div>
        </div>
      )}

      <div
        ref={mapContainer}
        className="absolute inset-0"
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      />

      <div
        id="ticket-card-scroll"
        className="absolute bottom-5 left-0 right-0 px-5 py-2 flex gap-4 overflow-x-auto pb-3 scrollbar-hide z-50"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            id={`card-${ticket.id}`}
            onClick={() => handleCardClick(ticket)}
            className={`min-w-[320px] bg-white rounded-2xl shadow-md p-4 flex-shrink-0 cursor-pointer transition-all duration-300 scroll-snap-align-center ${
              selected?.id === ticket.id ? "ring-4 ring-red-500 scale-105" : ""
            }`}
          >
            <div className="flex items-center mb-2">
              <div
                className="w-4 h-4 rounded-full mr-2"
                style={{
                  backgroundColor:
                    ticket.status === "OPEN"
                      ? "#22c55e"
                      : ticket.status === "FOLLOWED_UP"
                      ? "#2563eb"
                      : "#dc2626",
                }}
              />
              <h3 className="font-semibold text-sm">#{ticket.ticketNumber}</h3>
            </div>
            <p className="text-xs text-gray-700">
              <b>Longitude:</b> {ticket.lng}
            </p>
            <p className="text-xs text-gray-700">
              <b>Latitude:</b> {ticket.lat}
            </p>
            <p className="text-xs text-gray-700">
              <b>Ticket Date:</b> {ticket.date}
            </p>
            <div className="flex gap-2 mt-3">
              <button className="bg-red-500 text-white text-xs px-3 py-1 rounded-md">
                Edit
              </button>
              <button className="border border-gray-300 text-xs px-3 py-1 rounded-md">
                Get Direction
              </button>
              <button className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-md">
                Street View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardAmazonContainer;
