import styled from "styled-components";
import ticket from "../../../reports/TicketVenta";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import {useCartVentasStore} from "../../../store/CartVentasStore"
export function VisorTicketVenta({setState}) {
  const [base64, setBase64] = useState("");
  const {items} = useCartVentasStore()
  const onGenerateTicket = async (output) => {
    const dataempresa = {
      logo: "https://cdn.forbes.com.mx/2020/03/El-sen%CC%83or-de-los-anillos-Golum-.jpg",
      productos: items,
    };
    const response = await ticket(output, dataempresa);
    if (output === "b64") {
      setBase64(response?.content ?? "");
    }
  };
  useEffect(()=>{
    onGenerateTicket("b64")
  },[])
  return (
    <Container>
      <ContentTicket>
        <article className="contentverticket" onClick={setState}>
          <span>Ocultar ticket</span>
          <Icon className="icono" icon="fluent-emoji:monkey-face" />
        </article>

        {/* <button onClick={() => onGenerateTicket("print")}>IMPRIMIR TICKET</button>
      <button onClick={() => onGenerateTicket("b64")}>GENERAR TICKET</button> */}
        <iframe
          style={{ width: "100%", height: "100%" }}
          src={`data:application/pdf;base64,${base64}`}
        />
      </ContentTicket>
    </Container>
  );
}
const Container = styled.div`
  position: absolute;
  z-index: 2;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.bgtotal};
`;
const ContentTicket = styled.div`
  height: 80%;
  display:flex;
  gap:10px;
  flex-direction:column;
`;
