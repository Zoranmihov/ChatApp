/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserServiceService } from '../services/user-service.service';
import { Socket } from 'ngx-socket-io';
import { PeerLogic } from './peerLogic';
import { ModalLogic } from './modalLogic';

@Component({
  selector: 'chat-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  presentUser: any = false;
  myPeerId: any;

  constructor(
    private user: UserServiceService,
    private socket: Socket,
    private peerLogic: PeerLogic,
    private modalLogic: ModalLogic
  ) {
    this.myPeerId = this.peerLogic.initPeer();
  }

  addFriend = new FormGroup({
    email: new FormControl(''),
  });

  // Calling states
  stream: any;
  recivingCall = false;
  inCall = false;
  callFrom: any;

  // Calling functions
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
    this.inCall = true;
    this.recivingCall = false;
    this.peerLogic.answerCall();
  }

  rejectCall() {
    this.socket.emit('rejectCall', {
      callerEmail: this.callFrom.email,
      callerName: this.callFrom.name,
    });
    this.recivingCall = false;
    this.callFrom = null;
  }

  endCall() {
    this.peerLogic.endCall();
    this.inCall = false;
  }

  sendFriendRequest(){
    this.socket.emit('friendRequest', {email: this.addFriend.get('email')?.value, name: this.presentUser.name, senderEmail: this.presentUser.email})
  }

  // Modal functions

  openFriendsModal() {
    const modal = document.querySelector('#friend-modal');
    this.modalLogic.openModal(modal);
  }

  closeFriendsModal(){
    const modal = document.querySelector('#friend-modal');
    this.modalLogic.closeModal(modal)
    this.addFriend.reset()
  }

  // Lifecycle hooks

  ngOnInit(): void {
    this.user.checkUser();
    this.user.presentUser.subscribe((user: any) => {
      this.socket.emit('activeUser', { email: user.email });
      this.presentUser = user;
    });
    this.socket.on('hey', (data: any) => {
      if (this.recivingCall || this.inCall) {
        this.socket.emit('rejectCall', {
          callerEmail: data.from.email,
          callerName: data.from.name,
        });
      } else {
        this.recivingCall = true;
        this.callFrom = data.from;
      }
    });

    this.socket.on('callAccepted', (data: any) => {
      this.peerLogic.callUser(data.peerToCall);
      this.inCall = true;
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
    this.peerLogic.destroyPeer();
  }
}
