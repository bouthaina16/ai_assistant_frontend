import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from "@angular/core";
import {RouterModule} from "@angular/router";
import {CommonModule, DecimalPipe} from "@angular/common";
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InvoiceModel} from "../invoice.model";
import {ClientModel} from "../../client/client.model";
import {catchError, debounceTime, distinctUntilChanged, map, tap} from "rxjs/operators";
import {ClientService} from "../../../service/client.service";
import {Observable, Subject} from "rxjs";
import {ProductModel, ProductType} from "../../product/product.model";
import {ProductService} from "../../../service/product.service";
import {CalculateTotalPipe} from "../../shared/pipe/calculate-total.pipe";
import {InvoiceService} from "../../../service/invoice.service";
import {ToastService} from "../../../shared/toast/toast.service";

@Component({
  selector: 'app-invoice-update',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule, DecimalPipe, CalculateTotalPipe],
  standalone: true,
  templateUrl: './invoice-update.component.html'
})
export class InvoiceUpdateComponent implements OnInit, OnChanges {
  clients: Observable<ClientModel[]> = new Observable<ClientModel[]>();
  products: ProductModel[] = [];
  @Input() show = false;
  @Input() savedInvoice = {} as InvoiceModel;
  @Input() readOnly = false;
  @Input() isBl = false;
  @Output() refresh = new EventEmitter<any>();
  formGroup: FormGroup = new FormGroup<any>({});
  selectedClient: ClientModel = {} as ClientModel;
  productsMap: Map<number, ProductModel[]> = new Map<number, ProductModel[]>();
  productSearchSubject = new Subject<number>();
  constructor(private fb: FormBuilder,
              private clientService: ClientService,
              private invoiceService: InvoiceService,
              private toastService: ToastService,
              private productService: ProductService) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      client: this.fb.group({
        name: [''],
        publicId: ['', Validators.required],
        search: ['']
      }),
      productInvoices: this.fb.array([]),
      timbre: [this.isBl ? 0:1],
    });
    this.listenToClientSearch();
    this.listenToProductSearch();
    this.clients = this.findClients();
    this.findProducts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['savedInvoice'] && this.show) {
      this.selectedClient = this.savedInvoice.client;
      this.formGroup?.get("client")?.setValue({
        search: '',
        name: this.savedInvoice.client.name,
        publicId: this.savedInvoice.client.publicId,
      });
      this.formGroup?.get("timbre")?.setValue(this.savedInvoice.timbre);
      this.savedInvoice.productInvoices.forEach((productInv, i) => {
        (this.formGroup?.get("productInvoices") as FormArray).push(
          this.fb.group({
            search: [''],
            productName: [productInv.productName, Validators.required],
            productReference: [productInv.productReference, Validators.required],
            productPublicId: [productInv.productPublicId, Validators.required],
            unit: [productInv.unit],
            quantity: [productInv.quantity, Validators.required],
            unitPrice: [productInv.unitPrice, Validators.required],
            discount: [productInv.discount],
            tva: [productInv.tva],
          })
        );

        this.productsMap.set(i, this.products);
      });

    }

    if (this.readOnly) {
      this.formGroup.disable();
    } else {
      this.formGroup.enable();
    }
  }

  submit() {
    const invoiceForm = this.formGroup.value;
    invoiceForm.publicId = this.savedInvoice.publicId;
    invoiceForm.isBl = this.isBl;
    this.invoiceService.createInvoice(invoiceForm)
      .pipe(
        tap((response: InvoiceModel) => {
          this.savedInvoice = response;
          this.toastService.showSucess(`${this.isBl ? 'Bon de livraison' : 'Facture'}: <${response.reference}> modifiée avec succées`);
        }),
        catchError(() => {
          this.toastService.showFail('Problème survenu lors de la modification');
          return new Observable();
        })
      )
      .subscribe()
  }

  selectClient(client: ClientModel) {
    this.formGroup.get('client')?.get('publicId')?.setValue(client.publicId);
    this.formGroup.get('client')?.get('name')?.setValue(client.name);
    this.selectedClient = client;
  }

  private listenToClientSearch() {
    this.formGroup.get("client")?.get("search")?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => this.clients = this.findClients()),
    ).subscribe();
  }


  private findClients() {
    return this.clientService.findClients(
      {name: this.formGroup.get("client")?.get("search")?.value, page: 0, pageSize: 15}).pipe(
      map(clients => clients.clients)
    );
  }

  addProductLine() {
    this.productInvoiceArray.push(
      this.fb.group({
        search: [''],
        productName: ['', Validators.required],
        productReference: ['', Validators.required],
        productPublicId: ['', Validators.required],
        unit: [''],
        quantity: ['', Validators.required],
        unitPrice: ['', Validators.required],
        discount: [''],
        tva: [''],
      })
    );

    this.productsMap.set(this.productInvoiceArray.length - 1, this.products);
  }

  get productInvoiceArray(): FormArray {
    return this.formGroup.get('productInvoices') as FormArray;
  }

  removeProductLine(index: number) {
    (this.formGroup.get('productInvoices') as FormArray).removeAt(index);
  }

  private findProducts() {
    this.productService.findAllProducts({page: 0, pageSize: 15, types: [ProductType.RAW, ProductType.FINAL]})
      .subscribe((res) => this.products = res.products);
  }

  private findProductsWithMap(name: string, i: number) {
    this.productService.findAllProducts({name: name, page: 0, pageSize: 15, types: [ProductType.RAW, ProductType.FINAL]})
      .subscribe((res) => this.productsMap.set(i, res.products));
  }

  private listenToProductSearch() {
    this.productSearchSubject.pipe(
      debounceTime(500),
      tap((index: number) => {
        const searchValue = this.productInvoiceArray?.at(index)?.get('search')?.value;
        this.findProductsWithMap(searchValue, index);
      })
    ).subscribe();
  }

  selectProduct(product: ProductModel, index: number) {
    this.productInvoiceArray.at(index)?.get('productName')?.setValue(product.name);
    this.productInvoiceArray.at(index)?.get('productReference')?.setValue(product.reference);
    this.productInvoiceArray.at(index)?.get('productPublicId')?.setValue(product.publicId);
    this.productInvoiceArray.at(index)?.get('unit')?.setValue(product.unit);
    this.productInvoiceArray.at(index)?.get('unitPrice')?.setValue(product.price);
    this.productInvoiceArray.at(index)?.get('tva')?.setValue(7);
  }

  change(i: any) {
    this.productSearchSubject.next(i);
  }

  close() {
    this.formGroup.reset();
    this.savedInvoice = {} as InvoiceModel;
    this.productsMap = new Map<number, ProductModel[]>();
    this.selectedClient = {} as ClientModel;
    this.productInvoiceArray.clear();
    this.refresh.emit()
  }

  private extractProductInvoices() {
    return this.savedInvoice.productInvoices.map(productInv => {

    })
  }
}
