import GoogleLogin from "react-google-login";
import { useState, useEffect } from "react";
import "../styles/Login.css";

export default function Login() {
  const [loginData, setLoginData] = useState(
    localStorage.getItem("loginData")
      ? JSON.parse(localStorage.getItem("loginData"))
      : null
  );

  const handleFailure = (result) => {
    alert(result);
  };

  const handleLogin = async (googleData) => {
    const res = await fetch("/api/google-login", {
      method: "POST",
      body: JSON.stringify({
        token: googleData.tokenId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    setLoginData(data);
    localStorage.setItem("loginData", JSON.stringify(data));
  };

  const handleLogout = () => {
    localStorage.removeItem("loginData");
    setLoginData(null);
  };

  if (loginData) {
    return (window.location.href = "/dashboard");
  }

  return (
    <header className="App-header">
      <h1
        style={{
          fontWeight: 500,
          fontSize: "23px",
          color: "#ccc",
          marginBottom: "30px",
        }}
      >
        Log in or create an account using Google
      </h1>
      <div>
        {/* {loginData ? (
          <div>
            <h3>You logged in as {loginData.email}</h3>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            buttonText="Log in with Google"
            onSuccess={handleLogin}
            onFailure={handleFailure}
            cookiePolicy={"single_host_origin"}
          ></GoogleLogin>
        )} */}
        {!loginData && (
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            buttonText="Log in with Google"
            onSuccess={handleLogin}
            onFailure={handleFailure}
            cookiePolicy={"single_host_origin"}
          ></GoogleLogin>
        )}
      </div>
    </header>
  );
}
