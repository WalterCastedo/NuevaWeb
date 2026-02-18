import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import dataJson from "../assets/json/datos.json";
import NotFound from "../components/404";
import fondo from "../assets/img/fondoOferta.webp";

export default function Investigacion() {
  const { sede, seccion } = useParams();
  const navigate = useNavigate();
  const rightRef = useRef(null);
  const leftRef = useRef(null);
const getTitle = (key) => sectionTitles[key] || capitalize(key);

  const [topPos, setTopPos] = useState(0);
  const [activeTab, setActiveTab] = useState(seccion);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
const sectionTitles = {
  bienvenida: "Bienvenida",
  boletines: "Boletines",
  lineadeinvestigacion: "Línea de Investigación",
  docentesinvestigadores: "Docentes Investigadores",
    revistasalud: "Salud UNO",

  investigaciones: "Investigaciones",
};


  // Detectar mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sticky derecha solo desktop
  useEffect(() => {
    if (isMobile) return;
    const handleScroll = () => {
      if (!rightRef.current || !leftRef.current) return;
      const containerTop = leftRef.current.offsetTop;
      const containerHeight = leftRef.current.offsetHeight;
      const rightHeight = rightRef.current.offsetHeight;
      const maxTop = containerHeight - rightHeight;
      const newTop = Math.min(
        Math.max(window.scrollY - containerTop + 20, 0),
        maxTop
      );
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

  // Cambiar tab
  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveTab(seccion);
  }, [seccion]);

  const normalizeText = (t) =>
    t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const capitalize = (t = "") => t.charAt(0).toUpperCase() + t.slice(1);
// Función para mostrar títulos legibles
const formatTitle = (t = "") => {
  // Reemplaza minúsculas pegadas por espacios antes de mayúsculas (si hubiera)
  const spaced = t.replace(/([a-z])([A-Z])/g, "$1 $2")
                  .replace(/([a-z])([0-9])/gi, "$1 $2"); // opcional si hay números
  // Capitaliza cada palabra
  return spaced
    .split(/[\s_]+/) // divide por espacios o guiones bajos
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
  // Buscar sede
  const sedeKey = Object.keys(dataJson).find(
    (key) => normalizeText(key) === normalizeText(sede)
  );
  const sedeInfo = sedeKey ? dataJson[sedeKey] : null;
  const bloque = sedeInfo?.investigacion?.[0];

  if (!sedeInfo) return <h2 className="text-center mt-5">Sede no encontrada</h2>;
  if (!bloque)
    return (
      <h2 className="text-center mt-5">
        La sede no tiene datos de Investigación.
      </h2>
    );

  // Preparar tabs dinámicamente
  const tabKeys = Object.keys(bloque);
const tabs = tabKeys.map((key) => ({
  key: key.toLowerCase().replace(/\s+/g, ""),
  label: getTitle(key.toLowerCase()),
}));

  // Contenido según la tab
  let contenido;
  const seccionKey = seccion.toLowerCase();

  switch (seccionKey) {
    case "bienvenida":
      contenido = [{ titulo: "Bienvenida", contenido: bloque.bienvenida }];
      break;
    case "boletines":
      contenido = bloque.boletines;
      break;
    case "lineadeinvestigacion":
      contenido = bloque.lineadeinvestigacion;
      break;
    case "docentesinvestigadores":
      contenido = bloque.docentesinvestigadores;
      break;
    case "investigaciones":
      contenido = bloque.investigaciones;
      break;
    default:
      contenido = bloque[seccionKey];
  }

  if (!contenido)
    return (
      <NotFound mensaje={`No existe la sección "${seccion}" en Investigación.`} />
    );

  const handleTabClick = (k) => navigate(`/${sede}/investigacion/${k}`);

  // --- ANIMACIONES ---
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
        backgroundImage: `url(${fondo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        marginTop: "-14rem",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
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
            padding: "3rem 1rem",
            marginTop: "6rem",
          }}
        >
          <h1
  style={{
    fontSize: isMobile ? "2rem" : "3.5rem", // responsivo
    fontWeight: 700,
    marginBottom: "2rem",
    textAlign: "center",
    marginTop: "6rem",
    wordWrap: "break-word",
    overflowWrap: "break-word",
  }}
>
  {getTitle(seccionKey)}
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
                >
                  {/* Boletines */}
                  {seccionKey === "boletines" && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
                      {contenido.map((item, i) => (
                        <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" style={{ background: "#fff", padding: "1rem", borderRadius: "10px", textDecoration: "none", color: "#001A66", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                          {item.img && <img src={require(`../assets/img/${item.img}`)} alt={item.titulo} style={{ width: "100%", borderRadius: "8px", marginBottom: "0.5rem" }} />}
                          <h4 style={{ fontSize: "1rem", fontWeight: 700 }}>{item.titulo}</h4>
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Linea de Investigacion */}
{seccionKey === "lineadeinvestigacion" && (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", // 2 columnas en desktop, 1 en móvil
      gap: "1rem",
      justifyContent: "center",
    }}
  >
    {contenido.map((item, i) => (
      <div
        key={i}
        style={{
          background: "#fff",
          padding: "1rem",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          textAlign: "center",
          height: "100%",       // para que todos tengan altura uniforme si el contenido es variable
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h5 style={{ fontWeight: 700 }}>{item.titulo}</h5>
      </div>
    ))}
  </div>
)}


                  {/* Docentes Investigadores */}
                  {seccionKey === "docentesinvestigadores" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      {contenido.map((item, i) => (
                        <div key={i} style={{ background: "#fff", padding: "1rem", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
                          <h6 style={{ fontWeight: 500 }}>{item.docente}</h6>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Investigaciones */}
{seccionKey === "investigaciones" && (
  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
    {contenido.map((item, i) => (
      <a
        key={i}
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          background: "#fff",
          padding: "1rem",
          borderRadius: "8px",
          textDecoration: "none",
          color: "#001A66",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          textAlign: "center",      // centrar contenido
          wordBreak: "break-word",  // evitar desbordes
        }}
      >
        <h5 style={{ fontWeight: 700 }}>{item.titulo}</h5>
        <p style={{ whiteSpace: "pre-line" }}>{item.descripcion}</p>
      </a>
    ))}
  </div>
)}


                  {/* Bienvenida u otros */}
                  {["bienvenida"].includes(seccionKey) && (
                    contenido.map((item, i) => (
                      <motion.div key={i} className="p-3 shadow-sm rounded" style={{ background: "#fff", marginBottom: "2rem", padding: "1rem" }}>
                        
                        {item.contenido && <p style={{ whiteSpace: "pre-line", fontSize: "1rem" }}>{item.contenido}</p>}
                      </motion.div>
                    ))
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
