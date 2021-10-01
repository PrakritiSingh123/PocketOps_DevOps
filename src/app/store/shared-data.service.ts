import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAccessMapping, ILoggedinUserData } from '../interfaces&types/interaces&types';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  public static LoggedinUser: ILoggedinUserData = JSON.parse(sessionStorage.getItem("UserInfo"));
  public static UserAccess: IAccessMapping;

  constructor() { }

  public static clearCachedData(){
    SharedDataService.UserAccess = undefined;
    SharedDataService.LoggedinUser = undefined;
  }

  getUserAccess(): Observable<IAccessMapping> {
    return new Observable((observer) => {
      setInterval(() => {
        observer.next(SharedDataService.UserAccess);
      }, 100)
    })
  }
}
