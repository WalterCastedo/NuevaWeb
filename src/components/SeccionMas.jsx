import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import dataJson from "../assets/json/datos.json";
import NotFound from "../components/404";
export default function SeccionMas() {
  const { sede, seccion } = useParams();

  const capitalize = (text = "") =>
  text.charAt(0).toUpperCase() + text.slice(1);

  const normalizeText = (text) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "")
      .toLowerCase();

  const sedeKey = Object.keys(dataJson).find(
    (key) => normalizeText(key) === normalizeText(sede)
  );

  const sedeInfo = sedeKey ? dataJson[sedeKey] : null;
  const bloque = sedeInfo?.mas;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!sedeInfo) return <h2 className="text-center mt-5">Sede no encontrada</h2>;
  if (!bloque) return <h2 className="text-center mt-5">La sede no tiene datos de "Más"</h2>;

  const contenidoUnificado =
    seccion === "misionvision" || seccion === "filosofia"
      ? [
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
          {
            titulo: "Filosofía",
            contenido: bloque.filosofia?.contenido || "",
          },
        ]
      : null;

  const contenido =
    contenidoUnificado ||
    (() => {
      switch (normalizeText(seccion)) {
        case "bienvenida":
          return bloque.bienvenida;
        case "historia":
          return bloque.historia;
        case "reglamento":
          return bloque.reglamento;
        case "autoridades":
          return bloque.autoridades;
        default:
          return null;
      }
    })();

  if (!contenido)  return <NotFound mensaje={`En la sede "${sedeInfo}" no existe el apartado "${contenido}".`} />;

  // Imagen de la sección
  const sectionImage = contenido?.imagen ? require(`../assets/img/${contenido.imagen}`) : null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={seccion}
        className="card border-0 p-4 my-4 mx-auto"
        style={{ maxWidth: "1100px", color: "#001A66", fontFamily: "'Montserrat', sans-serif" }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
  className="text-center mb-4"
  style={{ fontWeight: 800, fontSize: "3rem" }}
>
  {seccion === "misionvision" || seccion === "filosofia"
    ? "Misión, Visión y Filosofía"
    : capitalize(contenido.titulo || seccion)}
</motion.h1>

        {/* Imagen sticky en Bienvenida o Historia */}
        {(normalizeText(seccion) === "bienvenida" || normalizeText(seccion) === "historia") && sectionImage && (
          <div className="row mb-4">
            <div className="col-md-8">
              <p style={{ whiteSpace: "pre-line", fontSize: "1rem" }}>{contenido.contenido}</p>
            </div>
            <div className="col-md-4">
              <div style={{ position: "sticky", top: "120px" }}>
                <img
                  src={sectionImage}
                  alt={contenido.titulo}
                  className="img-fluid shadow-sm rounded"
                  style={{ maxHeight: "450px", width: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Bloque unificado Misión, Visión y Filosofía */}
        {contenidoUnificado && (
          <div className="d-flex flex-column gap-4">
            {/* Misión y Visión arriba */}
            <div className="d-flex flex-wrap gap-3 justify-content-center">
              {contenidoUnificado
                .filter((item) => item.titulo === "Misión" || item.titulo === "Visión")
                .map((item, i) => (
                  <motion.div
                    key={i}
                    className="p-3 shadow-sm rounded"
                    style={{ background: "#f2f6ff", minWidth: "250px", flex: "1 1 250px" }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                  >
                    <h3 style={{ fontWeight: 700 }}>{item.titulo}</h3>
                    <p style={{ whiteSpace: "pre-line" }}>{item.contenido}</p>
                  </motion.div>
                ))}
            </div>

            {/* Filosofía abajo */}
            <div className="p-3 shadow-sm rounded" style={{ background: "#e6f0ff" }}>
              <h3 style={{ fontWeight: 700 }}>Filosofía</h3>
              <p style={{ whiteSpace: "pre-line" }}>
                {contenidoUnificado.find((item) => item.titulo === "Filosofía")?.contenido}
              </p>
            </div>
          </div>
        )}

        {/* Reglamento */}
        {normalizeText(seccion) === "reglamento" && (
          <div className="d-flex flex-column gap-2">
            {contenido.map((item, i) => (
              <motion.a
                key={i}
                href={`/assets/pdf/${item.archivo}`}
                target="_blank"
                className="btn btn-primary"
                style={{ maxWidth: "300px" }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                {item.titulo}
              </motion.a>
            ))}
          </div>
        )}

{normalizeText(seccion) === "autoridades" && (
  <div
    className="d-flex flex-wrap justify-content-center align-items-stretch"
    style={{
      gap: "2.2rem", // ← ESPACIADO AMPLIO ENTRE TARJETAS
      padding: "1rem 0",
    }}
  >
    {contenido.map((a, index) => (
      <motion.div
        key={index}
        className="shadow-sm rounded d-flex flex-column text-center"
        style={{
          background: "#f2f6ff",
          borderLeft: "4px solid #001A66",
          minWidth: "260px",
          maxWidth: "260px",
          flex: "1 1 260px",

          padding: "1.5rem",   // ← más espacio interno
          borderRadius: "12px",

          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * index }}
      >
        {/* Nombre */}
        <h6
          style={{
            fontWeight: 700,
            marginBottom: "0.3rem",
            height: "45px",
            overflow: "hidden",

            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            textAlign: "center",
            width: "100%",
          }}
        >
          {a.nombre}
        </h6>

        {/* Cargo */}
        <p
          style={{
            margin: "0.1rem 0",
            fontSize: "0.8rem",
            height: "55px",
            overflow: "hidden",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            width: "100%",
          }}
        >
          {a.cargo}
        </p>

        {/* Correo */}
        <p
          style={{
            margin: 0,
            fontSize: "0.85rem",
            height: "40px",
            overflow: "hidden",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            width: "100%",
          }}
        >
          {a.correo}
        </p>
      </motion.div>
    ))}
  </div>
)}





        {/* Secciones normales */}
        {!contenidoUnificado &&
          normalizeText(seccion) !== "reglamento" &&
          normalizeText(seccion) !== "autoridades" &&
          normalizeText(seccion) !== "bienvenida" &&
          normalizeText(seccion) !== "historia" && (
            <motion.p style={{ whiteSpace: "pre-line", fontSize: "1.1rem" }}>
              {contenido.contenido}
            </motion.p>
          )}
      </motion.div>
    </AnimatePresence>
  );
}
