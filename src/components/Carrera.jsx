import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import careersData from "../assets/json/datos.json";
import NotFound from "../components/404";
import fondo from "../assets/img/fondoOferta.webp";

// Para cargar imágenes de mallas dinámicamente
const images = require.context("../assets/img/mallas", false, /\.(png|jpe?g|svg|webp)$/);

export default function CareerCard() {
  const { sede, carrera } = useParams();
  const [showVideo, setShowVideo] = useState(false);
  const [activeTab, setActiveTab] = useState("misionVision");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [fondoImg, setFondoImg] = useState(fondo);
  const [mallaImg, setMallaImg] = useState(null);
  const iframeRef = useRef(null);

  // Función para normalizar textos
  const normalizeText = (text) =>
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "").toLowerCase();

  // Buscar sede y carrera
  const sedeKey = Object.keys(careersData).find(
    (key) => normalizeText(key) === normalizeText(sede.replace(/([A-Z])/g, " $1").trim())
  );
  const sedeInfo = sedeKey ? careersData[sedeKey] : null;
  const data = sedeInfo?.carrera.find(
    (item) => normalizeText(item.title) === normalizeText(carrera)
  );

 
  // Cargar imágenes dinámicas
  useEffect(() => {
    // Fondo
    if (sedeInfo?.imagenes?.fondoPrincipal) {
      try {
        const img = require(`../assets/img/${sedeInfo.imagenes.fondoPrincipal}`);
        setFondoImg(img);
      } catch {
        setFondoImg(fondo);
      }
    } else {
      setFondoImg(fondo);
    }

    // Malla
    if (data?.malla) {
      try {
        const img = images(`./${data.malla}`);
        setMallaImg(img);
      } catch {
        setMallaImg(null);
      }
    }
  }, [sedeInfo, data]);

  // Detectar tamaño móvil
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll al top al cargar
  useEffect(() => window.scrollTo(0, 0), []);
 if (!sedeInfo) return <div className="text-center mt-5">Sede no encontrada</div>;
  if (!data) return <NotFound mensaje={`La carrera no existe.`} />;

  // Video de YouTube
  const videoId = data?.video
    ? (() => {
        const regExp =
          /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/;
        const match = data.video.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
      })()
    : null;
  const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;

  // WhatsApp
  const whatsapp = sedeInfo?.whatsapp || "";
  const mensaje = encodeURIComponent(
    `Hola, deseo solicitar más información sobre la carrera ${data.title} en la sede ${sede}.`
  );
  const enlaceWhatsApp = `https://wa.me/${whatsapp}?text=${mensaje}`;

  // Tabs
  const tabs = [
    {
      key: "misionVision",
      label: "Misión y Visión",
      content: (
        <div>
          <h4
            style={{
              fontWeight: 700,
              color: "#001A66",
              marginBottom: "0.3rem",
              textAlign: "center",
            }}
          >
            Misión
          </h4>
          <p style={{ marginBottom: "1rem", textAlign: "center" }}>
            {data.mission}
          </p>

          <h4
            style={{
              fontWeight: 700,
              color: "#001A66",
              marginBottom: "0.3rem",
              textAlign: "center",
            }}
          >
            Visión
          </h4>
          <p style={{ textAlign: "center" }}>{data.vision}</p>
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
      content: mallaImg && (
        <div style={{ textAlign: "center" }}>
          <img
            src={mallaImg}
            alt={`Malla ${data.title}`}
            className="img-fluid shadow-sm"
            style={{ borderRadius: "10px", width: "100%" }}
          />

          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              gap: "0.8rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href={mallaImg}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: "#009DFA",
                color: "#fff",
                padding: "0.6rem 1.3rem",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Ver Malla
            </a>
            <a
              href={mallaImg}
              download
              style={{
                backgroundColor: "#001A66",
                color: "#fff",
                padding: "0.6rem 1.3rem",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Descargar
            </a>
          </div>
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
              backgroundColor: "#001A66",
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

  // Animaciones
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
        backgroundImage: `url(${fondoImg})`,
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
          pointerEvents: "none",
        }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={carrera}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "2rem 1rem",
            marginTop: "5rem",
          }}
        >
          <h1
            style={{
              fontSize: isMobile ? "2rem" : "3.5rem",
              fontWeight: 700,
              textAlign: "center",
              marginTop: "6rem",
              wordBreak: "break-word",
              overflowWrap: "break-word",
              lineHeight: isMobile ? "2.4rem" : "4rem",
              padding: isMobile ? "0 1rem" : "0",
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
              <div
                style={{
                  background: "#F5F7FF",
                  padding: "1rem",
                  borderRadius: "8px",
                  boxShadow: "0 0 6px rgba(0,0,0,0.1)",
                  marginTop: "1rem",
                }}
              >
                <p style={{ whiteSpace: "pre-line" }}>{data.description}</p>
              </div>
            </div>

            {/* DERECHA */}
            <div style={{ flex: isMobile ? "1 1 100%" : "0 0 380px", maxWidth: isMobile ? "100%" : "380px" }}>
              {data.rm && (
                <div
                  style={{
                    backgroundColor: "#001A66",
                    color: "#fff",
                    padding: "0.5rem 1rem",
                    fontWeight: 700,
                    marginBottom: "1.5rem",
                    borderRadius: "5px",
                    textAlign: "center",
                    borderBottom: "5px solid #009DFA",
                    width: "100%",
                  }}
                >
                  {data.rm}
                </div>
              )}
              <div
                style={{
                  background: "#F5F7FF",
                  padding: "1rem",
                  borderRadius: "8px",
                  boxShadow: "0 0 6px rgba(0,0,0,0.1)",
                  width: "100%",
                }}
              >
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
