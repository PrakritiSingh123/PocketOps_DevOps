import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SharedDataService } from '../store/shared-data.service';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    public httpService: HttpClientService
  ) { }

  authenticate(userName: string, password: string) {
    let params = {
      "Username": userName,
      "Password": password
    };
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpService.postData(`${environment.baseUrl}/login`, headers, params).pipe(
      map( res => {
        sessionStorage.setItem('token', res.AuthToken);
        sessionStorage.setItem('refreshToken', res.RefreshToken);
        return res;
      })
    );
  }

  isLoggedIn(){
    // console.log(sessionStorage.getItem('token'), SharedDataService.LoggedinUser?.Username);
    if(sessionStorage.getItem('token')) return true;
    else return false;
  }
}
