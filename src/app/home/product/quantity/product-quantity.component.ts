import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ProductModel, ProductQuantityModel} from "../product.model";

@Component({
  selector: 'app-product-quantity',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './product-quantity.component.html'
})
export class ProductQuantityComponent {
  quantity: number = 0;
  productPublicId: string = "";
  @ViewChild("btnQuantityModal") btn: ElementRef<HTMLButtonElement> | undefined;
  @Output() addQuantity = new EventEmitter<ProductQuantityModel>();
  @Output() subtractQuantity = new EventEmitter<ProductQuantityModel>();
  @Input() mode: string = '';

  submit() {
    const productQuantityRequest: ProductQuantityModel = {
      quantity: this.quantity,
      publicId: this.productPublicId
    } as ProductQuantityModel;

    if (this.mode === '+') {
      this.addQuantity.emit(productQuantityRequest);
    }

    if (this.mode === '-') {
      this.subtractQuantity.emit(productQuantityRequest);
    }

  }

  public openQuantityModal(product: ProductModel) {
    if (product.publicId) {
      this.productPublicId = product.publicId;
      this.btn?.nativeElement?.click();
    }
  }
}
