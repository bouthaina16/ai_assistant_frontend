import { CommonModule } from "@angular/common";
import { Component, ElementRef, EventEmitter, Output, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { catchError, switchMap, tap } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { ClientModel } from "../client.model";
import { InvoiceModel, ProductInvoiceModel } from "../../invoice/invoice.model";
import { ProductModel, ProductType } from "../../product/product.model";
import { InvoiceService } from "../../../service/invoice.service";
import { ProductService } from "../../../service/product.service";
import { ToastService } from "../../../shared/toast/toast.service";

interface OrderLineForm {
  productPublicId: string;
  quantity: number;
}

@Component({
  selector: "app-client-order",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./client-order.component.html"
})
export class ClientOrderComponent {
  @ViewChild("btnOpenClientOrderModal") btnOpenClientOrderModal?: ElementRef<HTMLButtonElement>;
  @Output() refresh = new EventEmitter<void>();

  selectedClient: ClientModel | null = null;
  productType: ProductType = ProductType.FINAL;
  productTypeEnum = ProductType;
  products: ProductModel[] = [];
  orders: InvoiceModel[] = [];
  isSaving = false;

  lineForm: OrderLineForm = {
    productPublicId: "",
    quantity: 1
  };
  lines: ProductInvoiceModel[] = [];

  constructor(
    private invoiceService: InvoiceService,
    private productService: ProductService,
    private toastService: ToastService
  ) {
  }

  openForClient(client: ClientModel): void {
    this.selectedClient = client;
    this.lines = [];
    this.lineForm = { productPublicId: "", quantity: 1 };
    this.loadProducts();
    this.loadOrders();
    this.btnOpenClientOrderModal?.nativeElement?.click();
  }

  loadProducts(): void {
    this.productService.findAllProducts({
      page: 0,
      pageSize: 200,
      types: [this.productType]
    }).subscribe((response) => {
      this.products = response.products;
      this.lineForm.productPublicId = "";
    });
  }

  addLine(): void {
    const product = this.products.find((item) => item.publicId === this.lineForm.productPublicId);
    if (!product || this.lineForm.quantity <= 0) {
      return;
    }

    const totalPrice = Number(product.price) * Number(this.lineForm.quantity);
    this.lines.push({
      productName: product.name,
      publicId: undefined,
      productReference: product.reference,
      productPublicId: product.publicId,
      unitPrice: Number(product.price),
      discount: 0,
      totalPrice,
      quantity: Number(this.lineForm.quantity),
      tva: 19,
      unit: product.unit
    });

    this.lineForm = {
      productPublicId: "",
      quantity: 1
    };
  }

  removeLine(index: number): void {
    this.lines.splice(index, 1);
  }

  saveOrder(): void {
    if (!this.selectedClient || this.lines.length === 0 || this.isSaving) {
      return;
    }

    this.isSaving = true;
    const totalBrut = this.lines.reduce((acc, line) => acc + Number(line.totalPrice), 0);

    this.invoiceService.createDraftInvoice().pipe(
      switchMap((draft) => this.invoiceService.createInvoice({
        publicId: draft.publicId,
        reference: draft.reference,
        client: this.selectedClient as ClientModel,
        priceAsText: "",
        creationDate: new Date(),
        totalBrut,
        totalTva: 0,
        timbre: 1,
        totalNet: totalBrut,
        productInvoices: this.lines,
        isBl: false
      })),
      tap(() => {
        this.toastService.showSucess("Commande client enregistrée avec succès");
        this.lines = [];
        this.refresh.emit();
      }),
      switchMap(() => this.findOrders()),
      catchError(() => {
        this.toastService.showFail("Erreur lors de l'enregistrement de la commande client");
        return of([] as InvoiceModel[]);
      })
    ).subscribe((orders) => {
      this.orders = orders;
      this.isSaving = false;
    });
  }

  private loadOrders(): void {
    this.findOrders().subscribe((orders) => {
      this.orders = orders;
    });
  }

  private findOrders(): Observable<InvoiceModel[]> {
    if (!this.selectedClient) {
      return of([]);
    }

    return this.invoiceService.findInvoices({
      name: this.selectedClient.name,
      clientPublicId: this.selectedClient.publicId,
      page: 0,
      pageSize: 100
    }, false).pipe(
      tap(() => {}),
      catchError(() => of({ invoices: [], count: 0 })),
      switchMap((response) => of(response.invoices))
    );
  }
}

