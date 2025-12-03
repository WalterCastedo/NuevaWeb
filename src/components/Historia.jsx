import historiaImg from "../assets/img/fundador.webp";
import { Container, Row, Col } from "react-bootstrap";

export default function Historia() {
  return (
    <>
      <style>{`

          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');


        #historia {
          padding: 60px 20px;
          background-color: #ffffff;
         
          
        }

        #historia h2 {
          text-align: center;
          font-size: 4em;
          margin-bottom: 40px;
        
          color: #001F68;
           font-family: 'Montserrat', sans-serif;
            font-weight: 700;
        }

        .historia-texto {
          column-count: 1;
          column-gap: 40px;
           font-family: 'Montserrat', sans-serif;
        }

        .historia-texto p {
          color: #001F68;
          font-size: 1em;
          line-height: 1.6;
          font-weight: 500;
          margin-bottom: 20px;
           font-family: 'Montserrat', sans-serif;
        }

        .historia-imagen-wrapper {
          position: sticky;
          top: 100px;
          align-self: flex-start;
           font-family: 'Montserrat', sans-serif;
        }

        .historia-imagen-wrapper img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
          border-radius: 10px;
        }

        @media (max-width: 768px) {
          .historia-texto {
            column-count: 1;
          }
          .historia-imagen-wrapper {
            position: relative;
            top: auto;
            margin: 0 auto 20px auto;
          }
        }
      `}</style>

      <section id="historia">
        <h2>Reseña histórica</h2>
        <Container>
          <Row>
            {/* Texto */}
            <Col md={8} xs={12} className="historia-texto">
              <p>
                La Universidad Nacional del Oriente de Santa Cruz, fue creada en
                el año 1999 aunque recién en la primera gestión del 2000 abre
                sus puertas a la población estudiantil de la ciudad de Santa Cruz
                de la Sierra y de su provincia Montero. El 22 de Junio de 1999,
                el ministerio de Educación, emite la Resolución Ministerial Nº
                203/99, autorizando el funcionamiento de las carreras de
                Bioquímica, Enfermería, Fisioterapia y Kinesiología, Biología a
                nivel Licenciatura. Además de Mercadotecnia, Forestal, Estadística
                a nivel Técnico Superior.
              </p>
              <p>
                Amparada bajo esta Resolución la Universidad inicia sus primeras
                clases en aulas ubicadas en el Segundo Anillo y Avenida Piraí, con
                26 estudiantes inscritos en su primera gestión de funcionamiento.
              </p>
              <p>
                El 1º de febrero de 2001, la Universidad recibe la Resolución
                Ministerial de Funcionamiento Nº 042/01, autorizando las carreras
                de Odontología, Derecho, Ingeniería de Sistemas a nivel
                Licenciatura y Análisis de Sistemas, Prótesis Dental, Contaduría a
                Nivel Técnico Superior.
              </p>
              <p>
                El 22 de Diciembre del año 2015, por Resolución Ministerial Nº
                996/2015, aprueba la apertura de las Carreras: Licenciatura en
                Odontología, Bioquímica y Farmacia, Fisioterapia y Kinesiología y
                Licenciatura en Contaduría Pública; en la Subsede Montero.
              </p>
              <p>
                La Resolución Ministerial Nº 0913/2016 del 30 de diciembre del
                2016 se aprueban los rediseños curriculares de las Carreras
                Licenciatura en: Derecho, Enfermería, Ing. de Sistemas,
                Odontología, Bioquímica y Farmacia, Fisioterapia y Kinesiología y
                Técnico superior en Contaduría. De acuerdo con el artículo 1º del
                Estatuto Orgánico de la Universidad Nacional del Oriente, ésta es
                una institución de Educación Superior, que forma parte de la
                Asociación Nacional de Universidades Privadas en igual jerarquía
                que las demás universidades, bajo el respaldo de la Constitución
                Política del Estado Plurinacional de Bolivia, la cual establece
                que todas sus actividades académicas están reguladas por el
                Ministerio de Educación, a través del Reglamento General de
                Universidades Privadas y su Estatuto Orgánico.
              </p>
              <p>
                Al presente cuenta con más de 18 años de excelencia académica e
                importante contribución a la formación de recursos humanos
                altamente calificados para las regiones donde se hallan las
                subsedes y todo el Estado.
              </p>
              <p>
                La Universidad Nacional del Oriente tiene como premisa fundamental
                coadyuvar al mejoramiento del bienestar de toda la población del
                país así como de la constante superación de la comunidad
                universitaria, mejorando paulatinamente las condiciones de
                infraestructura y oferta académica, de acuerdo a gestiones que
                desarrollan sus autoridades.
              </p>
            </Col>

            {/* Imagen sticky */}
            <Col md={4} xs={12} className="historia-imagen-wrapper">
              <img src={historiaImg} alt="Fundador de la UNO" />
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
