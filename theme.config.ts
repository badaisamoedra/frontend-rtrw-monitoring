import { ThemeConfig } from "antd";
import { COLORS } from "./libs/utils/src";

const config: ThemeConfig = {
  token: {
    colorPrimary: COLORS.red80,
    fontFamily: "Montserrat, system-ui",
    colorBgContainer: COLORS.white,
    colorText: COLORS.black,
  },
  components: {
    Button: {
      borderRadius: 8,
      colorBorder: COLORS.red80,
      colorText: COLORS.red80,
      colorBgContainerDisabled: COLORS.secondary10,
      colorTextDisabled: COLORS.secondary30,
      borderColorDisabled: COLORS.secondary30,
    },
    Layout: {
      siderBg: COLORS.white,
      headerBg: COLORS.white,
    },
  },
};

export default config;
