import {Component, Input, Output, EventEmitter} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-placeholder',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './placeholder.component.html'
})
export class PlaceholderComponent {
  @Input() isLoading = false;
}
