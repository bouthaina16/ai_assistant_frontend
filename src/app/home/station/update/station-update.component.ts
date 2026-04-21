import {Component, OnInit, Output, EventEmitter, ViewChild, ElementRef} from "@angular/core";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {StationModel, StationRequest} from "../station.model";

@Component({
  selector: 'app-station-update',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './station-update.component.html'
})
export class StationUpdateComponent implements OnInit {

  @ViewChild("btnUpdateStationModal") btn: ElementRef<HTMLButtonElement> | undefined;
  @Output() submitUpdate = new EventEmitter<StationRequest>()

  stationPublicId: string = "";
  formGroup: FormGroup = new FormGroup<any>({});
  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      name: ['', Validators.required],
      machine: [''],
      operator: [''],
      duration: [''],
      date: [''],
    })
  }

  submit() {
    const stationRequest: StationRequest = this.formGroup.value;
    stationRequest.publicId = this.stationPublicId;
    this.submitUpdate.emit(stationRequest);
    this.formGroup.reset();
  }

  public openUpdateModal(station: StationModel) {
    if (station.publicId) {
      this.stationPublicId = station.publicId;
      this.formGroup.patchValue({
        name: station.name,
        machine: station.machine,
        duration: station.duration,
        operator: station.operator,
        date: station.date,
      });
      this.btn?.nativeElement?.click();
    }
  }
}
