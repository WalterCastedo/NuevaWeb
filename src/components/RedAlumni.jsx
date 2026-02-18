import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import dataJson from "../assets/json/datos.json";
import NotFound from "../components/404";
import fondoDefault from "../assets/img/fondoOferta.webp";

// Para cargar imágenes dinámicas si se agregan en el futuro
const images = require.context("../assets/img", false, /\.(png|jpe?g|webp)$/);

export default function RedAlumni() {
  const { sede, seccion } = useParams();
  const navigate = useNavigate();
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  const [topPos, setTopPos] = useState(0);
  const [activeTab, setActiveTab] = useState(seccion);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [fondoImg, setFondoImg] = useState(fondoDefault);

  // Detectar tamaño móvil
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Cargar fondo dinámico según la sede
  useEffect(() => {
    if (!sede) return;
    const sedeKey = Object.keys(dataJson).find(
      (key) => key.toLowerCase() === sede.toLowerCase()
    );
    const sedeInfo = sedeKey ? dataJson[sedeKey] : null;

    if (sedeInfo?.imagenes?.fondoPrincipal) {
      try {
        const img = require(`../assets/img/${sedeInfo.imagenes.fondoPrincipal}`);
        setFondoImg(img);
      } catch {
        setFondoImg(fondoDefault);
      }
    } else {
      setFondoImg(fondoDefault);
    }
  }, [sede]);

  // Scroll sticky derecha (solo desktop)
  useEffect(() => {
    if (isMobile) return;
    const handleScroll = () => {
      if (!rightRef.current || !leftRef.current) return;
      const containerTop = leftRef.current.offsetTop;
      const containerHeight = leftRef.current.offsetHeight;
      const rightHeight = rightRef.current.offsetHeight;
      const maxTop = containerHeight - rightHeight;
      const newTop = Math.min(Math.max(window.scrollY - containerTop + 20, 0), maxTop);
      setTopPos(newTop);
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isMobile]);

  // Scroll al cambiar de sección
  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveTab(seccion);
  }, [seccion]);

  // Función para normalizar textos
  const normalize = (text = "") =>
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "").toLowerCase();

  const seccionNormalized = normalize(seccion);

  // Buscar sede
  const sedeKey = Object.keys(dataJson).find((key) => normalize(key) === normalize(sede));
  const sedeInfo = sedeKey ? dataJson[sedeKey] : null;
  const redAlumniData = sedeInfo?.redalumni;

  // Preparar tabs
  const tabs = [
    { key: "general", label: "General" },
    ...(redAlumniData?.carreras.map((c) => ({ key: normalize(c.nombre), label: c.nombre })) || []),
  ];

  // Preparar contenido según sección
  let contenido;
  if (seccionNormalized === "general") {
    contenido = { titulo: "Red Alumni", contenido: redAlumniData?.descripcion };
  } else {
    contenido = redAlumniData?.carreras.find((c) => normalize(c.nombre) === seccionNormalized);
  }

  if (!contenido)
    return (
      <NotFound
        mensaje={`No existe la sección "${seccion}" en la Red Alumni de la sede ${sede}.`}
      />
    );

  const handleTabClick = (tabKey) => navigate(`/${sede}/redalumni/${tabKey}`);

  // --- Animaciones ---
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
        }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={seccion}
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
              fontSize: "3.5rem",
              fontWeight: 700,
              marginBottom: "2rem",
              textAlign: "center",
              marginTop: "6rem",
            }}
          >
            Red Alumni
          </h1>

          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: "2rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {/* IZQUIERDA */}
            <div ref={leftRef} style={{ flex: "1 1 100%", maxWidth: "600px" }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  style={{ position: "relative" }}
                >
                  {contenido.graduados ? (
                    <div
                      style={{
                        background: "#fff",
                        padding: "1rem",
                        borderRadius: "8px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        marginBottom: "2rem",
                      }}
                    >
                      <h3 style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: "0.5rem" }}>
                        {contenido.nombre}
                      </h3>

                      <p>
                        <strong>Graduados:</strong> {contenido.graduados}
                      </p>

                      <div style={{ marginTop: "0.5rem" }}>
                        <strong>Lugares de trabajo:</strong>
                        <ul style={{ marginTop: "0.3rem", paddingLeft: "20px" }}>
                          {contenido.lugaresTrabajo.map((lugar, i) => (
                            <li key={i} style={{ marginBottom: "0.3rem" }}>
                              {lugar}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div style={{ marginTop: "0.5rem" }}>
                        <strong>Convenios:</strong>
                        <ul style={{ marginTop: "0.3rem", paddingLeft: "20px" }}>
                          {contenido.convenios.map((convenio, i) => (
                            <li key={i} style={{ marginBottom: "0.3rem" }}>
                              {convenio}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* BOTÓN DE WHATSAPP */}
                      {contenido.whatsapp && (
                        <div style={{ textAlign: "center", marginTop: "1rem" }}>
                          <a
                            href={contenido.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              backgroundColor: "#25D366",
                              color: "#fff",
                              padding: "0.8rem 1.5rem",
                              borderRadius: "25px",
                              textDecoration: "none",
                              fontWeight: 600,
                              display: "inline-block",
                            }}
                          >
                            Unirse al grupo de WhatsApp
                          </a>
                        </div>
                      )}
                    </div>
                  ) : (
                    <motion.p
                      style={{
                        whiteSpace: "pre-line",
                        background: "#fff",
                        padding: "1rem",
                        borderRadius: "5px",
                      }}
                    >
                      {contenido.contenido}
                    </motion.p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* DERECHA */}
            <div style={{ flex: "0 0 380px", maxWidth: isMobile ? "100%" : "380px" }}>
              <div
                ref={rightRef}
                style={{
                  position: isMobile ? "relative" : "sticky",
                  top: isMobile ? "auto" : "20px",
                }}
              >
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
                  }}
                >
                  Secciones
                </div>

                <div
                  style={{
                    background: "#F5F7FF",
                    padding: "1rem",
                    borderRadius: "8px",
                    boxShadow: "0 0 6px rgba(0,0,0,0.1)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => handleTabClick(tab.key)}
                      style={{
                        backgroundColor: activeTab === tab.key ? "#009DFA" : "#001A66",
                        color: "#fff",
                        border: "none",
                        padding: "0.6rem",
                        cursor: "pointer",
                        fontWeight: 600,
                        borderRadius: "5px",
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
