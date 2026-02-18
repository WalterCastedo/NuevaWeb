import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import lobo from "../assets/img/lobo404.webp";

export default function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();

  // Detecta la sede en la URL
  const partes = location.pathname.split("/").filter(Boolean);
  // Si la primera parte coincide con alguna sede, úsala; sino vuelve a "/"
  const sedes = ["santacruz", "montero", "tarija", "cochabamba", "yacuiba", "shinahota"];
  const sede = sedes.includes(partes[0]?.toLowerCase()) ? partes[0] : null;

  const destino = sede ? `/${sede}` : "/";

  return (
    <div style={{ textAlign: "center", marginTop: "0rem", padding: "0 1rem 8rem 0rem" }}>
      <h1 style={{ fontSize: "4rem", color: "#001A66", marginBottom: "1rem" }}>404</h1>
      <img src={lobo} alt="lobo error" style={{ height: "15rem" }} />
      <h2 style={{ fontSize: "2rem", color: "#009DFA", marginBottom: "1rem", padding: "0 0rem 3rem 0rem" }}>
        Página no encontrada
      </h2>

      <button
        onClick={() => navigate(destino)}
        style={{
          color: "#fff",
          backgroundColor: "#001A66",
          padding: "0.8rem 1.5rem",
          borderRadius: "8px",
          border: "none",
          fontWeight: "700",
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        Volver a {sede ? "la sede" : "inicio"}
      </button>
    </div>
  );
}
