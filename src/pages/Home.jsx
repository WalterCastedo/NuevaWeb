import { useParams } from "react-router-dom";
import datos from "../assets/json/datos.json";

import Inscripcion from '../components/Inscripcion';
import Oferta from "../components/Oferta";
import Alumni from "../components/Alumni";
import Sedes from "../components/Sedes";
import Noticias from "../components/Noticias";
import Requisitos from "../components/Requisitos";
import NotFound from "../components/404";

export default function Home() {
  const { sede: sedeUrl } = useParams();

  const infoSede = Object.keys(datos).find(
    key => key.replace(/\s+/g, '').toLowerCase() === sedeUrl.toLowerCase()
  );

  const sedeData = infoSede ? datos[infoSede] : null;

  if (!sedeData) return <NotFound mensaje={`La sede "${sedeUrl}" no existe.`} />;

  return (
    <>
      {sedeData?.inscripcion && <Inscripcion data={sedeData.inscripcion} />}
      {sedeData?.oferta && <Oferta data={sedeData.oferta} />}
      {sedeData?.sedes && <Sedes data={sedeData.sedes} />}
      {sedeData?.alumni && <Alumni data={sedeData.alumni} />}
      {sedeData?.requisitos && <Requisitos data={sedeData.requisitos} />}
      {sedeData?.noticias && <Noticias data={sedeData.noticias} />}
      
      
    </>
  );
}
