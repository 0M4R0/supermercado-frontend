import { apiFetch } from "../lib/api";
import type { Pedido } from "../types/checkout";

export function fetchPedidos(token: string) {
    return apiFetch<Pedido[]>("/pedidos", { token });
}
