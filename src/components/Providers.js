"use client";

import { AuthProvider } from "contexts/AuthContext";
import { ToastContainer } from "react-toastify";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      {children}
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}
