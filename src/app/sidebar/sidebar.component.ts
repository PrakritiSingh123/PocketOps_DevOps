import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router, Event, NavigationEnd } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AllModulesService } from "../all-modules/all-modules.service";
import { IAccessMapping } from "../interfaces&types/interaces&types";
import { SharedDataService } from "../store/shared-data.service";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit {
  urlComplete = {
    mainUrl: "",
    subUrl: "",
    childUrl: "",
  };

  sidebarMenus = {
    default: true,
    chat: false,
    settings: false,
  };

  members = {};
  groups = {};
  role: string;
  level: string;
  userAccess: IAccessMapping;

  constructor(
    private router: Router,
    private allModulesService: AllModulesService,
    public toaster: ToastrService
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        $(".main-wrapper").removeClass('slide-nav');
        $(".sidebar-overlay").removeClass('opened');
        const url = event.url.split("/");
        this.urlComplete.mainUrl = url[1];
        this.urlComplete.subUrl = url[2];
        this.urlComplete.childUrl = url[3];
        if (url[1] === "") {
          this.urlComplete.mainUrl = "dashboard";
          this.urlComplete.subUrl = "admin";
        }

        if (url[2] === "chat" || url[2] === "calls") {
          this.sidebarMenus.chat = true;
          this.sidebarMenus.default = false;
        } else {
          this.sidebarMenus.chat = false;
          this.sidebarMenus.default = true;
        }
      }
    });

    this.groups = { ...this.allModulesService.groups };
    this.members = { ...this.allModulesService.members };
  }

  ngOnInit() {
    // Slide up and down of menus
    $(document).on("click", "#sidebar-menu a", function (e) {
      e.stopImmediatePropagation();
      if ($(this).parent().hasClass("submenu")) {
        e.preventDefault();
      }
      if (!$(this).hasClass("subdrop")) {
        $("ul", $(this).parents("ul:first")).slideUp(350);
        $("a", $(this).parents("ul:first")).removeClass("subdrop");
        $(this).next("ul").slideDown(350);
        $(this).addClass("subdrop");
      } else if ($(this).hasClass("subdrop")) {
        $(this).removeClass("subdrop");
        $(this).next("ul").slideUp(350);
      }
    });
    this.role = SharedDataService.LoggedinUser.Role;
    this.level = SharedDataService.LoggedinUser.Level;
    console.log(this.level);
    this.getAccess();
  }

  setActive(member) {
    this.allModulesService.members.active = member;
  }

  getAccess(){
    let url = `access/FindDataByRoleAndLevel?Role=${this.role}`;
    if (this.level) url = url + `&Level=${this.level}`;
    this.allModulesService.get(url).subscribe((data)=>{
      if(data.data.length == 0){
        this.router.navigateByUrl('/error/no-access');
      }
      SharedDataService.UserAccess = data.data[0];
      this.userAccess = data.data[0];
      console.log(this.userAccess, this.userAccess?.Tickets);
    }, (err: HttpErrorResponse) => {
      console.log(err);
      this.toaster.error("Failde to load access", "Error");
    })
  }

  showModule(moduleObj: {[key: string]: any}){
    for(let subModule in moduleObj){
      if(moduleObj[subModule].R){
        return true;
      }
    }
    return false;
  }
}
