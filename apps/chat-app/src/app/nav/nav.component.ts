import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../services/user-service.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'chat-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  constructor(private user: UserServiceService, private socket: Socket){}
  statement!: boolean;
  loaded = false;
  presentUser: any

  openModal(){
    const modal:any = document.querySelector('#requests-modal')
    modal.style.display = 'flex'
  }

  closeModal(){
    const modal:any = document.querySelector('#requests-modal')
    modal.style.display = 'none'
  }

  respondToRequest(fromEmail: string, status:string){
    this.socket.emit('respondToRequest', {responseUser: this.presentUser.email, requestUser: fromEmail, action: status})

  }

  ngOnInit(): void {
    this.user.presentUser.subscribe((user: any) => {
      if(user.name) {
        this.presentUser = user
        this.statement = true

      } else {
        this.statement = false
      }
      this.loaded = true
    this.socket.on('reciveRequest', (data: any) => {
      this.presentUser.requests = data.update
    });
    })
  }

}
