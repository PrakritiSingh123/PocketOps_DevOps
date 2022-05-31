import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AllModulesService } from "src/app/all-modules/all-modules.service";
import { decodeToken } from "src/app/helpers/jwt-helper";

@Component({
  selector: "app-employee-profile",
  templateUrl: "./employee-profile.component.html",
  styleUrls: ["./employee-profile.component.css"],
})
export class EmployeeProfileComponent implements OnInit {
  public addEmployeeForm: FormGroup;
  public _id: string;
  public generalinfo = {
    Department: "",
    Designation: "",
    "Email Id": "",
    "Employee Id": "",
    "First Name": "",
    "Last Name": "",
    "User Name": "",
    _id: "",
  }
  public personalInfoForm: FormGroup = this.formBuilder.group({
    "_id": ["", [Validators.required]],
    "DOB": ["", [Validators.required]],
    "Address": ["", [Validators.required]],
    "Passport No": ["", [Validators.required]],
    "Passport Exp Date": ["", [Validators.required]],
    "Mobile": ["", [Validators.required]],
    "Nationality": ["", [Validators.required]],
    "Religion": ["", [Validators.required]],
    "Marital status": ["", [Validators.required]],
    "Employment of spouse": ["None", []],
    "No of children": ["", []]
  });
  public emergencyContactForm: FormGroup = this.formBuilder.group({
    "_id": ["", [Validators.required]],
    "Primary": this.formBuilder.group({
      "Name": ["", [Validators.required]],
      "Relationship": ["", [Validators.required]],
      "Phone": ["", [Validators.required]],
      "Phone 2": ["", []],
    }),
    "Secondary": this.formBuilder.group({
      "Name": ["", [Validators.required]],
      "Relationship": ["", [Validators.required]],
      "Phone": ["", [Validators.required]],
      "Phone 2": ["", []],
    }),
  });
  constructor(
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    public activatedRoute: ActivatedRoute,
    private srvModuleService: AllModulesService,
  ) { }

  async ngOnInit() {
    this.addEmployeeForm = this.formBuilder.group({
      client: ["", [Validators.required]],
    });
    await this.activatedRoute.queryParams.subscribe(async (q) => {
      this._id = q._id;
      if(!this._id){
        let decodedToken = await decodeToken(sessionStorage.getItem('token'));
        this._id = decodedToken['_id'];
      }
      this.loadGeneralInfo();
      this.loadPersonalInfo();
      this.loadEmergencyContactInfo();
    });
    this.personalInfoForm.patchValue({ _id: this._id });
    this.emergencyContactForm.patchValue({ _id: this._id });
  }

  loadGeneralInfo() {
    this.srvModuleService.get("employee/getEmployee-GeneralInformation?id=" + this._id).subscribe((data) => {
      console.log(data);
      this.generalinfo = data.data;
    }, (err: HttpErrorResponse) => {
      console.log(err);
    })
  }

  updatePersonalInfo() {
    let obj = {
      "_id": this._id,
      "Passport No": this.personalInfoForm.value["Passport No"],
      "Passport Exp Date": this.personalInfoForm.value["Passport Exp Date"],
      "Mobile": this.personalInfoForm.value["Mobile"],
      "Nationality": this.personalInfoForm.value["Nationality"],
      "Religion": this.personalInfoForm.value["Religion"],
      "Marital status": this.personalInfoForm.value["Marital status"],
      "Employment of spouse": this.personalInfoForm.value["Employment of spouse"],
      "No of children": this.personalInfoForm.value["No of children"],
      "DOB": this.personalInfoForm.value["DOB"],
      "Address": this.personalInfoForm.value["Address"],
    }
    // console.log(obj);
    this.srvModuleService.add(obj, "employee/create-personalInfo").subscribe((data) => {
      this.toastr.success("Personal information updated", "Success");
    }, (err: HttpErrorResponse) => {
      console.log(err);
      this.toastr.error("Failed to update personal information", "Error");
    })
  }

  loadPersonalInfo() {
    this.srvModuleService.get("employee/FindDataById-PersonalInformation?id=" + this._id).subscribe((data) => {
      // console.log(data.data[0]);
      if (data.data[0]?._id) {
        this.personalInfoForm.setValue(data.data[0]);
      }
    }, (err: HttpErrorResponse) => {
      console.log(err);
      this.toastr.error("Failed to update personal information", "Error");
    })
  }

  updateEmergencyContactInfo() {
    let obj = {
      "_id": this._id,
      "Primary": this.emergencyContactForm.value.Primary,
      "Secondary": this.emergencyContactForm.value.Secondary,
    }
    console.log(obj);
    this.srvModuleService.add(obj, "employee/create-emergencyContact").subscribe((data) => {
      this.toastr.success("Emergency contact updated", "Success");
    }, (err: HttpErrorResponse) => {
      console.log(err);
      this.toastr.error("Failed to update emergency contact", "Error");
    })
  }

  loadEmergencyContactInfo() {
    this.srvModuleService.get("employee/FindDataById-EmergencyContact?id=" + this._id).subscribe((data) => {
      console.log(data.data[0]);
      if (data.data[0]?._id) {
        this.emergencyContactForm.setValue(data.data[0]);
      }
    }, (err: HttpErrorResponse) => {
      console.log(err);
      this.toastr.error("Failed to update personal information", "Error");
    })
  }

  onSubmit() {
    this.toastr.success("Bank & statutory added", "Success");
  }
}
