import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // 1. Import this
import App from "./App";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { CartProvider } from "./context/CartContext";
import { Provider } from "react-redux";
import { store } from "./store/store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* 2. Wrap your App component here */}
    <BrowserRouter>
      <CartProvider>
        <Provider store={store}>
          <ToastContainer
            autoClose={3000}
            pauseOnHover={false}
            position="top-center"
          />
          <App />
        </Provider>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
