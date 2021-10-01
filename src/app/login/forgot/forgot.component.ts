import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AllModulesService } from 'src/app/all-modules/all-modules.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit {

  emailForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    public srvModuleService: AllModulesService,
    public toastr: ToastrService,
    public router: Router
  ) { }

  ngOnInit() {
    this.emailForm = this.fb.group({
      Username: ['', [Validators.required, Validators.email]]
    })
  }

  requestPasswordReset(){
    this.srvModuleService.add(this.emailForm.value, `pwd-reset-reqest`).subscribe((data) => {
      if(data.Status){
        sessionStorage.setItem("temp", data.TempToken);
        this.router.navigateByUrl('/login/otp');
      }
    },(err: HttpErrorResponse)=> {
      console.log(err.status);
      this.toastr.error("Failed to create password reset reqest.", "Error");
    })
  }

}
