import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from "@angular/core";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {StationModel} from "../station.model";
import {Observable, Subject} from "rxjs";
import {ProductSelectorComponent} from "./product-selector/product-selector.component";
import {ProductModel, ProductResponse, ProductType, SelectProductModel} from "../../product/product.model";
import {TransFormationEnum, TransformationModel} from "./transformation.model";
import {TransformTypePipe} from "../../shared/pipe/transform-type.pipe";
import {TransformationService} from "../../../service/transformation.service";
import {catchError, debounceTime, distinctUntilChanged, map, switchMap, tap} from "rxjs/operators";
import {ToastService} from "../../../shared/toast/toast.service";
import {v4 as uuidv4} from 'uuid';
import {ProductService} from "../../../service/product.service";

@Component({
  selector: 'app-transformation',
  imports: [RouterModule, CommonModule, FormsModule, ProductSelectorComponent, TransformTypePipe],
  standalone: true,
  templateUrl: './transformation.component.html'
})
export class TransformationComponent implements OnInit {

  @ViewChild("btnTransformationModal") btn: ElementRef<HTMLButtonElement> | undefined;
  @ViewChild("selectorIn") selectorIn?: ProductSelectorComponent;
  @ViewChild("selectorOut") selectorOut?: ProductSelectorComponent;
  @Output() reload = new EventEmitter();
  productsFirstPage: ProductModel[] = [];
  productsIn: ProductModel[] = [];
  searchProductsIn = new Subject<string>();
  productsOut: ProductModel[] = [];
  searchProductsOut = new Subject<string>();
  types = [ProductType.FINAL, ProductType.RAW];
  productLimit = 15;
  transformations: TransformationModel[] = [];
  transformEnum = TransFormationEnum;
  station: StationModel = {} as StationModel;

  constructor(private transformSerivce: TransformationService,
              private productService: ProductService,
              private toast: ToastService) {
  }

  ngOnInit(): void {
    this.findProducts();
    this.listenToSearch();
  }

  private findProducts(): void {
    this.productService.findAllProducts({types: this.types, pageSize: this.productLimit}).pipe(
      map((products: ProductResponse) => products.products)
    ).subscribe((products: ProductModel[]) => {
      this.productsOut = products;
      this.productsIn = products;
      this.productsFirstPage = products;
    });
  }

  submit() {
    this.transformations = this.transformations.filter(transform => transform?.productPublicId && transform?.quantity > 0)
    this.transformSerivce.addTransformations(this.station.publicId, this.transformations)
      .pipe(
        tap(success => {
          this.toast.showSucess(`Transformations sur la station ${success.name} ajoutées avec succès`);
          this.reload.emit();
        }),
        catchError(() => {
          this.toast.showFail(`Une erreur est survenue lors de l'enregistrement des transformation`);
          return new Observable();
        })
      )
      .subscribe()
  }

  public openTransformationModal(station: StationModel) {
    if (station.publicId) {
      this.station = station;
      this.transformations = station.transformations;
      this.btn?.nativeElement?.click();
      this.resetProductList();
    }
  }

  addTransformation(type: TransFormationEnum) {
    this.transformations = this.transformations.concat({
      publicId: uuidv4(),
      type
    } as TransformationModel);
    this.resetProductList();

  }

  resetProductList() {
    this.productsIn = this.productsFirstPage;
    this.productsOut = this.productsFirstPage;
  }

  addProductTransform(selectProductModel: SelectProductModel) {
    const transform = this.transformations
      .find(transform => transform.publicId === selectProductModel.publicId);
    if (transform) {
      transform.product = selectProductModel.product;
      transform.productPublicId = selectProductModel.product.publicId;
      transform.type === TransFormationEnum.INPUT ? this.selectorIn?.initSearch() : this.selectorOut?.initSearch();
    }
    this.resetProductList();

  }

  removeTransformation(publicId: string) {
    this.transformations = this.transformations.filter(transform => transform.publicId !== publicId);
  }

  private listenToSearch() {

    this.searchProductsIn.asObservable()
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((searchText: string, index: number) => {
          return this.productService.findAllProducts({name: searchText, types: this.types, pageSize: this.productLimit})
          }
        ),
        map((productResponse: ProductResponse) => productResponse.products)
      ).subscribe((products: ProductModel[]) => this.productsIn = products);

    this.searchProductsOut.asObservable()
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((searchText: string, index: number) => {
          return this.productService.findAllProducts({name: searchText, types: this.types, pageSize: this.productLimit})
          }
        ),
        map((productResponse: ProductResponse) => productResponse.products)
      ).subscribe((products: ProductModel[]) => this.productsOut = products);
  }
}
