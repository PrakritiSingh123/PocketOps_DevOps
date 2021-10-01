import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { AllModulesService } from "../../all-modules.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { DatePipe } from "@angular/common";
import { DataTableDirective } from "angular-datatables";
import { ToastrService } from "ngx-toastr";
import { HttpErrorResponse } from "@angular/common/http";

declare const $: any;
@Component({
  selector: "app-clients-list",
  templateUrl: "./clients-list.component.html",
  styleUrls: ["./clients-list.component.css"],
})
export class ClientsListComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  public clientsData = [];
  public editedClient;
  public addClientForm: FormGroup;
  public editClientForm: FormGroup;
  public tempId: any;
  public companiesList = new Set();

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
    this.dtOptions = {
      // ... skipped ...
      pageLength: 10,
      dom: "lrtip",
    };
    this.getClients();

    //Add clients form
    this.addClientForm = this.formBuilder.group({
      "Company_Name": ["", [Validators.required]],
      "Client Id": ["", [Validators.required]],
      "Autorise_Person_Detail1": this.AuthorisedPersonDetailsForm(),
      "Autorise_Person_Detail2": this.AuthorisedPersonDetailsForm(),
    });

    //Edit Clients Form
    this.editClientForm = this.formBuilder.group({
      "_id": ["", [Validators.required]],
      "Company_Name": ["", [Validators.required]],
      "Client Id": ["", [Validators.required]],
      "Autorise_Person_Detail1": this.AuthorisedPersonDetailsForm(),
      "Autorise_Person_Detail2": this.AuthorisedPersonDetailsForm(),
    });
  }

  AuthorisedPersonDetailsForm(){
    return this.formBuilder.group({
      Name: ["", [Validators.required]],
      Desgination: ["", [Validators.required]],
      Contact: ["", [Validators.required]],
      "Email id": ["", [Validators.required]],
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dtTrigger.next();
    }, 1000);
  }

  // manually rendering Data table

  rerender(): void {
    $("#datatable").DataTable().clear();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
    });
    this.clientsData = [];
    this.getClients();
    setTimeout(() => {
      this.dtTrigger.next();
    }, 1000);
  }
  //Get all Clients data
  public getClients() {
    this.allModulesService.get("clients/client-list").subscribe((data) => {
      this.clientsData = data.data;
      this.clientsData?.map((client) => this.companiesList.add(client.Company_Name));
      this.rows = this.clientsData;
      this.srch = [...this.rows];
    }, (err: HttpErrorResponse)=>{
      console.log(err);
      this.toastr.error("Falied to load client list");
    });
  }

  // Edit client
  public onEditClient(clientId: any) {
    let client = this.clientsData.filter((client) => client._id === clientId);
    this.editClientForm.setValue({
      "Company_Name": client[0].Company_Name,
      "Client Id": client[0]["Client Id"],
      "Autorise_Person_Detail1": client[0]["Autorise Person Detail 1"],
      "Autorise_Person_Detail2": client[0]["Autorise Person Detail 2"],
      _id: client[0]._id,
    });
  }

  //Reset form
  public resetForm() {
    this.addClientForm.reset();
  }

  // Save Client
  public onSave() {
    this.editedClient = {
      Company_Name: this.editClientForm.value.Company_Name,
      "Client Id": this.editClientForm.value["Client Id"],
      "Autorise Person Detail 1": this.editClientForm.value.Autorise_Person_Detail1,
      "Autorise Person Detail 2": this.editClientForm.value.Autorise_Person_Detail2,
      "_id": this.editClientForm.value._id,
    };
    this.allModulesService
      .add(this.editedClient, "clients/update-client")
      .subscribe((data) => {
        this.getClients();
        this.editClientForm.reset();
        this.toastr.success("Client updated sucessfully...!", "Success");
        $("#datatable").DataTable().clear();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
        this.dtTrigger.next();
      }, (err: HttpErrorResponse)=>{
        console.log(err);
        this.toastr.success("Client is updated", "Success");
      });
    $("#edit_client").modal("hide");
  }

  //Add new client
  public onAddClient() {
    let newClient = {
      Company_Name: this.addClientForm.value.Company_Name,
      "Client Id": this.addClientForm.value["Client Id"],
      "Autorise Person Detail 1": this.addClientForm.value.Autorise_Person_Detail1,
      "Autorise Person Detail 2": this.addClientForm.value.Autorise_Person_Detail2,
    };
    this.allModulesService.add(newClient, "clients/add-client").subscribe((data) => {
      this.addClientForm.reset();
      this.toastr.success("Client added sucessfully...!", "Success");
      $("#datatable").DataTable().clear();
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
      this.dtTrigger.next();
      this.getClients();
    }, (err: HttpErrorResponse) => {
      console.log(err);
      this.toastr.error("Failed to add client", "Error");
    });
    $("#add_client").modal("hide");
  }

  //Delete Client
  onDelete() {
    this.allModulesService.delete(this.tempId, "clients/removed-Client").subscribe((data) => {
      this.toastr.success("Client deleted sucessfully...!", "Success");
      $("#datatable").DataTable().clear();
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
      this.dtTrigger.next();
      this.getClients();
    }, (err: HttpErrorResponse) => {
      this.toastr.error("Failed to delete client", "error");
      console.log(err);
    });
    $("#delete_client").modal("hide");
  }

  //search by name
  searchID(val) {
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d["Client Id"]?.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }

  //search by name
  searchName(val) {
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.Company_Name?.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }

  //search by company
  searchCompany(val) {
    if(!val) return;
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.Company_Name?.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }
  //getting the status value
  getStatus(data) {
    this.statusValue = data;
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
