import Irid from "irid";
import * as coreVars from "./core-vars";
import _ from "lodash";

// const grayDarker = "#272b2e";
// const grayDark = "#414141";
// const gray = "#7f8c8d";
const grayLight = "#bdc3c7";
const grayLighter = "#f1f1f1";
const grey1 = "#212121";
const grey2 = "#313131";
const grey3 = "#353535";
const grey4 = "#414141";
const grey5 = "#515151";
//const grey6 = "#7f8c8d"; // "gray"

export default _.merge({}, {
  colors: {
    pageBackground: grey1,
    mainBackground: grey2,
    areaBackground: grey4,
    areaBackgroundAlt: grey1,
    areaBackgroundSubtle: grey3,
    areaBackgroundPrimary: grey5,
    inputBackground: grey2,
    areaBackgroundInverse: grey1,
    inverseColor: Irid(grey5).lighten(0.5).toHexString(),
    navbarTitleColor: grayLighter,
    bodyBg: "#FFFFFF",
    textColor: grayLight,
    linkColor: coreVars.colors.info,
    linkHoverColor: Irid(coreVars.colors.info).lighten(0.15).toHexString(),
    headingsColor: "#fff",
    secondaryHeadingsColor: grayLight,
    tertiaryHeadingsColor: grayLight,
    componentActiveColor: "#fff",
    componentActiveBg: coreVars.colors.primary,
  },
}, coreVars);
