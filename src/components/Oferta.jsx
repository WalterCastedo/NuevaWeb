import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import datos from "../assets/json/datos.json";
import fondoDefault from "../assets/img/fondoOferta.webp";

export default function Oferta() {
  const navigate = useNavigate();
  const { sede } = useParams();
  const [carreras, setCarreras] = useState([]);
  const [fondo, setFondo] = useState(fondoDefault);

  const dividirEnFilas = (lista) => {
    const n = lista.length;

    if (n <= 3) return [lista];
    if (n % 2 === 0) return [lista.slice(0, n / 2), lista.slice(n / 2)];

    const arriba = Math.ceil(n / 2);
    return [lista.slice(0, arriba), lista.slice(arriba)];
  };

  // ===============================
  // Cargar imágenes
  // ===============================
  const getImagenCarrera = (nombre) => {
    try {
      return require(`../assets/img/carreras/${nombre}`);
    } catch {
      return "";
    }
  };

  const getImagenFondo = (nombre) => {
    try {
      return require(`../assets/img/${nombre}`);
    } catch {
      return fondoDefault;
    }
  };

  const normalize = (str) => str.toLowerCase().replace(/\s+/g, "");

  useEffect(() => {
    const sedeKey = Object.keys(datos).find(
      (s) => normalize(s) === normalize(sede || "")
    );

    if (sedeKey && datos[sedeKey]) {
      const data = datos[sedeKey];

      // ================================
      // CARGAR CARRERAS
      // ================================
      if (data.oferta) {
        const lista = data.oferta.map((c) => ({
          title: c.title,
          img: getImagenCarrera(c.imagen),
        }));
        setCarreras(lista);
      } else {
        setCarreras([]);
      }

      // ================================
      // CARGAR FONDO DESDE JSON ✔✔✔
      // ================================
      if (data.imagenes?.fondoOferta) {
        setFondo(getImagenFondo(data.imagenes.fondoOferta));
      } else {
        setFondo(fondoDefault);
      }
    }
  }, [sede]);

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  const filas = dividirEnFilas(carreras);

  return (
    <section
      id="oferta"
      className="py-5"
      style={{
        background: `linear-gradient(rgba(255,255,255,0.70), rgba(255,255,255,0.70)), url(${fondo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container text-center">

        <motion.h2
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="fw-bold mb-3"
          style={{
            fontSize: "3.3em",
            color: "#002166",
          }}
        >
          Oferta académica
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mb-5"
          style={{
            fontSize: "1.35em",
            color: "#002166",
          }}
        >
          Contamos con carreras con mayor demanda laboral.
        </motion.p>

        {filas.map((fila, indexFila) => (
          <div
            key={indexFila}
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1.7rem",
              marginBottom: "1.7rem",
              flexWrap: "wrap",
            }}
          >
            {fila.map((carrera, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
              >
                <motion.div
                  className="text-center"
                  style={{
                    maxWidth: "215px",
                    width: "100%",
                  }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <img
                    src={carrera.img}
                    alt={carrera.title}
                    className="img-fluid rounded shadow"
                    style={{
                      maxHeight: "190px",
                      objectFit: "contain",
                      padding: "5px",
                      borderRadius: "12px",
                    }}
                  />

                  <motion.span
                    className="d-block fw-bold py-2 rounded-pill mt-3"
                    style={{
                      background: "#002166",
                      color: "white",
                      width: "100%",
                      fontSize: "1em",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      cursor: "pointer",
                    }}
                    whileHover={{ scale: 1.07, backgroundColor: "#003399" }}
                    onClick={() =>
                      navigate(
                        `/${sede}/Carrera/${carrera.title.replace(/\s+/g, "")}`
                      )
                    }
                  >
                    {carrera.title}
                  </motion.span>
                </motion.div>
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
