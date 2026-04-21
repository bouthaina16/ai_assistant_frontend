import { Injectable } from "@angular/core";
import { Observable, catchError, forkJoin, map, of } from "rxjs";
import { StockDataApiService } from "./stock-data-api.service";

export interface AiProductModel {
  publicId: string;
  name: string;
  quantity: number;
  reference: string;
  unit: string;
  type: string;
}

export interface AiClientModel {
  id: string;
  name: string;
}

export interface AiOrderModel {
  id: string;
  productInvoices: Array<{ productPublicId: string; quantity: number }>;
}

@Injectable({
  providedIn: "root"
})
export class AiIntegrationService {
  constructor(private readonly stockDataApiService: StockDataApiService) {
  }

  getProducts(): Observable<AiProductModel[]> {
    return forkJoin([
      this.stockDataApiService.searchProducts("RAW"),
      this.stockDataApiService.searchProducts("FINAL")
    ]).pipe(
      map(([raw, final]) => [...raw.products, ...final.products]),
      catchError(() => of([]))
    );
  }

  getClients(): Observable<AiClientModel[]> {
    return this.stockDataApiService.searchClients().pipe(
      map((response) => response.clients.map((client) => ({
        id: client.publicId,
        name: client.name
      }))),
      catchError(() => of([]))
    );
  }

  getOrders(): Observable<AiOrderModel[]> {
    return this.stockDataApiService.searchInvoices().pipe(
      map((response) => response.invoices.map((invoice) => ({
        id: invoice.publicId,
        productInvoices: invoice.productInvoices ?? []
      }))),
      catchError(() => of([]))
    );
  }
}

