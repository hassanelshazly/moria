import { createMuiTheme } from "@material-ui/core/styles";
import {isItDark} from "./../components/MainNav"
const theme = createMuiTheme({
  palette: {
     type:isItDark? 'dark':'light',
    primary: {
      light: "#21CBF3",
      main: "#2196F3",
      dark: "#2196F3",
    },
    secondary: {
      light: "#FF8E53",
      main: "#FE6B8B",
      dark: "#FE6B8B",
    },
    action: {
      selected: "rgba(33, 203, 243, 0.14)",
    },
  },
  shape: {
    borderRadius: 16,
  },
});

export default theme;
