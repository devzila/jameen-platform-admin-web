"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "components/Sidebar/Sidebar";
import { AuthContext } from "contexts/AuthContext";
import React from "react";
import sidebarImage from "assets/img/sidebar-4.jpg";

export default function AdminShell({ children }) {
  const { state } = React.useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();
  const mainPanel = React.useRef(null);
  const ready = state?.ready !== false;

  useEffect(() => {
    if (!ready) return;
    if (!state?.isAutheticated) {
      router.replace("/login");
    }
  }, [ready, state?.isAutheticated, router]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }
    if (mainPanel.current) {
      mainPanel.current.scrollTop = 0;
    }
  }, [pathname]);

  if (!ready) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        Loading...
      </div>
    );
  }

  if (!state?.isAutheticated) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        Redirecting to sign in...
      </div>
    );
  }

  return (
    <div className="wrapper">
      <Sidebar color="black" image={sidebarImage?.src || sidebarImage} />
      <div className="main-panel" ref={mainPanel}>
        <div className="content">{children}</div>
      </div>
    </div>
  );
}
