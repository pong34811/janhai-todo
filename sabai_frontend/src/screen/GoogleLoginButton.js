import React, { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

function GoogleLoginButton() {
  const handleGoogleLogin = (response) => {
    const token = response.credential;
    const decoded = jwtDecode(token);
    console.log("Decoded Token:", decoded);

    // เก็บ Token ใน Local Storage
    localStorage.setItem("token", token);

    // ทำสิ่งที่ต้องการ เช่น Redirect
    window.location.href = "/boards";
  };

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "", // ใส่ Client ID ที่ได้จาก Google Cloud
      callback: handleGoogleLogin,
    });

    google.accounts.id.renderButton(
      document.getElementById("googleSignIn"),
      {
        theme: "outline",
        size: "large",
      }
    );
  }, []);

  return <div id="googleSignIn"></div>;
}

export default GoogleLoginButton;
