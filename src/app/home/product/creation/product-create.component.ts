import {Component, OnInit, Output, EventEmitter, Input, OnDestroy} from "@angular/core";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ProductRequest, ProductType, ProductUnit} from "../product.model";

@Component({
  selector: 'app-product-create',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './product-create.component.html'
})
export class ProductCreateComponent implements OnInit {
  typeEnum = ProductType;
  unitEnum = ProductUnit;
  @Input() reference = "";
  @Output() submitCreation = new EventEmitter<ProductRequest>();
  @Output() createDraft = new EventEmitter<any>();

  formGroup: FormGroup = new FormGroup<any>({});
  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      name: ['', Validators.required],
      provider: [''],
      initialValue: ['', Validators.required],
      unit: ['', Validators.required],
      type: ['', Validators.required],
      price: [''],
    });
  }

  submit() {
    this.submitCreation.emit(this.formGroup.value);
    this.formGroup.reset();
  }
}
