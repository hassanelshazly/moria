import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import "fontsource-roboto";
import theme from "./config/theme";
import App from "./App";
import CssBaseline from "@material-ui/core/CssBaseline";
// import { StateProvider } from "./state/store";
// import { reducer, initialState } from "./state/reducer";
import { Provider } from "react-redux";
import store from "./state/reduxStore";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    {/* <StateProvider initialState={initialState} reducer={reducer}> */}
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router>
          <CssBaseline />
          <App />
        </Router>
      </ThemeProvider>
    </Provider>
    {/* </StateProvider> */}
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
