import React from "react";
import { useLocation, Route, Switch } from "react-router-dom";
import { Provider, useFetch } from 'use-http'

import Sidebar from "components/Sidebar/Sidebar";
import Login from "../views/Login"

import routes from "routes.js";

import sidebarImage from "assets/img/sidebar-4.jpg";
import { AuthContext, initialAuthState, reducer } from '../contexts/AuthContext'
import AppDataContext from "contexts/AppDataContext"
import options from './Options'


function Admin() {
  const [image, setImage] = React.useState(sidebarImage)
  const [appData, setAppData] = React.useState(null)
  const [color, setColor] = React.useState("black")
  const [hasImage, setHasImage] = React.useState(true)
  const location = useLocation();
  const mainPanel = React.useRef(null);
  const [state, dispatch] = React.useReducer(reducer, initialAuthState);
  const { get, response } = useFetch(process.env.REACT_APP_API_URL, options, [])

  async function loadAppData() {
    const api = await get('/v1/platform_admin/options')
    if (response.ok) {
      setAppData(api)
    }
  }


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
      if(!appData) { loadAppData() }
  }, [location]);
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {!state.isAutheticated ? (
        <Login />
      ) : (
        <div className="wrapper">
          <Provider url={process.env.REACT_APP_API_URL} options={options}>
            <AppDataContext.Provider value={appData}>
              <Sidebar color={color} image={hasImage ? image : ""} routes={routes} />
              <div className="main-panel" ref={mainPanel}>
                <div className="content">
                  <Switch>{getRoutes(routes)}</Switch>
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
