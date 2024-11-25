import styled from "styled-components";
import {
  Btn1,
  Buscador,
  RegistrarCategorias,
  Title,
  useCategoriasStore,
} from "../../index";
import { v } from "../../styles/variables";
import { TablaCategorias } from "../organismos/tablas/TablaCategorias";
import { useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import { RegistrarMetodosPago } from "../organismos/formularios/RegistrarMetodosPago";
import { TablaMetodosPago } from "../organismos/tablas/TablaMetodosPago";
import { Toaster } from "sonner";
import { useMetodosPagoStore } from "../../store/MetodosPagoStore";
export function MetodosPagoTemplate() {
  const [openRegistro, SetopenRegistro] = useState(false);
  const { dataMetodosPago } = useMetodosPagoStore();
  const [accion, setAccion] = useState("");
  const [dataSelect, setdataSelect] = useState([]);
  const [isExploding, setIsExploding] = useState(false);
  function nuevoRegistro() {
    SetopenRegistro(!openRegistro);
    setAccion("Nuevo");
    setdataSelect([]);
    setIsExploding(false)
  }
  return (
    <Container>
      <Toaster richColors position="top-right"/>
      {openRegistro && (
        <RegistrarMetodosPago setIsExploding={setIsExploding}
          onClose={() => SetopenRegistro(!openRegistro)}
          dataSelect={dataSelect}
          accion={accion}
        />
      )}
      <section className="area1">
        <Title>Métodos de pago</Title>
        <Btn1
          funcion={nuevoRegistro}
          bgcolor={v.colorPrincipal}
          titulo="nuevo"
          icono={<v.iconoagregar />}
        />
      </section>
     

      <section className="main">
        {isExploding && <ConfettiExplosion />}
        <TablaMetodosPago setdataSelect={setdataSelect} setAccion={setAccion} SetopenRegistro={SetopenRegistro} data={dataMetodosPago} />
      </section>
    </Container>
  );
}
const Container = styled.div`
  height: calc(100vh - 80px);
  
   margin-top:50px;
  padding: 15px;
  display: grid;
  grid-template:
    "area1" 60px
    "area2" 60px
    "main" auto;
  .area1 {
    grid-area: area1;
    /* background-color: rgba(103, 93, 241, 0.14); */
    display: flex;
    justify-content: end;
    align-items: center;
    gap: 15px;
  }
  .area2 {
    grid-area: area2;
    /* background-color: rgba(7, 237, 45, 0.14); */
    display: flex;
    justify-content: end;
    align-items: center;
  }
  .main {
    grid-area: main;
    /* background-color: rgba(237, 7, 221, 0.14); */
  }
`;
