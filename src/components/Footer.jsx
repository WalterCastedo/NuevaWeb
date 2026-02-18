import { Container, Row, Col } from "react-bootstrap";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";
import logo from "../assets/img/logo.webp";
import { useParams } from "react-router-dom";
import dataJson from "../assets/json/datos.json";

export default function Footer() {
  const { sede } = useParams();
  const footerData = dataJson[sede]?.footer || {};

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
            {footerData.edificios?.map((edificio, i) => (
              <p key={i} style={{ margin: 0, color: "white" }}>
                <strong>{edificio.nombre}:</strong> {edificio.direccion} <br />
                {edificio.telefono && <>Telf: {edificio.telefono} <br /></>}
                {edificio.fax && <>Fax: {edificio.fax} <br /></>}
              </p>
            ))}
            {footerData.email && (
              <a href={`mailto:${footerData.email}`} style={{ color: "#ffffffff" }}>
                {footerData.email}
              </a>
            )}
          </Col>

          {/* Redes sociales */}
          <Col md={3} className="text-center">
            <p className="mb-2">Universidad UNO</p>
            <div className="d-flex justify-content-center gap-3">
              {footerData.redes?.instagram && (
                <a href={footerData.redes.instagram} target="_blank" rel="noreferrer" style={{ color: "#ffffffff" }}>
                  <FaInstagram size={24} />
                </a>
              )}
              {footerData.redes?.facebook && (
                <a href={footerData.redes.facebook} target="_blank" rel="noreferrer" style={{ color: "#ffffffff" }}>
                  <FaFacebook size={24} />
                </a>
              )}
              {/* {footerData.redes?.twitter && (
                <a href={footerData.redes.twitter} target="_blank" rel="noreferrer" style={{ color: "#ffffffff" }}>
                  <FaTwitter size={24} />
                </a>
              )}*/}
            </div>
          </Col>
        </Row>
      </Container>

      {/* Copyright */}
      <div style={{ backgroundColor: "#002b6c", color: "#fff" }} className="text-center py-2">
        <small>
          © Copyright 2026 UNIVERSIDAD NACIONAL DEL ORIENTE. Todos los Derechos Reservados
        </small>
      </div>
    </footer>
  );
}
