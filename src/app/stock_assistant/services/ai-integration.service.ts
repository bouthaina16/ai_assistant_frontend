import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, catchError, map, of } from "rxjs";
import { AI_ASSISTANT_HOST } from "../../../environments/environment";

export interface StockProductModel {
  publicId: string;
  name: string;
  quantity: number;
  reference: string;
  unit: string;
  type: string;
}

export interface StockClientModel {
  publicId: string;
  name: string;
  reference: string;
  address: string;
  email: string;
  fiscalId: string;
  tel: string;
}

export interface StockInvoiceLineModel {
  productPublicId: string;
  quantity: number;
  price: number;
  discount: number;
  tax: number;
}

export interface StockInvoiceModel {
  publicId: string;
  reference: string;
  clientPublicId: string;
  date: string;
  total: number;
  productInvoices: StockInvoiceLineModel[];
}

interface ProductSearchResponse {
  products: StockProductModel[];
  count: number;
}

interface ClientSearchResponse {
  clients: StockClientModel[];
  count: number;
}

interface InvoiceSearchResponse {
  invoices: StockInvoiceModel[];
  count: number;
}

@Injectable({
  providedIn: "root"
})
export class AiIntegrationService {
  private readonly baseUrl = `${AI_ASSISTANT_HOST}/api/ai/stock`;

  constructor(private readonly http: HttpClient) {
  }

  getProducts(): Observable<StockProductModel[]> {
    return this.http.get<ProductSearchResponse>(`${this.baseUrl}/products`).pipe(
      map((response) => response.products ?? []),
      catchError(() => of([]))
    );
  }

  getClients(): Observable<StockClientModel[]> {
    return this.http.get<ClientSearchResponse>(`${this.baseUrl}/clients`).pipe(
      map((response) => response.clients ?? []),
      catchError(() => of([]))
    );
  }

  getOrders(): Observable<StockInvoiceModel[]> {
    return this.http.get<InvoiceSearchResponse>(`${this.baseUrl}/invoices`).pipe(
      map((response) => response.invoices ?? []),
      catchError(() => of([]))
    );
  }
}

