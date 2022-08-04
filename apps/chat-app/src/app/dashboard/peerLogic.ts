/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import Peer from 'peerjs';

@Injectable({
  providedIn: 'root',
})
export class PeerLogic {
  peer: any;
  myStream: any
  friendStream: any

  public initPeer() {
    const id = uuidv4();
    this.peer = new Peer(id, {
      host: 'localhost',
      port: 9000,
      path: '/myapp',
    });
    return id;
  }

 public async callUser(id: string) {
    try {
      const connection = this.peer.connect(id);
      connection.on('error', (err: any) => {
        console.error(err);
      });
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      this.myStream = stream
      const myVideo: any = document.querySelector('#myVideo');
      myVideo.srcObject = stream;
      const call = this.peer.call(id, stream);
      call.on('stream', (remoteStream: any) => {
        this.friendStream = remoteStream
        const userVideo: any = document.querySelector('#user-video');
        userVideo.srcObject = remoteStream;
        call.on('close', () => {this.endCall()})
      });
    } catch (error) {
      console.log(error);
    }
  }

 public answerCall() {
    try {
      this.peer.on('call', async (call: any) => {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        this.myStream = stream
        const myVideo: any = document.querySelector('#myVideo');
        myVideo.srcObject = stream;
        call.answer(stream);
        call.on('stream', (remoteStream: any) => {
          this.friendStream = remoteStream
          const userVideo: any = document.querySelector('#user-video');
          userVideo.srcObject = remoteStream;
        });
        call.on('close', () => {this.endCall()})
      });
    } catch (error) {
      console.log(error);
    }
  }

 public endCall(){
    this.myStream?.valuegetTracks().forEach((track: any) => {
      track.stop();
  });
  this.friendStream?.valuegetTracks().forEach((track: any) => {
    track.stop();
});
  }

  public destroyPeer() {
    this.peer?.disconnect();
    this.peer?.destroy();
}
}
