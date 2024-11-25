import { useQuery } from "@tanstack/react-query";
import { MetodosPagoTemplate } from "../components/templates/MetodosPagoTemplate";
import { useMetodosPagoStore } from "../store/MetodosPagoStore";
import { useEmpresaStore } from "../store/EmpresaStore";
import { Spinner1 } from "../components/moleculas/Spinner1";

export function MetodosPago() {
  const { mostrarMetodosPago } = useMetodosPagoStore();
  const { dataempresa } = useEmpresaStore();
  const { isLoading, error } = useQuery({
    queryKey: ["mostrar metodos pago"],
    queryFn: () => mostrarMetodosPago({ id_empresa: dataempresa?.id }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });
  if (isLoading) {
    return <Spinner1 />;
  }
  if (error) {
    return <span>error... {error.message} </span>;
  }
  return <MetodosPagoTemplate />;
}
