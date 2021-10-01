import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { AllModulesService } from "src/app/all-modules/all-modules.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { DatePipe } from "@angular/common";
import { Subject } from "rxjs";
import { DataTableDirective } from "angular-datatables";
import { id } from "src/assets/all-modules-data/id";
import { HttpErrorResponse } from "@angular/common/http";

declare const $: any;
@Component({
  selector: "app-employee-page-content",
  templateUrl: "./employee-page-content.component.html",
  styleUrls: ["./employee-page-content.component.css"],
})
export class EmployeePageContentComponent implements OnInit {
  public lstEmployee: any[];
  public url: any = "employee";
  public tempId: any;
  public editId: any;
  public lstDesignation: Set<any> = new Set();
  public lstDepartment: Set<any> = new Set();
  public addEmployeeForm: FormGroup;
  public editEmployeeForm: FormGroup;
  public isRandomPassword: boolean = false;
  public dropdownMetaData: any;
  public dropDownDesignations: Set<any> = new Set();
  public dropDownDepartments: Set<any> = new Set();
  public roleList = []
  public selectedRoleId: any;

  public pipe = new DatePipe("en-US");
  public rows = [];
  public srch = [];
  public statusValue;
  constructor(
    private srvModuleService: AllModulesService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.loadEmployee();
    this.LoadDesignation();
    this.addEmployeeForm = this.formBuilder.group({
      FirstName: ["", [Validators.required]],
      LastName: ["", [Validators.required]],
      UserName: ["", [Validators.required]],
      Password: ["", [Validators.required]],
      ConfirmPassword: ["", [Validators.required]],
      DepartmentName: ["", [Validators.required]],
      Designation: ["", [Validators.required]],
      Email: ["", [Validators.required]],
      PhoneNumber: ["", [Validators.required]],
      JoinDate: ["", [Validators.required]],
      // CompanyName: ["", [Validators.required]],
      EmployeeID: ["", [Validators.required]],
      Gender: ["", [Validators.required]],
    });

    this.editEmployeeForm = this.formBuilder.group({
      FirstName: ["", [Validators.required]],
      LastName: ["", [Validators.required]],
      UserName: ["", [Validators.required]],
      // Password: ["", [Validators.required]],
      // ConfirmPassword: ["", [Validators.required]],
      DepartmentName: ["", [Validators.required]],
      Designation: ["", [Validators.required]],
      Email: ["", [Validators.required]],
      PhoneNumber: ["", [Validators.required]],
      JoinDate: ["", [Validators.required]],
      // CompanyName: ["", [Validators.required]],
      EmployeeID: ["", [Validators.required]],
      Gender: ["", [Validators.required]],
    });
  }

  // Get Employee  Api Call
  loadEmployee() {
    this.srvModuleService.get(this.url + '/employee-list').subscribe((data) => {
      this.lstEmployee = [];
      this.lstEmployee = data.data;
      this.lstEmployee.forEach(employee => {
        this.lstDepartment.add(employee.Department);
        this.lstDesignation.add(employee.Designation);
      })
      this.rows = this.lstEmployee;
      this.srch = [...this.rows];
    });
  }

  // Add employee  Modal Api Call
  addEmployee() {
    let DateJoin = this.pipe.transform(
      this.addEmployeeForm.value.JoinDate,
      "dd-MM-yyyy"
    );
    // let obj = {
    //   firstname: this.addEmployeeForm.value.FirstName,
    //   lastname: this.addEmployeeForm.value.LastName,
    //   username: this.addEmployeeForm.value.UserName,
    //   email: this.addEmployeeForm.value.Email,
    //   password: this.addEmployeeForm.value.Password,
    //   confirmpassword: this.addEmployeeForm.value.ConfirmPassword,
    //   employeeId: this.addEmployeeForm.value.EmployeeID,
    //   joindate: DateJoin,
    //   phone: this.addEmployeeForm.value.PhoneNumber,
    //   company: this.addEmployeeForm.value.CompanyName,
    //   department: this.addEmployeeForm.value.DepartmentName,
    //   designation: this.addEmployeeForm.value.Designation,
    //   mobile: "9944996335",
    //   role: "Web developer",
    // };
    let obj = {
      "First Name": this.addEmployeeForm.value.FirstName,
      "Last Name": this.addEmployeeForm.value.LastName,
      "User Name": this.addEmployeeForm.value.UserName,
      "Email Id": this.addEmployeeForm.value.Email,
      "Password": this.addEmployeeForm.value.Password,
      "Employee Id": this.addEmployeeForm.value.EmployeeID,
      "Mobile Number": this.addEmployeeForm.value.PhoneNumber,
      "Department": this.addEmployeeForm.value.DepartmentName,
      "Designation": this.addEmployeeForm.value.Designation,
      "Joined Date": this.addEmployeeForm.value.JoinDate,
      "Gender": this.addEmployeeForm.value.Gender,
    }
    console.log(obj)
    this.srvModuleService.add(obj, this.url + "/create-employee").subscribe((data) => {
      this.loadEmployee();
      $("#add_employee").modal("hide");
      this.addEmployeeForm.reset();
      this.toastr.success("Employeee added sucessfully...!", "Success");
    }, (err: HttpErrorResponse) => {
      console.log(err);
    });
    $("#add_employee").modal("hide");
  }

  editEmployee() {
    let DateJoin = this.pipe.transform(
      this.editEmployeeForm.value.JoinDate,
      "dd-MM-yyyy"
    );
    // let obj = {
    //   firstname: this.editEmployeeForm.value.FirstName,
    //   lastname: this.editEmployeeForm.value.LastName,
    //   username: this.editEmployeeForm.value.UserName,
    //   email: this.editEmployeeForm.value.Email,
    //   password: this.editEmployeeForm.value.Password,
    //   confirmpassword: this.editEmployeeForm.value.ConfirmPassword,
    //   employeeId: this.editEmployeeForm.value.EmployeeID,
    //   joindate: this.editEmployeeForm.value.JoinDate,
    //   phone: this.editEmployeeForm.value.PhoneNumber,
    //   company: this.editEmployeeForm.value.CompanyName,
    //   department: this.editEmployeeForm.value.DepartmentName,
    //   designation: this.editEmployeeForm.value.Designation,
    //   mobile: "9944996335",
    //   role: "Web developer",
    //   id: this.editId,
    // };
    let obj = {
      "_id": this.editId,
      "First Name": this.editEmployeeForm.value.FirstName,
      "Last Name": this.editEmployeeForm.value.LastName,
      "User Name": this.editEmployeeForm.value.UserName,
      "Email Id": this.editEmployeeForm.value.Email,
      "Employee Id": this.editEmployeeForm.value.EmployeeID,
      "Mobile Number": this.editEmployeeForm.value.PhoneNumber,
      "Department": this.editEmployeeForm.value.DepartmentName,
      "Designation": this.editEmployeeForm.value.Designation,
      "Joined Date": this.editEmployeeForm.value.JoinDate,
      "Gender": this.editEmployeeForm.value.Gender,
    }
    console.log(obj)
    this.srvModuleService.add(obj, this.url+"/update-employee").subscribe((data1) => {
      this.loadEmployee();
      this.toastr.success("Employeee Updated sucessfully...!", "Success");
    }, (err: HttpErrorResponse) => {
      console.log(err);
    });
    $("#edit_employee").modal("hide");
  }

  // To Get The employee Edit Id And Set Values To Edit Modal Form
  editEmp(value) {
    this.editId = value;
    const index = this.lstEmployee.findIndex((item) => {
      return item._id === value;
    });
    let toSetValues = this.lstEmployee[index];
    this.loadDesignationDropdown(false, toSetValues['Department']);
    this.editEmployeeForm.setValue({
      FirstName: toSetValues['First Name']?toSetValues['First Name']:"",
      LastName: toSetValues['Last Name']?toSetValues['Last Name']:"",
      UserName: toSetValues['User Name']?toSetValues['User Name']:"",
      Email: toSetValues['Email Id']?toSetValues['Email Id']:"",
      // Password: toSetValues['First name'],
      // ConfirmPassword: toSetValues['First name'],
      EmployeeID: toSetValues['Employee Id']?toSetValues['Employee Id']:"",
      JoinDate: toSetValues['Joined Date']?this.pipe.transform(toSetValues['Joined Date'],"dd-MM-yyyy"):"",
      PhoneNumber: toSetValues['Mobile Number']?toSetValues['Mobile Number']:"",
      // CompanyName: toSetValues.company,
      DepartmentName: toSetValues['Department']?toSetValues['Department']:"",
      Designation: toSetValues['Designation']?toSetValues['Designation']:"",
      Gender: toSetValues['Gender']?toSetValues['Gender']:"",
    });
  }

  // edit update data set
  public edit(value: any) {
    let data = this.lstEmployee.filter((client) => client.id === value);
    this.editEmployeeForm.setValue({
      FirstName: data[0]['First name'],
      LastName: data[0].lastname,
      UserName: data[0].username,
      Email: data[0].email,
      Password: data[0].password,
      ConfirmPassword: data[0].confirmpassword,
      EmployeeID: data[0].employeeId,
      JoinDate: data[0].joindate,
      PhoneNumber: data[0].phone,
      CompanyName: data[0].company,
      DepartmentName: data[0].department,
      Designation: data[0].designation,
      Id: data[0].id,
    });
  }

  // delete api call
  deleteEmployee() {
    this.srvModuleService.delete(this.tempId, this.url + "/removed-employee").subscribe((data) => {
      this.lstEmployee = [];
      this.loadEmployee();
      $("#delete_employee").modal("hide");
      this.toastr.success("Employee deleted sucessfully..!", "Success");
    }, (err: HttpErrorResponse) => {
      console.log(err);
    });
  }

  //search by name
  searchId(val) {
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.employeeId.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }

  //search by name
  searchName(val) {
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d['First name'].toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }

  //search by designation
  searchByDesignation(val) {
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.Department.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }

  //getting the status value
  getStatus(data) {
    this.statusValue = data;
  }

  // Get designation list  Api Call
  LoadDesignation() {
    this.srvModuleService.get('designation/designation-list').subscribe((data) => {
      console.log(data);
      this.dropdownMetaData = data.data;
      this.dropdownMetaData?.forEach(x => {
        this.dropDownDepartments.add(x.Department?.['Department name']);
      })
    }, (err: HttpErrorResponse) => {
      console.log(err);
    });
  }

  loadDesignationDropdown(event, department: string) {
    this.dropDownDesignations.clear();
    this.dropdownMetaData?.forEach(x => {
      if (x.Department?.['Department name'] == department) {
        this.dropDownDesignations.add(x.Designation);
      }
    })
  }

  checkPassword() {
    if (this.addEmployeeForm.value.Password == this.addEmployeeForm.value.ConfirmPassword) {
      return false;
    } else {
      this.addEmployeeForm.controls['ConfirmPassword'].setErrors({ 'incorrect': true });
      return true;
    };
  }

  randomPasswordToggle(event) {
    console.log(this.isRandomPassword);
    if (this.isRandomPassword) {
      this.addEmployeeForm.get("Password").clearValidators();
      this.addEmployeeForm.get("ConfirmPassword").clearValidators();
      this.addEmployeeForm.get("Password").reset();
      this.addEmployeeForm.get("ConfirmPassword").reset();
      this.addEmployeeForm.get("Password").updateValueAndValidity();
      this.addEmployeeForm.get("ConfirmPassword").updateValueAndValidity();
    } else {
      this.addEmployeeForm.get("Password").setValidators([Validators.required]);
      this.addEmployeeForm.get("ConfirmPassword").setValidators([Validators.required]);
      this.addEmployeeForm.get("Password").updateValueAndValidity();
      this.addEmployeeForm.get("ConfirmPassword").updateValueAndValidity();
    }
  }

  getRoleList(){
    this.srvModuleService.get('access/roles-list').subscribe((data) => {
      this.roleList = data.data;
      this.getUserRole();
    }, (err: HttpErrorResponse) => {
      console.log(err);
      this.toastr.error("Failed to load roles list", "Error");  
    })
  }

  getUserRole(){
    this.srvModuleService.get(`employee/user-role?id=${this.tempId}`).subscribe((data) => {
      let role = this.roleList.find(e => e.Role == data.data[0]?.Role && e.Level == data.data[0]?.Level);
      this.selectedRoleId = role?._id;
      console.log(this.selectedRoleId);
    }, (err: HttpErrorResponse) => {
      console.log(err);
      this.toastr.error("Failed to load user role", "Error");  
    })
  }

  saveUserRole(){
    let selectedRole = this.roleList.find(e=>e._id === this.selectedRoleId);
    let obj = {
      _id: this.tempId,
      Role: selectedRole['Role'],
      Level: selectedRole['Level']
    };
    console.log(obj);
    this.srvModuleService.add(obj, `employee/save-user-role`).subscribe((data: any) => {
      this.toastr.info("Role updated for user", "Info");
      this.tempId = "";
    }, (err: HttpErrorResponse) => {
      console.log(err);
      this.toastr.error("Failed to update user role", "Error");
    })
  }
}
