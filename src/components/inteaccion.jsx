import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import dataJson from "../assets/json/datos.json";
import NotFound from "../components/404";
import fondo from "../assets/img/fondoOferta.webp";

export default function Interaccion() {
  const { sede, programa } = useParams();
  const navigate = useNavigate();
  const rightRef = useRef(null);
  const leftRef = useRef(null);

  const [topPos, setTopPos] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!rightRef.current || !leftRef.current || isMobile) return;
      const containerTop = leftRef.current.offsetTop;
      const containerHeight = leftRef.current.offsetHeight;
      const rightHeight = rightRef.current.offsetHeight;
      const maxTop = containerHeight - rightHeight;
      setTopPos(Math.min(Math.max(window.scrollY - containerTop + 20, 0), maxTop));
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
  }, [programa]);

  const normalizeText = (text) =>
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "").toLowerCase();

  const handleProgramaClick = (progTitulo) => {
    navigate(`/${normalizeText(sede)}/interaccion/${normalizeText(progTitulo)}`);
  };

  const sedeKey = Object.keys(dataJson).find(
    (key) => normalizeText(key) === normalizeText(sede)
  );
  const sedeInfo = sedeKey ? dataJson[sedeKey] : null;
  const interaccionArray = sedeInfo?.interaccion || [];
  const contenido = interaccionArray.find(
    (item) => normalizeText(item.titulo) === normalizeText(programa)
  );

  if (!sedeInfo) return <NotFound mensaje={`Sede "${sede}" no encontrada`} />;
  if (!contenido) return <NotFound mensaje={`Programa "${programa}" no encontrado`} />;

  const contentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -30, transition: { duration: 0.4 } },
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
          inset: 0,
          backgroundColor: "rgba(255,255,255,0.82)",
          zIndex: 0,
        }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={programa}
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "2rem 1rem",
            marginTop: "5rem",
          }}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={contentVariants}
        >
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: 700,
              textAlign: "center",
              marginTop: "6rem",
              marginBottom: "2rem",
            }}
          >
            {contenido.titulo}
          </h1>

          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: "2rem",
              justifyContent: "center",
              flexWrap: "wrap",
              alignItems: isMobile ? "center" : "flex-start",
            }}
          >
            {/* IZQUIERDA */}
            <div
              ref={leftRef}
              style={{
                flex: isMobile ? "1 1 100%" : "0 0 600px",
                maxWidth: isMobile ? "100%" : "600px",
                textAlign: isMobile ? "center" : "left",
                margin: isMobile ? "0 auto" : "0",
              }}
            >
              <div className="p-3 shadow-sm rounded" style={{ background: "#fff" }}>
                {contenido.descripcion && (
                  <p style={{ whiteSpace: "pre-line" }}>{contenido.descripcion}</p>
                )}
                {contenido.objetivo && (
                  <div>
                    <h3 style={{ textAlign: isMobile ? "center" : "left" }}>Objetivo</h3>
                    <p style={{ whiteSpace: "pre-line" }}>{contenido.objetivo}</p>
                  </div>
                )}

                {/* Proyectos o Becas (para todas las pestañas) */}
                {contenido.Proyectos && contenido.Proyectos.length > 0 && (
                  <div>
                    <h3 style={{ textAlign: isMobile ? "center" : "left", marginBottom: "1rem" }}>
                      {contenido.titulo === "Becas UNO" ? "Tipos de Becas" : "Proyectos"}
                    </h3>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(260px, 1fr))",
                        gap: "1.5rem",
                        justifyItems: "center",
                      }}
                    >
                      {contenido.Proyectos.map((p, i) => (
                        <div
                          key={i}
                          style={{
                            background: "#fff",
                            borderRadius: "12px",
                            border: "1px solid #E0E0E0",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                            padding: "1.5rem",
                            width: "100%",
                            maxWidth: "320px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.5rem",
                            transition: "transform 0.2s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                        >
                          {typeof p === "string" ? (
                            <span style={{ fontWeight: 600, textAlign: "center" }}>{p}</span>
                          ) : (
                            <>
                              <h4 style={{ margin: 0, color: "#001A66", fontSize: "1.2rem" }}>{p.titulo}</h4>
                              {p.descripcion && <p style={{ margin: "0.3rem 0", color: "#333" }}>{p.descripcion}</p>}
                              {p.objetivo && (
                                <p style={{ fontStyle: "italic", color: "#555", margin: "0.3rem 0" }}>
                                  Objetivo: {p.objetivo}
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Convenios: SOLO en la pestaña Convenios UNO */}
                {contenido.titulo === "Convenios UNO" && contenido.convenios && contenido.convenios.length > 0 && (
                  <div style={{ marginTop: "2rem" }}>
                    <h3 style={{ textAlign: isMobile ? "center" : "left", marginBottom: "1rem" }}>
                      Convenios
                    </h3>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(260px, 1fr))",
                        gap: "1.5rem",
                        justifyItems: "center",
                      }}
                    >
                      {contenido.convenios.map((conv, i) => (
                        <div
                          key={i}
                          style={{
                            background: "#fff",
                            borderRadius: "12px",
                            border: "1px solid #E0E0E0",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                            padding: "1.5rem",
                            width: "100%",
                            maxWidth: "320px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.5rem",
                            transition: "transform 0.2s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                        >
                          {conv.imagen && (
                            <img
                              src={require(`../assets/img/${conv.imagen}`)}
                              alt={conv.titulo}
                              style={{ borderRadius: "8px", width: "100%", objectFit: "cover" }}
                            />
                          )}
                          <h4 style={{ margin: 0, color: "#001A66", fontSize: "1.2rem" }}>
                            {conv.titulo}
                          </h4>
                          {conv.beneficios && (
                            <p style={{ fontSize: "0.9rem", color: "#333", whiteSpace: "pre-line" }}>
                              {conv.beneficios}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* DERECHA */}
            <div
              ref={rightRef}
              style={{
                flex: isMobile ? "1 1 100%" : "0 0 380px",
                maxWidth: isMobile ? "100%" : "380px",
                width: isMobile ? "100%" : "380px",
                position: isMobile ? "relative" : "sticky",
                top: isMobile ? "auto" : "100px",
                margin: isMobile ? "1rem auto 0 auto" : "0",
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
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                Interacción Social
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
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                {interaccionArray.map((prog) => (
                  <button
                    key={prog.titulo}
                    onClick={() => handleProgramaClick(prog.titulo)}
                    style={{
                      backgroundColor:
                        normalizeText(programa) === normalizeText(prog.titulo)
                          ? "#009DFA"
                          : "#001A66",
                      color: "#fff",
                      border: "none",
                      padding: "0.6rem",
                      cursor: "pointer",
                      fontWeight: 600,
                      borderRadius: "5px",
                      width: "100%",
                    }}
                  >
                    {prog.titulo}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
