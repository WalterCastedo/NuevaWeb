import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import CareerCard from "./components/Carrera";
import SeccionMas from "./components/SeccionMas";   // <--- IMPORTANTE
import SeleccionarSede from "./pages/SeleccionarSede";

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
            <Header />
            <main className="bg-white min-h-screen">
              <Home />
            </main>
            <Footer />
          </>
        }
      />

      {/* Página de carrera */}
      <Route
        path="/:sede/Carrera/:carrera"
        element={
          <>
            <Header />
            <main className="bg-white min-h-screen">
              <CareerCard />
            </main>
            <Footer />
          </>
        }
      />

      {/* 🔵 PÁGINAS DEL MENÚ "MÁS" */}
      <Route
        path="/:sede/mas/:seccion"
        element={
          <>
            <Header />
            <main className="bg-white min-h-screen">
              <SeccionMas />
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
      <AppContent />
    </Router>
  );
}
