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

  const menuBgColor = "#001a66"; // color del menú
  const defaultLogoColor = menuBgColor; // color inicial en páginas internas

  const [scrolled, setScrolled] = useState(false);
  const [logoColor, setLogoColor] = useState(defaultLogoColor);
  const [activeSection, setActiveSection] = useState("Inicio");
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [ofertaCarreras, setOfertaCarreras] = useState([]);

  // ====== Manejo del color del logo y scroll ======
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 0);

      const pathParts = location.pathname.split("/").filter(Boolean);
      const isMainOrSoloSede = pathParts.length <= 1; // página principal o solo sede

      // Logo y texto
      if (isMainOrSoloSede) {
        setLogoColor("white"); // siempre blanco
      } else {
        setLogoColor(scrollY > 0 ? "white" : defaultLogoColor); // cambia a blanco solo al hacer scroll
      }

      // Secciones activas
      const sections = document.querySelectorAll("section[id]");
      let current = "Inicio";
      sections.forEach((section) => {
        const top = section.offsetTop - 100;
        const bottom = top + section.offsetHeight;
        if (scrollY >= top && scrollY < bottom) current = section.id;
      });
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  // ====== Cargar oferta de carreras según sede ======
  useEffect(() => {
    if (!sede) return;
    const dataSede = dataJson[sede];
    const carreras = dataSede?.oferta || (Array.isArray(dataSede) ? dataSede : []);
    setOfertaCarreras(carreras);
  }, [sede]);

  // ====== Navegaciones ======
  const normalizeForUrl = (text) =>
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "");

  const handleClickInicio = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(sede ? `/${normalizeForUrl(sede)}` : "/");
  };

  const handleClickCarrera = (nombre) =>
    navigate(`/${normalizeForUrl(sede)}/Carrera/${normalizeForUrl(nombre)}`);

  const handleClickSubSede = (sub) => {
    navigate(`/${normalizeForUrl(sub)}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClickMas = (target) =>
    navigate(`/${normalizeForUrl(sede)}/Mas/${normalizeForUrl(target)}`);

  const scrollToTarget = (target) => {
    const el = document.getElementById(target);
    if (el) {
      const offset = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  };

  const handleClick = (e, item) => {
    e.preventDefault();
    if (item.name === "Inicio") return handleClickInicio();
    if (item.targets?.length)
      item.targets.forEach((t, i) => setTimeout(() => scrollToTarget(t), i * 100));
  };

  // ====== Dropdowns ======
  const handleOpenDropdown = (name, level) =>
    setOpenDropdowns((prev) => ({ ...prev, [level]: name }));

  const handleCloseDropdown = (level) =>
    setOpenDropdowns((prev) => {
      const copy = { ...prev };
      Object.keys(copy).forEach((key) => parseInt(key) >= level && (copy[key] = null));
      return copy;
    });

  const renderSubmenu = (submenu, level = 0, parentName = "") => (
    <div style={{ display: "flex", flexDirection: "column", minWidth: "200px", backgroundColor: "#001a66", borderRadius: "0 0 10px 10px" }}>
      {submenu.map((sub) => (
        <div key={sub.name} style={{ position: "relative" }}>
          <button
            onClick={() => {
              if (parentName === "Más") handleClickMas(sub.target);
              else if (parentName === "Carreras") handleClickCarrera(sub.name);
              else if (parentName === "SubSedes") handleClickSubSede(sub.name);
              else scrollToTarget(sub.target);
            }}
            onMouseEnter={() => sub.submenu && handleOpenDropdown(sub.name, level)}
            style={{
              display: "block",
              padding: "10px 20px",
              color: "#fff",
              fontSize: "0.7rem",
              fontWeight: "bold",
              textDecoration: "none",
              backgroundColor: activeSection === sub.target ? "#00bfff" : "transparent",
              borderRadius: activeSection === sub.target ? "5px" : "0",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "background 0.3s ease",
              border: "none",
              textAlign: "left",
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
                minWidth: "200px",
                backgroundColor: "#001a66",
                borderRadius: "0 0 10px 10px",
                zIndex: 3000 + level,
                opacity: 0,
                transform: "translateY(-10px)",
                animation: "fadeIn 0.3s forwards",
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
        { name: "Bienvenida", target: "bienvenida" },
        { name: "Historia", target: "historia" },
        { name: "Filosofía", target: "filosofia" },
        { name: "Reglamento", target: "reglamento" },
        { name: "Misión y Visión", target: "misionvision" },
        { name: "Autoridades", target: "autoridades" },
      ],
    },
    {
      name: "Carreras",
      submenu: ofertaCarreras.map((c) => ({ name: c.title, target: c.title })),
    },
    { name: "Clinica", targets: ["clinica"] },
    {
      name: "SubSedes",
      submenu: [
        { name: "Santa Cruz", target: "SantaCruz" },
        { name: "Cochabamba", target: "Cochabamba" },
        { name: "Shinaota", target: "Shinaota" },
        { name: "Montero", target: "Montero" },
        { name: "Yacuiba", target: "Yacuiba" },
        { name: "Tarija", target: "Tarija" },
      ],
    },
    { name: "Noticias", targets: ["noticias"] },
    { name: "Requisitos", targets: ["requisitos"] },
    { name: "Investigación", targets: ["investigacion"] },
    { name: "Interacción", targets: ["interaccion"] },
    {
      name: "Postgrado",
      targets: ["postgrado"],
      submenu: [
        { name: "Diplomados", target: "Diplomados" },
        { name: "Maestrías", target: "Maestrias" },
        { name: "Doctorado", target: "Doctorado" },
      ],
    },
    { name: "Red Alumni", targets: ["alumni", "otraSeccion"] },
  ];

  return (
    <div style={{ display: "flex", alignItems: "center", position: "sticky", top: 0, zIndex: 1000, overflow: "visible", height: "120px" }}>
      {/* Logo y sede */}
      <div style={{ padding: "0 50px", display: "flex", alignItems: "center", height: "100%", position: "relative" }}>
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
            filter: logoColor === "white" ? "brightness(0) invert(1)": "none" ,
          }}
        />
      </div>

      {/* Fondo azul animado */}
      <div
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

      {/* Menú */}
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
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", height: "100%" }}
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
                        <div style={{ position: "absolute", top: "80%", left: 0, width: "100%", zIndex: 2000 }}>
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
                        backgroundColor: item.targets.some((t) => t === activeSection) ? "#00bfff" : "transparent",
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
    </div>
  );
}
