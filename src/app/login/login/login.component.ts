import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SharedDataService } from 'src/app/store/shared-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoginFailed: boolean = false;

  constructor(
    public fb: FormBuilder,
    public authenticationService: AuthenticationService,
    public router: Router,
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      userName: new FormControl('', [Validators.required, Validators.email]),
      passWord: new FormControl('', [Validators.required,])
    })
  }

  login() {
    this.isLoginFailed = false;
    SharedDataService.clearCachedData();
    this.authenticationService.authenticate(this.loginForm.value.userName, this.loginForm.value.passWord).subscribe((res: any) => {
      SharedDataService.LoggedinUser = res.BasicUserInfo;
      console.log(SharedDataService.LoggedinUser);
      sessionStorage.setItem("UserInfo", JSON.stringify(SharedDataService.LoggedinUser));
      this.router.navigateByUrl('/');
    }, (err: HttpErrorResponse) => {
      this.isLoginFailed = true;
      console.log(err);
    })
  }

}
