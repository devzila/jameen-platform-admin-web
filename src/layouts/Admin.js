import React, { Suspense } from "react";
import { useLocation, Route, Routes } from "react-router-dom";
import { Provider, useFetch } from "use-http";

import Sidebar from "components/Sidebar/Sidebar";
import Login from "../views/Login";

import routes from "routes.js";

import sidebarImage from "assets/img/sidebar-4.jpg";
import {
  AuthContext,
  initialAuthState,
  reducer,
} from "../contexts/AuthContext";
import AppDataContext from "contexts/AppDataContext";
import options from "./Options";

function Admin() {
  const [image, setImage] = React.useState(sidebarImage);
  const [appData, setAppData] = React.useState(null);
  const [color, setColor] = React.useState("black");
  const [hasImage, setHasImage] = React.useState(true);
  const location = useLocation();
  const mainPanel = React.useRef(null);
  const [state, dispatch] = React.useReducer(reducer, initialAuthState);
  const { get, response } = useFetch(
    process.env.REACT_APP_API_URL,
    options,
    []
  );

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      return (
        <Route exact path={prop.path} element={prop.component} key={key} />
      );
    });
  };

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    if (mainPanel.current) {
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
          <Provider
            url={process.env.REACT_APP_API_URL}
            options={{
              ...options,
              ...{
                headers: {
                  Authorization: localStorage.getItem("platform_token"),
                },
              },
            }}
          >
            <AppDataContext.Provider value={appData}>
              <Sidebar
                color={color}
                image={hasImage ? image : ""}
                routes={routes}
              />
              <div className="main-panel" ref={mainPanel}>
                <div className="content">
                  <Suspense>
                    <Routes>{getRoutes(routes)}</Routes>
                  </Suspense>
                </div>
              </div>
            </AppDataContext.Provider>
          </Provider>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export default Admin;
