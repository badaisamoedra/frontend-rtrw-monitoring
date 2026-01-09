"use client";

import * as React from "react";
import maplibregl from "maplibre-gl";
import { Button, Input } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useData } from "@rtrw-monitoring-system/hooks";
import {
  BUILDING_FOOTPRINTS_SERVICE,
  ORDER_SERVICE,
  RESELLER_SERVICE,
} from "@rtrw-monitoring-system/app/constants/api_url";
import { useGeolocated } from "react-geolocated";
import {
  ModalDeviceBreakdown,
  ModalStreetView,
  ModalTicket,
  ToastContent,
} from "@rtrw-monitoring-system/components";
import { toast } from "react-toastify";
import { useResellerRepository } from "@rtrw-monitoring-system/services/reseller";
import { WINDOW_HELPER } from "@rtrw-monitoring-system/utils";

const DEFAULT = { lat: -8.1764739, lng: 113.6965699 };
const FOCUS_ZOOM = 18;

type ModalProps = {
  modalOpen: "EDIT" | "STREET_VIEW" | "";
  reseller?: any;
  image?: string;
};

const POLYGON_SOURCE_ID = "reseller-polygons";
const POLYGON_FILL_LAYER_ID = "reseller-polygons-fill";
const POLYGON_LINE_LAYER_ID = "reseller-polygons-line";

const POLYGON_JEMBER_SOURCE_ID = "jember-polygons";
const POLYGON_JEMBER_FILL_LAYER_ID = "jember-polygons-fill";
const POLYGON_JEMBER_LINE_LAYER_ID = "jember-polygons-line";

const POLYGON_CLIENT_BOUNDARY_SOURCE_ID = "client-boundary-polygons";
const POLYGON_CLIENT_BOUNDARY_FILL_LAYER_ID = "client-boundary-fill";
const POLYGON_CLIENT_BOUNDARY_LINE_LAYER_ID = "client-boundary-line";

const DashboardAmazonContainer = () => {
  const region = process.env.NEXT_PUBLIC_AWS_REGION || "ap-southeast-1";
  const mapName =
    process.env.NEXT_PUBLIC_AWS_MAP_NAME || "brainet_map_here_hybrid";
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

  const { updateReseller, renderBbox } = useResellerRepository();
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const hasInitialPolygonFit = React.useRef(false);
  const hasInitialPolygonJemberFit = React.useRef(false);

  const { isMobile } = WINDOW_HELPER.useWindowResize();
  const resellerDataRef = React.useRef<any[]>([]);
  const [selectResellerNumber, setSelectResellerNumber] = React.useState<
    string | null
  >(null);

  const [deviceModal, setDeviceModal] = React.useState<{
    open: boolean;
    data: DeviceBreakdown | null;
    id: string;
  }>({
    open: false,
    data: {
      IOS: [],
      OTHERS: [],
      ANDROID: [
        {
          details: [
            {
              count: 0,
              model: "",
            },
          ],
          manufacturer: "",
          total_devices: 0,
        },
      ],
      UNKNOWN: [],
    },
    id: "",
  });

  const [bbox, setBbox] = React.useState<{
    west: number;
    south: number;
    east: number;
    north: number;
  } | null>(null);

  const [viewportGeojson, setViewportGeojson] =
    React.useState<GeoJSON.FeatureCollection<GeoJSON.Polygon> | null>(null);

  const [isViewportLoading, setIsViewportLoading] = React.useState(false);

  const fetchViewportData = React.useCallback(
    async (payload: {
      west: number;
      south: number;
      east: number;
      north: number;
    }) => {
      try {
        setIsViewportLoading(true);

        const res = await renderBbox.mutateAsync(payload);

        const list = res?.data?.data?.list ?? [];

        if (!list.length) {
          setViewportGeojson(null);
          return;
        }

        const features: GeoJSON.Feature<GeoJSON.Polygon>[] = list
          .filter((item: any) => item?.geometry?.type === "Polygon")
          .map((item: any) => ({
            type: "Feature",
            properties: {
              homeId: item.homeId,
            },
            geometry: item.geometry,
          }));

        if (!features.length) {
          setViewportGeojson(null);
          return;
        }

        setViewportGeojson({
          type: "FeatureCollection",
          features,
        });
      } catch (err) {
        console.error("❌ Viewport fetch error:", err);
      } finally {
        setIsViewportLoading(false);
      }
    },
    []
  );

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
    queryResult: { data: resellerDetailData },
  } = useData<ResellerMapResponse>(
    { url: RESELLER_SERVICE.reseller_detail(selectedId ?? "") },
    [RESELLER_SERVICE.reseller_detail(selectedId ?? "")],
    null,
    { enabled: !!selectedId }
  );

  const boundaryUrl = React.useMemo(() => {
    return ORDER_SERVICE.order_client_boundary(selectedId ?? "");
  }, [selectedId]);

  const {
    queryResult: {
      data: dataBoundary,
      isLoading: boundaryLoading,
      refetch: refetchClientBoundary,
    },
  } = useData<BoundaryClientResponse>(
    { url: boundaryUrl },
    [boundaryUrl],
    null,
    { enabled: false }
  );

  // const {
  //   queryResult: { data: layeringMapJember },
  // } = useData<LayeringMapJemberResponse>(
  //   { url: BUILDING_FOOTPRINTS_SERVICE.building_footprints },
  //   [BUILDING_FOOTPRINTS_SERVICE.building_footprints],
  //   null,
  //   { enabled: true }
  // );

  React.useEffect(() => {
    resellerDataRef.current = resellerData?.data ?? [];
  }, [resellerData]);

  React.useEffect(() => {
    if (!selectedId) return;
    if (!resellerDetailData?.data) return;

    setShowModal({
      modalOpen: "EDIT",
      reseller: resellerDetailData.data,
    });
  }, [selectedId, resellerDetailData]);

  const renderResellerPolygons = React.useCallback(
    (
      map: maplibregl.Map,
      geojson: GeoJSON.FeatureCollection<GeoJSON.Polygon>
    ) => {
      const existing = map.getSource(POLYGON_SOURCE_ID) as
        | maplibregl.GeoJSONSource
        | undefined;

      if (existing) {
        existing.setData(geojson);
      } else {
        map.addSource(POLYGON_SOURCE_ID, {
          type: "geojson",
          data: geojson,
        });

        map.addLayer({
          id: POLYGON_FILL_LAYER_ID,
          type: "fill",
          source: POLYGON_SOURCE_ID,
          paint: {
            "fill-color": "#ef4444",
            "fill-opacity": 0.35,
          },
        });

        map.addLayer({
          id: POLYGON_LINE_LAYER_ID,
          type: "line",
          source: POLYGON_SOURCE_ID,
          paint: {
            "line-color": "#000000",
            "line-width": 2,
          },
        });

        map.on("click", POLYGON_FILL_LAYER_ID, (e) => {
          const feature = e.features?.[0];
          if (!feature) return;

          const resellerId = feature.properties?.resellerId;
          if (!resellerId) return;

          const reseller = resellerDataRef.current.find(
            (r: any) => r.id === resellerId
          );
          if (!reseller) return;

          setSelectedId(reseller.id);
          setSelected(reseller);
          setSelectResellerNumber(reseller.resellerNumber);

          const geometry = feature.geometry;
          const bounds = new maplibregl.LngLatBounds();

          if (geometry.type === "Polygon") {
            geometry.coordinates[0].forEach(([lng, lat]) =>
              bounds.extend([lng, lat])
            );
          }

          if (geometry.type === "MultiPolygon") {
            geometry.coordinates.forEach((polygon) =>
              polygon[0].forEach(([lng, lat]) => bounds.extend([lng, lat]))
            );
          }

          if (!bounds.isEmpty()) {
            map.fitBounds(bounds, {
              padding: 120,
              maxZoom: 18,
              duration: 800,
            });
          }

          setTimeout(() => scrollToCard(reseller.id), 100);

          // console.log("RESELLER DATA :", resellerDetailData)
          // setShowModal({
          //   modalOpen: "EDIT",
          //   reseller: resellerDetailData?.data,
          // });
        });

        map.on("mouseenter", POLYGON_FILL_LAYER_ID, () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", POLYGON_FILL_LAYER_ID, () => {
          map.getCanvas().style.cursor = "";
        });
      }

      if (!hasInitialPolygonFit.current && geojson.features.length) {
        const bounds = new maplibregl.LngLatBounds();

        geojson.features.forEach((feature) => {
          const ring = feature.geometry.coordinates[0];
          ring.forEach(([lng, lat]) => bounds.extend([lng, lat]));
        });
      }
    },
    []
  );

  const renderJemberPolygons = React.useCallback(
    (
      map: maplibregl.Map,
      geojson: GeoJSON.FeatureCollection<GeoJSON.Polygon>
    ) => {
      const existing = map.getSource(POLYGON_JEMBER_SOURCE_ID) as
        | maplibregl.GeoJSONSource
        | undefined;

      if (existing) {
        existing.setData(geojson);
      } else {
        map.addSource(POLYGON_JEMBER_SOURCE_ID, {
          type: "geojson",
          data: geojson,
        });

        map.addLayer({
          id: POLYGON_JEMBER_FILL_LAYER_ID,
          type: "fill",
          source: POLYGON_JEMBER_SOURCE_ID,
          paint: {
            "fill-color": "#F5F2F2",
            "fill-opacity": 0.35,
          },
        });

        map.addLayer({
          id: POLYGON_JEMBER_LINE_LAYER_ID,
          type: "line",
          source: POLYGON_JEMBER_SOURCE_ID,
          paint: {
            "line-color": "#000000",
            "line-width": 2,
          },
        });

        map.on("mouseenter", POLYGON_JEMBER_FILL_LAYER_ID, () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", POLYGON_JEMBER_FILL_LAYER_ID, () => {
          map.getCanvas().style.cursor = "";
        });
      }

      if (!hasInitialPolygonJemberFit.current && geojson.features.length) {
        const bounds = new maplibregl.LngLatBounds();

        geojson.features.forEach((feature) => {
          const ring = feature.geometry.coordinates[0];
          ring.forEach(([lng, lat]) => bounds.extend([lng, lat]));
        });
      }
    },
    []
  );

  const renderClientBoundaryPolygons = React.useCallback(
    (
      map: maplibregl.Map,
      geojson: GeoJSON.FeatureCollection<GeoJSON.Polygon>
    ) => {
      if (map.getLayer(POLYGON_CLIENT_BOUNDARY_FILL_LAYER_ID))
        map.removeLayer(POLYGON_CLIENT_BOUNDARY_FILL_LAYER_ID);
      if (map.getLayer(POLYGON_CLIENT_BOUNDARY_LINE_LAYER_ID))
        map.removeLayer(POLYGON_CLIENT_BOUNDARY_LINE_LAYER_ID);
      if (map.getSource(POLYGON_CLIENT_BOUNDARY_SOURCE_ID))
        map.removeSource(POLYGON_CLIENT_BOUNDARY_SOURCE_ID);

      map.addSource(POLYGON_CLIENT_BOUNDARY_SOURCE_ID, {
        type: "geojson",
        data: geojson,
      });

      map.addLayer({
        id: POLYGON_CLIENT_BOUNDARY_FILL_LAYER_ID,
        type: "fill",
        source: POLYGON_CLIENT_BOUNDARY_SOURCE_ID,
        paint: {
          "fill-color": "#F97316",
          "fill-opacity": 0.55,
        },
      });

      map.addLayer({
        id: POLYGON_CLIENT_BOUNDARY_LINE_LAYER_ID,
        type: "line",
        source: POLYGON_CLIENT_BOUNDARY_SOURCE_ID,
        paint: {
          "line-color": "#9A3412",
          "line-width": 3,
        },
      });

      if (map.getLayer(POLYGON_CLIENT_BOUNDARY_FILL_LAYER_ID))
        map.moveLayer(POLYGON_CLIENT_BOUNDARY_FILL_LAYER_ID);
      if (map.getLayer(POLYGON_CLIENT_BOUNDARY_LINE_LAYER_ID))
        map.moveLayer(POLYGON_CLIENT_BOUNDARY_LINE_LAYER_ID);

      map.on("click", POLYGON_CLIENT_BOUNDARY_FILL_LAYER_ID, (e) => {
        const feature = e.features?.[0];
        if (!feature) return;

        const deviceBreakdown = feature.properties?.deviceBreakdown;

        setDeviceModal({
          open: true,
          data: deviceBreakdown ?? {},
          id: feature.properties?.id,
        });
      });

      map.on("mouseenter", POLYGON_CLIENT_BOUNDARY_FILL_LAYER_ID, () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", POLYGON_CLIENT_BOUNDARY_FILL_LAYER_ID, () => {
        map.getCanvas().style.cursor = "";
      });

      const bounds = new maplibregl.LngLatBounds();
      geojson.features.forEach((f) => {
        f.geometry.coordinates[0].forEach(([lng, lat]) => {
          bounds.extend([lng, lat]);
        });
      });

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, {
          padding: 140,
          maxZoom: 21,
          duration: 900,
        });
      }
    },
    []
  );

  const resellerPolygons = React.useMemo(() => {
    if (!resellerData?.data) return null;

    const features: GeoJSON.Feature<GeoJSON.Polygon>[] = resellerData.data
      .filter((r: ResellerMap) => r?.locationPoint?.type === "Polygon")
      .map((r: ResellerMap) => ({
        type: "Feature",
        properties: {
          resellerId: r.id,
          status: r.status,
          isTelkom: r.isTelkom,
        },
        geometry: r.locationPoint as GeoJSON.Polygon,
      }));

    return {
      type: "FeatureCollection",
      features,
    } as GeoJSON.FeatureCollection<GeoJSON.Polygon>;
  }, [resellerData]);

  // const jemberPolygons = React.useMemo(() => {
  //   if (!layeringMapJember?.data) return null;

  //   const features: GeoJSON.Feature<GeoJSON.Polygon>[] =
  //     layeringMapJember.data?.list
  //       .filter((r: LayeringMapJember) => r?.geometry?.type === "Polygon")
  //       .map((r: LayeringMapJember) => ({
  //         type: "Feature",
  //         properties: {
  //           homeId: r.homeId,
  //         },
  //         geometry: r.geometry as GeoJSON.Polygon,
  //       }));

  //   return {
  //     type: "FeatureCollection",
  //     features,
  //   } as GeoJSON.FeatureCollection<GeoJSON.Polygon>;
  // }, [layeringMapJember]);

  const extractBoundaryList = React.useCallback((raw: any): any[] => {
    if (Array.isArray(raw)) return raw;

    if (Array.isArray(raw?.data)) return raw.data;

    if (Array.isArray(raw?.data?.list)) return raw.data.list;

    if (Array.isArray(raw?.list)) return raw.list;

    return [];
  }, []);

  const clientBoundaryPolygons = React.useMemo(() => {
    const list = extractBoundaryList(dataBoundary);

    if (!list.length) return null;

    const features: GeoJSON.Feature<GeoJSON.Polygon>[] = list
      .filter((x: BoundaryClient) => x?.boundaryBuilding?.type === "Polygon")
      .map((x: BoundaryClient) => ({
        type: "Feature",
        properties: { id: x.id, deviceBreakdown: x.deviceBreakdown },
        geometry: x.boundaryBuilding as GeoJSON.Polygon,
      }));

    if (!features.length) return null;

    return {
      type: "FeatureCollection",
      features,
    } as GeoJSON.FeatureCollection<GeoJSON.Polygon>;
  }, [dataBoundary, extractBoundaryList]);

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
        isTelkom: t.isTelkom,
      }));
  }, [resellerData]);

  const initializeMap = React.useCallback(() => {
    if (!mapContainer.current || !region || !mapName || !apiKey) return;

    if (mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current!,
      style: `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${mapName}/style-descriptor?key=${apiKey}`,
      center: [DEFAULT.lng, DEFAULT.lat],
      zoom: 14,
    });

    mapRef.current = map;

    map.on("load", () => {
      console.log("✅ Amazon map loaded successfully");
      setIsMapReady(true);
      renderMarkers(map);

      map.flyTo({
        center: [DEFAULT.lng, DEFAULT.lat],
        zoom: FOCUS_ZOOM,
        duration: 1000,
      });

      if (resellerPolygons) {
        renderResellerPolygons(map, resellerPolygons);
      }

      // if (jemberPolygons) {
      //   renderJemberPolygons(map, jemberPolygons);
      // }
    });

    let debounceTimer: any;

    map.on("move", () => {
      clearTimeout(debounceTimer);

      debounceTimer = setTimeout(() => {
        const b = map.getBounds();

        const nextBbox = {
          west: b.getWest(),
          south: b.getSouth(),
          east: b.getEast(),
          north: b.getNorth(),
        };

        setBbox(nextBbox);
        fetchViewportData(nextBbox);
      }, 400);
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

  React.useEffect(() => {
    const map = mapRef.current;
    if (!isMapReady || !map || !resellerPolygons) return;

    renderResellerPolygons(map, resellerPolygons);
  }, [isMapReady, resellerPolygons, renderResellerPolygons]);

  // React.useEffect(() => {
  //   const map = mapRef.current;
  //   if (!isMapReady || !map || !jemberPolygons) return;

  //   renderJemberPolygons(map, jemberPolygons);
  // }, [isMapReady, jemberPolygons, renderJemberPolygons]);

  React.useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady || !viewportGeojson) return;

    renderJemberPolygons(map, viewportGeojson);
  }, [viewportGeojson, isMapReady, renderJemberPolygons]);

  React.useEffect(() => {
    const map = mapRef.current;
    if (!isMapReady || !map || !clientBoundaryPolygons) return;

    const run = () => renderClientBoundaryPolygons(map, clientBoundaryPolygons);

    if (!map.isStyleLoaded() && !dataBoundary?.data) {
      map.once("idle", run);
    } else {
      run();
    }
  }, [
    isMapReady,
    clientBoundaryPolygons,
    renderClientBoundaryPolygons,
    dataBoundary,
  ]);

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

    resellers
      .filter((reseller) => reseller.isTelkom === true)
      .map((reseller) => {
        const getMarkerColor = (status: string) => {
          switch (status?.toUpperCase()) {
            case "RESELLER_ACTIVE":
            case "SIGNED_PKS":
              return "#008E53"; // Hijau
            case "NEGOTIATION":
              return "#FC9003"; // Oranye
            case "RESELLER_NOT_ACTIVE":
              return "#dc2626"; // Merah
            default:
              return "#9CA3AF"; // Abu-abu default
          }
        };
        const el = document.createElement("div");
        el.className = "custom-marker";
        el.style.cssText = `
        width: 18px;
        height: 18px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 6px rgba(0,0,0,0.4);
        background-color: ${getMarkerColor(reseller.status)};
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
          setSelectResellerNumber(reseller.resellerNumber);
          map.flyTo({
            center: [reseller.lng, reseller.lat],
            zoom: FOCUS_ZOOM,
            duration: 800,
          });
          setTimeout(() => scrollToCard(reseller.id), 100);
        });
      });
  };

  const scrollToCard = (resellerId: string | number) => {
    const el = document.getElementById(`card-${resellerId}`);
    const container = document.getElementById("reseller-card-scroll");
    if (el && container) {
      el.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  };

  const handleCardClick = (reseller: any) => {
    setSelected(reseller);
    setSelectedId(reseller.id);
    setSelectResellerNumber(reseller.resellerNumber);
    mapRef.current?.flyTo({
      center: [reseller.lng, reseller.lat],
      zoom: 20,
      duration: 800,
    });
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    // const found = resellers.find((t) =>
    //   t.id.toLowerCase().includes(value.toLowerCase())
    // );
    const found = resellers.find((t) => t.resellerNumber === value);
    if (found) {
      handleCardClick(found);
      scrollToCard(found.resellerNumber);
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

  const handleClickClientBoundary = (resellerNumber: string) => {
    setShowModal({ modalOpen: "" });
    setSelectResellerNumber(resellerNumber);

    // tunggu state update commit (microtask)
    setTimeout(() => {
      refetchClientBoundary();
    }, 0);
  };

  if (isLoading) return <div className="p-4">Loading resellers...</div>;

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden">
      <div
        className={`absolute z-50 flex items-center gap-2 ${
          isMobile
            ? "top-4 left-[5%] w-[90%]"
            : "top-[50px] left-1/14 w-[400px]"
        }`}
      >
        <Input.Search
          placeholder="Search Reseller No."
          allowClear
          enterButton
          onSearch={handleSearch}
          className={isMobile ? "flex-1 max-w-[210px]" : "flex-1 w-full"}
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

        {isMobile && (
          <Button
            icon={<InfoCircleOutlined />}
            onClick={() => setShowLegend((prev) => !prev)}
            className="ml-[2px]"
          />
        )}
      </div>

      {!isMobile && (
        <div className="absolute top-[50px] right-6 z-50 flex items-center">
          <Button
            icon={<InfoCircleOutlined />}
            onClick={() => setShowLegend((prev) => !prev)}
          >
            Legend
          </Button>
        </div>
      )}

      {showLegend && (
        <div
          className={`absolute right-6 bg-white shadow-md rounded p-3 text-sm space-y-1 z-50 w-[200px] ${
            isMobile ? "top-[60px]" : "top-[90px]"
          }`}
        >
          <h4 className="font-semibold mb-2">Legend Information</h4>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-[#008E53]"></span>
            <span>Reseller Active / Signed PKS</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-[#FC9003]"></span>
            <span>Negotiation</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-[#dc2626]"></span>
            <span>Reseller Not Active</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-[#9CA3AF]"></span>
            <span>Not Deal</span>
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
              selected?.resellerNumber === reseller.resellerNumber
                ? "ring-4 ring-red-500 scale-105"
                : ""
            }`}
          >
            <div className="flex items-center mb-2">
              <div
                className="w-4 h-4 rounded-full mr-2"
                style={{
                  backgroundColor:
                    reseller.status?.toUpperCase() === "RESELLER_ACTIVE" ||
                    reseller.status?.toUpperCase() === "SIGNED_PKS"
                      ? "#008E53" // Hijau
                      : reseller.status?.toUpperCase() === "NEGOTIATION"
                      ? "#FC9003" // Oranye
                      : reseller.status?.toUpperCase() === "RESELLER_NOT_ACTIVE"
                      ? "#dc2626" // Merah
                      : "#9CA3AF", // Abu-abu default
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
              <b>Tanggal:</b>{" "}
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
        onClose={() => {
          setShowModal({ modalOpen: "" });
          setSelectedId(null);
        }}
        onSave={handleSaveReseller}
        onClick={handleClickClientBoundary}
      />

      <ModalDeviceBreakdown
        open={deviceModal.open}
        onClose={() => setDeviceModal({ open: false, data: null, id: "" })}
        deviceBreakDown={deviceModal.data}
        id={deviceModal.id ?? ""}
      />
    </div>
  );
};

export default DashboardAmazonContainer;
