import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { URL_AUTH } from "../routes/CustomAPI";
import "./LoginView.css";
import GoogleLoginButton from "./GoogleLoginButton";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [message, setmessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(URL_AUTH.LoginAPI, {
        username,
        password,
      });
      const { access, refresh, user } = response.data;
      localStorage.setItem("token", access);
      localStorage.setItem("username", user.username);
      navigate("/boards");
    } catch {
      setmessage("กรอกกรุณาตรวจสอบข้อมูล User เเละ Password ใหม่ ?");
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    const accessToken = credentialResponse?.credential; // รับ Access token จาก Google OAuth
    console.log("Received access token:", accessToken); // ตรวจสอบว่าเป็น access token ที่ต้องการ

    if (!accessToken) {
      console.error("No access token received");
      return;
    }

    const code = credentialResponse?.code;
    console.log("Received code:", code);

    try {
      // ส่ง Access token, Code, และ ID token ไปยัง backend
      const response = await axios.post(URL_AUTH.GoogleLoginAPI, {
        access_token: accessToken,
        code: code, // ส่ง Code ถ้ามี
        id_token: accessToken, // คุณสามารถส่ง ID token ถ้าแยกออกจาก access token ได้
      });
      setmessage("Login Successful:", response.data);

      // หลังจากเข้าสู่ระบบสำเร็จ เปลี่ยนเส้นทางไปที่ /boards
      navigate("/boards");
    } catch (error) {
      console.error("Login Failed:", error.response || error);
    }
  };


  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setmessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <>
      {message && (
        <div className="message-box">
          <p>{message}</p>
        </div>
      )}
      <main>
        <div className="container-login">
          <div className="header-login">
            <Link to="/">
              <img src="/logo.png" className="item-img" alt="Logo" />
            </Link>
          </div>
          <div className="login-form">
            <form onSubmit={handleSubmit}>
              <div className="form-title">
                <h2>Login</h2>
                <img src="/logo.png" className="item-img" alt="Logo" />
              </div>
              <div className="form-input-login">
                <label>Username:</label>
                <input
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                />
                <label>Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <p>
                  No account? <Link to="/register">Register</Link> or{" "}
                  <Link to="/reset-password">Forget password</Link>.
                </p>
              </div>

              <div className="form-button-login">
                <button type="submit">Login</button>
              </div>
            </form>

            {/* Google Login Button */}
            <div className="google-login">
            <GoogleLoginButton />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Login;
