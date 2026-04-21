import {ClientModel} from "../client/client.model";

export interface InvoiceModel {
  publicId: string;
  reference: string;
  client: ClientModel;
  priceAsText: string;
  creationDate: Date;
  totalBrut: number;
  totalTva: number;
  timbre: number;
  closed: boolean;
  totalNet: number;
  productInvoices: ProductInvoiceModel[];
  isBl?: boolean;
}

export interface InvoiceRequest {
  publicId: string;
  reference: string;
  client: ClientModel;
  priceAsText: string;
  creationDate: Date;
  totalBrut: number;
  totalTva: number;
  timbre: number;
  totalNet: number;
  productInvoices: ProductInvoiceModel[];
  isBl?: boolean;
}

export interface ProductInvoiceModel {
  productName: string;
  publicId?: string
  productReference: string;
  productPublicId: string;
  unitPrice: number;
  discount: number;
  totalPrice: number;
  quantity: number;
  tva: number;
  unit: string;

}

export interface InvoiceResponse {
  invoices: InvoiceModel[];
  count: number;
}

export interface SearchInvoiceModel {
  name?: string;
  clientPublicId?: string;
  pageSize?: number;
  page?: number;
}
