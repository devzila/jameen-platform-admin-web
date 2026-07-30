"use client";

import { createContext, useEffect, useReducer, useState } from "react";

export const AuthContext = createContext(null);

function readStoredAuth() {
  if (typeof window === "undefined") {
    return {
      isAutheticated: false,
      user: null,
      platform_token: null,
    };
  }

  const token = localStorage.getItem("platform_token");
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  return {
    isAutheticated: token !== null,
    user,
    platform_token: token,
  };
}

export const initialAuthState = {
  isAutheticated: false,
  user: null,
  platform_token: null,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(action.payload.object));
        localStorage.setItem("platform_token", action.payload.token);
      }
      return {
        ...state,
        isAutheticated: true,
        user: action.payload.object,
        platform_token: action.payload.token,
      };
    case "LOGOUT":
      if (typeof window !== "undefined") {
        localStorage.clear();
      }
      return {
        ...state,
        isAutheticated: false,
        user: null,
        platform_token: null,
      };
    case "HYDRATE":
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialAuthState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    dispatch({ type: "HYDRATE", payload: readStoredAuth() });
    setReady(true);
  }, []);

  return (
    <AuthContext.Provider value={{ state: { ...state, ready }, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
