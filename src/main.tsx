import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { HashRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";

const CLERK_PUBLISHABLE_KEY = "pk_test_dW5pcXVlLWNvZC0zMS5jbGVyay5hY2NvdW50cy5kZXYk";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    </HashRouter>
  </StrictMode>
);
