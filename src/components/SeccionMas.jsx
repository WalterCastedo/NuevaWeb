import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import dataJson from "../assets/json/datos.json";
import NotFound from "../components/404";
import fondo from "../assets/img/fondoOferta.webp";

export default function SeccionMas() {
  const { sede, seccion } = useParams();
  const navigate = useNavigate();
  const rightRef = useRef(null);
  const leftRef = useRef(null);

  const [topPos, setTopPos] = useState(0);
  const [activeTab, setActiveTab] = useState(seccion);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Detectar tamaño móvil
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll para sticky derecha (solo desktop)
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

  const capitalize = (text = "") => text.charAt(0).toUpperCase() + text.slice(1);

  const normalizeText = (text) =>
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "").toLowerCase();

  const sedeKey = Object.keys(dataJson).find(
    (key) => normalizeText(key) === normalizeText(sede)
  );

  const sedeInfo = sedeKey ? dataJson[sedeKey] : null;
  const bloque = sedeInfo?.mas;

  if (!sedeInfo) return <h2 className="text-center mt-5">Sede no encontrada</h2>;
  if (!bloque) return <h2 className="text-center mt-5">La sede no tiene datos de "Más"</h2>;

  const tabKeys = Object.keys(bloque);
  const tabs = tabKeys.map((key) => {
    if (key === "misionvision") return { key, label: "Misión y Visión" };
    if (key === "filosofia") return { key, label: "Filosofía" };
    return { key, label: capitalize(key) };
  });

  // Preparar contenido según la sección
  let contenido;
  if (seccion === "misionvision") {
    contenido = [
      {
        titulo: "Misión",
        contenido:
          bloque.misionvision?.find((item) =>
            item.titulo.toLowerCase().includes("misi")
          )?.contenido || "",
      },
      {
        titulo: "Visión",
        contenido:
          bloque.misionvision?.find((item) =>
            item.titulo.toLowerCase().includes("visi")
          )?.contenido || "",
      },
    ];
  } else if (["filosofia", "bienvenida", "historia"].includes(seccion)) {
    contenido = [bloque[seccion]];
  } else if (["reglamento", "autoridades"].includes(seccion)) {
    contenido = bloque[seccion];
  } else {
    contenido = bloque[seccion];
  }

  if (!contenido)
    return (
      <NotFound
        mensaje={`No existe la sección "${seccion}" en la sede ${sede}.`}
      />
    );

  const handleTabClick = (tabKey) => navigate(`/${sede}/mas/${tabKey}`);

  // --- Animaciones ---
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
            {seccion === "misionvision" ? "Misión y Visión" : capitalize(seccion)}
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
            <div
              ref={leftRef}
              style={{
                flex: "1 1 100%",
                maxWidth: "600px",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  style={{ position: "relative" }} // Evita que afecte layout global
                >
                  {seccion === "autoridades" ? (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "1rem",
                        justifyItems: "center",
                        marginBottom: "1rem",
                      }}
                    >
                      {contenido.map((item, j) => (
                        <div
                          key={j}
                          className="shadow-lg"
                          style={{
                            background: "#fff",
                            borderRadius: "10px",
                            padding: "1rem",
                            width: "100%",
                            maxWidth: "350px",
                            textAlign: "center",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            fontSize: "0.9rem",
                          }}
                        >
                          <h4
                            style={{
                              fontWeight: 700,
                              color: "#001A66",
                              marginBottom: "0.3rem",
                              fontSize: "1rem",
                            }}
                          >
                            {item.cargo}
                          </h4>
                          <p style={{ fontWeight: 500, marginBottom: "0.2rem", fontSize: "0.85rem" }}>
                            {item.nombre}
                          </p>
                          <p>
  <a
    href={`mailto:${item.correo}`}
    style={{
      color: "#009DFA",
      textDecoration: "none",
      fontWeight: 500,
      fontSize: "0.8rem",
      wordBreak: "break-word", // <- esto evita que el correo se salga
      overflowWrap: "break-word", // <- soporte extra para navegadores
    }}
  >
    {item.correo}
  </a>
</p>
                        </div>
                      ))}
                    </div>
                  ) : Array.isArray(contenido) ? (
                    contenido.map((item, i) => (
                      <motion.div
                        key={i}
                        className="p-3 shadow-sm rounded"
                        style={{
                          background: "#fff",
                          marginBottom: "2rem",
                          padding: "1rem",
                          fontSize: "1rem",
                        }}
                      >
                        {item.titulo && <h3 style={{ fontWeight: 700, fontSize: "1.3rem" }}>{item.titulo}</h3>}
                        <p style={{ whiteSpace: "pre-line", fontSize: "1rem" }}>{item.contenido}</p>
                      </motion.div>
                    ))
                  ) : (
                    <motion.p
                      style={{
                        whiteSpace: "pre-line",
                        background: "#fff",
                        padding: "1rem",
                        borderRadius: "5px",
                      }}
                    >
                      {contenido.contenido || contenido}
                    </motion.p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* DERECHA */}
            <div
              style={{
                flex: "0 0 380px", // Mantiene ancho fijo en escritorio
                maxWidth: isMobile ? "100%" : "380px", // 100% en móvil
                
              }}
            >
              <div
                ref={rightRef}
                style={{
                  position: isMobile ? "relative" : "sticky", // sticky solo en desktop
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
                  Acerca de la Universidad
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
