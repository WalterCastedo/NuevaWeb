import { useEffect, useState } from "react";
import fondoNoticiasDefault from "../assets/img/noticias.webp";
import { useParams } from "react-router-dom";
import dataJson from "../assets/json/datos.json";

export default function Noticias() {
  const { sede } = useParams();
  const [fondoImg, setFondoImg] = useState(fondoNoticiasDefault);
  const [iframeUrl, setIframeUrl] = useState("https://widget.tagembed.com/317304?website=1"); // default

  // Actualizar fondo e iframe según sede
  useEffect(() => {
    if (!sede) return;
    const dataSede = dataJson[sede];

    // Fondo
    if (dataSede?.imagenes?.fondoNoticias) {
      try {
        const fondo = require(`../assets/img/${dataSede.imagenes.fondoNoticias}`);
        setFondoImg(fondo);
      } catch {
        setFondoImg(fondoNoticiasDefault);
      }
    } else {
      setFondoImg(fondoNoticiasDefault);
    }

    // URL del iframe
    if (dataSede?.imagenes?.iframeNoticias) {
      setIframeUrl(dataSede.imagenes.iframeNoticias);
    }
  }, [sede]);

  return (
    <section
      id="noticias"
      className="py-5 bg-light"
      style={{
        background: `linear-gradient(to right, rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url(${fondoImg}) center/cover no-repeat`,
      }}
    >
      <div className="container text-center">
        <h2 className="mb-4 fw-bold" style={{ fontSize: "3em", color: "#001A66" }}>
          Últimas Noticias
        </h2>
        <p className="mb-4 fw-semibold" style={{ fontSize: "1.5em", color: "#001A66" }}>
          Entérate de los eventos, ferias, actividades y congresos de la UNO
        </p>

        <div
          className="mx-auto"
          style={{
            maxWidth: "900px",
            height: "600px",  // altura del iframe
            overflow: "hidden",
            position: "relative",
          }}
        >
          <iframe
            src={iframeUrl}
            allow="fullscreen"
            style={{
              width: "100%",
              height: "100%",
              overflow: "auto",
              border: "none",
            }}
          ></iframe>
        </div>
      </div>
    </section>
  );
}
