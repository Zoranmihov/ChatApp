/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { UserServiceService } from '../services/user-service.service';
import { Socket } from 'ngx-socket-io';
import { PeerLogic } from './peerLogic';

@Component({
  selector: 'chat-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  presentUser: any;
  myPeerId: any;

  constructor(
    private user: UserServiceService,
    private socket: Socket,
    private peerLogic: PeerLogic
  ) {
    this.myPeerId = this.peerLogic.initPeer();
  }

  // Calling states
  stream: any;
  recivingCall = false;
  inCall = false
  callFrom: any;

  callUser(email: string) {
    this.socket.emit('callUser', {
      userToCall: email,
      from: { name: this.presentUser.name, email: this.presentUser.email },
    });
  }

  answerCall() {
    this.socket.emit('answerCall', {
      from: this.callFrom.email,
      called: this.presentUser.email,
      peerToCall: this.myPeerId,
    });
    this.inCall = true
    this.peerLogic.answerCall();
  }

  rejectCall() {
    this.socket.emit('rejectCall', { callerEmail: this.callFrom.email, callerName: this.callFrom.name });
    this.recivingCall = false;
    this.callFrom = null;
  }

  endCall() {
    this.peerLogic.endCall()
    this.inCall = false
  }

  ngOnInit(): void {
    this.user.checkUser();
    this.user.presentUser.subscribe((user: any) => {
      this.socket.emit('activeUser', { email: user.email });
      this.presentUser = user;
    });
    this.socket.on('hey', (data: any) => {
      if (this.recivingCall) {
        this.socket.emit('rejectCall', { callerEmail: data.from.email, callerName: data.from.name });
      } else {
        this.recivingCall = true;
        this.callFrom = data.from;
      }
    });

    this.socket.on('callAccepted', (data: any) => {
      this.peerLogic.callUser(data.peerToCall);
      this.inCall = true
    });
    this.socket.on('callRejected', (data: any) => {
      const statusMessage: any = document.querySelector('#statusMessage');
      statusMessage.style.color = '#EA0404';
      statusMessage.innerHTML = data.message;
      setTimeout(() => {
        statusMessage.innerHTML = '';
      }, 5000);
    });
  }

  ngOnDestroy(): void {
      this.peerLogic.destroyPeer()
  }
}
