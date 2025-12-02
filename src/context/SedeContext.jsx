import { createContext, useContext, useState, useEffect } from "react";

const SedeContext = createContext();

export function SedeProvider({ children }) {
  const [sede, setSede] = useState(() => {
    return localStorage.getItem("sede") || null;
  });

  useEffect(() => {
    if (sede) localStorage.setItem("sede", sede);
  }, [sede]);

  return (
    <SedeContext.Provider value={{ sede, setSede }}>
      {children}
    </SedeContext.Provider>
  );
}

export function useSede() {
  return useContext(SedeContext);
}
