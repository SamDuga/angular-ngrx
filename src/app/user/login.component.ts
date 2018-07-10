import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';

import { AuthService } from './auth.service';
import * as fromUser from '../user/state/';
import * as userActions from '../user/state/user.actions';
import { takeWhile } from '../../../node_modules/rxjs/operators';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  pageTitle = 'Log In';
  errorMessage: string;

  maskUserName: boolean;
  componentActive = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<fromUser.UserState>) { }

  ngOnInit(): void {
    this.store.pipe(select(fromUser.getMaskUserName),
      takeWhile( () => this.componentActive) )
      .subscribe( maskUserName => this.maskUserName = maskUserName );
  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  cancel(): void {
    this.router.navigate(['welcome']);
  }

  checkChanged(value: boolean): void {
    this.store.dispatch( new userActions.MaskUserName(value));
  }

  login(loginForm: NgForm): void {
    if (loginForm && loginForm.valid) {
      const userName = loginForm.form.value.userName;
      const password = loginForm.form.value.password;
      this.authService.login(userName, password);

      if (this.authService.redirectUrl)
        this.router.navigateByUrl(this.authService.redirectUrl);
      else
        this.router.navigate(['/products']);
    }
    else this.errorMessage = 'Please enter a user name and password.';
  }
}