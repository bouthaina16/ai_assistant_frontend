import {Component, ElementRef, EventEmitter, Output, ViewChild} from "@angular/core";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {StationModel} from "../station.model";
import {TransFormationEnum, TransformationModel} from "../transformation/transformation.model";

@Component({
  selector: 'app-finalize',
  imports: [RouterModule, CommonModule, FormsModule],
  standalone: true,
  templateUrl: './finalize.component.html'
})
export class FinalizeComponent {

  stationName: string = "";
  stationPublicId: string = "";
  transformationIn: TransformationModel[] = [];
  transformationOut: TransformationModel[] = [];
  @ViewChild("btnFinalizeModal") btn: ElementRef<HTMLButtonElement> | undefined;

  @Output() valid = new EventEmitter<string>();

  public openModal(station: StationModel) {
    this.stationName = station.name;
    this.stationPublicId = station.publicId;
    this.btn?.nativeElement?.click();
    this.transformationIn = station.transformations
      .filter(transformation => transformation.type === TransFormationEnum.INPUT);

    this.transformationOut = station.transformations
      .filter(transformation => transformation.type === TransFormationEnum.OUTPUT);
  }
}
