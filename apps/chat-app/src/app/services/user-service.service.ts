import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserServiceService {
  constructor(private http: HttpClient, private router: Router) {}
  // eslint-disable-next-line @typescript-eslint/ban-types
  private currentUser = new BehaviorSubject<Object>({});
  public presentUser = this.currentUser.asObservable()


  public initUser() {
    this.http
      .get('/api/user/profile', {
        withCredentials: true,
      }).subscribe((res: any) => {
        this.currentUser.next(res)
      }, err => {
        this.currentUser.next({});
      })
      return Promise.resolve()
    }

    checkUser(){
      this.http.get('/api/user/profile', {
        withCredentials: true,
      }).subscribe((res: any) => {
        return
      }, err => {
        this.router.navigate(['login'])
      })
    }
}
