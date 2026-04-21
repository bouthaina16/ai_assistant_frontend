import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from "@angular/core";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ClientModel, ClientRequest} from "../client.model";

@Component({
  selector: 'app-client-update',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './client-update.component.html'
})
export class ClientUpdateComponent implements OnInit {
  clientPublicId: string = "";
  @ViewChild("btnUpdateClientModal") btn: ElementRef<HTMLButtonElement> | undefined;
  @Output() submitUpdate = new EventEmitter<ClientRequest>()
  client: ClientModel = {} as ClientModel;
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
    })
  }

  submit() {
    if (!this.sameClient()) {
      const request: ClientRequest = this.formGroup.value as ClientRequest;
      request.publicId = this.clientPublicId;
      this.submitUpdate.emit(request);
    }
    this.formGroup.reset();
  }

  public openUpdateModal(client: ClientModel) {
    if (client.publicId) {
      this.client = client;
      this.clientPublicId = client.publicId;
      this.formGroup.patchValue({
        name: client.name,
        address: client.address,
        tel: client.tel,
        fiscalId: client.fiscalId,
        email: client.email,
      });
      this.btn?.nativeElement?.click();
    }
  }

  private sameClient() {
    return this.client.name === this.formGroup.get('name')?.value
      && this.client.address === this.formGroup.get('address')?.value
      && this.client.tel === this.formGroup.get('tel')?.value
      && this.client.fiscalId === this.formGroup.get('fiscalId')?.value
      && this.client.email === this.formGroup.get('email')?.value;
  }
}
