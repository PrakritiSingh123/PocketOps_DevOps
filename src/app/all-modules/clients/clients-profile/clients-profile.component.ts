import { Component, OnInit } from '@angular/core';
import { AllModulesService } from '../../all-modules.service';
import { ActivatedRoute } from '@angular/router';
import { map, mergeMap } from 'rxjs/operators';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';

@Component({
  selector: 'app-clients-profile',
  templateUrl: './clients-profile.component.html',
  styleUrls: ['./clients-profile.component.css']
})
export class ClientsProfileComponent implements OnInit {
  public allClients = [];
  public client = null;
  public clientId;
  
  constructor(
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    public activatedRoute: ActivatedRoute,
    private srvModuleService: AllModulesService,
  ) { }

    

  async ngOnInit() {
    await this.activatedRoute.queryParams.subscribe(async (q) => {
      this.clientId = q._id;
      await this.loadClientProfile();
    });
  }

  loadClientProfile() {
    this.srvModuleService.get("clients/FindClientById?id="+this.clientId).subscribe((client) => {
      console.log(client);
      this.client = client.data[0];
    },(err: HttpErrorResponse)=>{
      this.toastr.error("Failed to load client profile", "Error");
    })
  }

  loadProjects(){
    this.srvModuleService.get("clients/FindClientById?id="+this.clientId).subscribe((client) => {
      console.log(client);
      // this.client = client.data[0];
    },(err: HttpErrorResponse)=>{
      this.toastr.error("Failed to load client projects", "Error");
    })
  }

}
