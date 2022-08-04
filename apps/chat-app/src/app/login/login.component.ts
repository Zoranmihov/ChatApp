import { Component, ViewChild, ElementRef } from '@angular/core';
import { UserServiceService } from '../services/user-service.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'chat-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(
    private http: HttpClient,
    private router: Router,
    private user: UserServiceService
  ) {}

  loginForm = new FormGroup({
    email: new FormControl(
      '',
      Validators.pattern(
        // eslint-disable-next-line no-useless-escape
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ),
    password: new FormControl(''),
  });

  @ViewChild('resError') resError!: ElementRef;

  get email() {
    return this.loginForm.get('email');
  }

  login = () => {
    this.http
      .post('/api/user/login', this.loginForm.getRawValue(), {
        withCredentials: true,
      }).subscribe(
        (res: any) => {
          console.log('Works')
          setTimeout(() => {
            this.router.navigate(['dashboard'])
          }, 400);
        },
        (err) => {
          if (err.error.message == 'Unauthorized') {
            this.resError.nativeElement.innerHTML = 'Invalid credentials';
            this.loginForm.reset();
          } else {
            console.log(err);
          }
        }
      );
  };
}
