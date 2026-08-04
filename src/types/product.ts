export type Product = {
    id: number | string;
    name: string;
    price: number;
    originalPrice?: number;
    categories?: Category[];
    categoryIds?: number[];
    discount?: string;
    imageUrl?: string;
    description?: string;
    proveedor?: string;
    inStock?: boolean;
    stock?: number;
    maxStock?: number;
};

export type Category = {
    id: number;
    nombre: string;
};
