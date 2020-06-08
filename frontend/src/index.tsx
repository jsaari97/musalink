import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { ThemeProvider } from "emotion-theming";
import { theme, GlobalStyle } from "./theme";

const Root = () => (
  <ThemeProvider theme={theme}>
    <>
      <App />
      <GlobalStyle />
    </>
  </ThemeProvider>
);

ReactDOM.render(<Root />, document.getElementById("root"));

serviceWorker.unregister();
