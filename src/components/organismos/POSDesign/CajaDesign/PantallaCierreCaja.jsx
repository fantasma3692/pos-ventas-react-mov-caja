import styled from "styled-components";
import { VolverBtn } from "../../../moleculas/VolverBtn";
import { Btn1 } from "../../../moleculas/Btn1";
import { Device } from "../../../../styles/breakpoints";
import { useCierreCajaStore } from "../../../../store/CierreCajaStore";
import { useFormattedDate } from "../../../../hooks/useFormattedDate";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { useMovCajaStore } from "../../../../store/MovCajaStore";
import { FormatearNumeroDinero } from "../../../../utils/Conversiones";
import { useEmpresaStore } from "../../../../store/EmpresaStore";
import { PantallaConteoCaja } from "./PantallaConteoCaja";
export function PantallaCierreCaja() {
  const { setStateCierraCaja, dataCierreCaja,stateConteoCaja,setStateConteoCaja } = useCierreCajaStore();
  const {
    mostrarEfectivoSinVentasMovcierrecaja,
    mostrarVentasMetodoPagoMovCaja,
    totalVentasMetodoPago,
    totalVentasEfectivo,
    totalAperturaCaja,
    totalGastosVariosCaja,
    totalIngresosVariosCaja,
    totalEfectivoCajaSinVentas,
    totalEfectivoTotalCaja,
  } = useMovCajaStore();
  const { dataempresa } = useEmpresaStore();
  const fechaactual = useFormattedDate();
  const fechaInicioFormateada = format(
    new Date(dataCierreCaja?.fechainicio),
    "dd/MM/yyyy HH:mm:ss"
  );
  const {
    isLoading: isloading1,
    isError: iserror1,
    error: error1,
  } = useQuery({
    queryKey: ["mostrar efectivo sin ventas movCaja"],
    queryFn: () =>
      mostrarEfectivoSinVentasMovcierrecaja({
        _id_cierre_caja: dataCierreCaja?.id,
      }),
  });
  const {
    data: dataventasmetodopago,
    isLoading: isloading2,
    isError: iserror2,
    error: error2,
  } = useQuery({
    queryKey: ["mostrar ventas metodoPago movCaja"],
    queryFn: () =>
      mostrarVentasMetodoPagoMovCaja({ _id_cierre_caja: dataCierreCaja?.id }),
  });
  const isLoading = isloading1 || isloading2;
  const isError = iserror1 || iserror2;
  const error = error1 || error2;
  if (isloading1) {
    return <span>cargando datos...</span>;
  }
  if (isError) {
    return <span>error...{error.message} </span>;
  }

  return (
    <Container>
      <VolverBtn funcion={()=>setStateCierraCaja(false)} />

      <Fechas>
        Corte de caja desde: {fechaInicioFormateada} Hasta: {fechaactual}
      </Fechas>
      <Datos>
        <section>
          Ventas Totales:{" "}
          <span>
            {FormatearNumeroDinero(
              totalVentasMetodoPago,
              dataempresa?.currency,
              dataempresa?.iso
            )}{" "}
          </span>
        </section>
        <section>
          Efectivo en CAJA:{" "}
          <span>
            {FormatearNumeroDinero(
              totalEfectivoTotalCaja,
              dataempresa?.currency,
              dataempresa?.iso
            )}{" "}
          </span>
        </section>
      </Datos>
      <Division></Division>

      <Resumen>
        <Tablas>
          <Tabla>
            <h4>Dinero en CAJA</h4>
            <ul>
              <li>
                Fondo de caja:{" "}
                <span>
                  {FormatearNumeroDinero(
                    totalAperturaCaja,
                    dataempresa?.currency,
                    dataempresa?.iso
                  )}
                </span>
              </li>
              <li>
                Ventas en efectivo:{" "}
                <span>
                  {" "}
                  {FormatearNumeroDinero(
                    totalVentasEfectivo,
                    dataempresa?.currency,
                    dataempresa?.iso
                  )}
                </span>
              </li>

              <li>
                Ingresos varios:{" "}
                <span>
                  {FormatearNumeroDinero(
                    totalIngresosVariosCaja,
                    dataempresa?.currency,
                    dataempresa?.iso
                  )}
                </span>
              </li>
              <li>
                Gastos varios:{" "}
                <span style={{ color: "#f15050", fontWeight: "bold" }}>-
                  {FormatearNumeroDinero(
                    totalGastosVariosCaja,
                    dataempresa?.currency,
                    dataempresa?.iso
                  )}
                </span>
              </li>
              <li className="total">
                <Divider />
                {FormatearNumeroDinero(
                  totalEfectivoTotalCaja,
                  dataempresa?.currency,
                  dataempresa?.iso
                )}
              </li>
            </ul>
          </Tabla>
          <DivisionY />
          <Tabla>
            <h4>Ventas Totales</h4>
            <ul>
              {dataventasmetodopago?.map((item, index) => {
                return (
                  <li key={index}>
                    En {item?.metodo_pago}:{" "}
                    <span>
                      {FormatearNumeroDinero(
                        item?.monto,
                        dataempresa?.currency,
                        dataempresa?.iso
                      )}{" "}
                    </span>
                  </li>
                );
              })}
              <li className="total">
                <Divider />
                {FormatearNumeroDinero(
                  totalVentasMetodoPago,
                  dataempresa?.currency,
                  dataempresa?.iso
                )}
              </li>
            </ul>
          </Tabla>
          <DivisionY />
        </Tablas>
      </Resumen>
      <Btn1 funcion={()=>setStateConteoCaja(true)}
        titulo={"CERRAR CAJA"}
        color="#ffffff"
        border="2px"
        bgcolor="#e88018"
      />
{
  stateConteoCaja && <PantallaConteoCaja/>
}
      
    </Container>
  );
}

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.color2};
  margin-right: 10px;
`;
const DivisionY = styled.span`
  width: 1px;
  border-radius: 15px;
  margin: 20px 0;
  position: relative;
  text-align: center;
  display: none;
  border-left: 1px dashed ${({ theme }) => theme.color2};
  height: 95%;
  @media ${Device.tablet} {
    display: block;
  }
`;
const Division = styled.span`
  background-color: ${({ theme }) => theme.color2};
  height: 1px;
  border-radius: 15px;
  margin: 20px 0;
  position: relative;
  text-align: center;
  display: block;
  width: 95%;
`;
// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.bgtotal || "#fff"};
  gap: 20px;
  position: absolute;
  width: 100%;
  justify-content: center;
  z-index: 10;
`;

const VolverWrapper = styled.div`
  align-self: flex-start;
`;

const Fechas = styled.p`
  font-size: 14px;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const Resumen = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 100%;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Datos = styled.div`
  display: flex;
  gap: 8px;
  justify-content: space-around;
  width: 100%;
`;

const Tablas = styled.div`
  display: flex;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Tabla = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 120%;
  h4 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
  }

  li {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    margin-bottom: 4px;
  }

  .total {
    font-weight: bold;
    margin-top: 8px;
    display: flex;
    justify-content: flex-end;
  }
`;
