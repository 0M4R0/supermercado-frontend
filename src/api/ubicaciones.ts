import { apiFetch } from "../lib/api";
import type { Ubicacion, CreateUbicacionPayload } from "../types/checkout";

export function fetchUbicaciones(token: string) {
    return apiFetch<Ubicacion[]>("/ubicaciones", { token });
}

export function createUbicacion(token: string, payload: CreateUbicacionPayload) {
    return apiFetch<Ubicacion>("/ubicaciones", {
        method: "POST",
        token,
        body: JSON.stringify(payload),
    });
}
