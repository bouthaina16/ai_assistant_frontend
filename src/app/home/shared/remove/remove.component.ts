import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-remove',
  imports: [RouterModule, CommonModule, FormsModule],
  standalone: true,
  templateUrl: './remove.component.html'
})
export class RemoveComponent {

  item?: any;
  @ViewChild("btnDeleteModal") btnDelete: ElementRef<HTMLButtonElement> | undefined;

  @Output() validDelete = new EventEmitter<any>();

  public openRemoveModal(item: any) {
    this.item = item;
    this.btnDelete?.nativeElement?.click();
  }
}
