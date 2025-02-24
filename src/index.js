import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/scss/light-bootstrap-dashboard-react.scss?v=2.0.0";
import "./assets/css/demo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import "react-toastify/dist/ReactToastify.css";

const AdminLayout = React.lazy(() => import("./layouts/Admin"));

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <>
    <BrowserRouter>
      <Suspense>
        <Routes>
          <Route path="*" element={<AdminLayout />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
    <ToastContainer />
  </>
);
