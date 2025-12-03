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

  // ---------- HOOKS SIEMPRE PRIMERO ----------
  const [topPos, setTopPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!rightRef.current || !leftRef.current) return;
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
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [programa]);

  // ---------- FUNCIONES ----------
  const normalizeText = (text) =>
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "").toLowerCase();

  const handleProgramaClick = (progTitulo) => {
    navigate(`/${normalizeText(sede)}/interaccion/${normalizeText(progTitulo)}`);
  };

  // ---------- DATOS ----------
  const sedeKey = Object.keys(dataJson).find(
    (key) => normalizeText(key) === normalizeText(sede)
  );
  const sedeInfo = sedeKey ? dataJson[sedeKey] : null;
  const interaccionArray = sedeInfo?.interaccion || [];
  const contenido = interaccionArray.find(
    (item) => normalizeText(item.titulo) === normalizeText(programa)
  );

  // ---------- RENDERS CONDICIONALES ----------
  if (!sedeInfo) return <NotFound mensaje={`Sede "${sede}" no encontrada`} />;
  if (!contenido) return <NotFound mensaje={`Programa "${programa}" no encontrado`} />;

  // ---------- ANIMACIONES ----------
  const contentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -30, transition: { duration: 0.4 } },
  };

  // ---------- RENDER ----------
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

          <div style={{ display: "flex", gap: "2rem" }}>
            {/* IZQUIERDA */}
            <div style={{ flex: "0 0 600px" }} ref={leftRef}>
              <div className="p-3 shadow-sm rounded" style={{ background: "#fff" }}>
                {contenido.descripcion && <p style={{ whiteSpace: "pre-line" }}>{contenido.descripcion}</p>}
                {contenido.objetivo && (
                  <div>
                    <h3>Objetivo</h3>
                    <p style={{ whiteSpace: "pre-line" }}>{contenido.objetivo}</p>
                  </div>
                )}
                {contenido.Proyectos && contenido.Proyectos.length > 0 && (
                  <div>
                    <h3>Proyectos</h3>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "1rem",
                      }}
                    >
                      {contenido.Proyectos.map((p, i) => (
                        <div
                          key={i}
                          style={{
                            padding: "1rem",
                            background: "#F5F7FF",
                            borderRadius: "8px",
                            fontWeight: 600,
                            color: "#001A66",
                            textAlign: "center",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                          }}
                        >
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* DERECHA */}
            <div style={{ flex: "0 0 380px", alignSelf: "flex-start" }}>
              <div ref={rightRef} style={{ position: "sticky", top: `${topPos}px` }}>
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
                  Programas
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
                      }}
                    >
                      {prog.titulo}
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
