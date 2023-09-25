import React from "react"
import { toast } from 'react-toastify'
import { AuthContext } from '../contexts/AuthContext'

const Login = () => {
  const { dispatch } = React.useContext(AuthContext)
  const initialState = {
    email: '',
    password: '',
    isSubmitting: false,
    errorMessage: null,
  }
  const [data, setData] = React.useState(initialState)
  const handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    })
  }
  const handleFormSubmit = (event) => {
    event.preventDefault()
    setData({
      ...data,
      isSubmitting: true,
      errorMessage: null,
    })
    fetch(`${process.env.REACT_APP_API_URL}/v1/platform_admin/auth/session`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: data.email,
        password: data.password,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json()
        }
        throw res
      })
      .then((resJson) => {
        dispatch({
          type: 'LOGIN',
          payload: resJson,
        })
      })
      .catch((error) => {
        if (!('json' in error) || error.status == 404) {
          toast('Unknown Error Occured. Server response not received.')
          setData({
            ...data,
            isSubmitting: false,
          })
          return
        }
        console.log(error.status)
        error.json().then((response) => {
          toast(response.message)
          setData({
            ...data,
            isSubmitting: false,
            errorMessage: response.message || error.statusText,
          })
        })
      })
  }

  return (
    <div className="Auth-form-container">
      <form method="post" className="Auth-form" onSubmit={handleFormSubmit}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign In</h3>
          <div className="form-group mt-3">
            <label>Username</label>
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
          <div className="d-grid gap-2 mt-3">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={data.isSubmitting}
            >
              {data.isSubmitting ? 'Loading...' : 'Login'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Login
