import styled from "styled-components";
import { InputText2 } from "../../formularios/InputText2";
import { Btn1 } from "../../../moleculas/Btn1";
import { useState } from "react";
import { useUsuariosStore } from "../../../../store/UsuariosStore";
import { useCajasStore } from "../../../../store/CajasStore";
import { useCierreCajaStore } from "../../../../store/CierreCajaStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast, Toaster } from "sonner";
import { useFormattedDate } from "../../../../hooks/useFormattedDate";
import { useMetodosPagoStore } from "../../../../store/MetodosPagoStore";
import { useMovCajaStore } from "../../../../store/MovCajaStore";
export function PantallaAperturaCaja() {
  const [montoEfectivo, setMontoEfectivo] = useState(0);
  const fechaActual = useFormattedDate();
  const queryClient = useQueryClient();
  const { datausuarios } = useUsuariosStore();
  const { dataCaja } = useCajasStore();
  const { aperturarcaja } = useCierreCajaStore();
  const { dataMetodosPago } = useMetodosPagoStore();
  const { insertarMovCaja } = useMovCajaStore();
  const registrarMovCaja = async (p) => {
    const id_metodo_pago = dataMetodosPago
      .filter((item) => item.nombre === "Efectivo")
      .map((item) => item.id)[0];
    const pmovcaja = {
      fecha_movimiento: fechaActual,
      tipo_movimiento: "apertura",
      monto: montoEfectivo?montoEfectivo:0,
      id_metodo_pago: id_metodo_pago,
      descripcion: `Apertura de caja con`,
      id_usuario: datausuarios?.id,
      id_cierre_caja: p.id_cierre_caja,
    };

    await insertarMovCaja(pmovcaja);
  };
  const insertar = async () => {
    const p = {
      fechainicio: fechaActual,
      fechacierre: fechaActual,
      id_usuario: datausuarios?.id,
      id_caja: dataCaja.id,
    };
    const data = await aperturarcaja(p);

    await registrarMovCaja({ id_cierre_caja: data?.id });
  };

  const mutation = useMutation({
    mutationKey: ["aperturar caja"],
    mutationFn: insertar,
    onSuccess: () => {
      toast.success("🎉 Caja aperturada correctamente!!!");
      queryClient.invalidateQueries("mostrar cierre de caja");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });
  return (
    <Container>
      <Toaster richColors position="top-center" />
      <section className="area1">
        <span className="title">Aperturar caja con:</span>
       
        <InputText2>
          <input
            className="form__field"
            onChange={(e) => setMontoEfectivo(parseFloat(e.target.value))}
            type="number"
            placeholder="0.00"
          />
        </InputText2>
        <span>en efectivo.</span>
        <article className="contentbtn">
          <Btn1
            titulo="OMITIR"
            funcion={() => {
              setMontoEfectivo(0);
              mutation.mutateAsync();
            }}
          />
          <Btn1
            titulo="APERTURAR"
            color="#ffffff"
            border="2px"
            bgcolor="#1da939"
            funcion={() => mutation.mutateAsync()}
          />
        </article>
      </section>
    </Container>
  );
}
const Container = styled.div`
  height: 100vh;
  width: 100%;
  background-color: ${({ theme }) => theme.bgtotal};
  align-items: center;
  justify-content: center;
  display: flex;
  .area1 {
    display: flex;
    flex-direction: column;
    gap: 12px;
    .title {
      font-size: 19px;
      font-weight: bold;
    }
    .contentbtn {
      display: flex;
      gap: 12px;
    }
  }
`;
