import { useQuery } from "@tanstack/react-query";
import {
  ProductosTemplate,
  Spinner1,
  useCategoriasStore,
  useEmpresaStore,
  useProductosStore,
  useSucursalesStore,
} from "../index";

export function Productos() {
  const {mostrarCategorias} = useCategoriasStore();
  const {mostrarSucursales} = useSucursalesStore();
  const { mostrarProductos, buscarProductos, buscador,setRefetch } =
    useProductosStore();
  const { dataempresa } = useEmpresaStore();
  const {
    data: productos,
    isLoading: isLoadingProductos,
    error: errorProductos,
    refetch,
  } = useQuery({
    queryKey: ["mostrar productos", dataempresa?.id],
    queryFn: () => mostrarProductos({ id_empresa: dataempresa?.id, refetchs: refetch }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });
  
  // Buscar categorías
  const { isLoading: isLoadingBuscarProductos } = useQuery({
    queryKey: ["buscar productos", buscador],
    queryFn: () => buscarProductos({ id_empresa: dataempresa?.id, buscador: buscador }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });
  
  // Mostrar sucursales
  const { isLoading: isLoadingSucursales } = useQuery({
    queryKey: ["mostrar sucursales", dataempresa?.id],
    queryFn: () => mostrarSucursales({ id_empresa: dataempresa?.id }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });
  
  // Mostrar categorías
  const { isLoading: isLoadingCategorias } = useQuery({
    queryKey: ["mostrar categorias", dataempresa?.id],
    queryFn: () => mostrarCategorias({ id_empresa: dataempresa?.id }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });
  
  // Consolidación de isLoading y error
  const isLoading = isLoadingProductos || isLoadingBuscarProductos || isLoadingSucursales || isLoadingCategorias;
  const error = errorProductos;
  
  if (isLoading) {
    return <Spinner1 />;
  }
  
  if (error) {
    return <span>Error: {error.message}</span>;
  }
  
  return <ProductosTemplate />;
}
