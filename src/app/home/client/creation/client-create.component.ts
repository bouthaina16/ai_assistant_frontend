import {Component, OnInit, Output, EventEmitter, Input, OnDestroy} from "@angular/core";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ClientRequest} from "../client.model";

@Component({
  selector: 'app-client-create',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './client-create.component.html'
})
export class ClientCreateComponent implements OnInit {
  @Input() reference = "";
  @Output() submitCreation = new EventEmitter<ClientRequest>();
  @Output() createDraft = new EventEmitter<any>();

  formGroup: FormGroup = new FormGroup<any>({});
  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      name: ['', Validators.required],
      address: [''],
      tel: [''],
      email: ['', Validators.email],
      fiscalId: [''],
    });
  }

  submit() {
    this.submitCreation.emit(this.formGroup.value);
    this.formGroup.reset();
  }
}
