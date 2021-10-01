import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(
    public httpClient: HttpClient,
  ) { }

  getData(url: string, headers: HttpHeaders): Observable<any> {
    return this.httpClient.get(url, { headers: headers }).pipe(
      map((res: any) => res),
      catchError((err: any) => throwError(err))
    );
  }
  postData(url: string, headers: HttpHeaders, body: any): Observable<any> {
    return this.httpClient.post(url, body, { headers: headers }).pipe(
      map((res: any) => res),
      catchError((err: any) => throwError(err))
    );
  }
  putData(url: string, headers: HttpHeaders, body: any): Observable<any> {
    return this.httpClient.put(url, body, { headers: headers }).pipe(
      map((res: any) => res),
      catchError((err: any) => throwError(err))
    );
  }
  deleteData(url: string, headers: HttpHeaders): Observable<any> {
    return this.httpClient.delete(url, { headers: headers }).pipe(
      map((res: any) => res),
      catchError((err: any) => throwError(err))
    );
  }
}
