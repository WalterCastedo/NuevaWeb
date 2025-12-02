import React from "react";

export default function Loader() {
  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  };

  const spinnerStyle = {
    width: "60px",
    height: "60px",
    border: "6px solid #ddd",
    borderTopColor: "#007bff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  };

  const keyframes = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div style={overlayStyle}>
        <div style={spinnerStyle}></div>
      </div>
    </>
  );
}
