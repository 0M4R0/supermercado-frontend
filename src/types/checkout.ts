export type Ubicacion = {
    id: number;
    direccion: string;
    ciudad: string;
    provincia: string;
    pais: string;
    codigo_postal: number | null;
    direccion_extra: string | null;
    por_defecto: boolean;
    activo: boolean;
    created_at: string;
};

export type CreateUbicacionPayload = {
    direccion: string;
    ciudad: string;
    provincia: string;
    pais?: string;
    codigo_postal?: number;
    direccion_extra?: string;
    por_defecto?: boolean;
};

export type MetodoPagoCatalogo = {
    id: number;
    nombre: string;
};

export type SavedCard = {
    id: number;
    metodo_pago_id: number;
    alias: string | null;
    ultimos_4: string | null;
    marca: string | null;
    activo: boolean;
    created_at: string;
};

export type CreateCardPayload = {
    metodo_pago_id: number;
    ultimos_4?: string;
    token?: string;
    alias?: string;
    marca?: string;
};

export type CheckoutPayload = {
    ubicacion_id: number;
    metodo_pago_id?: number;
    usuario_metodo_pago_id?: number;
    estado_pago_id?: number;
    referencia_transaccion?: string | null;
};

export type CheckoutResponse = {
    pedido_id: number;
    codigo_seguimiento: string;
    total: number;
    estado_pedido: string;
};

export type Pedido = {
    pedido_id: number;
    codigo_seguimiento: string;
    total: number;
    estado_pedido: string;
    created_at: string;
};
