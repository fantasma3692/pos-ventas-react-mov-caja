import { useState, useEffect } from "react";

export function useFormattedDate() {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const fechaActual = new Date();
    //2024-19-09 45.45:UTC45200
    const offset = fechaActual.getTimezoneOffset() * 60000; 
    const fechaLocal = new Date(fechaActual - offset)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    setFormattedDate(fechaLocal);
  }, []); 

  return formattedDate;
}
