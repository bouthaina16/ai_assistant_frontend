import { Injectable } from "@angular/core";
import { Observable, catchError, forkJoin, map, of } from "rxjs";
import { ClientService } from "../../service/client.service";
import { InvoiceService } from "../../service/invoice.service";
import { ClientModel } from "../../home/client/client.model";
import { InvoiceModel } from "../../home/invoice/invoice.model";
import { ProductModel, ProductType } from "../../home/product/product.model";
import { ProductService } from "../../service/product.service";

@Injectable({
  providedIn: "root"
})
export class AiIntegrationService {
  constructor(
    private productService: ProductService,
    private clientService: ClientService,
    private invoiceService: InvoiceService
  ) {
  }

  getProducts(): Observable<ProductModel[]> {
    return forkJoin([
      this.productService.findAllProducts({ types: [ProductType.RAW], page: 0, pageSize: 200 }),
      this.productService.findAllProducts({ types: [ProductType.FINAL], page: 0, pageSize: 200 })
    ]).pipe(
      map(([raw, final]) => [...raw.products, ...final.products]),
      catchError(() => of([]))
    );
  }

  getClients(): Observable<ClientModel[]> {
    return this.clientService.findClients({ page: 0, pageSize: 200 }).pipe(
      map((response) => response.clients),
      catchError(() => of([]))
    );
  }

  getOrders(): Observable<InvoiceModel[]> {
    return this.invoiceService.findInvoices({ page: 0, pageSize: 200 }, false).pipe(
      map((response) => response.invoices),
      catchError(() => of([]))
    );
  }
}

