import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'chat-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {

  constructor(private http: HttpClient,
    private router: Router,){}

  registerForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl('', [
      Validators.pattern(
        // eslint-disable-next-line no-useless-escape
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ),
    ]),
    password: new FormControl('', [
      Validators.pattern(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/
      ),
    ]),
  });

  @ViewChild('resError') resError!: ElementRef;

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  register = () => {
    this.http.post('/api/user/create-user', this.registerForm.getRawValue()).subscribe(
      (res) => {
        this.router.navigate(['login']);
      },
      (err) => {
        this.resError.nativeElement.innerHTML = err.error.message;
        this.registerForm.reset();
      }
    );
  };

  ngOnInit(): void {
    console.log('')
  }
}
