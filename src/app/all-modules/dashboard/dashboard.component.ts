import { Component, OnInit, HostListener, NgZone } from "@angular/core";
import { Router, Event, NavigationEnd } from "@angular/router";
import { SharedDataService } from "src/app/store/shared-data.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
@HostListener("window: resize", ["$event"])
export class DashboardComponent implements OnInit {
  public innerHeight: any;

  getScreenHeight() {
    this.innerHeight = window.innerHeight + "px";
  }

  constructor(private ngZone: NgZone, private router: Router) {
    window.onresize = (e) => {
      this.ngZone.run(() => {
        this.innerHeight = window.innerHeight + "px";
      });
    };
    this.getScreenHeight();
  }

  ngOnInit() {
    if(SharedDataService.LoggedinUser.Role.toLowerCase() == "admin") this.router.navigateByUrl("/dashboard/admin");
    else this.router.navigateByUrl("/dashboard/employee");
  }

  onResize(event) {
    this.innerHeight = event.target.innerHeight + "px";
  }
}
