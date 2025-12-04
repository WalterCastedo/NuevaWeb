import { useState, useEffect } from "react";
import logo from "../assets/img/logo.webp";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import dataJson from "../assets/json/datos.json";

export default function Header() {
  const navigate = useNavigate();
  const { sede } = useParams();
  const location = useLocation();

  const menuBgColor = "#001a66";
  const defaultLogoColor = menuBgColor;

  const [scrolled, setScrolled] = useState(false);
  const [logoColor, setLogoColor] = useState(defaultLogoColor);
  const [activeSection, setActiveSection] = useState("inicio");
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [ofertaCarreras, setOfertaCarreras] = useState([]);
  const [ofertaInteraccion, setOfertaInteraccion] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const normalizeForUrl = (text) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "")
      .toLowerCase();

  useEffect(() => {
    if (!sede) return;
    const dataSede = dataJson[sede];
    setOfertaCarreras(dataSede?.oferta || []);
    setOfertaInteraccion(dataSede?.interaccion || []);
  }, [sede]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 0);

      const pathParts = location.pathname
        .split("/")
        .filter(Boolean)
        .map(normalizeForUrl);
      const isMainOrSoloSede = pathParts.length <= 1;

      setLogoColor(
        isMainOrSoloSede ? "white" : scrollY > 0 ? "white" : defaultLogoColor
      );

      const sections = document.querySelectorAll("section[id]");
      let current = "inicio";
      sections.forEach((section) => {
        const top = section.offsetTop - 100;
        const bottom = top + section.offsetHeight;
        if (scrollY >= top && scrollY < bottom)
          current = normalizeForUrl(section.id);
      });
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const handleClickInicio = () => {
    navigate(sede ? `/${normalizeForUrl(sede)}` : "/");
    setMobileMenuOpen(false);
  };

  const handleClickCarrera = (nombre) => {
    navigate(`/${normalizeForUrl(sede)}/carrera/${normalizeForUrl(nombre)}`);
    setMobileMenuOpen(false);
  };

  const handleClickSubSede = (sub) => {
    navigate(`/${normalizeForUrl(sub)}`);
    setMobileMenuOpen(false);
  };

  const handleClickMas = (target) => {
    navigate(`/${normalizeForUrl(sede)}/mas/${normalizeForUrl(target)}`);
    setMobileMenuOpen(false);
  };

  const handleClickPrograma = (nombre) => {
    navigate(`/${normalizeForUrl(sede)}/interaccion/${normalizeForUrl(nombre)}`);
    setMobileMenuOpen(false);
  };

  const handleClickInvestigacion = (seccion) => {
    navigate(`/${normalizeForUrl(sede)}/investigacion/${normalizeForUrl(seccion)}`);
    setMobileMenuOpen(false);
    setOpenDropdowns({});
  };

  const scrollToTarget = (target) => {
    const el = document.getElementById(target);
    if (el) {
      const offset = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  const handleClick = (e, item) => {
    e.preventDefault();
    if (item.name === "Inicio") return handleClickInicio();
    if (item.targets?.length)
      item.targets.forEach((t, i) =>
        setTimeout(() => scrollToTarget(t), i * 100)
      );
  };

  const handleOpenDropdown = (name, level) =>
    setOpenDropdowns((prev) => ({ ...prev, [level]: name }));

  const handleCloseDropdown = (level) =>
    setOpenDropdowns((prev) => {
      const copy = { ...prev };
      Object.keys(copy).forEach(
        (key) => parseInt(key) >= level && (copy[key] = null)
      );
      return copy;
    });

  const renderSubmenu = (submenu, level = 0, parentName = "") => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#001a66",
        borderRadius: "0 0 10px 10px",
        minWidth: Math.max(...submenu.map((s) => s.name.length * 6)) + 40,
      }}
    >
      {submenu.map((sub) => (
        <div key={sub.name} style={{ position: "relative", width: "100%" }}>
          <button
            onClick={() => {
              if (parentName === "Más") handleClickMas(sub.target);
              else if (parentName === "Carreras") handleClickCarrera(sub.name);
              else if (parentName === "SubSedes") handleClickSubSede(sub.name);
              else if (parentName === "Interacción") handleClickPrograma(sub.name);
              else if (parentName === "Investigación") handleClickInvestigacion(sub.target);
              else scrollToTarget(sub.target);
            }}
            onMouseEnter={() => sub.submenu && handleOpenDropdown(sub.name, level)}
            style={{
              display: "block",
              padding: "10px 20px",
              color: "#fff",
              fontSize: "0.7rem",
              fontWeight: "bold",
              textAlign: "left",
              backgroundColor:
                normalizeForUrl(activeSection) === normalizeForUrl(sub.target)
                  ? "#00bfff"
                  : "transparent",
              borderRadius:
                normalizeForUrl(activeSection) === normalizeForUrl(sub.target)
                  ? "5px"
                  : "0",
              cursor: "pointer",
              border: "none",
              width: "100%",
            }}
          >
            {sub.name}
          </button>
          {sub.submenu && openDropdowns[level] === sub.name && (
            <div
              onMouseEnter={() => handleOpenDropdown(sub.name, level)}
              onMouseLeave={() => handleCloseDropdown(level)}
              style={{
                position: "absolute",
                top: 0,
                left: "100%",
                backgroundColor: "#001a66",
                borderRadius: "0 0 10px 10px",
                zIndex: 3000 + level,
                minWidth: Math.max(...sub.submenu.map((s) => s.name.length * 8)) + 40,
              }}
            >
              {renderSubmenu(sub.submenu, level + 1, parentName)}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const menuWidth = scrolled ? "100%" : "75%";

  const menuItems = [
    { name: "Inicio", targets: [] },
    {
      name: "Más",
      submenu: [
        { name: "Bienvenida", target: normalizeForUrl("Bienvenida") },
        { name: "Historia", target: normalizeForUrl("Historia") },
        { name: "Filosofía", target: normalizeForUrl("Filosofía") },
        { name: "Reglamento", target: normalizeForUrl("Reglamento") },
        { name: "Misión y Visión", target: normalizeForUrl("MisionVision") },
        { name: "Autoridades", target: normalizeForUrl("Autoridades") },
      ],
    },
    {
      name: "Carreras",
      submenu: ofertaCarreras.map((c) => ({
        name: c.title,
        target: normalizeForUrl(c.title),
      })),
    },
    { name: "Clinica", targets: ["clinica"].map(normalizeForUrl) },
    {
      name: "SubSedes",
      submenu: ["Santa Cruz", "Cochabamba", "Shinaota", "Montero", "Yacuiba", "Tarija"].map((s) => ({
        name: s,
        target: normalizeForUrl(s),
      })),
    },
    { name: "Noticias", targets: ["noticias"].map(normalizeForUrl) },
    { name: "Requisitos", targets: ["requisitos"].map(normalizeForUrl) },
    {  
      name: "Investigación",
      submenu: [
        { name: "Bienvenida", target: normalizeForUrl("bienvenida") },
        { name: "Boletines", target: normalizeForUrl("boletines") },
        { name: "Salud UNO", target: normalizeForUrl("") },
        { name: "Líneas de Investigación", target: normalizeForUrl("lineadeinvestigacion") },
        { name: "Investigaciónes", target: normalizeForUrl("investigaciones") },
        { name: "Docentes Investigadores", target: normalizeForUrl("docentesinvestigadores") },
      ],
    },
    {
      name: "Interacción",
      submenu: ofertaInteraccion.map((p) => ({
        name: p.titulo,
        target: normalizeForUrl(p.titulo),
      })),
    },
    {
      name: "Postgrado",
      targets: ["postgrado"].map(normalizeForUrl),
      submenu: [
        { name: "Diplomados", target: normalizeForUrl("Diplomados") },
        { name: "Maestrías", target: normalizeForUrl("Maestrias") },
        { name: "Doctorado", target: normalizeForUrl("Doctorado") },
      ],
    },
    { name: "Red Alumni", targets: ["alumni", "otraSeccion"].map(normalizeForUrl) },
  ];

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        overflow: "visible",
        height: "120px",
      }}
    >
      {/* Logo y sede */}
      <div
        style={{
          padding: "0 50px",
          display: "flex",
          alignItems: "center",
          height: "100%",
          position: "relative",
        }}
      >
        {sede && (
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "54%",
              transform: "translateX(-50%)",
              color: logoColor,
              fontSize: "0.5rem",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "1px",
              whiteSpace: "nowrap",
              transition: "color 0.3s ease",
            }}
          >
            {sede}
          </div>
        )}
        <img
          src={logo}
          alt="Logo UNO"
          onClick={handleClickInicio}
          style={{
            maxHeight: "80%",
            marginTop: "-40px",
            cursor: "pointer",
            transition: "filter 0.3s ease",
            filter: logoColor === "white" ? "brightness(0) invert(1)" : "none",
          }}
        />
      </div>

      {/* Fondo azul animado escritorio */}
      <div
        className="d-none d-lg-block"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          height: "70%",
          width: menuWidth,
          backgroundColor: "#001a66",
          borderTopLeftRadius: scrolled ? "0px" : "100px",
          borderBottomLeftRadius: scrolled ? "0px" : "100px",
          transition: "width 0.3s ease, border-radius 0.3s ease",
          zIndex: -1,
        }}
      />

      {/* Menú escritorio */}
      <div
        className="d-none d-lg-block"
        style={{
          marginLeft: "auto",
          width: menuWidth,
          height: "130%",
          display: "flex",
          alignItems: "center",
          transition: "width 0.3s ease",
        }}
      >
        <Navbar expand="lg" variant="dark" style={{ background: "transparent", width: "100%", height: "80%" }}>
          <Container fluid className="p-0" style={{ height: "100%" }}>
            <Nav
              className="align-items-center w-100"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <div style={{ display: "flex", gap: 0, flex: 1, height: "100%", alignItems: "center" }}>
                {menuItems.map((item) =>
                  item.submenu ? (
                    <div
                      key={item.name}
                      onMouseEnter={() => handleOpenDropdown(item.name, 0)}
                      onMouseLeave={() => handleCloseDropdown(0)}
                      style={{ position: "relative", flex: 1, height: "100%" }}
                    >
                      <Nav.Link
                        as="span"
                        className="fw-bold text-white"
                        style={{
                          fontSize: "0.7rem",
                          textAlign: "center",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                      >
                        {item.name}
                      </Nav.Link>
                      {item.submenu && openDropdowns[0] === item.name && (
                        <div style={{ position: "absolute", top: "80%", left: 0, zIndex: 2000 }}>
                          {renderSubmenu(item.submenu, 1, item.name)}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Nav.Link
                      key={item.name}
                      href={item.targets[0] ? `#${item.targets[0]}` : "#"}
                      onClick={(e) => handleClick(e, item)}
                      className="fw-bold text-white"
                      style={{
                        flex: 1,
                        fontSize: "0.7rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        transition: "all 0.3s ease",
                        backgroundColor: item.targets.some(
                          (t) => normalizeForUrl(t) === normalizeForUrl(activeSection)
                        )
                          ? "#00bfff"
                          : "transparent",
                        borderRadius: "5px",
                      }}
                    >
                      {item.name}
                    </Nav.Link>
                  )
                )}
              </div>
            </Nav>
          </Container>
        </Navbar>
      </div>

      {/* menú móvil */}
      <div className="d-lg-none" style={{ width: "100%", position: "fixed", top: 0, left: 0, zIndex: 3000 }}>
        {/* Barra superior */}
        <div
          style={{
            backgroundColor: "#001a66",
            width: "100%",
            padding: "20px 50px 10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <img
              src={logo}
              alt="Logo UNO"
              onClick={handleClickInicio}
              style={{ maxHeight: "80px", cursor: "pointer", filter: "brightness(0) invert(1)", marginTop: "-20px" }}
            />
          </div>
          <button
            onClick={() => {
              setMobileMenuOpen((prev) => !prev);
              if (mobileMenuOpen) setOpenDropdowns({});
            }}
            style={{
              fontSize: "2rem",
              background: "transparent",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              zIndex: 3100,
            }}
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        <div
          style={{
            overflow: "hidden",
            maxHeight: mobileMenuOpen ? "1000px" : "0",
            transition: "max-height 0.5s ease-in-out",
            backgroundColor: "#001a66",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: mobileMenuOpen ? "10px 0" : "0" }}>
            {menuItems.map((item, index) => {
              const isActive = openDropdowns[0] === item.name;
              return (
                <div
                  key={item.name}
                  style={{
                    width: "90%",
                    textAlign: "center",
                    marginBottom: isActive ? "10px" : "0",
                    transform: isActive ? "translateY(0px)" : "translateY(0px)",
                    transition: "all 0.4s ease",
                    display: !openDropdowns[0] || isActive ? "block" : "none",
                  }}
                >
                  {item.submenu ? (
                    <>
                      <button
                        onClick={() =>
                          setOpenDropdowns((prev) => ({
                            0: prev[0] === item.name ? null : item.name,
                          }))
                        }
                        style={{
                          background: "#0044aa",
                          border: "none",
                          color: "#fff",
                          textAlign: "center",
                          padding: "12px 0",
                          width: "100%",
                          fontWeight: "bold",
                          cursor: "pointer",
                          fontSize: "1rem",
                          borderRadius: "5px",
                          transition: "all 0.4s ease",
                        }}
                      >
                        {item.name}
                      </button>

                      <div
                        style={{
                          maxHeight: isActive ? `${item.submenu.length * 50}px` : "0",
                          overflow: "hidden",
                          transition: "max-height 0.4s ease-in-out",
                          backgroundColor: "#0055cc",
                          borderRadius: "5px",
                          marginTop: "5px",
                        }}
                      >
                        {item.submenu.map((sub) => (
                          <button
                            key={sub.name}
                            onClick={() => {
                              if (item.name === "Más") handleClickMas(sub.target);
                              else if (item.name === "Carreras") handleClickCarrera(sub.name);
                              else if (item.name === "SubSedes") handleClickSubSede(sub.name);
                              else if (item.name === "Interacción") handleClickPrograma(sub.name);
                              else if (item.name === "Investigación") handleClickInvestigacion(sub.target);
                              else scrollToTarget(sub.target);
                            }}
                            style={{
                              display: "block",
                              padding: "10px",
                              width: "100%",
                              textAlign: "center",
                              color: "#fff",
                              background: "transparent",
                              border: "none",
                              fontSize: "0.8rem",
                              fontWeight: "bold",
                              cursor: "pointer",
                            }}
                          >
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={(e) => handleClick(e, item)}
                      style={{
                        background: "#0044aa",
                        border: "none",
                        color: "#fff",
                        textAlign: "center",
                        padding: "12px 0",
                        width: "100%",
                        fontWeight: "bold",
                        cursor: "pointer",
                        fontSize: "1rem",
                        borderRadius: "5px",
                        marginBottom: "5px",
                      }}
                    >
                      {item.name}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
