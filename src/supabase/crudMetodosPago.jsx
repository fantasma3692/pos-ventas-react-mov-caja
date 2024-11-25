import { supabase } from "./supabase.config";
const tabla = "metodos_pago";
export async function MostrarMetodosPago(p) {
  const { data } = await supabase
    .from(tabla)
    .select()
    .eq("id_empresa", p.id_empresa);
  return data;
}
//manejo de icono en forma de imagen
export async function InsertarMetodosPago(p, file) {
  const { error, data } = await supabase
    .from(tabla)
    .insert(p)
    .select()
    .maybeSingle();
  if (error) {
    throw new Error(error.message);
  }
  const img = file.size;
  if (img != undefined) {
    const nuevo_id = data?.id;
    const urlImagen = await subirImagen(nuevo_id, file);
    const piconoeditar = {
      icono: urlImagen.publicUrl,
      id: nuevo_id,
    };
    await EditarIconoMetodosPago(piconoeditar);
  }
}

async function subirImagen(idmetodopago, file) {
  const ruta = "metodospago/" + idmetodopago;
  const { data, error } = await supabase.storage
    .from("imagenes")
    .upload(ruta, file, {
      cacheControl: "0",
      upsert: true,
    });
  if (error) {
    throw new Error(error.message);
  }
  if (data) {
    const { data: urlimagen } = await supabase.storage
      .from("imagenes")
      .getPublicUrl(ruta);
    return urlimagen;
  }
}
async function EditarIconoMetodosPago(p) {
  const { error } = await supabase.from(tabla).update(p).eq("id", p.id);
  if (error) {
    throw new Error(error.message);
  }
}
export async function EditarIconoStorage(id, file) {
  const ruta = "metodospago/" + id;
  await supabase.storage.from("imagenes").update(ruta, file, {
    cacheControl: "0",
    upsert: true,
  });
}
//
export async function EditarMetodosPago(p, fileold, filenew) {
  const { error } = await supabase.from(tabla).update(p).eq("id", p.id);
  if (error) {
    throw new Error(error.message);
  }
  if (filenew != "-" && filenew.size != undefined) {
    if (fileold != "-") {
      await EditarIconoStorage(p._id, filenew);
    } else {
      const dataImagen = await subirImagen(p._id, filenew);
      const piconoeditar = {
        icono: dataImagen.publicUrl,
        id: p._id,
      };
      await EditarIconoMetodosPago(piconoeditar);
    }
  }
}

export async function EliminarMetodosPago(p) {
  const { error } = await supabase.from(tabla).delete().eq("id", p.id);
  if (error) {
    throw new Error(error.message);
  }
  if (p.icono != "-") {
    const ruta = "metodospago/" + p.id;
    await supabase.storage.from("imagenes").remove([ruta]);
  }
}