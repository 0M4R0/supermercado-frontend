export type PaginatedResponse<T> = {
    data: T[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
};

export type ApiCategoria = {
    id: number;
    nombre: string;
};

export type ApiCategoriaEmbed = {
    id: number;
    nombre: string;
};

export type ApiInventario = {
    stock: number;
    min_stock: number;
    max_stock: number;
};

export type ApiProductoCategoria = {
    categoria_id?: number;
    categorias: ApiCategoriaEmbed | ApiCategoriaEmbed[] | null;
};

export type ApiProducto = {
    producto_id: number;
    nombre: string;
    descripcion: string | null;
    precio: number;
    imagen_producto: string | null;
    created_at: string;
    producto_inventario?: ApiInventario | ApiInventario[] | null;
    producto_categoria?: ApiProductoCategoria[] | null;
    proveedores?: { nombre: string } | { nombre: string }[] | null;
};

export type ApiProductoEmbed = {
    producto_id: number;
    nombre: string;
    imagen_producto: string | null;
    precio: number;
};

export type ApiArticuloCarrito = {
    articulo_carrito_id: number;
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
    descuento_aplicado: number;
    productos: ApiProductoEmbed | null;
};

export type ApiCarrito = {
    carrito_id: number | null;
    estado?: string;
    created_at?: string;
    actualizado_en?: string;
    articulos: ApiArticuloCarrito[];
    subtotal: number;
    total_items: number;
};

export type ProductosQuery = {
    page?: number;
    limit?: number;
    categoria_id?: number[];
    order?: "nombre" | "precio" | "created_at";
    dir?: "asc" | "desc";
};

export type SortOption = {
    order: "nombre" | "precio" | "created_at";
    dir: "asc" | "desc";
    label: string;
};

export const SORT_OPTIONS: SortOption[] = [
    { order: "nombre", dir: "asc", label: "Relevancia" },
    { order: "precio", dir: "asc", label: "Precio: menor a mayor" },
    { order: "precio", dir: "desc", label: "Precio: mayor a menor" },
    { order: "created_at", dir: "desc", label: "Más nuevos" },
];
