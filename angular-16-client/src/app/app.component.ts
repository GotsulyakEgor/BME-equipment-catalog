import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "./services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private router: Router,
              public authService: AuthService) {}

  logout() {
    this.authService.logout()
  }

  navigateToSignIn() {
    this.router.navigate(['sign-in']);
  }

}
