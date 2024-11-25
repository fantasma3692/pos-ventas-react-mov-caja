import { supabase } from "./supabase.config";
const tabla = "caja";
export async function MostrarCajaXSucursal(p) {
    const { data } = await supabase
      .from(tabla)
      .select()
      .eq("id_sucursal", p.id_sucursal)
      .maybeSingle();
    return data;
  }