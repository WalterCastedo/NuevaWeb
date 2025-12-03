import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AnimatedText } from "./textoIncripcion";

import { useParams } from "react-router-dom";
import fondoLibertad from "../assets/img/fondoLibertad.webp";
import expoUno from "../assets/img/expUno.webp";
import calendario from "../assets/img/ingresoAlumno.webp";
import ingAlum from "../assets/img/ingresoAlumno.webp";
import ingDoc from "../assets/img/ingresoDocente.webp";

import dataJson from "../assets/json/datos.json"; // JSON con info de cada sede
import "./Inscripcion.css"; 

export default function Inscripcion() {
  const [isScrolled, setIsScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 0) setIsScrolled(true); // Ajusta el scroll para fijar
    else setIsScrolled(false);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);


  const { sede } = useParams();
  const [chicaImg, setChicaImg] = useState(null);
  const [fondoImg, setFondoImg] = useState(fondoLibertad); // <-- nuevo estado

  useEffect(() => {
    if (!sede) return;

    const dataSede = dataJson[sede];

    // Imagen chica
    if (dataSede?.imagenes?.personaPortada) {
      try {
        const img = require(`../assets/img/${dataSede.imagenes.personaPortada}`);
        setChicaImg(img);
      } catch {
        setChicaImg(require("../assets/img/ChicaUno.webp")); 
      }
    } else {
      setChicaImg(require("../assets/img/ChicaUno.webp")); 
    }

    // Imagen de fondo dinámica según subsede
    if (dataSede?.imagenes?.fondoIncripcion) {
      try {
        const fondo = require(`../assets/img/${dataSede.imagenes.fondoIncripcion}`);
        setFondoImg(fondo);
      } catch {
        setFondoImg(fondoLibertad);
      }
    } else {
      setFondoImg(fondoLibertad);
    }

  }, [sede]);

  
  const botones = [
    { img: ingDoc, text: "Ingreso Docente", link: "https://www.uno.edu.bo/docentes-2025/" },
    { img: ingAlum, text: "Ingreso Alumno", link: "https://www.uno.edu.bo/alumnos-2025/" },
    { img: calendario, text: "Calendario Académico", link: "https://mega.nz/file/ZgRnyCaS#O60U_2yXQL_K4O7iM2ZZfJ5NlzTgz-wk9zwcrWNR494" },
    { img: expoUno, text: "", link: "" }
  ];

  return (
    <section
      className="hero-inscripcion"
      style={{
        background: `linear-gradient(to right, rgba(0, 33, 90, 0.9), rgba(11, 67, 163, 0.9)), url(${fondoImg}) center/cover no-repeat`
      }}
    >
      <div className="container-hero">
        <div className="hero-content">
          <motion.img
            src={chicaImg || require("../assets/img/ChicaUno.webp")}
            alt="Chica invitando"
            className="chica"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          />

          <div className="hero-text">
            <AnimatedText text="¡Es ahora!" className="titulo-ahora" />
            <br />
            <AnimatedText text="Inscripciones" className="titulo-inscripciones" />
            <div style={{ position: "relative" }}>
              <AnimatedText text="2026" className="titulo-ano" />
            </div>

            <div className="textos-abiertas-gestion">
              <AnimatedText text="Abiertas" className="texto-abiertas" />
              <AnimatedText text="Gestión I -" className="texto-gestion" />
            </div>
          </div>
        </div>
      </div>
      <motion.div
  className="sub-menu"
  animate={{
    scale: isScrolled ? 0.7 : 1,
    bottom: isScrolled ? 0 : 0,
    right: isScrolled ? 0 : 0,
    position: isScrolled ? "fixed" : "absolute",
    x: isScrolled ? 99 : 0,
    y: isScrolled ? 15 : 0
  }}

  // SOLO hover grande cuando está pequeño
  whileHover={
    isScrolled
      ? {
          scale: 1,
          x: 0,
          y: -2,
          transition: { type: "spring", stiffness: 1800, damping: 100 }
        }
      : undefined
  }

  transition={{ type: "spring", stiffness: 200, damping: 25 }}
>
  {botones.map((item, i) => (
    <motion.div
      key={i}
      className="sub-menu-item"
      style={{ cursor: "pointer" }}
      onClick={() => item.link && window.open(item.link, "_blank")}
    >
      <motion.img
        src={item.img}
        alt={item.text}
        className="sub-menu-img"

        // 🔥 PEQUEÑA ANIMACIÓN SIEMPRE ACTIVA
        whileHover={{ rotate: 10, scale: 1.05 }}
      />

      {item.text && (
        <motion.span
          className="sub-menu-text"
          // 🔥 Animación suave SIEMPRE
          whileHover={{ scale: 1.05 }}
        >
          {item.text}
        </motion.span>
      )}
    </motion.div>
  ))}
</motion.div>
    </section>
  );
}
