"use client";

import * as React from "react";
import maplibregl from "maplibre-gl";
import { Button, Card, Input } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useData } from "@rtrw-monitoring-system/hooks";
import { TICKET_SERVICE } from "@rtrw-monitoring-system/app/constants/api_url";

const region = process.env.NEXT_PUBLIC_AWS_REGION || "";
const mapName = process.env.NEXT_PUBLIC_AWS_MAP_NAME;
const apiKey = process.env.NEXT_PUBLIC_AWS_MAPS_API_KEY || "";

const DashboardAmazonContainer = () => {
  const mapContainer = React.useRef<HTMLDivElement | null>(null);
  const mapRef = React.useRef<maplibregl.Map | null>(null);

  const [selected, setSelected] = React.useState<any>(null);
  const [search, setSearch] = React.useState("");
  const [highlighted, setHighlighted] = React.useState<string | null>(null);
  const [showLegend, setShowLegend] = React.useState(false);

  console.log("CONFIG AWS :", {
    region: region,
    mapName: mapName,
    apiKey: apiKey,
  });

  console.log(
    "MAPPS :",
    `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${mapName}/style-descriptor?key=${apiKey}`
  );

  // fetch data tiket
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
    if (!mapContainer.current) return;

    if (mapRef.current) return;

    const timer = setTimeout(() => {
      const map = new maplibregl.Map({
        container: mapContainer.current!,
        style: `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${mapName}/style-descriptor?key=${apiKey}`,
        center: [106.816666, -6.2],
        zoom: 11,
      });

      mapRef.current = map;

      map.on("load", () => console.log("✅ Amazon Map Loaded"));
      map.on("error", (e) => console.error("❌ Map Error:", e));
    }, 300);

    return () => clearTimeout(timer);
  }, [region, mapName, apiKey]);

  // render markers
  React.useEffect(() => {
    if (!mapRef.current || tickets.length === 0) return;

    const timer = setTimeout(() => {
      document
        .querySelectorAll(".maplibregl-marker")
        .forEach((m) => m.remove());

      tickets.forEach((ticket) => {
        const el = document.createElement("div");
        el.className = "marker";
        el.style.width = "24px";
        el.style.height = "24px";
        el.style.borderRadius = "50%";
        el.style.backgroundColor =
          highlighted === ticket.id
            ? "yellow"
            : ticket.status === "OPEN"
            ? "green"
            : ticket.status === "FOLLOWED_UP"
            ? "blue"
            : "red";
        el.style.border = "2px solid white";
        el.style.cursor = "pointer";

        el.addEventListener("click", () => setSelected(ticket));

        new maplibregl.Marker(el)
          .setLngLat([ticket.lng, ticket.lat])
          .addTo(mapRef.current!);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [tickets, highlighted]);

  // handle search
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

      {/* Map Container */}
      <div
        key={typeof window !== "undefined" ? window.location.pathname : "map"}
        ref={mapContainer}
        className="w-full h-[calc(100vh-64px)]"
      />

      {/* Info Card */}
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
