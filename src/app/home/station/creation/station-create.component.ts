import {Component, OnInit, Output, EventEmitter, Input} from "@angular/core";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {StationRequest} from "../station.model";


@Component({
  selector: 'app-station-create',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './station-create.component.html'
})
export class StationCreateComponent implements OnInit {

  @Output() submitCreation = new EventEmitter<StationRequest>()
  @Output() createStationDraft = new EventEmitter<any>()

  @Input() reference = ""
  formGroup: FormGroup = new FormGroup<any>({});
  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      name: ['', Validators.required],
      operator: [''],
      machine: [''],
      date: [''],
      duration: [''],
    })
  }

  submit() {
    this.submitCreation.emit(this.formGroup.value);
    this.formGroup.reset();
  }
}
