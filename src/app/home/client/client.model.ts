import {ProductModel} from "../product/product.model";

export interface ClientModel {
  publicId: string;
  name: string;
  reference: string;
  address: string;
  email: string;
  fiscalId: string;
  tel: string;
}

export interface ClientResponse {
  clients: ClientModel[];
  count: number;
}

export interface ClientRequest {
  name: string;
  email: string;
  address: string;
  publicId: string;
  fiscalId: string;
  tel: string;
}

export interface SearchClientModel {
  name?: string;
  pageSize?: number;
  page?: number;
}
