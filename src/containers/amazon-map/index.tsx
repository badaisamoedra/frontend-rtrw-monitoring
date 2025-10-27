"use client";

import * as React from "react";
import maplibregl from "maplibre-gl";
import { Button, Card, Input } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useData } from "@rtrw-monitoring-system/hooks";
import { TICKET_SERVICE } from "@rtrw-monitoring-system/app/constants/api_url";
import { useGeolocated } from "react-geolocated";

const DEFAULT = {
  lat: -6.273429747830478,
  lng: 106.822463982675,
};

const DashboardAmazonContainer = () => {
  const region = process.env.NEXT_PUBLIC_AWS_REGION || "";
  const mapName = process.env.NEXT_PUBLIC_AWS_MAP_NAME;
  const apiKey = process.env.NEXT_PUBLIC_AWS_MAPS_API_KEY || "";
  const mapContainer = React.useRef<HTMLDivElement | null>(null);
  const mapRef = React.useRef<maplibregl.Map | null>(null);

  const [selected, setSelected] = React.useState<any>(null);
  const [search, setSearch] = React.useState("");
  const [highlighted, setHighlighted] = React.useState<string | null>(null);
  const [showLegend, setShowLegend] = React.useState(false);

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
        potentialHigh: t.details?.[0]?.potentialHigh ?? 0,
        potentialLow: t.details?.[0]?.potentialLow ?? 0,
        potentialRevenue: t.details?.[0]?.potentialRevenue ?? 0,
        date: new Date(t.details?.[0]?.createdAt ?? "").toLocaleString(),
      }));
  }, [ticketData]);

  React.useEffect(() => {
    if (!mapContainer.current || !region || !mapName || !apiKey) return;

    if (mapRef.current && typeof mapRef.current.remove === "function") {
      try {
        mapRef.current.remove();
      } catch (err) {
        console.warn("⚠️ Failed to clean map instance:", err);
      }
      mapRef.current = null;
    }

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${mapName}/style-descriptor?key=${apiKey}`,
      center: position,
      zoom: 16,
    });

    mapRef.current = map;

    map.on("load", () => {
      const renderMarkers = () => {
        if (!tickets?.length) return;

        document
          .querySelectorAll(".custom-marker")
          .forEach((el) => el.remove());

        tickets.forEach((ticket) => {
          const el = document.createElement("div");
          el.className = "custom-marker";

          el.style.cssText = `
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 0 4px rgba(0,0,0,0.4);
            background-color: ${
              ticket.status === "OPEN"
                ? "#16a34a"
                : ticket.status === "FOLLOWED_UP"
                ? "#2563eb"
                : "#dc2626"
            };
          `;

          el.setAttribute("title", `${ticket.ticketNumber} (${ticket.status})`);

          new maplibregl.Marker({ element: el })
            .setLngLat([Number(ticket.lng), Number(ticket.lat)])
            .addTo(map);
        });
      };

      renderMarkers();

      const observer = new MutationObserver(() => renderMarkers());
      const interval = setInterval(() => {
        if (tickets.length > 0) renderMarkers();
      }, 1000);

      return () => {
        clearInterval(interval);
        observer.disconnect();
        document
          .querySelectorAll(".custom-marker")
          .forEach((el) => el.remove());
      };
    });

    map.on("error", (e) => {
      console.error("❌ Map Error:", e);
    });

    return () => {
      map.remove();
    };
  }, [region, mapName, apiKey, tickets]);

  const handleSearch = (value: string) => {
    setSearch(value);
    if (!value || tickets.length === 0) return;

    const found = tickets.find((t) => t.ticketNumber.includes(value));
    if (found && mapRef.current) {
      mapRef.current.flyTo({
        center: [found.lng, found.lat],
        zoom: 16,
        speed: 0.8,
      });
      setHighlighted(found.id);
      setSelected(found);
    }
  };

  if (isLoading) return <div className="p-4">Loading tickets...</div>;

  return (
    <div className="flex flex-col h-full w-full relative">
      {/* Search + Reset */}
      <div className="absolute top-[80px] left-1/10 z-50 w-[400px] flex gap-2">
        <Input.Search
          placeholder="Search Ticket No."
          allowClear
          enterButton
          onSearch={handleSearch}
          onChange={(e) => {
            if (!e.target.value) {
              setHighlighted(null);
              setSearch("");
            }
          }}
        />
        <Button
          onClick={() => {
            setSearch("");
            setHighlighted(null);
            mapRef.current?.flyTo({ center: [106.816666, -6.2], zoom: 11 });
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

      <div ref={mapContainer} className="w-full h-[calc(100vh-64px)]" />

      {selected && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white shadow-md rounded-lg p-4 w-[320px] z-50">
          <Card title={`#${selected.ticketNumber}`} size="small">
            <p>
              <b>Status:</b> {selected.status}
            </p>
            <p>
              <b>District:</b> {selected.district}
            </p>
            <p>
              <b>Sub-District:</b> {selected.subDistrict}
            </p>
            <p>
              <b>Potential Revenue:</b> Rp {selected.potentialRevenue}
            </p>
            <div className="flex gap-2 mt-2">
              <Button type="primary" danger size="small">
                Edit
              </Button>
              <Button size="small" onClick={() => setSelected(null)}>
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DashboardAmazonContainer;
