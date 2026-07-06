import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { router } from "./router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <>
      <AuthContextProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </AuthContextProvider>
    </>
  </StrictMode>,
);
