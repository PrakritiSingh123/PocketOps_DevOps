import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SharedDataService } from 'src/app/store/shared-data.service';
import { AllModulesService } from '../../all-modules.service';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent implements OnInit {

  userFullName: string;
  todayDate: Date = new Date();
  userImage: string = "./assets/img/profiles/avatar-2.jpg";

  constructor(
    public srvModuleService: AllModulesService
  ) { }

  ngOnInit() {
    this.userFullName = SharedDataService.LoggedinUser.FirstName + " " + SharedDataService.LoggedinUser.LastName;
    this.getGeneralUserImage();
  }

  getGeneralUserImage(){
    let text = (SharedDataService.LoggedinUser.FirstName[0]+SharedDataService.LoggedinUser.LastName[0]).toUpperCase();
    this.srvModuleService.getGeneralImage(text).subscribe((data) => {
      typeof data.data == "string"? this.userImage = data.data:"";
    },(err: HttpErrorResponse) => {
      console.log(err);
    })
  }
}
