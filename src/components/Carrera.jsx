import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import careersData from "../assets/json/datos.json";
import NotFound from "../components/404";
import fondo from "../assets/img/fondoOferta.png";

const images = require.context("../assets/img/mallas", false, /\.(png|jpe?g|svg)$/);

export default function CareerCard() {
  const { sede, carrera } = useParams();
  const [showVideo, setShowVideo] = useState(false);
  const [activeTab, setActiveTab] = useState("mision");
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, visible: false });
  const iframeRef = useRef(null);

  useEffect(() => window.scrollTo(0, 0), []);

  const normalizeText = (text) =>
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "").toLowerCase();

  const sedeKey = Object.keys(careersData).find(
    (key) => normalizeText(key) === normalizeText(sede.replace(/([A-Z])/g, " $1").trim())
  );

  const sedeInfo = sedeKey ? careersData[sedeKey] : null;
  const data = sedeInfo?.carrera.find(
    (item) => normalizeText(item.title) === normalizeText(carrera)
  );

  const videoId = data?.video ? (() => {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/;
    const match = data.video.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  })() : null;

  const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
  const mallaImage = data?.malla ? images(`./${data.malla}`) : null;

  // --- Control cuando el video termina ---
  useEffect(() => {
    if (!showVideo || !iframeRef.current) return;

    const interval = setInterval(() => {
      const iframe = iframeRef.current;
      iframe.contentWindow.postMessage(JSON.stringify({ event: "listening" }), "*");
    }, 500);

    const handleMessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.event === "onStateChange" && msg.info === 0) {
          setShowVideo(false);
        }
      } catch {}
    };

    window.addEventListener("message", handleMessage);
    return () => {
      clearInterval(interval);
      window.removeEventListener("message", handleMessage);
    };
  }, [showVideo]);

  if (!sedeInfo) return <div className="text-center mt-5">Sede no encontrada</div>;
  if (!data) return <NotFound mensaje={`La sede no existe.`} />;

  // --- Zoom malla ---
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y, visible: true });
  };

  const handleMouseLeave = () => setZoomPos({ ...zoomPos, visible: false });

  // --- Tabs ---
  const tabs = [
    { key: "mision", label: "Misión", content: <p>{data.mission}</p> },
    { key: "vision", label: "Visión", content: <p>{data.vision}</p> },
    { key: "campo", label: "Campo Laboral", content: <ul>{data.roles?.map((r, i) => <li key={i}>{r}</li>)}</ul> },
    { key: "valores", label: "Valores", content: <ul>{data.values?.map((v, i) => <li key={i}>{v}</li>)}</ul> },
    {
      key: "malla",
      label: "Malla Curricular",
      content: mallaImage && (
        <div
          style={{ display: "inline-block", position: "relative" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={mallaImage}
            alt={`Malla ${data.title}`}
            className="img-fluid shadow-sm"
            style={{ borderRadius: "10px" }}
          />
          {zoomPos.visible && (
            <div
              style={{
                position: "absolute",
                top: `${zoomPos.y}%`,
                left: `${zoomPos.x}%`,
                width: "300px",
                height: "300px",
                borderRadius: "50%",
                pointerEvents: "none",
                transform: "translate(-50%, -50%)",
                backgroundImage: `url(${mallaImage})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "800%",
                backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                border: "2px solid #009DFA",
              }}
            />
          )}
        </div>
      )
    }
  ];

  const whatsapp = sedeInfo?.whatsapp || "";
  const mensaje = encodeURIComponent(`Hola, deseo solicitar más información sobre la carrera ${data.title} en la sede ${sede}.`);
  const enlaceWhatsApp = `https://wa.me/${whatsapp}?text=${mensaje}`;

  return (
    <AnimatePresence mode="wait">
      {/* Contenedor principal con fondo global */}
      <motion.div
        key={carrera}
        style={{
          position: "relative",
          minHeight: "100vh",
          fontFamily: "'Montserrat', sans-serif",
          color: "#001A66",
          backgroundImage: `url(${fondo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          marginTop: "-120px", // si hay menú fijo arriba
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Filtro blanco semitransparente */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.82)",
          zIndex: 0,
        }} />

        {/* Contenido encima del filtro */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: "1100px", margin: "0 auto", padding: "2rem 1rem" }}>
          <h1 style={{ fontSize: "3.5rem", fontWeight: 700, textAlign: "center", marginTop: "5.5rem" }}>{data.title}</h1>

          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", marginTop: "2rem" }}>
            {/* IZQUIERDA */}
            <div style={{ flex: "0 0 600px" }}>
              {videoId && (
                <div className="ratio ratio-16x9 mb-3">
                  {showVideo ? (
                    <iframe
                      ref={iframeRef}
                      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`}
                      title="Video de la carrera"
                      allowFullScreen
                      className="w-100 h-100 rounded shadow-sm"
                    />
                  ) : (
                    <div
                      className="w-100 h-100 d-flex align-items-center justify-content-center rounded shadow-sm"
                      style={{ backgroundImage: `url(${thumbnail})`, backgroundSize: "cover", backgroundPosition: "center", cursor: "pointer" }}
                      onClick={() => setShowVideo(true)}
                    >
                      <span style={{ background: "rgba(0,0,0,0.6)", borderRadius: "50%", padding: "20px", color: "white", fontSize: "2rem" }}>▶</span>
                    </div>
                  )}
                </div>
              )}
              <p style={{ whiteSpace: "pre-line", marginTop: "1rem" }}>{data.description}</p>
            </div>

            {/* DERECHA */}
            <div style={{ flex: "0 0 380px" }}>
              {data.rm && (
                <div style={{
                  backgroundColor: "#001A66", color: "#fff", padding: "0.5rem 1rem",
                  fontWeight: 700, marginBottom: "1.5rem", borderRadius: "5px",
                  textAlign: "center", borderBottom: "5px solid #009DFA"
                }}>{data.rm}</div>
              )}
              <div style={{ background: "#F5F7FF", padding: "1rem", borderRadius: "8px", boxShadow: "0 0 6px rgba(0,0,0,0.1)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {tabs.map((tab) => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                      style={{
                        backgroundColor: activeTab === tab.key ? "#009DFA" : "#001A66",
                        color: "#fff", border: "none", padding: "0.6rem", cursor: "pointer",
                        fontWeight: 600, borderRadius: "5px"
                      }}>{tab.label}</button>
                  ))}
                </div>
                <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }} style={{ marginTop: "1rem" }}>
                  {tabs.find((t) => t.key === activeTab)?.content}
                </motion.div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "1.5rem", paddingBottom:"2rem" }}>
            <a href={enlaceWhatsApp} target="_blank" rel="noopener noreferrer"
              style={{
                backgroundColor: "#1f219bff", padding: "0.8rem 1.5rem", borderRadius: "8px",
                color: "white", textDecoration: "none", fontWeight: 700, fontSize: "1.1rem", display: "inline-block"
              }}
            >Solicitar más información</a>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
