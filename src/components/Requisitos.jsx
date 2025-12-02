import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaRegFileAlt, FaRegClipboard, FaIdCard, FaRegImage } from "react-icons/fa";
import fondoRequisitos from "../assets/img/fondoRequisitos.png";
import fotoRequisito from "../assets/img/fotos.png";
import certificadoRequisito from "../assets/img/certificado.jpg";
import carnetRequisito from "../assets/img/carnet.png";
import tituloRequisito from "../assets/img/titulo.webp";

export default function Requisitos() {
  const requisitos = [
    { texto: "Fotocopia legalizada del Título", icon: <FaRegFileAlt />, foto: tituloRequisito },
    { texto: "Certificado de nacimiento original", icon: <FaRegClipboard />, foto: certificadoRequisito },
    { texto: "2 Fotocopias simple de CI", icon: <FaIdCard />, foto: carnetRequisito },
    { texto: "3 Fotos fondo blanco 3x4", icon: <FaRegImage />, foto: fotoRequisito },
  ];

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Precargar imágenes
  useEffect(() => {
    const imagePromises = requisitos
      .filter((r) => r.foto)
      .map(
        (r) =>
          new Promise((resolve) => {
            const img = new Image();
            img.src = r.foto;
            img.onload = resolve;
          })
      );
    Promise.all(imagePromises).then(() => setImagesLoaded(true));
  }, []);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <section
      id="requisitos"
      className="py-5"
      style={{
        background: `linear-gradient(to right, rgba(0, 40, 120, 0.75), rgba(11, 67, 163, 0.75)), url(${fondoRequisitos}) center/cover no-repeat`,
      }}
    >
      {/* 🔹 Precargar imágenes invisibles */}
      <div style={{ display: "none" }}>
        {requisitos.map((req, i) => req.foto ? <img key={i} src={req.foto} alt="" /> : null)}
      </div>

      <div className="container text-center px-3 px-md-4">
        <h2
          className="mb-5"
          style={{
            fontSize: "clamp(1.8rem, 5vw, 2.2rem)",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Requisitos de Admisión
        </h2>

        <motion.div
          layout
          className="d-flex justify-content-center align-items-start gap-4 flex-wrap"
        >
          <ul className="list-unstyled d-flex flex-column align-items-center gap-4 w-100"
style={{ maxWidth: "400px" }}>
            {requisitos.map((req, index) => (
              <motion.li
                key={index}
                layout
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="w-100"
                style={{ maxWidth: "600px" }}
              >
                {/* Contenedor animado de botón y detalle */}
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  style={{ width: "100%" }}
                >
                  {/* Botón principal con hover */}
                  <motion.div
                    layout
                    onClick={() =>
                      setSelectedIndex(index === selectedIndex ? null : index)
                    }
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.1rem",
                      fontWeight: "bold",
                      fontSize: "clamp(1rem, 3vw, 1.2rem)",
                      color: "#001A66",
                      backgroundColor: "white",
                      minHeight: "3rem",
                      borderRadius: "50px",
                      cursor: "pointer",
                      padding: "0.5rem 2rem",
                    }}
                    whileHover={{ scale: 1.03, boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)" }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {req.icon && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#009DFA",
                          fontSize: "clamp(1.2rem, 4vw, 1.5rem)",
                        }}
                      >
                        {req.icon}
                      </span>
                    )}
                    <span style={{ flex: 1, textAlign: "center" }}>{req.texto}</span>
                  </motion.div>

                  {/* Contenedor de detalle con animación suave */}
                  {selectedIndex === index && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      style={{
                        overflow: "hidden",
                        marginTop: "1rem",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      {req.foto && imagesLoaded && (
                        <motion.img
                          src={req.foto}
                          alt={req.texto}
                          className="img-fluid rounded"
                          style={{
                            width: "100%",
                            maxHeight: "500px",
                            objectFit: "contain",
                          }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        />
                      )}

                      {/* Botón Atrás */}   
                      <motion.button
                        onClick={() => setSelectedIndex(null)}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        style={{
                          padding: "0.5rem 1.2rem",
                          borderRadius: "0.5rem",
                          border: "none",
                          backgroundColor: "#009DFA",
                          color: "white",
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "1rem",
                        }}
                      >
                        Atrás
                      </motion.button>
                    </motion.div>
                  )}
                </motion.div>
              </motion.li>
            ))}

            {/* BOTÓN FINAL */}
            <motion.li
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-100"
              style={{ maxWidth: "600px" }}
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(0,0,0,0.2)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => (window.location.href = "/formulario")}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "50px",
                  border: "none",
                  backgroundColor: "#009DFA",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "clamp(1rem, 3vw, 1.2rem)",
                }}
              >
                Iniciar mi proceso de admisión
              </motion.button>
            </motion.li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
