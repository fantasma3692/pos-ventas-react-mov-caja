import { create } from "zustand";
import { MostrarMetodosPago,InsertarMetodosPago,EliminarMetodosPago,EditarMetodosPago } from "../supabase/crudMetodosPago";

export const useMetodosPagoStore = create((set) => ({
  dataMetodosPago: null,
  mostrarMetodosPago: async (p) => {
    const response = await MostrarMetodosPago(p);
    set({ dataMetodosPago: response });
    return response;
  },
  metodosPagoItemSelect: [],
  selectMetodosPago: (p) => {
    set({ metodosPagoItemSelect: p });
  },
  insertarMetodosPago: async (p, file) => {
    await InsertarMetodosPago(p, file);
  },
  eliminarMetodosPago: async (p) => {
    await EliminarMetodosPago(p);
  },
  editarMetodosPago: async (p, fileold, filenew) => {
    await EditarMetodosPago(p, fileold, filenew);
  },

}));
