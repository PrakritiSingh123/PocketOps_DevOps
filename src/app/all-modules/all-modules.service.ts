import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { throwError, Observable } from "rxjs";
import { tap, catchError, map } from "rxjs/operators";
import { AllModulesData } from "src/assets/all-modules-data/all-modules-data";
import { id } from "src/assets/all-modules-data/id";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class AllModulesService {
  // Chats

  groups = {
    active: "",
    total: ["general", "video responsive survey", "500rs", "warehouse"],
  };
  members = {
    active: "Mike Litorus",
    total: [
      { name: "John Doe", count: 3 },
      { name: "Richard Miles", count: 0 },
      { name: "John Smith", count: 7 },
      { name: "Mike Litorus", count: 9 },
    ],
  };

  // Api Methods for All modules

  public apiurl;

  // Headers Setup
  headers = {
    headers: {
      "Accept": "application/json",
      "authorization": sessionStorage.getItem("token")||''
    }
  };

  tempHeader = {
    headers: { "authorization": sessionStorage.getItem("temp") }
  }

  constructor(private http: HttpClient) { }

  // Handling Errors
  private handleError(error: any) {
    return throwError(error);
  }

  // Get Method Api
  get(type): Observable<any> {
    // this.headers.headers["authorization"] = "";
    this.apiurl = `${environment.baseUrl}/${type}`;
    console.log(this.apiurl);
    return this.http
      .get(this.apiurl, this.headers)
      .pipe(
        map((res: any) => res),
        catchError((err: any) => throwError(err))
      );
  }

  // Post Method Api
  add(user: any, type): Observable<any> {
    // this.headers.headers["authorization"] = "";
    this.apiurl = `${environment.baseUrl}/${type}`;
    return this.http
      .post(this.apiurl, user, this.headers)
      .pipe(
        map((res: any) => res),
        catchError((err: any) => throwError(err))
      );
  }

  // Update Method Api
  update(user: any, type): Observable<any> {
    // this.headers.headers["authorization"] = "";
    this.apiurl = `${environment.baseUrl}/${type}`;
    const url = `${this.apiurl}/${user.id}`;
    return this.http.put<any>(url, user, this.headers).pipe(
      map((res: any) => res),
      catchError((err: any) => throwError(err))
    );
  }

  // Delete Method Api
  delete(id: string | string[], type): Observable<id> {
    // this.headers.headers["authorization"] = "";
    this.apiurl = `${environment.baseUrl}/${type}`;
    const url = `${this.apiurl}?id=${id}`;
    return this.http
      .delete<id>(url, this.headers)
      .pipe(
        map((res: any) => res),
        catchError((err: any) => throwError(err))
      );
  }

  // password reset
  resetPwd(user: any, type): Observable<any> {
    this.tempHeader = {
      headers: { "authorization": sessionStorage.getItem("temp") }
    }
    this.apiurl = `${environment.baseUrl}/${type}`;
    return this.http
      .post(this.apiurl, user, this.tempHeader)
      .pipe(
        map((res: any) => res),
        catchError((err: any) => throwError(err))
      );
  }

  getGeneralImage(text: string): Observable<any> {
    this.headers.headers["authorization"] = "";
    this.apiurl = `${environment.baseUrl}/generate-image?text=${text}`;
    console.log(this.apiurl)
    return this.http
      .get(this.apiurl, this.headers)
      .pipe(
        map((res: any) => res),
        catchError((err: any) => throwError(err))
      );
  }
}
