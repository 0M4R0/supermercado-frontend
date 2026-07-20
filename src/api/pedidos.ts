import { apiFetch } from "../lib/api";
import type { PaginatedResponse } from "../types/api";
import type { Pedido } from "../types/checkout";

export function fetchPedidos(token: string, page = 1, limit = 10) {
    return apiFetch<PaginatedResponse<Pedido>>(`/pedidos?page=${page}&limit=${limit}`, { token });
}
