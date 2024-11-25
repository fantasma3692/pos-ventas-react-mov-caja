import { Icon } from "@iconify/react/dist/iconify.js";
import styled from "styled-components";
export function VolverBtn({funcion}) {
  return (<Container onClick={funcion}>
<Icon icon="mingcute:arrow-left-fill" className="icono"/>
<span>Volver</span>
  </Container>);
}
const Container =styled.div`
  display: flex;
  cursor: pointer;
  align-items: center;
  gap: 8px;
  .icono {
    font-size: 25px;
  }
  margin-bottom: 30px;
`