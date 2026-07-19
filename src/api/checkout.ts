import { apiFetch } from "../lib/api";
import type { CheckoutPayload, CheckoutResponse } from "../types/checkout";

export function createOrder(token: string, payload: CheckoutPayload) {
    return apiFetch<CheckoutResponse>("/checkout", {
        method: "POST",
        token,
        body: JSON.stringify(payload),
    });
}
