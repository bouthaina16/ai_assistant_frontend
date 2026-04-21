import {Component, Input, OnInit, Output, EventEmitter} from "@angular/core";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ProductModel, SelectProductModel} from "../../../product/product.model";
import {TransformationModel} from "../transformation.model";
import {EllipsisPipe} from "../../../shared/pipe/ellipsis.pipe";

@Component({
  selector: 'app-product-selector',
  imports: [RouterModule, CommonModule, FormsModule, EllipsisPipe],
  standalone: true,
  templateUrl: './product-selector.component.html',
  styleUrls: ['./product-selector.component.scss']
})
export class ProductSelectorComponent {

  @Input() transformations: TransformationModel[] = [];
  @Input() productsData: ProductModel[] = [];

  @Output() addTransformation = new EventEmitter<number>()
  @Output() selectProductTransform = new EventEmitter<SelectProductModel>()
  @Output() removeTransformation = new EventEmitter<string>()
  @Output() searchProductEvent = new EventEmitter<string>()
  searchProduct = '';

  public initSearch() {
    this.searchProduct = '';
  }

}
