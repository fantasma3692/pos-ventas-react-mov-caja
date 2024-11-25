import { supabase } from "./supabase.config";
const tabla = "movimientos_caja";
export async function InsertarMovCaja(p) {
  const { error } = await supabase.from(tabla).insert(p);
  if (error) {
    throw new Error(error.message);
  }
}
export async function MostrarEfectivoSinVentasMovcierrecaja(p) {

  const { data } = await supabase.rpc("sumarefectivosinventasmovcierrecaja",p)
  return data;
}
export async function MostrarVentasMetodoPagoMovCaja(p) {
  
  const { data } = await supabase.rpc("sumarventasmetodopagomovcierrecaja",p)
  return data;
}
