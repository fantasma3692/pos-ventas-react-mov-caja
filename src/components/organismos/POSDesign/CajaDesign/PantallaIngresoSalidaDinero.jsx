import styled from "styled-components";
import { useCierreCajaStore } from "../../../../store/CierreCajaStore";
import { VolverBtn } from "../../../moleculas/VolverBtn";
import { InputText2 } from "../../formularios/InputText2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import { Btn1 } from "../../../moleculas/Btn1";
import { useCajasStore } from "../../../../store/CajasStore";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useMovCajaStore } from "../../../../store/MovCajaStore";
import { useMetodosPagoStore } from "../../../../store/MetodosPagoStore";
import { useUsuariosStore } from "../../../../store/UsuariosStore";
import { useFormattedDate } from "../../../../hooks/useFormattedDate";
export function PantallaIngresoSalidaDinero() {
  const fechaActual = useFormattedDate()
  const { tipoRegistro, setStateIngresoSalida } =
    useCierreCajaStore();
  const { insertarMovCaja } = useMovCajaStore();
  const [startDate, setStartDate] = useState(new Date());
  const [selectedMetodo, setSelectedMetodo] = useState(null);
  const { dataCaja } = useCajasStore();
  const { dataMetodosPago } = useMetodosPagoStore();
  const {datausuarios} = useUsuariosStore()
  const {dataCierreCaja} = useCierreCajaStore()
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const insertar = async (data) => {
   
    const pmovcaja = {
      fecha_movimiento:fechaActual,
      tipo_movimiento: tipoRegistro,
      monto: parseFloat(data.monto),
      id_metodo_pago: selectedMetodo?.id,
      descripcion: `${tipoRegistro==="ingreso"?"Ingreso":"Salida"} de dinero con ${selectedMetodo?.nombre} ${data.motivo?`- detalle: ${data.motivo}`:""}`,
      id_usuario: datausuarios?.id,
      id_cierre_caja: dataCierreCaja?.id,
    };

    await insertarMovCaja(pmovcaja);
  };
  const {
    isPending,
    mutate: doInsertar,
    error,
  } = useMutation({
    mutationKey: ["insertar ingresos salidas caja"],
    mutationFn: insertar,
    onSuccess: () => {
      toast.success("🎉 Registrado!!!");
      setStateIngresoSalida(false)
      reset();
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || "Error al registrar  !!!";
    toast.error(`Error: ${errorMessage}`);
    },
  });
  const manejadorEnvio = (data) => {
    doInsertar(data);
  };
  const handleMetodoClick = (item) => {
    setSelectedMetodo(item);
  };
  useEffect(() => {
    const efectivo = dataMetodosPago?.find(
      (item) => item.nombre === "Efectivo"
    );
    if (efectivo) {
      console.log(efectivo)
      setSelectedMetodo(efectivo);
    }
  }, [dataMetodosPago]);
  return (
    <Container>
      <VolverBtn funcion={()=>setStateIngresoSalida(false)} />

      <span className="title">
        {tipoRegistro === "ingreso"
          ? "INGRESAR DINERO A CAJA"
          : "RETIRAR DINERO DE CAJA"}
      </span>
      
      <section className="areatipopago">
        {dataMetodosPago
          ?.filter((item) => item.nombre !== "Mixto")
          .map((item, index) => {
            return (
              <article className="box" key={index}>
                <Btn1
                  imagen={item.icono != "-" ? item.icono : null}
                  titulo={item.nombre}
                  border="0"
                  height="70px"
                  width="100%"
                  funcion={() => handleMetodoClick(item)}
                  bgcolor={item.id === selectedMetodo?.id ? "#FFD700" : "#FFF"}
                />
              </article>
            );
          })}
      </section>
      <form onSubmit={handleSubmit(manejadorEnvio)}>
        <section className="area1">
          <span>Monto:</span>
          <InputText2>
            <input
              className="form__field"
              placeholder="0.00"
              type="number"
              {...register("monto", { required: true })}
            />
            {errors.monto?.type === "required" && <p>Campon requerido</p>}
          </InputText2>

          {/* <StyledDatePickerWrapper>
            <StyledDatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Seleccionar Fecha"
            />
          </StyledDatePickerWrapper> */}
          <span>Motivo (puede estar en blanco)</span>
          <InputText2>
            <textarea
              className="form__field"
              rows="3"
              placeholder="motivo"
              type="text"
              {...register("motivo")}
            />
          </InputText2>
          <article className="contentbtn">
            <Btn1
              titulo={"REGISTRAR"}
              color="#ffffff"
              border="2px"
              bgcolor="#1da939"
            />
          </article>
        </section>
      </form>
    </Container>
  );
}
const Container = styled.div`
  height: 100vh;
  position: absolute;
  background-color: ${({ theme }) => theme.bgtotal};
  width: 100%;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .areatipopago {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 10px;

    .box {
      flex: 1 1 40%;
      display: flex;
      gap: 10px;
    }
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
    }
  }
`;
const StyledDatePickerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 2px solid ${({ theme }) => theme.color2};
  background-color: ${({ theme }) => theme.bgtotal};
  color: ${({ theme }) => theme.text};
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0px 0px 5px ${({ theme }) => theme.primary};
  }
  &::placeholder {
    color: ${({ theme }) => theme.placeholder};
  }
`;
