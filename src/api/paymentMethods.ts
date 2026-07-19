import { apiFetch } from "../lib/api";
import type { MetodoPagoCatalogo, SavedCard, CreateCardPayload } from "../types/checkout";

export function fetchMetodosPagoCatalogo(token: string) {
    return apiFetch<MetodoPagoCatalogo[]>("/payment-methods/catalog", { token });
}

export function fetchSavedCards(token: string) {
    return apiFetch<SavedCard[]>("/payment-methods", { token });
}

export function createCard(token: string, payload: CreateCardPayload) {
    return apiFetch<SavedCard>("/payment-methods", {
        method: "POST",
        token,
        body: JSON.stringify(payload),
    });
}
