import React from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../contexts/AuthContext";
import logo from "assets/img/jameen-logo.png";

const Login = () => {
  const { dispatch } = React.useContext(AuthContext);

  const initialState = {
    email: "",
    password: "",
    isSubmitting: false,
    errorMessage: null,
  };
  const [data, setData] = React.useState(initialState);

  const handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setData({
      ...data,
      isSubmitting: true,
      errorMessage: null,
    });
    fetch(`${process.env.REACT_APP_API_URL}/v1/platform_admin/auth/session`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw res;
      })
      .then((resJson) => {
        dispatch({
          type: "LOGIN",
          payload: resJson,
        });
      })
      .catch((error) => {
        if (!("json" in error) || error.status == 404) {
          toast.error("Unknown Error Occured. Server response not received.");
          setData({
            ...data,
            isSubmitting: false,
          });
          return;
        }
        error.json().then((response) => {
          toast.error(response.message);
          setData({
            ...data,
            isSubmitting: false,
            errorMessage: response.message || error.statusText,
          });
        });
      });
  };

  return (
    <div className="Auth-form-container">
      <form method="post" className="Auth-form" onSubmit={handleFormSubmit}>
        <div className="Auth-form-content">
          <div className="d-flex align-items-center mb-3">
            <img
              src={logo}
              alt="Jameen"
              style={{
                width: 42,
                height: 42,
                objectFit: "contain",
                marginRight: 12,
              }}
            />
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--admin-primary)",
                }}
              >
                Jameen
              </div>
              <div style={{ fontWeight: 700, color: "var(--admin-text)" }}>
                Platform Admin
              </div>
            </div>
          </div>
          <h3 className="Auth-form-title">Sign in</h3>
          <p className="mb-4" style={{ color: "var(--admin-text-muted)" }}>
            Access the platform administration console.
          </p>
          <div className="form-group mt-3">
            <label>Email</label>
            <input
              name="email"
              className="form-control mt-1"
              placeholder="Enter email"
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control mt-1"
              placeholder="Enter password"
              onChange={handleInputChange}
            />
          </div>
          <div className="d-grid gap-2 mt-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={data.isSubmitting}
            >
              {data.isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
