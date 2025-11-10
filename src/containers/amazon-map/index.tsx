"use client";

import * as React from "react";
import maplibregl from "maplibre-gl";
import { Button, Input } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useData } from "@rtrw-monitoring-system/hooks";
import { RESELLER_SERVICE } from "@rtrw-monitoring-system/app/constants/api_url";
import { useGeolocated } from "react-geolocated";
import {
  ModalStreetView,
  ModalTicket,
  ToastContent,
} from "@rtrw-monitoring-system/components";
import { toast } from "react-toastify";
import { useResellerRepository } from "@rtrw-monitoring-system/services/reseller";

const DEFAULT = { lat: -8.2, lng: 114.05 };

type ModalProps = {
  modalOpen: "EDIT" | "STREET_VIEW" | "";
  reseller?: any;
  image?: string;
};

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
  const [showModal, setShowModal] = React.useState<ModalProps>({
    modalOpen: "",
  });

  const { updateReseller } = useResellerRepository();
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isGeolocationEnabled && coords) {
      setPosition({ lat: coords.latitude, lng: coords.longitude });
    }
  }, [coords, isGeolocationEnabled]);

  const {
    queryResult: { data: resellerData, isLoading, refetch },
  } = useData<ResellerMapResponse>(
    { url: RESELLER_SERVICE.reseller_map },
    [RESELLER_SERVICE.reseller_map],
    null,
    { enabled: true }
  );

  const {
    queryResult: {
      data: resellerDetailData,
      isLoading: loadingDetail,
      refetch: refetchDetail,
    },
  } = useData<ResellerMapResponse>(
    { url: RESELLER_SERVICE.reseller_detail(selectedId ?? "") }, // ini diisi reseller id
    [RESELLER_SERVICE.reseller_detail(selectedId ?? "")],
    null,
    { enabled: !!selectedId }
  );

  // this function will be called when this future on
  // const renderPolygons = (map: maplibregl.Map) => {
  //   if (!ticketData?.data?.length) return;

  //   const districtGroups = ticketData.data.reduce((acc, ticket) => {
  //     if (!acc[ticket.district]) acc[ticket.district] = [];
  //     acc[ticket.district].push([
  //       parseFloat(ticket.longitude),
  //       parseFloat(ticket.latitude),
  //     ]);
  //     return acc;
  //   }, {} as Record<string, [number, number][]>);

  //   const features = Object.entries(districtGroups).map(
  //     ([district, coords]) => {
  //       const bounds = coords.reduce(
  //         (b, [lng, lat]) => {
  //           b.minLng = Math.min(b.minLng, lng);
  //           b.maxLng = Math.max(b.maxLng, lng);
  //           b.minLat = Math.min(b.minLat, lat);
  //           b.maxLat = Math.max(b.maxLat, lat);
  //           return b;
  //         },
  //         {
  //           minLng: coords[0][0],
  //           maxLng: coords[0][0],
  //           minLat: coords[0][1],
  //           maxLat: coords[0][1],
  //         }
  //       );

  //       return {
  //         type: "Feature",
  //         properties: { name: district },
  //         geometry: {
  //           type: "Polygon",
  //           coordinates: [
  //             [
  //               [bounds.minLng, bounds.minLat],
  //               [bounds.maxLng, bounds.minLat],
  //               [bounds.maxLng, bounds.maxLat],
  //               [bounds.minLng, bounds.maxLat],
  //               [bounds.minLng, bounds.minLat],
  //             ],
  //           ],
  //         },
  //       } satisfies GeoJSON.Feature<GeoJSON.Polygon>;
  //     }
  //   );

  //   const polygonData: GeoJSON.FeatureCollection<GeoJSON.Polygon> = {
  //     type: "FeatureCollection",
  //     features,
  //   };

  //   if (map.getSource("district-polygons")) {
  //     (map.getSource("district-polygons") as maplibregl.GeoJSONSource).setData(
  //       polygonData
  //     );
  //   } else {
  //     map.addSource("district-polygons", {
  //       type: "geojson",
  //       data: polygonData,
  //     } satisfies maplibregl.GeoJSONSourceSpecification);

  //     map.addLayer({
  //       id: "polygon-fill",
  //       type: "fill",
  //       source: "district-polygons",
  //       paint: {
  //         "fill-color": [
  //           "match",
  //           ["get", "name"],
  //           "Jakarta Selatan",
  //           "#4ade80",
  //           "Jakarta Barat",
  //           "#60a5fa",
  //           "Bekasi Barat",
  //           "#facc15",
  //           "#a855f7",
  //         ],
  //         "fill-opacity": 0.25,
  //       },
  //     });

  //     map.addLayer({
  //       id: "polygon-outline",
  //       type: "line",
  //       source: "district-polygons",
  //       paint: {
  //         "line-color": "#1e3a8a",
  //         "line-width": 2,
  //       },
  //     });

  //     map.on("click", "polygon-fill", (e) => {
  //       const name = e.features?.[0]?.properties?.name;
  //       const coordinates = e.lngLat;
  //       new maplibregl.Popup()
  //         .setLngLat(coordinates)
  //         .setHTML(`<strong>${name}</strong>`)
  //         .addTo(map);
  //     });

  //     map.on("mouseenter", "polygon-fill", () => {
  //       map.getCanvas().style.cursor = "pointer";
  //     });
  //     map.on("mouseleave", "polygon-fill", () => {
  //       map.getCanvas().style.cursor = "";
  //     });
  //   }
  // };

  const resellers = React.useMemo(() => {
    if (!resellerData?.data) return [];
    return resellerData.data
      .filter(
        (t) =>
          t.latitude !== null &&
          t.longitude !== null &&
          !isNaN(t.latitude) &&
          !isNaN(t.longitude)
      )
      .map((t) => ({
        id: t.id,
        resellerNumber: t.resellerNumber || "",
        latitude: t.latitude,
        longitude: t.longitude,
        lat: t.latitude,
        lng: t.longitude,
        status: t.status || "UNKNOWN",
        createdAt: t.createdAt,
      }));
  }, [resellerData]);

  const initializeMap = React.useCallback(() => {
    if (!mapContainer.current || !region || !mapName || !apiKey) return;

    if (mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current!,
      style: `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${mapName}/style-descriptor?key=${apiKey}`,
      center: [DEFAULT.lng, DEFAULT.lat],
      zoom: 13,
    });

    mapRef.current = map;

    map.on("load", () => {
      console.log("✅ Amazon map loaded successfully");
      setIsMapReady(true);
      renderMarkers(map);
    });

    map.on("click", "polygon-fill", (e) => {
      const name = e.features?.[0]?.properties?.name;
      const coordinates = e.lngLat;

      new maplibregl.Popup()
        .setLngLat(coordinates)
        .setHTML(`<strong>${name}</strong>`)
        .addTo(map);
    });

    map.on("mouseenter", "polygon-fill", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "polygon-fill", () => {
      map.getCanvas().style.cursor = "";
    });

    map.on("error", (e) => {
      console.error("❌ Map initialization error:", e);
    });
  }, [region, mapName, apiKey, position]);

  // React.useEffect(() => {
  //   if (isMapReady && mapRef.current && resellerData?.data?.length) {
  //     renderPolygons(mapRef.current);
  //   }
  // }, [isMapReady, resellerData]);

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
  }, [isMapReady, resellers]);

  const renderMarkers = (map: maplibregl.Map) => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (!resellers.length) return;

    const bounds = new maplibregl.LngLatBounds();

    resellers.forEach((reseller, index) => {
      const el = document.createElement("div");
      el.className = "custom-marker";
      el.style.cssText = `
        width: 18px;
        height: 18px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 6px rgba(0,0,0,0.4);
        background-color: ${
          reseller.status === "ACTIVE"
            ? "#008E53"
            : reseller.status === "PENDING"
            ? "#0050AE"
            : "#dc2626"
        };
        cursor: pointer;
        transition: transform 0.2s ease;
      `;

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([reseller.lng, reseller.lat])
        .addTo(map);

      markersRef.current.push(marker);
      bounds.extend([reseller.lng, reseller.lat]);

      el.addEventListener("click", () => {
        setSelectedId(reseller.id);
        setSelected(reseller);
        map.flyTo({
          center: [reseller.lng, reseller.lat],
          zoom: 15,
          duration: 800,
        });
        scrollToCard(reseller.id, index);
      });
    });

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, { padding: 80, maxZoom: 14, duration: 1000 });
    }
  };

  const scrollToCard = (resellerId: string | number, index?: number) => {
    const el = document.getElementById(`card-${resellerId}-${index ?? 0}`);
    const container = document.getElementById("reseller-card-scroll");
    if (el && container) {
      el.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  };

  const handleCardClick = (reseller: any) => {
    setSelected(reseller);
    setSelectedId(reseller.id);
    mapRef.current?.flyTo({
      center: [reseller.lng, reseller.lat],
      zoom: 15,
      duration: 800,
    });
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    const found = resellers.find((t) =>
      t.resellerNumber.toLowerCase().includes(value.toLowerCase())
    );
    if (found) {
      handleCardClick(found);
      scrollToCard(found.id);
    }
  };

  const handleSaveReseller = async (updatedReseller: UpdateResellerPayload) => {
    try {
      const pocUser =
        typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem("pocUser") || "{}")
          : {};

      const payload: UpdateResellerPayload = {
        id: updatedReseller?.id,
        status: updatedReseller?.status,
        potentialHigh: updatedReseller?.potentialHigh,
        potentialLow: updatedReseller?.potentialLow,
        potentialThreeMonth: Number(updatedReseller?.potentialThreeMonth),
        potentialRevenue: Number(updatedReseller?.potentialRevenue),
        notes: updatedReseller?.notes,
        createdBy: pocUser?.id ?? null,
        latitude: updatedReseller?.latitude,
        longitude: updatedReseller?.longitude,
      };

      await updateReseller.mutateAsync(payload);

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

  if (isLoading) return <div className="p-4">Loading resellers...</div>;

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden">
      <div className="absolute top-[50px] left-1/14 z-50 w-[400px] flex gap-2">
        <Input.Search
          placeholder="Search Reseller No."
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
            <span className="inline-block w-3 h-3 rounded-full bg-[#008E53]"></span>
            <span>Active</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-[#0050AE]"></span>
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-[#dc2626]"></span>
            <span>Non Active</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-[#dc2626]"></span>
            <span>Reject</span>
          </div>
        </div>
      )}

      <div
        ref={mapContainer}
        className="absolute inset-0"
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      />

      <div
        id="reseller-card-scroll"
        className="absolute bottom-5 left-0 right-0 px-5 py-2 flex gap-4 overflow-x-auto pb-3 scrollbar-hide z-50"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {resellers.map((reseller, index) => (
          <div
            key={`${reseller.id}-${index}`}
            id={`card-${reseller.id}`}
            onClick={() => handleCardClick(reseller)}
            className={`min-w-[320px] bg-white rounded-2xl shadow-md p-4 flex-shrink-0 cursor-pointer transition-all duration-300 scroll-snap-align-center ${
              selected?.id === reseller.id
                ? "ring-4 ring-red-500 scale-105"
                : ""
            }`}
          >
            <div className="flex items-center mb-2">
              <div
                className="w-4 h-4 rounded-full mr-2"
                style={{
                  backgroundColor:
                    reseller.status === "ACTIVE"
                      ? "#008E53"
                      : reseller.status === "PENDING"
                      ? "#0050AE"
                      : "#dc2626",
                }}
              />
              <h3 className="font-semibold text-sm">
                #{reseller.resellerNumber ?? ""}
              </h3>
            </div>
            <p className="text-xs text-gray-700">
              <b>Longitude:</b> {reseller.lng}
            </p>
            <p className="text-xs text-gray-700">
              <b>Latitude:</b> {reseller.lat}
            </p>
            <p className="text-xs text-gray-700">
              <b>reseller Date:</b>{" "}
              {new Date(reseller?.createdAt ?? "").toLocaleDateString()}
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() =>
                  setShowModal({
                    modalOpen: "EDIT",
                    reseller: resellerDetailData?.data,
                  })
                }
                className="bg-red-500 text-white text-xs px-3 py-1 rounded-md shadow-sm hover:bg-red-600 hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer"
              >
                Edit
              </button>

              <button
                disabled={!reseller.lat || !reseller.lng}
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${reseller.lat},${reseller.lng}`,
                    "_blank"
                  )
                }
                className={`border text-xs px-3 py-1 rounded-md shadow-sm transition-all duration-200 cursor-pointer${
                  !reseller.lat || !reseller.lng
                    ? "cursor-not-allowed opacity-50 border-gray-200 text-gray-400"
                    : "border-gray-300 hover:bg-gray-100 hover:shadow-md hover:scale-105"
                }`}
              >
                Get Direction
              </button>

              <button
                disabled={!reseller.lat || !reseller.lng}
                onClick={() => {
                  if (reseller.lat && reseller.lng) {
                    setShowModal({
                      modalOpen: "STREET_VIEW",
                      reseller: resellerDetailData?.data,
                    });
                  }
                }}
                className={`text-xs px-3 py-1 rounded-md shadow-sm transition-all duration-200 cursor-pointer ${
                  !reseller.lat || !reseller.lng
                    ? "cursor-not-allowed opacity-50 bg-gray-200 text-gray-400"
                    : "bg-yellow-500 text-white hover:bg-yellow-600 hover:shadow-md hover:scale-105"
                }`}
              >
                Street View
              </button>
            </div>
          </div>
        ))}
      </div>
      <ModalStreetView
        open={showModal.modalOpen === "STREET_VIEW"}
        onClose={() => setShowModal({ modalOpen: "" })}
        reseller={showModal.reseller}
      />

      <ModalTicket
        open={showModal.modalOpen === "EDIT"}
        ticket={showModal.reseller}
        section="EDIT"
        onClose={() => setShowModal({ modalOpen: "" })}
        onSave={handleSaveReseller}
      />
    </div>
  );
};

export default DashboardAmazonContainer;
