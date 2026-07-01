import type { ApiProducto } from "../types/api";
import type { Product } from "../types/product";

function unwrapSingle<T>(value: T | T[] | null | undefined): T | undefined {
    if (value == null) return undefined;
    return Array.isArray(value) ? value[0] : value;
}

function extractCategories(producto: ApiProducto) {
    return (producto.producto_categoria ?? []).flatMap((entry) => {
        const categoria = unwrapSingle(entry.categorias);
        return categoria ? [categoria] : [];
    });
}

export function mapProducto(producto: ApiProducto): Product {
    const inventario = unwrapSingle(producto.producto_inventario);
    const categorias = extractCategories(producto);
    const proveedor = unwrapSingle(producto.proveedores);
    const stock = inventario?.stock ?? 0;

    return {
        id: producto.producto_id,
        name: producto.nombre,
        price: producto.precio,
        description: producto.descripcion ?? undefined,
        imageUrl: producto.imagen_producto ?? undefined,
        category: categorias[0]?.nombre,
        categoryIds: categorias.map((c) => c.id),
        distributor: proveedor?.nombre,
        inStock: stock > 0,
        stock,
    };
}
