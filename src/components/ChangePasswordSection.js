import React, { useState } from "react";
import api from "../services/api";

export default function ChangePasswordSection({ user }) {
  const [step, setStep] = useState(0); // 0: button, 1: code sent, 2: verified
  const [email, setEmail] = useState(user.email);
  const [code, setCode] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendCode = async () => {
    setLoading(true);
    setMessage("");
    try {
      await api.post("/auth/request-password-code", email, {
        headers: { "Content-Type": "application/json" },
      });
      setStep(1);
      setMessage("Verification code sent to your email.");
    } catch (err) {
      setMessage(err.response?.data || "Failed to send code.");
    }
    setLoading(false);
  };

  const verifyCode = async () => {
    setLoading(true);
    setMessage("");
    try {
      await api.post("/auth/verify-password-code", { email, code: enteredCode });
      setStep(2);
      setMessage("Code verified. You can now set a new password.");
    } catch (err) {
      setMessage(err.response?.data || "Invalid code.");
    }
    setLoading(false);
  };

  const changePassword = async () => {
    setLoading(true);
    setMessage("");
    try {
      await api.post("/auth/change-password", { email, code: enteredCode, newPassword });
      setMessage("Password changed successfully!");
      setStep(0);
      setEnteredCode("");
      setNewPassword("");
    } catch (err) {
      setMessage(err.response?.data || "Failed to change password.");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "32px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0002", padding: 24 }}>
      <h2 style={{ color: "#2563eb" }}>Change Password</h2>
      {step === 0 && (
        <>
          <p style={{ color: "#444" }}>Click below to receive a verification code on your email.</p>
          <button onClick={sendCode} disabled={loading} style={{ background: "#2563eb", color: "white", padding: "10px 24px", border: 0, borderRadius: 6, fontWeight: "bold", fontSize: "1em", cursor: "pointer" }}>Send Verification Code</button>
        </>
      )}
      {step === 1 && (
        <>
          <p style={{ color: "#444" }}>Enter the code you received in your email:</p>
          <input type="text" value={enteredCode} onChange={e => setEnteredCode(e.target.value)} placeholder="Enter code" style={{ width: "100%", padding: 8, marginBottom: 12, borderRadius: 5, border: "1px solid #bbb" }} />
          <button onClick={verifyCode} disabled={loading || !enteredCode} style={{ background: "#2563eb", color: "white", padding: "10px 24px", border: 0, borderRadius: 6, fontWeight: "bold", fontSize: "1em", cursor: "pointer" }}>Verify Code</button>
        </>
      )}
      {step === 2 && (
        <>
          <p style={{ color: "#444" }}>Enter your new password:</p>
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password" style={{ width: "100%", padding: 8, marginBottom: 12, borderRadius: 5, border: "1px solid #bbb" }} />
          <button onClick={changePassword} disabled={loading || !newPassword} style={{ background: "#2563eb", color: "white", padding: "10px 24px", border: 0, borderRadius: 6, fontWeight: "bold", fontSize: "1em", cursor: "pointer" }}>Change Password</button>
        </>
      )}
      {message && <div style={{ marginTop: 16, color: message.includes("success") ? "#22c55e" : "#e53e3e" }}>{message}</div>}
    </div>
  );
}
