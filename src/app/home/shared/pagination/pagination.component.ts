import {Component, Input, Output, EventEmitter} from '@angular/core';
import {CommonModule} from "@angular/common";
import {PaginationPipe} from "../pipe/pagination.pipe";

@Component({
  selector: 'app-pagination',
  imports: [CommonModule, PaginationPipe],
  standalone: true,
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {

  pageSize: number = 10;
  pages: number[] = [];
  currentPage: number = 1;
  @Output() selectPage = new EventEmitter<number>();
  @Input() set count(c: number) {
    const total = Math.ceil(c/this.pageSize);
    this.pages = Array.from({length: total}, (_,index) => index + 1)
  };

  select(page: number) {
    if (Number.isInteger(page)) {
      this.currentPage = page;
      this.selectPage.emit(page);
    }
  }

  public init() {
    this.currentPage = 1;
  }
}
