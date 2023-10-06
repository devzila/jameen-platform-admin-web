import React, { Component } from "react";
import { useLocation, Route, Switch } from "react-router-dom";
import { Provider } from 'use-http'

import Sidebar from "components/Sidebar/Sidebar";
import Login from "../views/Login"

import routes from "routes.js";

import sidebarImage from "assets/img/sidebar-4.jpg";
import { AuthContext, initialAuthState, reducer } from '../contexts/AuthContext'
import options from './Options'


function Admin() {
  const [image, setImage] = React.useState(sidebarImage);
  const [color, setColor] = React.useState("black");
  const [hasImage, setHasImage] = React.useState(true);
  const location = useLocation();
  const mainPanel = React.useRef(null);
  const [state, dispatch] = React.useReducer(reducer, initialAuthState);


  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      return (
        <Route
          exact path={prop.path}
          render={(props) => <prop.component {...props} />}
          key={key}
        />
      );
    });
  };
  React.useEffect(() => {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      if(mainPanel.current) {
        mainPanel.current.scrollTop = 0;
        if (
          window.innerWidth < 993 &&
          document.documentElement.className.indexOf("nav-open") !== -1
        ) {
          document.documentElement.classList.toggle("nav-open");
          var element = document.getElementById("bodyClick");
          element.parentNode.removeChild(element);
        }
      }  
  }, [location]);
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {!state.isAutheticated ? (
        <Login />
      ) : (
        <div className="wrapper">
          <Provider url={process.env.REACT_APP_API_URL} options={options}>
            <Sidebar color={color} image={hasImage ? image : ""} routes={routes} />
            <div className="main-panel" ref={mainPanel}>
              <div className="content">
                <Switch>{getRoutes(routes)}</Switch>
              </div>
            </div>
          </Provider>
        </div>
      )} 
    </AuthContext.Provider>   
  );
}

export default Admin;
