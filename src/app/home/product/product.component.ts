import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {RouterModule} from "@angular/router";
import {Observable, Subject, Subscription} from "rxjs";
import {
  ProductModel,
  ProductQuantityModel,
  ProductRequest,
  ProductResponse,
  ProductType,
  SearchProductModel
} from "./product.model";
import {CommonModule} from "@angular/common";
import {ProductService} from "../../service/product.service";
import {catchError, debounceTime, distinctUntilChanged, map, tap} from "rxjs/operators";
import {FormsModule} from "@angular/forms";
import {ToastService} from "../../shared/toast/toast.service";
import {ProductUpdateComponent} from "./update/product-update.component";
import {RemoveComponent} from "../shared/remove/remove.component";
import {ProductQuantityComponent} from "./quantity/product-quantity.component";
import {PaginationComponent} from "../shared/pagination/pagination.component";
import {PlaceholderComponent} from "../shared/placeholder/placeholder.component";
import {ProductCreateComponent} from "./creation/product-create.component";

@Component({
  selector: 'app-product',
  imports: [RouterModule, CommonModule, FormsModule, PaginationComponent, PlaceholderComponent, ProductQuantityComponent, ProductCreateComponent, ProductUpdateComponent, RemoveComponent],
  standalone: true,
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy {

  constructor(private productService: ProductService, private toastService: ToastService) {
  }
  type: ProductType = ProductType.RAW;
  search: string = "";
  searchSubject = new Subject<string>();
  searchSubscription = new Subscription();
  products: Observable<ProductModel[]> = this.findProducts();
  productCount: number = 0;
  typeEnum = ProductType;
  isLoading = true;
  quantityMode = '';
  publicId = '';
  reference = '';
  createDraftSubscription = new Subscription();

  @ViewChild(ProductQuantityComponent) productQuantity?: ProductQuantityComponent;
  @ViewChild(ProductUpdateComponent) productUpdate?: ProductUpdateComponent;
  @ViewChild(RemoveComponent) removeComponent?: RemoveComponent;
  @ViewChild(PaginationComponent) pagination?: PaginationComponent;

  ngOnInit(): void {
    this.listenToSearch();
  }

  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
    this.createDraftSubscription.unsubscribe();
  }

  private findProducts(search?: string, page: number = 0): Observable<ProductModel[]> {
    this.isLoading = true;
    const searchRequest = {
      types: [this.type],
      name: search,
      page: page
    } as SearchProductModel;
    return this.productService.findAllProducts(searchRequest).pipe(
      tap((products: ProductResponse) => {
        this.productCount = products.count;
        this.isLoading = false;
      }),
      map(productModel => productModel.products)
    )
  }

  change(type: ProductType) {
    this.type = type;
    this.search = "";
    this.products = this.findProducts()
  }

  createProduct(productForm: ProductRequest) {
    productForm.publicId = this.publicId;
    this.productService.createProduct(productForm)
      .pipe(
        tap((response: ProductModel) => {
          this.toastService.showSucess(`Produit <${response.name}> créé avec succées`);
          this.search = "";
          this.products = this.findProducts();
          this.pagination?.init();
          this.createDraftSubscription.unsubscribe();
        }),
        catchError(() => {
          this.toastService.showFail('Problème survenu lors de la création du produit');
          return new Observable();
        })
      )
      .subscribe()
  }

  updateProduct(productForm: ProductRequest) {
    this.productService.updateProduct(productForm)
      .pipe(
        tap((response: ProductModel) => {
          this.toastService.showSucess(`Produit <${response.name}> modifié avec succées`);
          this.products = this.findProducts(this.search);
        }),
        catchError(() => {
          this.toastService.showFail('Problème survenu lors de la modification du produit');
          return new Observable();
        })
      )
      .subscribe()
  }

  deleteProduct(product: ProductRequest) {
    this.productService.removeProduct(product.publicId)
      .pipe(
        tap((response: ProductModel) => {
          this.toastService.showSucess(`Produit <${product?.name}> supprimé avec succées`);
          this.search = "";
          this.products = this.findProducts(this.search);
        }),
        catchError((errror) => {
          this.toastService.showFail('Problème survenu lors de la suppression du produit');
          return new Observable();
        })
      )
      .subscribe()
  }

  addQuantity(productQuantity: ProductQuantityModel) {
    this.productService.addQuantity(productQuantity.publicId, productQuantity.quantity)
      .pipe(
        tap((response: ProductModel) => {
          this.toastService.showSucess(`Quantité de produit modifiée avec succès`);
          this.products = this.findProducts(this.search);
        }),
        catchError((errror) => {
          this.toastService.showFail('Problème survenu lors de la modification de la qunatité de produit');
          return new Observable();
        })
      )
      .subscribe()
  }

  subtractQuantity(productQuantity: ProductQuantityModel) {
    this.productService.subtractQuantity(productQuantity.publicId, productQuantity.quantity)
      .pipe(
        tap((response: ProductModel) => {
          this.toastService.showSucess(`Quantité de produit modifié avec succès`);
          this.products = this.findProducts(this.search);
        }),
        catchError((errror) => {
          this.toastService.showFail('Problème survenu lors de la modification de la qunatité de produit');
          return new Observable();
        })
      )
      .subscribe()
  }

  openModalChangeQuantity(item: ProductModel, sign: string) {
    this.quantityMode = sign;
    this.productQuantity?.openQuantityModal(item);
  }

  private listenToSearch() {
    this.searchSubscription = this.searchSubject.asObservable().pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap((searchQuery: string) => {
        this.products = this.findProducts(searchQuery);
        this.pagination?.init();
      })
    ).subscribe()
  }

  changePage(page: number) {
    this.products = this.findProducts(this.search, page - 1);
  }


  createDraftProduct() {
    this.createDraftSubscription = this.productService.createDraftProduct()
      .subscribe(productModel => {
        this.publicId = productModel?.publicId;
        this.reference = productModel?.reference;
      })
  }
}
