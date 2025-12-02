import React from "react";
import { Link } from "react-router-dom";
import lobo from "../assets/img/lobo404.png"

export default function NotFound({ mensaje }) {
  return (
    <div style={{ textAlign: "center", marginTop: "0rem", padding: "0 1rem 8rem 0rem" }}>
      <h1 style={{ fontSize: "4rem", color: "#001A66", marginBottom: "1rem" }}>404</h1>
      <img src={lobo} alt="lobo error"
      style={{
        height:"15rem"
      }}
      />
      <h2 style={{ fontSize: "2rem", color: "#009DFA", marginBottom: "1rem",padding: "0 0rem 3rem 0rem" }}>
        Página no encontrada
      </h2>
      
      <Link
        to="/"
        style={{
          color: "#fff",
          backgroundColor: "#001A66",
          padding: "0.8rem 1.5rem",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "700",
          fontSize: "1rem",
        }}
      >
        Ir al inicio
      </Link>
    </div>
  );
}