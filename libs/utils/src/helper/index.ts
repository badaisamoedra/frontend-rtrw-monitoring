import dayjs from "dayjs";
import "dayjs/locale/id";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import localeData from "dayjs/plugin/localeData";
import "dayjs/locale/id";
import React from "react";
import duration from "dayjs/plugin/duration";
// import * as turf from "@turf/turf";

dayjs.extend(customParseFormat);
dayjs.extend(duration);

export const toRupiah = (angka: number, prefixRupiah: "Rp" | "IDR" = "IDR") => {
  if (!angka) {
    return prefixRupiah + 0;
  }
  const isMinus = angka < 0 ? `-${prefixRupiah}` : prefixRupiah;
  let newAngka = angka.toString();
  const angkaInt = parseInt(newAngka);
  newAngka = angkaInt.toString();
  const number_string = newAngka.replace(/[^0+(?=\d),\d]/g, ""),
    split = number_string.split(","),
    sisa = split[0].length % 3,
    ribuan = split[0].substring(sisa).match(/\d{3}/gi);
  let rupiah = split[0].substring(0, sisa);

  if (ribuan) {
    const separator = sisa ? "." : "";
    rupiah += separator + ribuan.join(".");
  }

  rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
  if (prefixRupiah === "Rp") {
    return rupiah ? isMinus + rupiah : "";
  } else if (prefixRupiah === "IDR") {
    return rupiah ? isMinus + " " + rupiah : "";
  }
  return rupiah;
};

export const printDashIfNull = (param?: string | number): string | number => {
  if (param === 0) {
    return param;
  }
  return param ? param : "----";
};

export const formatPhoneNumber = (phone?: string) => {
  if (!phone) {
    return "";
  }
  const firstAndSecondChar = phone.substring(0, 2);

  if (phone.substring(0, 3) === "+62") {
    phone = phone.slice(3);
  } else if (
    firstAndSecondChar === "62" ||
    firstAndSecondChar === "60" ||
    firstAndSecondChar === "65"
  ) {
    phone = phone.slice(4);
  } else if (phone.charAt(0) === "0") {
    phone = phone.slice(3);
  }

  return phone.toString().replace(/\D/g, "");
};

export const numberWithDots = (number?: number | string): string => {
  if (isNaN(Number(removeNonNumeric(number)))) {
    return "0";
  } else if (typeof number == "string" && number[0] == "0") {
    return "0";
  } else if (typeof number == "string" && number.length < 3) {
    return number.toString();
  } else {
    return (
      removeNonNumeric(number ?? 0).replace(/\B(?=(\d{3})+(?!\d))/g, ".") ??
      "-----"
    );
  }
};

export const camelCase = (text: string) => {
  const splitStr = text?.toLowerCase().split(" ");
  for (let i = 0; i < splitStr?.length; i++) {
    splitStr[i] =
      splitStr[i]?.charAt(0)?.toUpperCase() + splitStr[i]?.substring(1);
  }
  return splitStr?.join(" ");
};

export const removeNonNumeric = (num: any) => {
  const number = num?.toString() as string;
  const numberIsMin = number?.includes("-");
  return numberIsMin
    ? `-${number.replace(/[^0-9]/g, "")}`
    : number?.replace(/[^0-9]/g, "");
};

export const removeDotInCurrencyString = (value: string) => {
  const currencyWithoutDot = value?.toString().replace(/[.]/g, "");
  return currencyWithoutDot;
};

export const capitalizeFirstLetter = (str?: string) => {
  if (str) {
    const strParam = str.toLowerCase();
    return strParam.charAt(0).toUpperCase() + strParam.slice(1);
  }

  return printDashIfNull(undefined);
};

export const checkSameValue = (
  valueFirst: string | number,
  valueSecond: string | number
) => {
  if (valueFirst === valueSecond) {
    return true;
  } else {
    return false;
  }
};

export const convertToPercentage = (decimalValue: any) => {
  const percentageValue = Math.floor(decimalValue * 100);
  return `${percentageValue}%`;
};

/**
 * Filters an array of images by type and returns the filtered array.
 *
 * @param {Array<{ type: string; url: string }>} images - The array of images to filter.
 * @param {string} type - The type of images to filter by.
 * @return {Array<{ type: string; url: string }> | undefined} - The filtered array of images or undefined if no images match the given type.
 */
export const getImagesByType = (
  images: Array<{
    type: string;
    url: string;
  }>,
  type: string
): Array<{ type: string; url: string }> | undefined => {
  const filterImages = images.filter((item) => item.type === type);

  if (!filterImages.length) {
    return undefined;
  }

  return filterImages;
};

/**
 * Retrieves an image of a specific type from the given array of images.
 *
 * @param {Array<{type: string, url: string}>} images - The array of images to search through.
 * @param {string} type - The type of image to retrieve.
 * @return {{type: string, url: string} | undefined} - The image with the specified type, or undefined if not found.
 */
export const getImageByType = (
  images: Array<{
    type: string;
    url: string;
  }>,
  type: string
): { type: string; url: string } | undefined => {
  const filterImages = getImagesByType(images, type);

  if (!filterImages) {
    return undefined;
  }

  return filterImages[filterImages.length - 1];
};

export const formattedDate = (date: string | undefined): string | undefined => {
  if (!date) {
    return undefined;
  }

  const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (dateFormatRegex.test(date)) {
    return dayjs(date).locale("id").format("D MMMM YYYY");
  }

  return date;
};

export const isVideoFile = (fileString: string) => {
  const videoPattern =
    /\.(mp4|mkv|flv|avi|mov|wmv|webm|m4v|mpeg|mpg|ogv|3gp|3g2)$/i;
  return videoPattern.test(fileString);
};

export const formattedMonthYear = (
  date: string | null | undefined
): string | null => {
  if (!date) {
    return null;
  }

  const parsedDate = dayjs(date, "MM/YYYY").add(2, "year");
  return parsedDate.locale("id").format("MMMM YYYY");
};

export const parseJSON = (value: any) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    console.error("Failed to parse value:", error);
    return value;
  }
};

export const formattedDateTime = (date: string) => {
  dayjs.extend(utc);
  dayjs.extend(localeData);
  dayjs.locale("id");

  const dateConverter = dayjs.utc(date).local().format("D MMMM YYYY, HH:mm");

  return dateConverter;
};

export const translateText = (text: string) => {
  const formattedString = text.replace(/_/g, " ");
  const words = formattedString.split(" ");

  const capitalizedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  const result = capitalizedWords.join(" ");

  return result;
};

// export const exportToExcel = (data: any, fileName = "data.xlsx") => {
//   // Convert data to worksheet
//   const worksheet = XLSX.utils.json_to_sheet(data);

//   // Create a new workbook
//   const workbook = XLSX.utils.book_new();

//   // Append the worksheet to the workbook
//   XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

//   // Write the workbook to a file
//   XLSX.writeFile(workbook, fileName);
// };

export const replaceUnderscoreToSpace = (str?: string) => {
  if (!str) return printDashIfNull(str);

  if (str.includes("_")) {
    return str.replace(/_/g, " ");
  } else {
    return str;
  }
};

export const formatDateWithTimezone = (date: string | Date) => {
  const formattedDate = dayjs(date).format("DD MMMM YYYY, HH:mm");
  const timezoneOffset = dayjs(date).utcOffset();
  let timezone = "WIB";

  if (timezoneOffset === 480) {
    timezone = "WITA";
  } else if (timezoneOffset === 540) {
    timezone = "WIT";
  }

  return `${formattedDate} ${timezone}`;
};

export const getFileFormat = (url: string): string => {
  const extension = url.split(".").pop() || "";
  return extension.toLowerCase();
};

export const convertPercentage = (value: string) => {
  const number = parseFloat(value).toFixed(1);
  return number.replace(".", ",") + "%";
};

export const calculateAmountByPercentage = (
  amount: number,
  percentage: number
) => {
  // Convert percentage to a decimal
  const decimalPercentage = 1 - percentage / 100;

  // Calculate the result
  return amount / decimalPercentage - amount;
};

export const translateStatusTicket = (value: string) => {
  switch (value) {
    case "OPEN":
      return "Open";
    case "FOLLOWED_UP":
      return "Followed Up";
    case "NO_RESPONSE":
      return "No Response";
    default:
      return "Unknown Status";
  }
};

export const cleanParams = (obj: Record<string, any>) => {
  const cleaned: Record<string, any> = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      cleaned[key] = value;
    }
  });
  return cleaned;
};

export const WINDOW_HELPER = {
  useWindowResize: () => {
    const [isMobile, setIsMobile] = React.useState(false);
    const [windowWidth, setWindowWidth] = React.useState<number>(0);

    React.useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
        setWindowWidth(window.innerWidth);
      };
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return { isMobile, windowWidth };
  },
};

export const getDiffDayHour = (createdAt: string | Date) => {
  const diff = dayjs?.duration(dayjs().diff(dayjs(createdAt)));
  const days = diff.days();
  const hours = diff.hours();

  return `${days} day ${hours} hours`;
};

// export const buildCoveragePolygon = (
//   points: { lng: number; lat: number }[]
// ): GeoJSON.Feature<GeoJSON.Polygon> | null => {
//   if (points.length < 3) return null;

//   const turfPoints = points.map((p) => turf.point([p.lng, p.lat]));

//   const fc = turf.featureCollection(turfPoints);
//   const hull = turf.convex(fc);

//   return hull as GeoJSON.Feature<GeoJSON.Polygon> | null;
// };

export const formatEnumLabel = (value: string) => {
  if (!value) return "-";

  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const validatePhoneNumber = (value: string) => {
  if (!value) return "";

  if (/^(0|62|\+62)/.test(value)) {
    return "Nomor tidak boleh diawali 0, 62";
  }

  if (!/^[0-9]+$/.test(value)) {
    return "Nomor hanya boleh angka";
  }

  if (value.length < 9 || value.length > 12) {
    return "Nomor handphone tidak valid";
  }

  return "";
};
