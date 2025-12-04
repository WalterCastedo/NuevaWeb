import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import CareerCard from "./components/Carrera";
import SeccionMas from "./components/SeccionMas";
import SeleccionarSede from "./pages/SeleccionarSede";
import Interaccion from "./components/inteaccion";
import ScrollToTop from "./components/ScrollToTop";
import investigacion from "./components/investigacion"
import RedAlumni from "./components/RedAlumni";
import { useEffect } from "react";

// Componente para normalizar params y redirigir si es necesario
function RouteWrapper({ element: Element }) {
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    // Normaliza todos los parámetros a minúscula
    let normalized = false;
    const newParams = {};
    Object.keys(params).forEach((key) => {
      if (params[key] && params[key] !== params[key].toLowerCase()) {
        newParams[key] = params[key].toLowerCase();
        normalized = true;
      }
    });

    if (normalized) {
      // Construye la URL normalizada y reemplaza la ruta
      let path = window.location.pathname;
      Object.keys(newParams).forEach((key) => {
        const re = new RegExp(params[key], "i");
        path = path.replace(re, newParams[key]);
      });
      navigate(path, { replace: true });
    }
  }, [params, navigate]);

  return <Element />;
}

function AppContent() {
  return (
    <Routes>
      {/* Página para seleccionar sede */}
      <Route path="/" element={<SeleccionarSede />} />

      {/* Página de Home según la sede */}
      <Route
        path="/:sede"
        element={
          <>
            <RouteWrapper element={Header} />
            <main className="bg-white min-h-screen">
              <RouteWrapper element={Home} />
            </main>
            <Footer />
          </>
        }
      />

      {/* Página de carrera */}
      <Route
        path="/:sede/carrera/:carrera"
        element={
          <>
            <RouteWrapper element={Header} />
            <main className="bg-white min-h-screen">
              <RouteWrapper element={CareerCard} />
            </main>
            <Footer />
          </>
        }
      />

       {/* Página de carrera */}
      <Route
        path="/:sede/redalumni/:seccion"
        element={
          <>
            <RouteWrapper element={Header} />
            <main className="bg-white min-h-screen">
              <RouteWrapper element={RedAlumni} />
            </main>
            <Footer />
          </>
        }
      />

      {/* PÁGINAS DEL MENÚ "MÁS" */}
      <Route
        path="/:sede/mas/:seccion"
        element={
          <>
            <RouteWrapper element={Header} />
            <main className="bg-white min-h-screen">
              <RouteWrapper element={SeccionMas} />
            </main>
            <Footer />
          </>
        }
      />

      {/* Página de interacción */}
      <Route
        path="/:sede/interaccion/:programa"
        element={
          <>
            <RouteWrapper element={Header} />
            <main className="bg-white min-h-screen">
              <RouteWrapper element={Interaccion} />
            </main>
            <Footer />
          </>
        }
      />

      {/* Página de investigacion */}
      <Route
        path="/:sede/investigacion/:seccion"
        element={
          <>
            <RouteWrapper element={Header} />
            <main className="bg-white min-h-screen">
              <RouteWrapper element={investigacion} />
            </main>
            <Footer />
          </>
        }
      />

      {/* Ruta no encontrada */}
      <Route
        path="*"
        element={
          <div className="text-center mt-5" style={{ fontSize: "1.5rem" }}>
            Página no encontrada
          </div>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}
