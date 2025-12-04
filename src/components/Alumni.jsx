import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useParams } from "react-router-dom";
import dataJson from "../assets/json/datos.json"; 
import fondoDefault from "../assets/img/fondoRedAlumni.webp";

function AnimatedCircle({ value, label, duration = 2000, showPlus = false, delay = 0, hover }) {
  const [count, setCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const steps = 60;
    const increment = value / steps;
    const interval = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        start = value;
        clearInterval(timer);
      }
      setCount(Math.floor(start));
      setProgress((start / value) * 360);
    }, interval);

    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 360) * circumference;

  const textColor = hover ? "#fff" : "#001A66";
  const strokeColor = hover ? "#fff" : "#001A66";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className="d-flex flex-column align-items-center justify-content-center rounded-circle m-2 position-relative"
      style={{ width: "180px", height: "180px" }}
    >
      <svg width="180" height="180">
        <circle cx="90" cy="90" r={radius} stroke="#e6e6e6" strokeWidth="5" fill="none" />
        <circle
          cx="90"
          cy="90"
          r={radius}
          stroke={strokeColor}
          strokeWidth="5"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 90 90)"
        />
      </svg>
      <div
        className="position-absolute d-flex flex-column align-items-center justify-content-center"
        style={{ top: 0, left: 0, width: "180px", height: "180px" }}
      >
        <span className="fw-bold" style={{ fontSize: "2em", color: textColor }}>
          {showPlus ? `+${count}` : count}
        </span>
        <span className="fw-bold" style={{ fontSize: "1.1em", color: textColor }}>
          {label}
        </span>
      </div>
    </motion.div>
  );
}

export default function Alumni() {
  const { sede, seccion } = useParams();
  const totalDuration = 1500;
  const [hover, setHover] = useState(false);
  const [fondoImg, setFondoImg] = useState(fondoDefault);
  const [alumniImg, setAlumniImg] = useState(null);

  // Manejo dinámico de datos según sección
  const dataSede = seccion === "general" 
    ? null 
    : dataJson[sede];

  // Totales dinámicos
  const totalGraduados = seccion === "general"
    ? Object.values(dataJson).reduce((acc, s) => acc + (s.alumni?.graduados || 0), 0)
    : dataSede?.alumni?.graduados || 0;

  const totalCarreras = seccion === "general"
    ? Object.values(dataJson).reduce((acc, s) => acc + (s.oferta ? Object.keys(s.oferta).length : 0), 0)
    : dataSede?.oferta ? Object.keys(dataSede.oferta).length : 0;

  const descripcion = seccion === "general"
    ? "Conoce nuestra Red Alumni de todas las sedes y descubre el impacto de nuestros graduados."
    : dataSede?.alumni?.descripcion || "";

  // Cargar imágenes dinámicamente
  useEffect(() => {
    if (seccion === "general") {
      setFondoImg(fondoDefault);
      setAlumniImg(null);
      return;
    }

    if (!dataSede) return;

    if (dataSede?.imagenes?.fondoAlumni) {
      try {
        const fondo = require(`../assets/img/${dataSede.imagenes.fondoAlumni}`);
        setFondoImg(fondo);
      } catch {
        setFondoImg(fondoDefault);
      }
    } else setFondoImg(fondoDefault);

    if (dataSede?.imagenes?.graduados) {
      try {
        const img = require(`../assets/img/${dataSede.imagenes.graduados}`);
        setAlumniImg(img);
      } catch {
        setAlumniImg(null);
      }
    }
  }, [sede, seccion, dataSede]);

  const buttonBg = hover ? "#fff" : "#001A66";
  const buttonColor = hover ? "#001A66" : "#fff";

  return (
    <section
      id="alumni"
      className="position-relative"
      style={{
        background: `url(${fondoImg}) center/cover no-repeat`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: hover ? "rgba(0,26,102,0.9)" : "rgba(255,255,255,0.8)",
          transition: "background-color 0.5s ease",
          zIndex: 1,
        }}
      />

      <div className="container py-5 position-relative" style={{ zIndex: 2 }}>
        <div className="row justify-content-center text-center">
          <div className="col-12 col-md-6 mb-4">
            <motion.h2
              initial={{ opacity: 0, y: -50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="fw-bold mb-4"
              style={{ fontSize: "2.2em", color: hover ? "#fff" : "#001A66" }}
            >
              Red Alumni
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 1 }}
              className="fw-semibold mb-4"
              style={{ fontSize: "1.2em", color: hover ? "#fff" : "#001A66" }}
            >
              {descripcion}
            </motion.p>

            <div className="d-flex flex-wrap justify-content-center mb-3">
              <AnimatedCircle
                value={totalGraduados}
                label="Graduados"
                showPlus
                duration={totalDuration}
                delay={0.1}
                hover={hover}
              />

              <AnimatedCircle
                value={totalCarreras}
                label="Carreras"
                duration={totalDuration}
                delay={0.1}
                hover={hover}
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <a
  href={`/${sede}/redalumni/general`}
  className="fw-bold btn rounded-pill px-5 py-2"
  style={{
    backgroundColor: buttonBg,
    color: buttonColor,
    border: `2px solid #001A66`,
    transition: "all 0.5s ease",
  }}
  onMouseEnter={() => setHover(true)}
  onMouseLeave={() => setHover(false)}
>
  Ver más...
</a>
            </motion.div>
          </div>

          <motion.div
            className="col-12 col-md-6 mt-4 mt-md-0 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <div
              style={{
                margin: "0 auto",
                width: "80%",
                maxWidth: "450px",
                aspectRatio: "1/1",
                borderRadius: "50%",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {alumniImg && (
                <img
                  src={alumniImg}
                  alt="Red Alumni UNO"
                  className="img-fluid"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              )}

              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: hover ? "transparent" : "rgba(0,26,102,0.6)",
                  transition: "background 0.5s ease",
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
