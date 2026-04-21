import {Component, OnInit} from '@angular/core';
import {Router, RouterModule} from "@angular/router";
@Component({
  selector: 'app-home',
  imports: [RouterModule],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  disconnect() {
    localStorage.removeItem('Authorization');
    this.router.navigate(['/login']);
  }
}
