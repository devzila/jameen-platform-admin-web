import React, { Component } from "react";
import { useLocation, NavLink } from "react-router-dom";

import { Nav } from "react-bootstrap";

import logo from "assets/img/jameen-logo.png";
import { AuthContext } from "./../../contexts/AuthContext";

function Sidebar({ color, image, routes }) {
  const location = useLocation();
  const { dispatch } = React.useContext(AuthContext);
  const handleLogout = (event) => {
    event.preventDefault();
    dispatch({
      type: "LOGOUT",
      payload: null,
    });
  };
  const activeRoute = (routeName) => {
    return location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };
  return (
    <div className="sidebar" data-image={image} data-color={color}>
      <div
        className="sidebar-background"
        style={{
          backgroundImage: "url(" + image + ")",
        }}
      />
      <div className="sidebar-wrapper">
        <div className="logo d-flex align-items-center justify-content-start">
          <a className="simple-text logo-mini mx-1">
            <div className="logo-img">
              <img src={logo} alt="..." />
            </div>
          </a>
          <a className="simple-text">Platform Admin</a>
        </div>
        <Nav>
          {routes.map((prop, key) => {
            if (prop.main)
              return (
                <li
                  className={
                    prop.upgrade ? "active active-pro" : activeRoute(prop.path)
                  }
                  key={key}
                >
                  <NavLink to={prop.path} className="nav-link">
                    <i className={prop.icon} />
                    <p>{prop.name}</p>
                  </NavLink>
                </li>
              );
            return null;
          })}

          <li className="active active-pro" key="99">
            <NavLink to="" className="nav-link" onClick={handleLogout}>
              <i className="nc-icon nc-alien-33" />
              <p>Logout</p>
            </NavLink>
          </li>
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;
