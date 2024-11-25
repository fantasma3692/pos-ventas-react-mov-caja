import styled from "styled-components";
import { Welcome } from "../../index";
import { useState } from "react";
import  ticket from "../../reports/TicketVenta"
import {useCartVentasStore} from "../../store/CartVentasStore"
import { NieveComponente } from "../organismos/NieveComponente";
export function HomeTemplate() {
  const [base64, setBase64] = useState("");
const {items} = useCartVentasStore()
  const onGenerateTicket= async(output)=>{
    const dataempresa ={
      logo:"https://cdn.forbes.com.mx/2020/03/El-sen%CC%83or-de-los-anillos-Golum-.jpg",
      productos:items
    }
    const response = await ticket(output,dataempresa)
    if(output==="b64"){
      setBase64(response?.content ?? "")
    }
  }
  return (
    <Container>
     
      <Welcome />
      {/* <button onClick={()=>onGenerateTicket("print")}>IMPRIMIR TICKET</button>
      <button onClick={()=>onGenerateTicket("b64")}>GENERAR TICKET</button>
      <iframe style={{width:"100%",height:"100%"}}  src={`data:application/pdf;base64,${base64}`}/> */}
    </Container>
  );
}
const Container = styled.div`
  height: 100vh;
`;
