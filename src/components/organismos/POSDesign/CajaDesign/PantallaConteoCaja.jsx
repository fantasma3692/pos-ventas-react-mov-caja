import styled from "styled-components";
import { VolverBtn } from "../../../moleculas/VolverBtn";
import { InputText2 } from "../../formularios/InputText2";
import {
  Btn1,
  FormatearNumeroDinero,
  useAuthStore,
  useEmpresaStore,
  useUsuariosStore,
} from "../../../..";
import { useMovCajaStore } from "../../../../store/MovCajaStore";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useCierreCajaStore } from "../../../../store/CierreCajaStore";
import { useFormattedDate } from "../../../../hooks/useFormattedDate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BarLoader } from "react-spinners";
export function PantallaConteoCaja() {
  const { cerrarSesion } = useAuthStore();
  const [montoEfectivo, setMontoEfectivo] = useState(0);
  const { totalEfectivoTotalCaja } = useMovCajaStore();
  const { datausuarios } = useUsuariosStore();
  const fechaactual = useFormattedDate();
  const { dataempresa } = useEmpresaStore();
  const {
    cerrarTurnoCaja,
    dataCierreCaja,
    setStateConteoCaja,
    setStateCierraCaja,
  } = useCierreCajaStore();
  const queryClient = useQueryClient();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const insertar = async (data) => {
    const p = {
      id: dataCierreCaja?.id,
      fechacierre: fechaactual,
      id_usuario: datausuarios?.id,
      total_efectivo_calculado: parseFloat(totalEfectivoTotalCaja),
      total_efectivo_real: parseFloat(data.montoreal),
      estado: 1,
      diferencia_efectivo: diferencia,
    };
    console.log(p);
    await cerrarTurnoCaja(p);
  };
  const { isPending, mutate: doInsertar } = useMutation({
    mutationKey: ["cerrar turno caja"],
    mutationFn: insertar,
    onSuccess: () => {
      toast.success("🎉 Caja cerrada correctamente!!!");
      setStateConteoCaja(false);
      setStateCierraCaja(false);
      reset();
      queryClient.invalidateQueries(["mostrar cierre de caja"]);
      cerrarSesion();
    },
    onError: (error) => {
      toast.error(`Error al cerrar caja: ${error.message}`);
    },
  });
  const handleSub = (data) => {
    doInsertar(data);
  };

  // Calcula la diferencia entre el total esperado en caja y el monto ingresado
  const diferencia = montoEfectivo - totalEfectivoTotalCaja;
  // Define el mensaje y el color del anuncio basado en la diferencia
  const anuncioMensaje =
    diferencia === 0
      ? "Genial, todo está perfecto"
      : "La diferencia será registrada en su turno y se enviará a gerencia";
  const anuncioColor = diferencia === 0 ? "#09bc42" : "#ff3f56";

  return (
    <Container>
      <VolverBtn funcion={() => setStateConteoCaja(false)} />
      <span className="title">Efectivo esperado en caja:</span>
      <span className="title">
        {FormatearNumeroDinero(
          totalEfectivoTotalCaja,
          dataempresa?.currency,
          dataempresa?.iso
        )}{" "}
      </span>
      {isPending ? (
        <BarLoader color="#2af169" />
      ) : (
        <form onSubmit={handleSubmit(handleSub)}>
          <section className="area1">
            <span>¿Cuánto de EFECTIVO hay en caja física?</span>
            <InputText2>
              <input
                type="number"
                className="form__field"
                {...register("montoreal", {
                  required: true,
                  onChange: (e) =>
                    setMontoEfectivo(parseFloat(e.target.value) || 0),
                })}
              />
              {errors.montoreal?.type === "required" && <p>Campo requerido</p>}
            </InputText2>
            <Divider />
            <span style={{ textAlign: "center" }}>
              diferencia:{" "}
              {FormatearNumeroDinero(
                diferencia,
                dataempresa?.currency,
                dataempresa?.iso
              )}
            </span>
            <article className="contentbtn">
              <Btn1
                titulo="CERRAR TURNO"
                color="#ffffff"
                border="2px"
                bgcolor="#1da939"
              />
            </article>
          </section>
        </form>
      )}

      <span style={{ color: anuncioColor, textAlign: "center" }}>
        {anuncioMensaje}{" "}
      </span>
    </Container>
  );
}
const Container = styled.div`
  position: absolute;
  height: 100vh;
  background-color: ${({ theme }) => theme.bgtotal};
  width: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  gap: 10px;
  flex-direction: column;
  input {
    text-align: center;
  }
  p {
    color: #ff0062;
    font-weight: bold;
  }
  .title {
    font-size: 25px;
    font-weight: bold;
  }
  .area1 {
    display: flex;
    flex-direction: column;
    gap: 12px;
    .contentbtn {
      margin-top: 15px;
      display: flex;
      gap: 12px;
      justify-content: center;
    }
  }
`;
const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.color2};
  margin-right: 10px;
`;
