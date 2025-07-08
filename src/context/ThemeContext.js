import React from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";

const theme = {
  background: "bg-gradient-to-br from-green-100 to-green-300",
  color: "text-gray-800",
  primary: "#007bff",
  secondary: "#6c757d",
  success: "#28a745",
  error: "#dc3545",
  fontFamily: "Inter, Arial, sans-serif",
};

export const ThemeProvider = ({ children }) => {
  return (
    <StyledThemeProvider theme={theme}>
      <div className={`${theme.background} ${theme.color} min-h-screen`}>
        {children}
      </div>
    </StyledThemeProvider>
  );
};