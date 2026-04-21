import {Component, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ToastService} from "./toast.service";
import {delay, tap} from "rxjs/operators";

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {

  constructor(private toastService: ToastService) {}

  show: boolean = false;
  message: string = "";
  status: Status = Status.SUCCESS;

  statusEnum = Status;

  ngOnInit(): void {
    this.listenToSuccess();
    this.listenToFail();
  }


  private listenToSuccess() {
    this.toastService.getToastSucess()
      .pipe(
        tap((message: string) => {
          this.show = true;
          this.message = message;
          this.status = Status.SUCCESS;
        }),
        delay(6000),
        tap(() => {
          this.show = false;
        })
      )
      .subscribe();
  }

  private listenToFail() {
    this.toastService.getToastFail()
      .pipe(
        tap((message: string) => {
          this.show = true;
          this.message = message;
          this.status = Status.FAIL;
        }),
        delay(6000),
        tap(() => {
          this.show = false;
        })
      )
      .subscribe();
  }

  close() {
    this.show = false;
  }
}

export enum Status {
  SUCCESS='success', FAIL='fail'
}
