import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import dataJson from "../assets/json/datos.json";
import NotFound from "../components/404";
import fondo from "../assets/img/fondoOferta.webp";

const fondos = require.context("../assets/img", false, /\.(png|jpe?g|webp|svg)$/);

export default function Investigacion() {

  const { sede, seccion } = useParams();
  const navigate = useNavigate();

  const rightRef = useRef(null);
  const leftRef = useRef(null);

  const [fondoImg, setFondoImg] = useState(fondo);
  const [activeTab, setActiveTab] = useState(seccion);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // nombres bonitos
  const sectionTitles = {
    bienvenida: "Bienvenida",
    boletines: "Boletines",
    revistasalud: "Salud UNO",
    lineadeinvestigacion: "Línea de Investigación",
    investigaciones: "Investigaciones",
    docentesinvestigadores: "Docentes Investigadores",
  };

  const getTitle = (key) =>
    sectionTitles[key] ||
    key?.charAt(0).toUpperCase() + key?.slice(1);

  const normalizeText = (t) =>
    t?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  // detectar mobile
  useEffect(() => {
    const handleResize = () =>
      setIsMobile(window.innerWidth <= 768);

    window.addEventListener("resize", handleResize);

    return () =>
      window.removeEventListener("resize", handleResize);

  }, []);

  // cambiar tab
  useEffect(() => {

    window.scrollTo(0, 0);
    setActiveTab(seccion);

  }, [seccion]);

  // buscar sede
  const sedeKey = Object.keys(dataJson).find(
    (key) => normalizeText(key) === normalizeText(sede)
  );

  const sedeInfo = sedeKey ? dataJson[sedeKey] : null;

  const bloque = sedeInfo?.investigacion?.[0];

  // fondo dinámico
  useEffect(() => {

    if (sedeInfo?.imagenes?.fondoPrincipal) {

      try {

        setFondoImg(
          fondos(`./${sedeInfo.imagenes.fondoPrincipal}`)
        );

      } catch {

        setFondoImg(fondo);

      }

    } else {

      setFondoImg(fondo);

    }

  }, [sedeInfo]);

  if (!sedeInfo)
    return <h2 className="text-center mt-5">Sede no encontrada</h2>;

  if (!bloque)
    return (
      <h2 className="text-center mt-5">
        Esta sede no tiene sección de Investigación
      </h2>
    );

  // generar tabs dinámicamente
  const tabs = Object.keys(bloque).map((key) => ({
    key: key.toLowerCase(),
    label: getTitle(key.toLowerCase()),
  }));

  const seccionKey = seccion?.toLowerCase();

  // obtener contenido
  let contenido;

  switch (seccionKey) {

    case "bienvenida":
      contenido = [{
        contenido: bloque.bienvenida,
      }];
      break;

    case "boletines":
      contenido = bloque.boletines;
      break;

    case "revistasalud":
      contenido = bloque.revistaSalud;
      break;

    case "lineadeinvestigacion":
      contenido = bloque.lineadeinvestigacion;
      break;

    case "investigaciones":
      contenido = bloque.investigaciones;
      break;

    case "docentesinvestigadores":
      contenido = bloque.docentesinvestigadores;
      break;

    default:
      contenido = null;

  }

  if (!contenido)
    return (
      <NotFound
        mensaje={`No existe la sección "${seccion}"`}
      />
    );

  const handleTabClick = (k) =>
    navigate(`/${sede}/investigacion/${k}`);

  // animaciones
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    },
    exit: {
      opacity: 0,
      y: -50,
      transition: { duration: 0.4 }
    },
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35 }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.25 }
    },
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
        marginTop: "-14rem",
      }}
    >

      {/* overlay */}
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

          {/* TITULO */}
          <h1
            style={{
              fontSize: isMobile ? "2rem" : "3.5rem",
              fontWeight: 700,
              marginBottom: "2rem",
              textAlign: "center",
              marginTop: "6rem",
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
            }}
          >

            {/* IZQUIERDA */}
            <div
              ref={leftRef}
              style={{
                flex: "1 1 100%",
                maxWidth: "600px"
              }}
            >

              <AnimatePresence mode="wait">

                <motion.div
                  key={seccionKey}
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >

                  {/* BIENVENIDA */}
                  {seccionKey === "bienvenida" &&
                    contenido.map((item, i) => (

                      <div
                        key={i}
                        style={{
                          background: "#fff",
                          padding: "1rem",
                          borderRadius: "10px",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
                        }}
                      >
                        <p style={{ whiteSpace: "pre-line" }}>
                          {item.contenido}
                        </p>
                      </div>

                    ))}

                  {/* BOLETINES */}
                  {seccionKey === "boletines" && (

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(160px, 1fr))",
                        gap: "1rem"
                      }}
                    >

                      {contenido.map((item, i) => (

                        <a
                          key={i}
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            background: "#fff",
                            padding: "1rem",
                            borderRadius: "10px",
                            textDecoration: "none",
                            color: "#001A66",
                            boxShadow:
                              "0 2px 8px rgba(0,0,0,0.1)"
                          }}
                        >

                          <img
                            src={
                              require(`../assets/img/${item.img}`)
                            }
                            alt=""
                            style={{
                              width: "100%",
                              borderRadius: "8px",
                              marginBottom: "0.5rem"
                            }}
                          />

                          <h4
                            style={{
                              fontSize: "1rem",
                              fontWeight: 700
                            }}
                          >
                            {item.titulo}
                          </h4>

                        </a>

                      ))}

                    </div>

                  )}

                  {/* REVISTA SALUD */}
                  {seccionKey === "revistasalud" && (

                    <a
                      href={contenido}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "block",
                        background: "#fff",
                        padding: "1rem",
                        borderRadius: "10px",
                        textAlign: "center",
                        boxShadow:
                          "0 2px 6px rgba(0,0,0,0.1)"
                      }}
                    >
                      Ir a Revista Salud UNO
                    </a>

                  )}

                  {/* LINEAS */}
{seccionKey === "lineadeinvestigacion" && (

  <div
    style={{
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      gap: "1rem",
      justifyContent: "center",   // centra horizontalmente el grid
      alignItems: "center",       // centra verticalmente el grid
    }}
  >

    {contenido.map((item, i) => (

      <div
        key={i}
        style={{
          background: "#fff",
          padding: "1.5rem",
          borderRadius: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",

          display: "flex",              // activar flex
          justifyContent: "center",    // centrar horizontal
          alignItems: "center",        // centrar vertical
          textAlign: "center",

          minHeight: "100px",          // altura uniforme
        }}
      >

        <h5
          style={{
            fontWeight: 700,
            margin: 0
          }}
        >
          {item.titulo}
        </h5>

      </div>

    ))}

  </div>

)}

                  {/* INVESTIGACIONES */}
                  {seccionKey === "investigaciones" &&
                    contenido.map((item, i) => (

                      <a
                        key={i}
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: "block",
                          background: "#fff",
                          padding: "1rem",
                          borderRadius: "8px",
                          textDecoration: "none",
                          color: "#001A66",
                          boxShadow:
                            "0 2px 6px rgba(0,0,0,0.1)",
                          marginBottom: "1rem"
                        }}
                      >

                        <h5 style={{ fontWeight: 700 }}>
                          {item.titulo}
                        </h5>

                        <p style={{
                          whiteSpace: "pre-line"
                        }}>
                          {item.descripcion}
                        </p>

                      </a>

                    ))}

                  {/* DOCENTES */}
                  {seccionKey === "docentesinvestigadores" &&
                    contenido.map((item, i) => (

                      <div
                        key={i}
                        style={{
                          background: "#fff",
                          padding: "1rem",
                          borderRadius: "8px",
                          boxShadow:
                            "0 2px 6px rgba(0,0,0,0.1)",
                          marginBottom: "1rem"
                        }}
                      >
                        {item.docente}
                      </div>

                    ))}

                </motion.div>

              </AnimatePresence>

            </div>

            {/* DERECHA */}
            <div
              style={{
                flex: "0 0 380px",
                maxWidth:
                  isMobile ? "100%" : "380px"
              }}
            >

              <div
                ref={rightRef}
                style={{
                  position:
                    isMobile
                      ? "relative"
                      : "sticky",
                  top: "20px",
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
                    borderBottom:
                      "5px solid #009DFA"
                  }}
                >
                  Investigación UNO
                </div>

                <div
                  style={{
                    background: "#F5F7FF",
                    padding: "1rem",
                    borderRadius: "8px",
                    boxShadow:
                      "0 0 6px rgba(0,0,0,0.1)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem"
                  }}
                >

                  {tabs.map((t) => (

                    <button
                      key={t.key}
                      onClick={() =>
                        handleTabClick(t.key)
                      }
                      style={{
                        backgroundColor:
                          activeTab === t.key
                            ? "#009DFA"
                            : "#001A66",
                        color: "#fff",
                        border: "none",
                        padding: "0.6rem",
                        cursor: "pointer",
                        fontWeight: 600,
                        borderRadius: "5px"
                      }}
                    >
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
