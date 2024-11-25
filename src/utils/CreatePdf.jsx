
import printJS from "print-js";
import * as pdfMake from "pdfmake/build/pdfmake";
import "pdfmake/build/vfs_fonts";

const createPdf = async (props, output = "print") => {
  return new Promise((resolve, reject) => {
    try {
      const {
        pageSize = {
          width: 226.77,
          height: 841.88,
        },
        pageMargins = [5.66, 5.66, 5.66, 5.66],
        info = {},
        styles = {},
        content,
      } = props;
      const docDefinition = {
        pageSize, //TAMAÑO HOJA
        pageMargins, //MARGENES HOJA
        info, //METADATA PDF
        styles, //ESTILOS PDF
        content, // CONTENIDO PDF
      };
      if (output === "b64") {
        const pdfMakeCreatePdf = pdfMake.createPdf(docDefinition);
        pdfMakeCreatePdf.getBase64((data) => {
          resolve({
            success: true,
            content: data,
            message: "Archivo generado correctamente.",
          });
        });
        return;
      } else if (output === "print") {
        //ENVIAR A IMPRESIÓN DIRECTA
        const pdfMakeCreatePdf = pdfMake.createPdf(docDefinition);
        pdfMakeCreatePdf.getBase64((data) => {
          printJS({
            printable: data,
            type: "pdf",
            base64: true,
          });
          resolve({
            seccess: true,
            content: null,
            message: "Documento enviado a impresión.",
          });
        });
        return
      }
      reject({
        success: false,
        content: null,
        message: "Debes enviar tipo salida.",
      });
    } catch (error) {
      reject({
        success: false,
        content: null,
        message: error?.message ?? "No se pudo generar el proceso.",
      });
    }
  });
};
export default createPdf;
