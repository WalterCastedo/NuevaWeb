import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import dataJson from "../assets/json/datos.json";
import NotFound from "../components/404";
import fondo from "../assets/img/fondoOferta.webp";

export default function SeccionInvestigacion() {
  const { sede, seccion } = useParams();
  const navigate = useNavigate();
  const rightRef = useRef(null);
  const leftRef = useRef(null);

  const [topPos, setTopPos] = useState(0);
  const [activeTab, setActiveTab] = useState(seccion || "bienvenida");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveTab(seccion || "bienvenida");
  }, [seccion]);

  const normalizeText = (text = "") =>
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "").toLowerCase();

  const sedeKey = Object.keys(dataJson).find(
    (key) => normalizeText(key) === normalizeText(sede)
  );

  const sedeInfo = sedeKey ? dataJson[sedeKey] : null;
  const bloque = sedeInfo?.investigacion?.[0];

  if (!sedeInfo) return <h2 className="text-center mt-5">Sede no encontrada</h2>;
  if (!bloque) return <h2 className="text-center mt-5">No hay información de Investigación</h2>;

  const tabKeys = [
    "bienvenida",
    "boletines",
    "revistaSalud",
    "revistaMultidiciplinaria",
    "lineaDeInvestigacion",
    "investigaciones",
    "docentesInvestigadores"
  ];

  const tabs = tabKeys.map((key) => {
    switch (key) {
      case "revistaSalud": return { key, label: "Revista Salud" };
      case "revistaMultidiciplinaria": return { key, label: "Revista Multidisciplinaria" };
      case "lineaDeInvestigacion": return { key, label: "Líneas de Investigación" };
      case "investigaciones": return { key, label: "Investigaciones" };
      case "docentesInvestigadores": return { key, label: "Docentes Investigadores" };
      default: return { key, label: key.charAt(0).toUpperCase() + key.slice(1) };
    }
  });

  const contenido = bloque[activeTab] || [];

  const handleTabClick = (tabKey) => navigate(`/${sede}/investigacion/${tabKey}`);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.4, ease: "easeIn" } }
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.25 } }
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
          key={activeTab}
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
            {tabs.find(t => t.key === activeTab)?.label || activeTab}
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
                  {activeTab === "boletines" && contenido.map((b, i) => (
                    <div key={i} style={{ background: "#fff", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem", boxShadow: "0 0 6px rgba(0,0,0,0.1)" }}>
                      <h5>{b.titulo}</h5>
                      {b.url && <a href={b.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm mt-2">Ver Boletín</a>}
                    </div>
                  ))}

                  {activeTab === "lineaDeInvestigacion" && (
                    <ul>{contenido.map((l, i) => <li key={i}>{l.titulo}</li>)}</ul>
                  )}

                  {activeTab === "investigaciones" && contenido.map((inv, i) => (
                    <div key={i} style={{ background: "#fff", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem", boxShadow: "0 0 6px rgba(0,0,0,0.1)" }}>
                      <h5>{inv.titulo}</h5>
                      <p style={{ whiteSpace: "pre-line" }}>{inv.descripcion}</p>
                      {inv.url && <a href={inv.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm mt-2">Ver Investigación</a>}
                    </div>
                  ))}

                  {activeTab === "docentesInvestigadores" && contenido.map((d, i) => (
                    <div key={i} style={{ background: "#fff", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem", boxShadow: "0 0 6px rgba(0,0,0,0.1)" }}>
                      <h5>{d.nombre}</h5>
                      {d.cargo && <p><strong>Cargo:</strong> {d.cargo}</p>}
                      {d.correo && <p><a href={`mailto:${d.correo}`} style={{ color: "#009DFA" }}>{d.correo}</a></p>}
                    </div>
                  ))}

                  {activeTab === "bienvenida" && (
                    <p style={{ whiteSpace: "pre-line", background: "#fff", padding: "1rem", borderRadius: "5px" }}>
                      {contenido?.bienvenida || contenido}
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* DERECHA */}
            <div style={{ flex: "0 0 380px", maxWidth: isMobile ? "100%" : "380px" }}>
              <div ref={rightRef} style={{ position: isMobile ? "relative" : "sticky", top: isMobile ? "auto" : "20px" }}>
                <div style={{ backgroundColor: "#001A66", color: "#fff", padding: "0.5rem 1rem", fontWeight: 700, marginBottom: "1.5rem", borderRadius: "5px", textAlign: "center", borderBottom: "5px solid #009DFA" }}>
                  Investigación UNO
                </div>

                <div style={{ background: "#F5F7FF", padding: "1rem", borderRadius: "8px", boxShadow: "0 0 6px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {tabs.map((t) => (
                    <button key={t.key} onClick={() => handleTabClick(t.key)} style={{ backgroundColor: activeTab === t.key ? "#009DFA" : "#001A66", color: "#fff", border: "none", padding: "0.6rem", cursor: "pointer", fontWeight: 600, borderRadius: "5px" }}>
                      {t.label}
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
