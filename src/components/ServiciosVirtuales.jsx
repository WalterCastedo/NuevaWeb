import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import dataJson from "../assets/json/datos.json";
import fondoDefault from "../assets/img/fondoOferta.webp";
import NotFound from "../components/404";

export default function ServiciosVirtuales() {

  const { sede, tipo } = useParams();

  const [fondoImg, setFondoImg] = useState(fondoDefault);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // detectar tamaño
  useEffect(() => {

    const handleResize = () =>
      setIsMobile(window.innerWidth <= 768);

    window.addEventListener("resize", handleResize);

    return () =>
      window.removeEventListener("resize", handleResize);

  }, []);

  // fondo dinámico
  useEffect(() => {

    if (!sede) return;

    const sedeKey = Object.keys(dataJson).find(
      key => key.toLowerCase() === sede.toLowerCase()
    );

    const sedeInfo = sedeKey ? dataJson[sedeKey] : null;

    if (sedeInfo?.imagenes?.fondoPrincipal) {

      try {

        const img = require(
          `../assets/img/${sedeInfo.imagenes.fondoPrincipal}`
        );

        setFondoImg(img);

      } catch {

        setFondoImg(fondoDefault);

      }

    }

  }, [sede]);


  // SERVICIOS BASE (comunes)
  const serviciosBase = [

    {
      titulo: "SERVICIO_DINAMICO",
      imagen: "IMAGEN_DINAMICA",
      link: "LINK_DINAMICO"
    },
{
      titulo: "Plataforma Virtual",
      imagen: "https://www.uno.edu.bo/wp-content/uploads/2025/03/2310700-1-300x300.png",
      link: "https://virtual.uno.edu.bo"
    },
    {
      titulo: "Biblioteca Virtual Digitalia",
      imagen: "https://www.uno.edu.bo/wp-content/uploads/2025/03/Onlic@2025.jpg",
      link: "https://www.digitaliapublishing.com"
    },

    

    {
      titulo: "Biblioteca Virtual EBSCO",
      imagen: "https://www.uno.edu.bo/wp-content/uploads/2025/03/EBSCOhost_logo_CMYK-300x159.png",
      link: "https://search.ebscohost.com"
    }

  ];



  let servicios = [...serviciosBase];
  let titulo = "";

  
  if (tipo === "estudiante") {

    servicios[0] = {
      titulo: "Consulta Tus Notas",
      imagen: "https://www.uno.edu.bo/wp-content/uploads/2025/03/IMAGEN-WEB-DIGITAL-300x165.jpg",
      link: "https://alumno.uno.edu.bo/"
    };

    titulo = "Servicios para Estudiantes";

  }
  else if (tipo === "docente") {

    servicios[0] = {
      titulo: "Sistema Docente UNO",
      imagen: "https://cdn-icons-png.flaticon.com/512/3135/3135755.png",
      link: "https://sistema2.uno.edu.bo/"
    };

    titulo = "Servicios para Docentes";

  }
  else {

    return <NotFound mensaje="Ruta no válida" />;

  }


  const cardVariants = {

    hidden: { opacity: 0, y: 40 },

    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    },

    hover: {
      scale: 1.05
    }

  };


  return (

    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${fondoImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        marginTop: "-14rem",
        position: "relative"
      }}
    >

      {/* capa blanca */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: "rgba(255,255,255,0.85)"
        }}
      />

      {/* contenido */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1100px",
          margin: "auto",
          padding: "2rem",
          marginTop: "6rem"
        }}
      >

        <h1
  style={{
    textAlign: "center",
    fontSize: "3rem",
    fontWeight: "700",
    marginBottom: "3rem",
    marginTop: "6rem", // ← AGREGA ESTO
    color: "#001A66"
  }}
>
  {titulo}
</h1>

        {/* grid */}
        <div
          style={{
            display: "grid",
           gridTemplateColumns: isMobile
  ? "1fr"
  : "repeat(2, 220px)",
justifyContent: "center",
gap: "2rem",
          }}
        >

          {servicios.map((servicio, index) => (

            <motion.a
              key={index}
              href={servicio.link}
              target="_blank"
              rel="noopener noreferrer"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              style={{
                background: "#fff",
                padding: "1.5rem",
                borderRadius: "10px",
                textAlign: "center",
                textDecoration: "none",
                color: "#001A66",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
              }}
            >

              <img
                src={servicio.imagen}
                alt=""
                style={{
                  height: "80px",
                  objectFit: "contain",
                  marginBottom: "1rem"
                }}
              />

              <h4>{servicio.titulo}</h4>

            </motion.a>

          ))}

        </div>

      </div>

    </div>

  );

}