import { create } from "zustand";
import {
  MostrarCierreCajaAperturada,
  AperturarCierreCaja,
  CerrarTurnoCaja,
} from "../supabase/crudCierresCaja";
export const useCierreCajaStore = create((set) => ({
  stateConteoCaja: false,
  setStateConteoCaja: (p) => set({ stateConteoCaja: p }),

  stateIngresoSalida: false,
  setStateIngresoSalida: (p) => set({ stateIngresoSalida: p }),

  stateCierreCaja: false,
  setStateCierraCaja: (p) => set({ stateCierreCaja: p }),
  tipoRegistro: "",
  setTipoRegistro: (p) => set({ tipoRegistro: p }),
  dataCierreCaja: null,
  mostrarCierreCaja: async (p) => {
    const response = await MostrarCierreCajaAperturada(p);
    set({ dataCierreCaja: response });
    return response;
  },
  aperturarcaja: async (p) => {
    const response = await AperturarCierreCaja(p);
    set({ dataCierreCaja: response });
    return response;
  },
  cerrarTurnoCaja: async (p) => {
    await CerrarTurnoCaja(p);
  },
}));
