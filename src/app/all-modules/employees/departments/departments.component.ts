import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AllModulesService } from "../../all-modules.service";
import { ToastrService } from "ngx-toastr";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
declare const $: any;
@Component({
  selector: "app-departments",
  templateUrl: "./departments.component.html",
  styleUrls: ["./departments.component.css"],
})
export class DepartmentsComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();
  public lstDepartment: any[];
  public url: any = "department";
  public tempId: any;
  public editId: any;
  public rows = [];
  public srch = [];
  public addDepartmentForm: FormGroup;
  public editDepartmentForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private srvModuleService: AllModulesService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.dtOptions = {
      // ... skipped ...
      pageLength: 10,
      dom: "lrtip",
    };
    this.LoadDepartment();

    this.addDepartmentForm = this.formBuilder.group({
      DepartmentName: ["", [Validators.required]],
    });

    this.editDepartmentForm = this.formBuilder.group({
      DepartmentName: ["", [Validators.required]],
    });
  }

  // Get department list  Api Call
  LoadDepartment() {
    this.srvModuleService.get(this.url+'/dept-list').subscribe((data: any) => {
      this.lstDepartment = data.data;
      this.dtTrigger.next();
      this.rows = this.lstDepartment;
      this.srch = [...this.rows];
    }, (err: HttpErrorResponse)=>{
      console.log(err);
    });
  }

  // Add Department  Modal Api Call
  addDepartment() {
    if (this.addDepartmentForm.valid) {
      let obj = {
        "Department name": this.addDepartmentForm.value.DepartmentName,
      };
      this.srvModuleService.add(obj, this.url+"/create-dept").subscribe((data) => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
        this.LoadDepartment();
        $("#add_department").modal("hide");
        this.addDepartmentForm.reset();
        this.toastr.success("Department added sucessfully...!", "Success");
        console.log(data);
      }, (err: HttpErrorResponse)=>{
        console.log(err);
      });
    }
  }

  editDepartment() {
    if (this.editDepartmentForm.valid) {
      let obj = {
        departmentName: this.editDepartmentForm.value.DepartmentName,
        id: this.editId,
      };
      this.srvModuleService.update(obj, this.url).subscribe((data1) => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
      });
      this.LoadDepartment();
      $("#edit_department").modal("hide");
      this.toastr.success("Department Updated sucessfully...!", "Success");
    }
  }

  // To Get The department Edit Id And Set Values To Edit Modal Form
  edit(value) {
    this.editId = value;
    const index = this.lstDepartment.findIndex((item) => {
      return item.id === value;
    });
    let toSetValues = this.lstDepartment[index];
    this.editDepartmentForm.setValue({
      DepartmentName: toSetValues.departmentName,
    });
  }


  deleteDepartment() {
    this.srvModuleService.delete(this.tempId, this.url+'/removed-dept').subscribe((data) => {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
      this.LoadDepartment();
      $("#delete_department").modal("hide");
      this.toastr.success("Department deleted sucessfully..!", "Success");
    }, (err: HttpErrorResponse)=>{
      console.log(err);
    });
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
