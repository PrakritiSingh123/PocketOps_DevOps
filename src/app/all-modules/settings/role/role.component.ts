import { Component, OnInit } from "@angular/core";
import { AllModulesService } from "../../all-modules.service";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { HttpErrorResponse } from "@angular/common/http";
import { AccessMapping, ITreeTableData, RoleDataFormatter } from "./role-data-formater";
import { IAccessMapping } from "src/app/interfaces&types/interaces&types";

declare const $: any;
@Component({
  selector: "app-role",
  templateUrl: "./role.component.html",
  styleUrls: ["./role.component.css"],
})
export class RoleComponent implements OnInit {
  public url: any = "roles";
  public allroles: {Role: string, Level: string, _id?: string, AccessList: ITreeTableData[]}[] = [];
  public addRoles: FormGroup;
  public editRoles: FormGroup;
  public editId: any;
  public tempId: any;
  public roleMappingData: IAccessMapping[];
  public selectedRoleId;
  public saveMapping: boolean;

  constructor(
    private allModuleService: AllModulesService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getRoles();

    // Add Provident Form Validation And Getting Values

    this.addRoles = this.formBuilder.group({
      addRoleName: ["", [Validators.required]],
      addRoleLevel: ["", [Validators.required]],
    });

    // Edit Provident Form Validation And Getting Values

    this.editRoles = this.formBuilder.group({
      editRoleName: ["", [Validators.required]],
      editRoleLevel: ["", [Validators.required]],
    });
    console.log(new RoleDataFormatter().newRole().then(data => console.log(data)));
  }

  getRoles() {
    this.allModuleService.get("access/mapping-list").subscribe(async (data) => {
      console.log(data);
      this.roleMappingData = data.data;
      this.allroles = [];
      this.roleMappingData.forEach(async x => {
        this.allroles.push({
          AccessList: await new RoleDataFormatter().rawDataToTreeTable(x),
          Level: x.Level,
          Role: x.Role,
          _id: x._id
        });
      })
      console.log(await new RoleDataFormatter().rawDataToTreeTable(data.data[0]));
    }, (err: HttpErrorResponse) => {
      console.log(err);
      this.toastr.error("Failed to get asses list", "Error");
    });
  }

  // Add Provident Modal Api Call

  addRolesSubmit() {
    if (this.addRoles.valid) {
      let obj = new AccessMapping();
      obj.Role = this.addRoles.value.addRoleName?.charAt(0).toUpperCase() + this.addRoles.value.addRoleName?.slice(1);
      obj.Level = this.addRoles.value.addRoleLevel?.charAt(0).toUpperCase() + this.addRoles.value.addRoleLevel?.slice(1);
      console.log(obj);
      this.allModuleService.add(obj, "access/create-Mapping").subscribe((data) => {
        this.toastr.info("Role added", "Success");
        this.addRoles.reset();
        this.getRoles();
      }, (err: HttpErrorResponse) => {
        console.log(err);
        this.toastr.error("Failed to add new role. Please try again.", "Error");
      });
      $("#add_role").modal("hide");
    }
  }

  // Edit Provident Modal Api Call

  async editRolesSubmit(event?: any) {
    // let obj = { Role: this.editRoles.value.editRoleName, _id: this.editId };
    let role = this.allroles.find(x=> x._id == this.selectedRoleId);
    let accessObj = await new RoleDataFormatter().treeTableToRawData(role);
    accessObj.Role = this.editRoles.value.editRoleName?.charAt(0).toUpperCase() + this.editRoles.value.editRoleName?.slice(1);
    accessObj.Level = this.editRoles.value.editRoleLevel.charAt(0).toUpperCase() + this.editRoles.value.editRoleLevel?.slice(1);
    accessObj._id = this.selectedRoleId;
    console.log(accessObj);
    this.allModuleService.add(accessObj, "access/update-Mapping").subscribe((data1) => {
      this.toastr.success("Roles is updated", "Success");
      this.getRoles();
    }, (err: HttpErrorResponse)=>{
      console.log(err);
      this.toastr.error("Failed to update role/access mapping", "Error");
    });
    $("#edit_role").modal("hide");
  }

  edit(value) {
    this.editId = value;
    const index = this.allroles.findIndex((item) => {
      return item._id === value;
    });
    let toSetValues = this.allroles[index];
    this.selectedRoleId = toSetValues._id;
    this.editRoles.setValue({
      editRoleName: toSetValues.Role,
      editRoleLevel: toSetValues.Level
    });
  }

  // Delete Provident Modal Api Call

  deleteRoles() {
    this.allModuleService.delete(this.tempId, "access/removed-mapping").subscribe((data) => {
      this.getRoles();
      $("#delete_role").modal("hide");
      this.toastr.success("Roles is deleted", "Success");
    },(err: HttpErrorResponse)=>{
      console.log(err);
      this.toastr.error("Failed to delete role", "Error");
    });
  }

  checkIfHasSubModule(data: any) {
    if(data.hasOwnProperty('R')){
      return false;
    } else return true;
  }

  selectedRole(_id: string) {
    return this.allroles.find(role => role._id === _id);
  }

  async onChange(event){
    // console.log(await new RoleDataFormatter().treeTableToRawData(this.allroles[0]));
    this.saveMapping = true;
    let role = this.allroles.find(x=> x._id == this.selectedRoleId);
    if(role){
      this.editRoles.patchValue({
        editRoleName: role.Role,
        editRoleLevel: role.Level,
      })
    }
  }
}
