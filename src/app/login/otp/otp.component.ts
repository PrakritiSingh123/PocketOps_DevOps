import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AllModulesService } from 'src/app/all-modules/all-modules.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent implements OnInit {

  otpForm: FormGroup;
  passwordForm: FormGroup;

  otpEntered: boolean = false;

  constructor(
    public fb: FormBuilder,
    public srvModuleService: AllModulesService,
    public toastr: ToastrService,
    public router: Router
  ) { }

  ngOnInit() {
    this.otpForm = this.fb.group({
      Otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    })
    this.passwordForm = this.fb.group({
      Password: ['', [Validators.required]],
      ConfirmPassword: ['', [Validators.required]],
    });
    this.otpEntered = false;
  }

  submitOtp() {
    console.log(this.otpForm.value);
    if (!this.otpForm.value.Otp || this.otpForm.value.length == 0) {
      this.toastr.warning("Please enter 6 digit otp", "Warning");
      return;
    }
    this.otpEntered = true;
  }

  changePassword() {
    console.log(this.passwordForm.value);
    if (this.passwordForm.value.Password !== this.passwordForm.value.ConfirmPassword) {
      this.toastr.warning("Both passwords must be same.", "Warning");
      return;
    }
    let obj = {
      "OTP": parseInt(this.otpForm.value.Otp),
      "Password": this.passwordForm.value.Password
    }
    this.srvModuleService.resetPwd(obj, `pwd-reset`).subscribe((data)=>{
      if(data.Status){
        this.toastr.info("Password has been changed, please try login after 1-2 minutes", "Success")
      } else {
        this.toastr.error("Failed to change password. Please try again", "Error");
      }
      this.router.navigateByUrl("/login")
    },(err: HttpErrorResponse)=>{
      console.log(err);
      this.toastr.error("Failed to change password. Please try again", "Error");
    })
  }

}
