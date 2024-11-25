import { create } from "zustand";
import {
  InsertarMovCaja,
  MostrarEfectivoSinVentasMovcierrecaja,
  MostrarVentasMetodoPagoMovCaja,
} from "../supabase/crudMovimientosCaja";

export const useMovCajaStore = create((set, get) => ({
  totalVentasMetodoPago: 0,
  totalVentasEfectivo: 0,
  totalAperturaCaja: 0,
  totalGastosVariosCaja: 0,
  totalIngresosVariosCaja: 0,
  totalEfectivoCajaSinVentas: 0,
  totalEfectivoTotalCaja: 0,
  updateTotalEfectivoTotalCaja: () => {
    const { totalEfectivoCajaSinVentas, totalVentasEfectivo } = get();
    const total = totalEfectivoCajaSinVentas + totalVentasEfectivo;
    set({ totalEfectivoTotalCaja: total });
  },
  setTotalEfectivoCajaSinVentas: (p) => {
    set({ totalEfectivoCajaSinVentas: p });
    get().updateTotalEfectivoTotalCaja(); //recalcular el total
  },
  setTotalVentasEfectivo: (p) => {
    set({ totalVentasEfectivo: p });
    get().updateTotalEfectivoTotalCaja(); //recalcular el total
  },

  insertarMovCaja: async (p) => {
    await InsertarMovCaja(p);
  },
  mostrarEfectivoSinVentasMovcierrecaja: async (p) => {
    const result = await MostrarEfectivoSinVentasMovcierrecaja(p);
    // Filtrar solo los movimientos de tipo "apertura"
    const movimientosApertura = result.filter(
      (item) => item.tipo_movimiento === "apertura"
    );
    // Sumar la columna "monto" solo para los movimientos de tipo "apertura"
    const totalApertura = movimientosApertura.reduce(
      (total, item) => total + (item.monto || 0),
      0
    );
    set({ totalAperturaCaja: totalApertura });

    // Filtrar solo los movimientos de tipo "ingreso"
    const movimientosIngreso = result.filter(
      (item) => item.tipo_movimiento === "ingreso"
    );
    const totalIngreso = movimientosIngreso.reduce(
      (total, item) => total + (item.monto || 0),
      0
    );
    set({ totalIngresosVariosCaja: totalIngreso });

    // Filtrar solo los movimientos de tipo "salida"
    const movimientosSalida = result.filter(
      (item) => item.tipo_movimiento === "salida"
    );
    // Sumar la columna "monto" solo para los movimientos de tipo "salida"
    const totalSalida = movimientosSalida.reduce(
      (total, item) => total + (item.monto || 0),
      0
    );
    set({ totalGastosVariosCaja: totalSalida });
    const totalEfectivoCajaSinVentas =
      totalApertura + totalIngreso - totalSalida;
    set({ totalEfectivoCajaSinVentas: totalEfectivoCajaSinVentas });
    get().setTotalEfectivoCajaSinVentas(totalEfectivoCajaSinVentas);
    return result;
  },
  mostrarVentasMetodoPagoMovCaja: async (p) => {
    const result = await MostrarVentasMetodoPagoMovCaja(p);
    //sumamos el total
    const totalMonto = result.reduce(
      (total, item) => total + (item.monto || 0),
      0
    );
    // Filtrar solo las ventas en efectivo
    const ventasEfectivo = result.filter(
      (item) => item.metodo_pago === "Efectivo"
    );
    // Sumar la columna "monto" solo para ventas en efectivo
    const totalEfectivo = ventasEfectivo.reduce(
      (total, item) => total + (item.monto || 0),
      0
    );
    set({ totalVentasMetodoPago: totalMonto });
    set({ totalVentasEfectivo: totalEfectivo });
    get().setTotalVentasEfectivo(totalEfectivo);
    return result;
  },
}));
