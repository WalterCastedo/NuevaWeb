import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import careersData from "../assets/json/datos.json";
import NotFound from "../components/404";
import fondo from "../assets/img/fondoOferta.webp";

const images = require.context("../assets/img/mallas", false, /\.(png|jpe?g|svg|webp)$/);

export default function CareerCard() {
  const { sede, carrera } = useParams();
  const [showVideo, setShowVideo] = useState(false);
  const [activeTab, setActiveTab] = useState("misionVision");
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, visible: false });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const iframeRef = useRef(null);

  // Detectar tamaño móvil
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  if (!sedeInfo) return <div className="text-center mt-5">Sede no encontrada</div>;
  if (!data) return <NotFound mensaje={`La carrera no existe.`} />;

  const videoId = data?.video
    ? (() => {
        const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/;
        const match = data.video.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
      })()
    : null;

  const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
  const mallaImage = data?.malla ? images(`./${data.malla}`) : null;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y, visible: true });
  };
  const handleMouseLeave = () => setZoomPos({ ...zoomPos, visible: false });

  const whatsapp = sedeInfo?.whatsapp || "";
  const mensaje = encodeURIComponent(`Hola, deseo solicitar más información sobre la carrera ${data.title} en la sede ${sede}.`);
  const enlaceWhatsApp = `https://wa.me/${whatsapp}?text=${mensaje}`;

  // Tabs
  const tabs = [
    {
      key: "misionVision",
      label: "Misión y Visión",
      content: (
        <div>
          <p>{data.mission}</p>
          <p>{data.vision}</p>
        </div>
      ),
    },
    {
      key: "campo",
      label: "Campo Laboral",
      content: <ul>{data.roles?.map((r, i) => <li key={i}>{r}</li>)}</ul>,
    },
    {
      key: "valores",
      label: "Valores",
      content: <ul>{data.values?.map((v, i) => <li key={i}>{v}</li>)}</ul>,
    },
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
            style={{ borderRadius: "10px", width: "100%" }}
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
      ),
    },
    {
      key: "informacion",
      label: "Solicitar Información",
      content: (
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <a
            href={enlaceWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: "#1f219bff",
              padding: "0.8rem 1.5rem",
              borderRadius: "8px",
              color: "white",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "1.1rem",
              display: "inline-block",
            }}
          >
            Solicitar más información
          </a>
        </div>
      ),
    },
  ];

  // Variants animación
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.4, ease: "easeIn" } },
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.25 } },
  };

  const videoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3, ease: "easeIn" } },
  };

  return (
    <div
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
        marginTop: "-13rem",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(255,255,255,0.82)",
          zIndex: 0,
        }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={carrera}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{ position: "relative", zIndex: 1, maxWidth: "1100px", margin: "0 auto", padding: "2rem 1rem", marginTop: "5rem" }}
        >
          <h1
  style={{
    fontSize: isMobile ? "2rem" : "3.5rem", // más pequeño en móvil
    fontWeight: 700,
    textAlign: "center",
    marginTop: "6rem",
    wordBreak: "break-word",         // evita que se desborde
    overflowWrap: "break-word",      // soporte extra
    lineHeight: isMobile ? "2.4rem" : "4rem", // ajusta la altura de línea
    padding: isMobile ? "0 1rem" : "0", // añade padding lateral en móvil
  }}
>
  {data.title}
</h1>

          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: "2rem",
              justifyContent: "center",
              flexWrap: "wrap",
              alignItems: isMobile ? "center" : "flex-start",
              marginTop: "2rem",
            }}
          >
            {/* IZQUIERDA */}
            <div style={{ flex: isMobile ? "1 1 100%" : "0 0 600px", maxWidth: isMobile ? "100%" : "600px" }}>
              {videoId && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={showVideo ? "video" : "thumbnail"}
                    variants={videoVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="ratio ratio-16x9 mb-3"
                    style={{ width: "100%" }}
                  >
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
                        style={{
                          backgroundImage: `url(${thumbnail})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          cursor: "pointer",
                        }}
                        onClick={() => setShowVideo(true)}
                      >
                        <span
                          style={{
                            background: "rgba(0,0,0,0.6)",
                            borderRadius: "50%",
                            padding: "20px",
                            color: "white",
                            fontSize: "2rem",
                          }}
                        >
                          ▶
                        </span>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
              <div style={{ background: "#F5F7FF", padding: "1rem", borderRadius: "8px", boxShadow: "0 0 6px rgba(0,0,0,0.1)", marginTop: "1rem" }}>
                <p style={{ whiteSpace: "pre-line" }}>{data.description}</p>
              </div>
            </div>

            {/* DERECHA */}
            <div style={{ flex: isMobile ? "1 1 100%" : "0 0 380px", maxWidth: isMobile ? "100%" : "380px" }}>
              {data.rm && (
                <div style={{
                  backgroundColor: "#001A66",
                  color: "#fff",
                  padding: "0.5rem 1rem",
                  fontWeight: 700,
                  marginBottom: "1.5rem",
                  borderRadius: "5px",
                  textAlign: "center",
                  borderBottom: "5px solid #009DFA",
                  width: "100%",
                }}>
                  {data.rm}
                </div>
              )}
              <div style={{ background: "#F5F7FF", padding: "1rem", borderRadius: "8px", boxShadow: "0 0 6px rgba(0,0,0,0.1)", width: "100%" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      style={{
                        backgroundColor: activeTab === tab.key ? "#009DFA" : "#001A66",
                        color: "#fff",
                        border: "none",
                        padding: "0.6rem",
                        cursor: "pointer",
                        fontWeight: 600,
                        borderRadius: "5px",
                        width: "100%",
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    variants={tabVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    style={{ marginTop: "1rem" }}
                  >
                    {tabs.find((t) => t.key === activeTab)?.content}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
