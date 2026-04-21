
export interface ProductModel {
  publicId: string;
  provider: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  type: ProductType;
  reference: string;
}

export interface ProductResponse {
  products: ProductModel[];
  count: number;
}

export interface ProductQuantityModel {
  quantity: number;
  publicId: string;
}

export interface ProductRequest {
  provider: string;
  name: string;
  initialValue: number;
  unit: ProductUnit;
  type: ProductType;
  publicId: string;
  price: number;
}

export enum ProductType {
  RAW = "RAW",
  FINAL = "FINAL"
}

export enum ProductUnit {
  KG = "KG",
  PIECE = "PIECE"
}

export interface SelectProductModel {
  publicId: string;
  product: ProductModel;
}

export interface SearchProductModel {
  name?: string;
  types?: ProductType[];
  pageSize?: number;
  page?: number;
}
