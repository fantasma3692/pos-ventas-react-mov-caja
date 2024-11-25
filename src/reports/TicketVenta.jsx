import { urlToBase64 } from "../utils/Conversiones";
import createPdf from "../utils/CreatePdf";
const TicketVenta = async (output, data) => {
  const logoempresa = await urlToBase64(data.logo);
  const productTableBody = [
    [
      { text: "CÓDIGO - DESCRIPCIÓN", colSpan: 4, style: "tProductsHeader" },
      {},
      {},
      {},
    ],
    [
      { text: "CANT.", style: "tProductsHeader" },
      { text: "UM", style: "tProductsHeader", alignment: "center" },
      { text: "PRECIO", style: "tProductsHeader", alignment: "right" },
      { text: "TOTAL", style: "tProductsHeader", alignment: "right" },
    ],
    ...data.productos.flatMap((item) => [
      [
        {
          text: `"codigo" - ${item._descripcion}`,
          style: "tProductsBody",
          colSpan: 4,
        },
        {},
        {},
        {},
      ],
      [
        { text: item._cantidad, style: "tProductsBody", alignment: "center" },
        { text: "unidad", style: "tProductsBody", alignment: "center" },
        {
          text: item._precio_venta,
          style: "tProductsBody",
          alignment: "right",
        },
        { text: item._total, style: "tProductsBody", alignment: "right" },
      ],
    ]),
  ];

  const content = [
    //DATA EMPRESA
    {
      image: logoempresa, //logo
      fit: [141.73, 56.692],
      alignment: "center",
    },
    {
      text: "NOMBRE EMPRESA",
      style: "header",
      margin: [0, 10, 0, 0],
    },
    {
      text: "DIRECION",
      style: "header",
    },
    {
      text: "RUC EMPRESA",
      style: "header",
    },

    //TIPO Y NUMERO DOCUMENTO
    { text: "FACTURA ELECTRÓNICA", style: "header", margin: [0, 10, 0, 2.25] },
    { text: "F001-000001", style: "header", margin: [0, 2.25, 0, 0] },

    //DATOS CEBECERA FACTURAR
    {
      margin: [0, 10, 0, 0],
      table: {
        widths: ["25%", "35%", "15%", "25%"],
        body: [
          [
            { text: "FECHA", style: "tHeaderLabel" },
            { text: "20/25/20", style: "tHeaderLabel" },
            { text: "HORA:", style: "tHeaderLabel" },
            { text: "00:25:00:", style: "tHeaderLabel" },
          ],
          [
            { text: "CAJERO:", style: "tHeaderLabel" },
            { text: "NOMBRE CAJERO", style: "tHeaderValue", colSpan: 3 },
            {},
            {},
          ],
          [
            { text: "VENDEDOR:", style: "tHeaderLabel" },
            { text: "MARK SAM", style: "tHeaderValue", colSpan: 3 },
            {},
            {},
          ],

          //DATOS CLIENTE
          [
            {
              text: "CLIENTE: ",
              style: "tTotals",
              alignment: "left",
              colSpan: 4,
              margin: [0, 6, 0, 0],
            },
            {},
            {},
            {},
          ],
          [
            { text: "NOMBRES: ", style: "tClientLabel" },
            {
              text: "MADERAS CASTOREO S.A.",
              style: "tClientValue",
              colSpan: 3,
            },
            {},
            {},
          ],
          [
            { text: "DOC.ID: ", style: "tClientLabel" },
            { text: "11155998822", style: "tClientValue", colSpan: 3 },
            {},
            {},
          ],
          [
            { text: "DIRECC.: ", style: "tClientLabel" },
            {
              text: "15Z INT. 7X6 URB. JARDIN - SAN ISIDRO - LIMA",
              style: "tClientValue",
              colSpan: 3,
            },
            {},
            {},
          ],
        ],
      },
      layout: "noBorders",
    },
    //TABLA PRODUCTOS
    {
      margin: [0, 10, 0, 0],
      table: {
        widths: ["20%", "20%", "30%", "30%"],
        headerRows: 2,
        body: productTableBody,
      },
      layout: {
        hLineWidth: function (i, node) {
          return i == 2 ? 0.5 : 0;
        },
        vLineWidth: function (i, node) {
          return 0;
        },
        hLineColor: function () {
          return "#a9a9a9";
        },
      },
    },
    //TOTALES
    {
      margin: [0, 10, 0, 0],
      table: {
        widths: ["25%", "35%", "15%", "25%"],
        body:[
          //TOTAL
          [
            { text: "SUBTOTAL: S/", style: "tTotals", colSpan: 2 },
            {},
            { text: "45", style: "tTotals", colSpan: 2 },
            {},
          ],
          [
            { text: "I.G.V: S/", style: "tTotals", colSpan: 2 },
            {},
            { text: "45", style: "tTotals", colSpan: 2 },
            {},
          ],
          [
            { text: "TOTAL: S/", style: "tTotals", colSpan: 2 },
            {},
            { text: "45", style: "tTotals", colSpan: 2 },
            {},
          ],
          //TOTAL IMPORTE EN LETRAS
          [
            {
              text: "IMPORTE EN LETRAS:",
              style: "tTotals",
              alignment: "left",
              colSpan: 4,
              margin: [0, 4, 0, 0],
            },
            {},
            {},
            {},
          ],
          [
            {
              text: `SON: CUARENTA Y CINCO/100`,
              style: "tProductsBody",
              colSpan: 4,
            },
            {},
            {},
            {},
          ],
          //FORMAS DE PAGO
          [
            {
              text: "FORMA DE PAGO:",
              style: "tTotals",
              alignment: "left",
              colSpan: 4,
              margin: [0, 4, 0, 0],
            },
            {},
            {},
            {},
          ],
          [{ text: "EFECTIVO", style: "tProductsBody", colSpan: 4 }, {}, {}, {}],
          [
            { text: "EFECTIVO: S/", style: "tTotals", colSpan: 2 },
            {},
            { text: "635.00", style: "tTotals", colSpan: 2 },
            {},
          ],
          [
            { text: "VISA: S/", style: "tTotals", colSpan: 2 },
            {},
            { text: "45", style: "tTotals", colSpan: 2 },
            {},
          ],
          [
            { text: "CREDITO: S/", style: "tTotals", colSpan: 2 },
            {},
            { text: "55", style: "tTotals", colSpan: 2 },
            {},
          ],

        ]
      },
      layout: "noBorders",
    },
     //NOTA DE PIE
     {
      text: "ESTIMADO CLIENTE, TIENE COMO PLAZO MAXIMO DE 5 DIAS HABILES EN RECOGER SU MERCADERÍA, DICHO ESTO SE LE COBRARÍA PENALIDAD DE ALMACEN POR EL MONTO DE S/20.00 POR DIA, GRACIAS.",
      style: "text",
      alignment: "justify",
      margin: [0, 5],
    },
    //QR FACTURA
    {
      stack:[
        {
          qr:"20603831404|03|B002|000131|724.94|4,752.30|30/09/2023|1|70477554|v2Ez4sKStje4NiqcXiuTcmTtPwgbrqgnXpWPltJKEhk=|",
          fit: 115,
          alignment: "center",
          eccLevel: "Q",
          margin: [0, 10, 0, 3]
        },
        {
          text: "Representación impresa del comprobante original. Consulta tu comprobante aquí:",
          style: "text",
        },
        {
          text: "https://x.microsoft.pse.pe/cpe/ace72300-0dfb-42d2-9ed7-0ba6e3cee01f",
          link: "https://x.microsoft.pse.pe/cpe/ace72300-0dfb-42d2-9ed7-0ba6e3cee01f",
          style: "link",
        },
      ]
    }
  ];

  //estilos
  const styles = {
    header: {
      fontSize: 9,
      bold: true,
      alignment: "center",
    },
    tHeaderLabel: {
      fontSize: 8,
      alignment: "right",
    },
    tHeaderValue: {
      fontSize: 8,
      bold: true,
    },
    tProductsHeader: {
      fontSize: 8.5,
      bold: true,
    },
    tProductsBody: {
      fontSize: 9,
    },
    tTotals: {
      fontSize: 9,
      bold: true,
      alignment: "right",
    },
    tClientLabel: {
      fontSize: 8,
      alignment: "right",
    },
    tClientValue: {
      fontSize: 8,
      bold: true,
    },
    text: {
      fontSize: 8,
      alignment: "center",
    },
    link: {
      fontSize: 8,
      bold: true,
      margin: [0, 0, 0, 4],
      alignment: "center",
    },
  };
  const response = await createPdf({ content, styles }, output);
  return response;
};
export default TicketVenta;
