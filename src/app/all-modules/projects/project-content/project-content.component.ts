import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { AllModulesService } from "../../all-modules.service";
import { FormGroup, FormBuilder, Validators, NgForm } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { DatePipe } from "@angular/common";
import { DataTableDirective } from "angular-datatables";
import { HttpErrorResponse } from "@angular/common/http";

declare const $: any;
@Component({
  selector: "app-project-content",
  templateUrl: "./project-content.component.html",
  styleUrls: ["./project-content.component.css"],
})
export class ProjectContentComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public projects = [];
  public addProjectForm: FormGroup;
  public editProjectForm: FormGroup;
  public tempId: any;

  public rows = [];
  public srch = [];
  public statusValue;
  public dtTrigger: Subject<any> = new Subject();
  public pipe = new DatePipe("en-US");
  constructor(
    private allModulesService: AllModulesService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
    this.getProjects();
    //Add Projects form
    this.addProjectForm = this.formBuilder.group({
      projectName: ["", [Validators.required]],
      projectDescription: ["", [Validators.required]],
      projectStartDate: ["", [Validators.required]],
      projectEndDate: ["", [Validators.required]],
      projectPriority: ["", [Validators.required]],
      projectLeader: ["", [Validators.required]],
      addTeamMembers: ["", [Validators.required]],
      projectId: ["", [Validators.required]],
      id: ["", [Validators.required]],
    });

    //Edit Projects Form
    this.editProjectForm = this.formBuilder.group({
      editProjectName: ["", [Validators.required]],
      editProjectDescription: ["", [Validators.required]],
      editProjectStartDate: ["", [Validators.required]],
      editProjectEndDate: ["", [Validators.required]],
      editProjectPriority: ["", [Validators.required]],
      editaddTeamMembers: ["", [Validators.required]],
      editProjectId: ["", [Validators.required]],
      editId: ["", [Validators.required]],
    });
  }

  getProjects() {
    this.allModulesService.get("project/proj-list").subscribe((data) => {
      this.projects = data.data;
      this.dtTrigger.next();
      this.rows = this.projects;
      this.srch = [...this.rows];
    });
  }

  //Create New Project
  public addProject() {
    let StartDate = this.pipe.transform(
      this.addProjectForm.value.projectStartDate,
      "dd-MM-yyyy"
    );
    let EndDate = this.pipe.transform(
      this.addProjectForm.value.projectEndDate,
      "dd-MM-yyyy"
    );
    let newProject = {
      "_id": null,
      "Project Name": this.addProjectForm.value.projectName,
      "Start Date": this.addProjectForm.value.projectStartDate,
      "End Date": this.addProjectForm.value.projectEndDate ? this.addProjectForm.value.projectEndDate:'',
      "Rate": '',
      "Priority": this.addProjectForm.value.projectPriority,
      "Project Leader": this.addProjectForm.value.projectLeader,
      "Team Member": this.addProjectForm.value.addTeamMembers,
      "Description": this.addProjectForm.value.projectDescription,
      "Modified": "",
    }
    this.allModulesService.add(newProject, "project/create-project").subscribe((response)=>{
      this.toastr.success("Project added sucessfully...!", "Success");
      this.getProjects();
      this.addProjectForm.reset();
    },(err: HttpErrorResponse)=>{
      this.toastr.error("Failed to create project. please try again.");
    });
    $("#create_project").modal("hide");
  }

  //Edit project
  editProject(id: any) {
    this.tempId = id;
    const index = this.projects.findIndex((item) => {
      return item.id === id;
    });
    let toSetValues = this.projects[index];
    this.editProjectForm.setValue({
      editProjectName: toSetValues.name,
      editProjectDescription: toSetValues.description,
      editProjectEndDate: toSetValues.endDate,
      editProjectStartDate: toSetValues.startDate,
      editProjectPriority: toSetValues.priority,
      editaddTeamMembers: toSetValues.teamMember,
      editProjectId: toSetValues.projectId,
      editId: toSetValues.id,
    });
  }

  //Save Project
  public saveProject() {
    let StartDate = this.pipe.transform(
      this.editProjectForm.value.projectStartDate,
      "dd-MM-yyyy"
    );
    let EndDate = this.pipe.transform(
      this.editProjectForm.value.projectEndDate,
      "dd-MM-yyyy"
    );
    let editedProject = {
      name: this.editProjectForm.value.editProjectName,
      description: this.editProjectForm.value.editProjectDescription,
      endDate: EndDate,
      startDate: StartDate,
      priority: this.editProjectForm.value.editProjectPriority,
      teamMember: this.editProjectForm.value.editaddTeamMembers,
      projectId: this.editProjectForm.value.editProjectPriority,
      id: this.tempId,
    };
    this.allModulesService.update(editedProject, "projects").subscribe();
    this.getProjects();
    this.editProjectForm.reset();
    $("#edit_project").modal("hide");
    this.toastr.success("Project updated sucessfully...!", "Success");
  }

  //Delete project
  public deleteProject() {
    this.allModulesService.delete(this.tempId, "projects").subscribe();
    this.getProjects();
    $("#delete_project").modal("hide");
    this.toastr.success("Project deleted sucessfully...!", "Success");
  }

  //search by name
  searchName(val) {
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }

  //search by name
  searchByEmpname(val) {
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.teamMember.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }

  //search by purchase
  searchByDesignation(val) {
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.designation.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }

  // for unsubscribe datatable
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
