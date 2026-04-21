import {Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef} from "@angular/core";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ProductModel, ProductRequest, ProductType, ProductUnit} from "../product.model";

@Component({
  selector: 'app-product-update',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './product-update.component.html'
})
export class ProductUpdateComponent implements OnInit {
  typeEnum = ProductType;
  unitEnum = ProductUnit;
  productPublicId: string = "";
  @ViewChild("btnUpdateModal") btn: ElementRef<HTMLButtonElement> | undefined;
  @Output() submitUpdate = new EventEmitter<ProductRequest>()
  product: ProductModel = {} as ProductModel;
  formGroup: FormGroup = new FormGroup<any>({});
  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      name: ['', Validators.required],
      provider: [''],
      unit: ['', Validators.required],
      type: ['', Validators.required],
      price: ['']
    })
  }

  submit() {
    if (!this.sameProduct()) {
      const request: ProductRequest = this.formGroup.value as ProductRequest;
      request.publicId = this.productPublicId;
      this.submitUpdate.emit(request);
    }
    this.formGroup.reset();
  }

  public openUpdateModal(product: ProductModel) {
    if (product.publicId) {
      this.product = product;
      this.productPublicId = product.publicId;
      this.formGroup.patchValue({
        name: product.name,
        provider: product.provider,
        unit: product.unit,
        type: product.type,
        price: product.price
      });
      this.btn?.nativeElement?.click();
    }
  }

  private sameProduct() {
    return this.product.name === this.formGroup.get('name')?.value
      && this.product.provider === this.formGroup.get('provider')?.value
      && this.product.unit === this.formGroup.get('unit')?.value
      && this.product.price === this.formGroup.get('price')?.value
      && this.product.type === this.formGroup.get('type')?.value;
  }
}
