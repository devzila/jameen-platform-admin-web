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

  useEffect(() => {
    if (!state?.isAutheticated) {
      router.replace("/login");
    }
  }, [state?.isAutheticated, router]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }
    if (mainPanel.current) {
      mainPanel.current.scrollTop = 0;
    }
  }, [pathname]);

  if (!state?.isAutheticated) {
    return null;
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
