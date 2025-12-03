import { useEffect } from "react";
import fondoNoticias from "../assets/img/noticias.webp";

export default function Noticias() {
  useEffect(() => {
    // Revisar si el script ya está cargado
    if (!document.getElementById("elfsight-script")) {
      const script = document.createElement("script");
      script.id = "elfsight-script";
      script.src = "https://elfsightcdn.com/platform.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <section
      id="noticias"
      className="py-5 bg-light"
      style={{
        background: `linear-gradient(to right, rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url(${fondoNoticias}) center/cover no-repeat`,
      }}
    >
      <div className="container text-center">
        <h2
          className="mb-4 fw-bold"
          style={{ fontSize: "3em", color: "#001A66" }}
        >
          Últimas Noticias
        </h2>
        <p
          className="mb-4 fw-semibold"
          style={{ fontSize: "1.5em", color: "#001A66" }}
        >
          Entérate de los eventos, ferias, actividades y congresos de la UNO
        </p>

        <div
          className="mx-auto"
          style={{
            maxWidth: "900px",
            overflow: "visible",
            position: "relative",
          }}
        >
          {/* Div de Elfsight */}
          <div
            className="elfsight-app-c9a88a88-eca1-4915-bbee-8dcc660e0042"
            data-elfsight-app-lazy
          ></div>
        </div>
      </div>
    </section>
  );
}
