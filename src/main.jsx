import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./styles.css";
import { AuthContextProvider } from "./contexts/AuthContext.jsx";
// import { ReservedContextProvider } from "./contexts/ReservedContext.jsx";
// import { CarNumberContextProvider } from "./contexts/CarNumberContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      {/* <CarNumberContextProvider>
        <ReservedContextProvider> */}
          <App />
        {/* </ReservedContextProvider>
      </CarNumberContextProvider> */}
    </AuthContextProvider>
  </React.StrictMode>
);
