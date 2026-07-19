"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Nav } from "react-bootstrap";
import logo from "assets/img/jameen-logo.png";
import { AuthContext } from "contexts/AuthContext";

const MAIN_LINKS = [
  { path: "/companies", name: "Companies", icon: "nc-icon nc-chart-pie-35" },
  {
    path: "/invoice-templates",
    name: "Invoice Templates",
    icon: "nc-icon nc-single-copy-04",
  },
  { path: "/subscriptions", name: "Subscription", icon: "nc-icon nc-notes" },
  {
    path: "/invoice-run-history",
    name: "Invoice Run History",
    icon: "nc-icon nc-time-alarm",
  },
  { path: "/sessions", name: "Login/Sessions", icon: "nc-icon nc-key-25" },
];

function Sidebar({ color = "black", image }) {
  const pathname = usePathname();
  const router = useRouter();
  const { dispatch } = React.useContext(AuthContext);

  const handleLogout = (event) => {
    event.preventDefault();
    dispatch({ type: "LOGOUT", payload: null });
    router.replace("/login");
  };

  const isActive = (routeName) =>
    pathname === routeName || pathname.startsWith(`${routeName}/`);

  return (
    <div className="sidebar" data-image={image} data-color={color}>
      <div
        className="sidebar-background"
        style={{
          backgroundImage: image ? `url(${image})` : undefined,
        }}
      />
      <div className="sidebar-wrapper">
        <div className="logo d-flex align-items-center justify-content-start">
          <Link href="/companies" className="simple-text logo-mini mx-1">
            <div className="logo-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo.src || logo} alt="Jameen" />
            </div>
          </Link>
          <span className="simple-text">Platform Admin</span>
        </div>
        <Nav>
          {MAIN_LINKS.map((item) => (
            <li
              className={isActive(item.path) ? "active" : ""}
              key={item.path}
            >
              <Link href={item.path} className="nav-link">
                <i className={item.icon} />
                <p>{item.name}</p>
              </Link>
            </li>
          ))}

          <li className="active active-pro" key="logout">
            <a href="#logout" className="nav-link" onClick={handleLogout}>
              <i className="nc-icon nc-alien-33" />
              <p>Logout</p>
            </a>
          </li>
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;
