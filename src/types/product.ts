export type Product = {
    id: number | string;
    name: string;
    price: number;
    originalPrice?: number;
    category?: string;
    categoryIds?: number[];
    discount?: string;
    imageUrl?: string;
    description?: string;
    distributor?: string;
    inStock?: boolean;
    stock?: number;
};

export type Category = {
    id: number;
    nombre: string;
};
