import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, HostListener, NgZone } from "@angular/core";
import { NavigationEnd, Event, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { IAccessMapping } from "src/app/interfaces&types/interaces&types";
import { SharedDataService } from "src/app/store/shared-data.service";
import { AllModulesService } from "../all-modules.service";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.css"],
})
@HostListener("window: resize", ["$event"])
export class SettingsComponent implements OnInit {
  public innerHeight: any;
  public urlComplete = {
    mainUrl: "",
    subUrl: "",
    childUrl: "",
  };
  role: string;
  level: string;
  userAccess: IAccessMapping;
  getScreenHeight() {
    this.innerHeight = window.innerHeight + "px";
  }

  constructor(
    private ngZone: NgZone, 
    private router: Router,
    private allModulesService: AllModulesService,
    public toaster: ToastrService,
    public sharedDataService: SharedDataService,
    ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        const url = event.url.split("/");
        this.urlComplete.mainUrl = url[1];
        this.urlComplete.subUrl = url[2];
        this.urlComplete.childUrl = url[3];
      }
    });
    window.onresize = (e) => {
      this.ngZone.run(() => {
        this.innerHeight = window.innerHeight + "px";
      });
    };
    this.getScreenHeight();
  }

  ngOnInit() {
    this.sharedDataService.getUserAccess().subscribe((data: IAccessMapping) => {
      this.userAccess = data;
    })
  }

  onResize(event) {
    this.innerHeight = event.target.innerHeight + "px";
  }
}
