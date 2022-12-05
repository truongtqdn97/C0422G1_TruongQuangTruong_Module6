import {Component, OnDestroy, OnInit} from '@angular/core';
import {ShareDataService} from "../../service/share-data.service";
import {SecurityService} from "../../service/security.service";
import {FormControl, FormGroup} from "@angular/forms";
import {LoginResponse} from "../../model/login-response";
import {TokenStorageService} from "../../service/token-storage.service";
import {NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs/operators";
import {FacebookLoginProvider, GoogleLoginProvider, SocialAuthService} from "angularx-social-login";
import {log} from "util";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy {

  loginForm: FormGroup;
  loginResponse: LoginResponse;
  rememberMe = false;
  previousUrl: string;

  constructor(private shareDataService: ShareDataService,
              private securityService: SecurityService,
              private tokenStorageService: TokenStorageService,
              private router: Router,
              private authService: SocialAuthService) {
    shareDataService.changeLoginModuleStatus(true)
    shareDataService.currentPreviousUrl.subscribe(url => this.previousUrl = url)
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl(""),
      password: new FormControl("")
    })
  }

  submitLogin() {
    this.securityService.login(this.loginForm.value).subscribe(loginResponse => {
      this.loginResponse = loginResponse;
      if (this.rememberMe){
        this.tokenStorageService.localStorageSave(loginResponse);
      }else {
        this.tokenStorageService.sessionStorageSave(loginResponse);
      }
      this.shareDataService.changeLoginStatus(true)
      this.router.navigateByUrl(this.previousUrl);
    } )
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(data => {
      this.securityService.loginBySocial(data.idToken,'google').subscribe(loginResponse => {
        this.tokenStorageService.sessionStorageSave(loginResponse);
        this.shareDataService.changeLoginStatus(true)
        this.router.navigateByUrl(this.previousUrl);
      })
    });
  }
  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(data => {
      this.securityService.loginBySocial(data.authToken,'facebook').subscribe(loginResponse => {
        this.tokenStorageService.sessionStorageSave(loginResponse);
        this.shareDataService.changeLoginStatus(true)
        this.router.navigateByUrl(this.previousUrl);
      })
    });
  }

  ngOnDestroy(): void {
    this.shareDataService.changeLoginModuleStatus(false);
  }
}
