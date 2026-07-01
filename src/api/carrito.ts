import { apiFetch } from "../lib/api";
import type { ApiCarrito } from "../types/api";

export function fetchCarrito(token: string) {
    return apiFetch<ApiCarrito>("/carrito", { token });
}

export function addToCarrito(
    token: string,
    payload: { producto_id: number; cantidad?: number }
) {
    return apiFetch<ApiCarrito>("/carrito", {
        method: "POST",
        token,
        body: JSON.stringify(payload),
    });
}

export function updateCarritoItem(
    token: string,
    articuloId: number,
    payload: { cantidad: number }
) {
    return apiFetch<ApiCarrito>(`/carrito/${articuloId}`, {
        method: "PUT",
        token,
        body: JSON.stringify(payload),
    });
}

export function removeFromCarrito(token: string, articuloId: number) {
    return apiFetch<ApiCarrito>(`/carrito/${articuloId}`, {
        method: "DELETE",
        token,
    });
}

export function clearCarrito(token: string) {
    return apiFetch<ApiCarrito>("/carrito", {
        method: "DELETE",
        token,
    });
}
