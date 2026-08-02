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
    estado: string;
    total: number;
    fecha_pedido: string;
    resumen_productos: string;
    cantidad_productos: number;
    imagenes_productos: string[];
};

export type PedidoDetail = {
  pedido_id: number;
  codigo_seguimiento: string;
  estado: string;
  total: number;
  fecha_pedido: string;
  cancelable_until: string | null;
  productos: {
    producto_id: number;
    nombre: string;
    imagen_producto: string | null;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
  }[];
  entrega: {
    estado_entrega: string;
    direccion: string;
    ciudad: string;
    provincia: string;
    fecha_programada: string | null;
  } | null;
  pago: {
    estado_pago: string;
    referencia_transaccion: string | null;
    metodo_pago: string;
    tarjeta: {
      marca: string;
      ultimos_4: string;
    } | null;
  } | null;
};
