import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import cochabambaImg from "../assets/img/cocha.webp";
import monteroImg from "../assets/img/montero.webp";
import shinahotaImg from "../assets/img/shinaota.webp";
import santaCruzImg from "../assets/img/santacruz.webp";
import tarijaImg from "../assets/img/tarija.webp";
import yacuibaImg from "../assets/img/yacuhiba.png";

import mapaBolivia from "../assets/img/pais.webp";
import marcador from "../assets/img/marcador.webp";
import fondoSedes from "../assets/img/fondoRed.webp";
import mscImg from "../assets/img/mSC.webp";
import mcbImg from "../assets/img/mcb.webp";
import mtrImg from "../assets/img/mtr.webp";

export default function SeleccionarSede() {
  const navigate = useNavigate();
  const [activeSede, setActiveSede] = useState(null);

  // Nuevo orden de sedes
  const sedes = [
    { nombre: "Santa Cruz", img: santaCruzImg, width: "115px", height: "170px", anchor: "bottom-right" },
    { nombre: "Montero", img: monteroImg, width: "120px", height: "180px", anchor: "bottom-right" },
    { nombre: "Tarija", img: tarijaImg, width: "125px", height: "165px", anchor: "bottom-right" },
    { nombre: "Cochabamba", img: cochabambaImg, width: "120px", height: "170px", anchor: "bottom-right" },
    { nombre: "Yacuiba", img: yacuibaImg, width: "130px", height: "150px", anchor: "bottom-left" },
    { nombre: "Shinahota", img: shinahotaImg, width: "140px", height: "150px", anchor: "bottom-left" }
  ];

  const markers = [
    { nombre: "Cochabamba", top: "47%", left: "23%" },
    { nombre: "Shinahota", top: "41%", left: "32%" },
    { nombre: "Montero", top: "37%", left: "51%" },
    { nombre: "Santa Cruz", top: "52%", left: "55%" },
    { nombre: "Tarija", top: "70%", left: "38%" },
    { nombre: "Yacuiba", top: "77.5%", left: "48%" }
  ];

  const regionMap = {
    Montero: { img: mscImg, top: "52.5%", left: "69.5%", width: "51%", height: "51%" },
    "Santa Cruz": { img: mscImg, top: "52.5%", left: "69.5%", width: "51%", height: "51%" },
    Shinahota: { img: mcbImg, top: "53.3%", left: "38%", width: "20%", height: "20%" },
    Cochabamba: { img: mcbImg, top: "53.3%", left: "38%", width: "20%", height: "20%" },
    Tarija: { img: mtrImg, top: "84.8%", left: "50.8%", width: "21.5%", height: "21.5%" },
    Yacuiba: { img: mtrImg, top: "84.8%", left: "50.8%", width: "21.5%", height: "21.5%" }
  };

  return (
    <section
      className="py-5 bg-light"
      style={{
        minHeight: "100vh",
        background: `linear-gradient(to right, rgba(0, 33, 130, 0.85), rgba(11, 67, 163, 0.75)), url(${fondoSedes}) center/cover no-repeat`,
      }}
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="fw-bold text-white text-center" style={{ fontSize: "3em" }}>
            Sub Sedes
          </h2>
          <p className="text-white text-center" style={{ fontSize: "1.2em" }}>
            Bienvenido a la Red Universitaria UNO
          </p>
        </motion.div>

        <div className="row pt-5 align-items-start"
        >
          <div className="col-lg-6"
          >
           <div className="row d-flex flex-wrap justify-content-center">
  {sedes.map((sede, i) => {
    const isActive = activeSede === sede.nombre;
    const opacity = activeSede && !isActive ? 0.3 : 1;

    return (
      <motion.div
        key={i}
        className="col-4 col-md-4 col-lg-4 mb-4" // col-4 asegura 3 por fila en móvil
        style={{ order: i }}
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: i * 0.15 }}
      >
        <div
          style={{ textAlign: "center", cursor: "pointer", opacity }}
          onMouseEnter={() => setActiveSede(sede.nombre)}
          onMouseLeave={() => setActiveSede(null)}
          onClick={() => {
            const sedeUrl = sede.nombre.replace(/\s+/g, "").toLowerCase();
            navigate(`/${sedeUrl}`);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <div
            style={{
              height: "110px",
              width: "120px",
              backgroundColor: "#009dfa",
              borderRadius: "0.8rem",
              position: "relative",
              overflow: "visible",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
              margin: "0 auto", // centra en móvil
            }}
          >
            <motion.img
              src={sede.img}
              alt={sede.nombre}
              style={{
                width: `calc(${sede.width} * 0.7)`,
                height: `calc(${sede.height} * 0.7)`,
                objectFit: "cover",
                borderRadius: "0.5rem",
                position: "absolute",
                bottom: "0",
                right: sede.anchor === "bottom-right" ? "0" : "auto",
                left: sede.anchor === "bottom-left" ? "0" : "auto",
              }}
              whileHover={{
                scale: 1.15,
                translateX: sede.anchor === "bottom-right" ? "-6%" : "6%",
                translateY: "-6%",
              }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <h5
            className="mt-2 text-white fw-bold"
            style={{ fontSize: "0.9rem" }}
          >
            {sede.nombre}
          </h5>
        </div>
      </motion.div>
    );
  })}
</div>

          </div>

          <div className="col-lg-6 text-center mt-4 mt-lg-0">
            <motion.div
              className="position-relative d-inline-block"
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1.2, y: -50 }}
              transition={{ duration: 0.8 }}
            >
              <div style={{ maxWidth: "320px", margin: "50px auto -20px", position: "relative" }}>
                <img
                  src={mapaBolivia}
                  className="img-fluid rounded"
                  alt="Mapa Bolivia"
                  style={{ width: "100%", height: "auto" }}
                />

                {Object.entries(regionMap).map(([sede, data], i) => (
                  <motion.img
                    key={i}
                    src={data.img}
                    alt={sede}
                    className="position-absolute"
                    style={{
                      top: data.top,
                      left: data.left,
                      width: data.width,
                      height: data.height,
                      transform: "translate(-50%, -50%)",
                      objectFit: "contain",
                      zIndex: 2,
                    }}
                    animate={{ opacity: activeSede === sede ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                  />
                ))}

                {markers.map((m, i) => {
                  const isActive = activeSede === m.nombre;
                  const visible = !activeSede || isActive;
                  const arriba = ["Shinahota", "Montero", "Tarija"].includes(m.nombre);

                  return (
                    <motion.div
                      key={i}
                      className="position-absolute d-flex flex-column align-items-center"
                      style={{ top: m.top, left: m.left, zIndex: 3 }}
                      animate={{
                        opacity: visible ? 1 : 0,
                        scale: visible ? 1 : 0.8,
                      }}
                      transition={{ duration: 0.5 }}
                      onMouseEnter={() => setActiveSede(m.nombre)}
                      onMouseLeave={() => setActiveSede(null)}
                    >
                      {arriba && (
                        <div
                          className="text-white px-2 py-1"
                           style={{
    backgroundColor: "#001A66",
    borderRadius: "50px",
    fontSize: "0.75rem"   
  }}
                        >
                          {m.nombre}
                        </div>
                      )}

                      <motion.img
                        src={marcador}
                        alt={m.nombre}
                        style={{ width: "25px" }}
                        animate={{ scale: isActive ? 1 : 0.8 }}
                        transition={{ duration: 0.3 }}
                      />

                      {!arriba && (
                        <div
                          className="text-white px-2 py-1 small mt-1"
                          style={{ backgroundColor: "#001A66", borderRadius: "50px" , fontSize: "0.75rem" }}
                       
                       >
                          {m.nombre}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
