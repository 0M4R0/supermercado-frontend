export function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("es-DO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}
