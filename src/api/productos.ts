import { apiFetch } from "../lib/api";
import type { ApiCategoria, ApiProducto, PaginatedResponse, ProductosQuery } from "../types/api";

function buildProductosQuery(params: ProductosQuery): string {
    const search = new URLSearchParams();

    if (params.page) search.set("page", String(params.page));
    if (params.limit) search.set("limit", String(params.limit));
    if (params.categoria_id?.length) {
        search.set("categoria_id", params.categoria_id.join(","));
    }
    if (params.order) search.set("order", params.order);
    if (params.dir) search.set("dir", params.dir);

    const query = search.toString();
    return query ? `?${query}` : "";
}

export function fetchProductos(params: ProductosQuery = {}) {
    return apiFetch<PaginatedResponse<ApiProducto>>(`/productos${buildProductosQuery(params)}`);
}

export function fetchProductoById(id: number | string) {
    return apiFetch<ApiProducto>(`/productos/${id}`);
}

export function fetchCategorias() {
    return apiFetch<ApiCategoria[]>("/productos/categorias");
}
