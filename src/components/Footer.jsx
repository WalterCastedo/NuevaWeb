import { Container, Row, Col } from "react-bootstrap";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";
import logo from "../assets/img/logo.png"; // coloca aquí tu logo

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#808080ff", color: "#000" }}>
      <Container fluid className="py-4">
        <Row className="align-items-center">
          {/* Logo */}
          <Col md={4} className="text-center mb-3 mb-md-0">
            <img src={logo} alt="UNO" style={{ maxWidth: "300px" }} />
               </Col>

          {/* Información de contacto */}
          <Col md={5} className="text-start">
            <p style={{ margin: 0 , color:"white"}}>
              <strong>Edificio Central:</strong> Calle Libertad – esq. Andrés Ibáñez. <br />
              Telf: (591) (3) 333 7577 – Fax: (591) (3) 336 8453. <br />
              <strong>Edificio Ciencias de la Salud:</strong> Calle 24 de Septiembre entre calles Cuellar y Seoane <br />
              Telf: (591) 62241035 – 62241036 <br />
              <strong>Clínica Odontológica:</strong> Calle España esq. Florida #220. <br />
              Telf: (591) (3) 337 7951. <br />
              <a href="mailto:informaciones@uno.edu.bo" style={{ color: "#ffffffff" }}>
                informaciones@uno.edu.bo
              </a>
            </p>
          </Col>

          {/* Redes sociales */}
          <Col md={3} className="text-center">
            <p className="mb-2">Universidad UNO</p>
            <div className="d-flex justify-content-center gap-3">
              <a href="#" style={{ color: "#ffffffff" }}>
                <FaInstagram size={24} />
              </a>
              <a href="#" style={{ color: "#ffffffff" }}>
                <FaFacebook size={24} />
              </a>
              <a href="#" style={{ color: "#ffffffff" }}>
                <FaTwitter size={24} />
              </a>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Copyright */}
      <div style={{ backgroundColor: "#002b6c", color: "#fff" }} className="text-center py-2">
        <small>
          © Copyright 2025 UNIVERSIDAD NACIONAL DEL ORIENTE. Todos los Derechos Reservados
        </small>
      </div>
    </footer>
  );
}
