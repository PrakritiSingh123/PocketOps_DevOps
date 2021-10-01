import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AllModulesService } from "../../all-modules.service";
import { ToastrService } from "ngx-toastr";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
declare const $: any;
@Component({
  selector: "app-designation",
  templateUrl: "./designation.component.html",
  styleUrls: ["./designation.component.css"],
})
export class DesignationComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();
  lstDesignation: any[];
  lstDepartments: any[];
  url: any = "designation";
  public tempId: any;
  public editId: any;

  public rows = [];
  public srch = [];
  public addDesignationForm: FormGroup;
  public editDesignationForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private srvModuleService: AllModulesService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.dtOptions = {
      // ... skipped ...
      pageLength: 10,
      dom: "lrtip",
    };
    this.LoadDesignation();

    this.addDesignationForm = this.formBuilder.group({
      Designation: ["", [Validators.required]],
      DepartmentName: ["", [Validators.required]],
    });

    this.editDesignationForm = this.formBuilder.group({
      Designation: ["", [Validators.required]],
      DepartmentName: ["", [Validators.required]],
    });
  }

  // Get designation list  Api Call
  LoadDesignation() {
    this.srvModuleService.get(this.url + '/designation-list').subscribe((data) => {
      // console.log(data);
      this.lstDesignation = data.data;
      this.dtTrigger.next();
      this.rows = this.lstDesignation;
      this.srch = [...this.rows];
    }, (err: HttpErrorResponse) => {
      console.log(err);
    });
  }

  // Get departments list  Api Call
  LoadDepartmentsList() {
    this.srvModuleService.get('department/dept-list').subscribe((data) => {
      // console.log(data);
      this.lstDepartments = data.data;
    }, (err: HttpErrorResponse) => {
      console.log(err);
    });
  }

  // Add Designation  Modal Api Call
  addDesignation() {
    if (this.addDesignationForm.valid) {
      let obj = {
        Designation: this.addDesignationForm.value.Designation,
        Department: this.addDesignationForm.value.DepartmentName,
      };
      // console.log(obj)
      this.srvModuleService.add(obj, this.url + '/create-designation').subscribe((data) => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
        this.LoadDesignation();
        this.toastr.success("Desigantion added sucessfully...!", "Success");
      }, (err: HttpErrorResponse) => {
        console.log(err);
      });
      $("#add_designation").modal("hide");
      this.addDesignationForm.reset();
    }
  }

  editDesignation() {
    if (this.editDesignationForm.valid) {
      let obj = {
        Designation: this.editDesignationForm.value.Designation,
        Department: this.editDesignationForm.value.DepartmentName,
        _id: this.editId,
      };
      this.srvModuleService.add(obj, this.url + '/update-designation').subscribe((data1) => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
      });
      this.LoadDesignation();
      $("#edit_designation").modal("hide");
      this.toastr.success("Department Updated sucessfully...!", "Success");
    }
  }

  // To Get The timesheet Edit Id And Set Values To Edit Modal Form
  async edit(value) {
    this.editId = value;
    console.log(value);
    const index = this.lstDesignation.findIndex((item) => {
      return item._id === value;
    });
    let toSetValues = this.lstDesignation[index];
    this.LoadDepartmentsList();
    // setTimeout(() => {
      this.editDesignationForm.setValue({
        Designation: toSetValues.Designation,
        DepartmentName: toSetValues.Department,
      });
    // },1000);
  }

  // Delete timedsheet Modal Api Call

  deleteDesignation() {
    this.srvModuleService.delete(this.tempId, this.url+'/removed-designation').subscribe((data) => {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.LoadDesignation();
        $("#delete_designation").modal("hide");
        this.toastr.success("Designation deleted sucessfully..!", "Success");
      });
    });
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
