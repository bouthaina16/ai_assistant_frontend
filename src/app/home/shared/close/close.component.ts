import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-close',
  imports: [RouterModule, CommonModule, FormsModule],
  standalone: true,
  templateUrl: './close.component.html'
})
export class CloseComponent {

  item?: any;
  @ViewChild("btnCloseModal") btnClose: ElementRef<HTMLButtonElement> | undefined;

  @Output() validClose = new EventEmitter<any>();

  public openCloseModal(item: any) {
    this.item = item;
    this.btnClose?.nativeElement?.click();
  }
}
