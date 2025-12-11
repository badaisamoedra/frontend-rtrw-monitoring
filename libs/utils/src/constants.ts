const APP_NAME = process.env["NEXT_PUBLIC_APP_NAME"] ?? "";

export const LOCAL_STORAGE_KEYS = {
  USER_INFO: "pocUser" + APP_NAME,
  USER_ROLE: "pocRole" + APP_NAME,
};

export const COLORS = {
  telkomsel10: "#FEE0D4",
  telkomsel30: "#FBB293",
  telkomsel50: "#F9804C",
  telkomselMain: "#FF0025",
  telkomsel70: "#A5441B",

  secondary10: "#E3EAEF",
  secondary30: "#BACBD7",
  secondary50: "#8CA8BD",
  secondaryMain: "#7597B0",
  secondary70: "#4E6575",

  green10: "#D4E6D8",
  green30: "#94BF9E",
  green50: "#4E955E",
  greenMain: "#2A803E",
  green70: "#1C5529",

  red10: "#FFE2E2",
  red30: "#FFB7B7",
  red50: "#FF8888",
  redMain: "#FF7070",
  red70: "#AA4B4B",
  red80: "#AD0808",

  blue10: "#DDE5F9",
  blue30: "#A9BDEF",
  blue50: "#7091E5",
  blueMain: "#537BE0",
  blue70: "#375295",

  grey10: "#FAFAFA",
  grey30: "#DDDDDD",
  grey50: "#C8C8C8",
  greyMain: "#A8A8A8",

  yellow10: "#F8F3CC",
  yellow30: "#ECE180",
  yellow50: "#E0CE2B",
  yellowMain: "#DAC400",
  yellow70: "#918300",

  white: "#fff",
  black: "#000",

  darkGunmetal: "#1B2730",
};
