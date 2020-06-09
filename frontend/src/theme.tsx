import * as React from "react";
import { Global, css } from "@emotion/core";

export const theme = {
  breakpoints: ["40em", "52em", "64em"],
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64],
  colors: {
    primary: "#542E71",
    orange: "#E26D5C",
    blue: "#07c",
    lightgray: "#f6f6ff"
  },
  space: [0, 4, 8, 16, 32, 64, 128, 256],
  fonts: {
    heading: "Roboto, system-ui, sans-serif",
    sans: "Roboto, system-ui, sans-serif",
    mono: "Menlo, monospace"
  },
  shadows: {
    small: "0 8px 12px -8px rgba(0, 0, 0, 0.2)",
    large: "0 18px 16px -15px rgba(0,0,0,0.3), 0 10px 10px -20px rgba(0,0,0,0.8)"
  },
  buttons: {
    clear: {
      bg: 'transparent',
      m: 0,
      p: 0,
      outline: 0,
      border: 0,
    }
  }
};

export const GlobalStyle: React.FC = () => (
  <Global
    styles={css`
      body {
        min-height: 100vh;
        margin: 0;
      }

      html,
      input {
        font-family: ${theme.fonts.sans};
      }


      pre {
        font-family: ${theme.fonts.mono};
      }
    `}
  />
);
