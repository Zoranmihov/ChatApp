/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from '../services/userService';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200',
  },
})
export class LiveChat implements OnGatewayDisconnect {

  constructor(private userService:UserService){}

  activeUsers: any = {};
  @WebSocketServer()
  server: Server;

  handleDisconnect(client: Socket) {
    for (const key of Object.keys(this.activeUsers)) {
      if (this.activeUsers[key].id == client.id) {
        delete this.activeUsers[key];
      }
    }
  }

  @SubscribeMessage('activeUser')
  addUser(client: Socket, data: any) {
    if (data.email == undefined) {
      return;
    } else {
      if (!this.activeUsers[data.email]) {
        this.activeUsers[data.email] = {
          id: client.id,
        };
      }
    }
  }

  @SubscribeMessage('callUser')
  privateCall(@MessageBody() data: any) {
    try {
      const id = this.activeUsers[data.userToCall].id;
      this.server.to(id).emit('hey', { from: data.from });
    } catch (error) {
      console.log(error);
    }
  }

  @SubscribeMessage('answerCall')
  answerCall(@MessageBody() data: any) {
    try {
      const id = this.activeUsers[data.from].id;
      this.server.to(id).emit('callAccepted', { peerToCall: data.peerToCall });
    } catch (error) {
      console.log(error);
    }
  }

  @SubscribeMessage('rejectCall')
  rejectCall(@MessageBody() data: any) {
    try {
      const id = this.activeUsers[data.callerEmail].id;
      this.server
        .to(id)
        .emit('callRejected', { message: `${data.callerName} is busy` });
    } catch (error) {
      console.log(error);
    }
  }

  @SubscribeMessage('friendRequest')
 async friendRequest(@MessageBody() data: any) {
   const newData = await this.userService.request(data.email, data.name, data.senderEmail)
    try {
      const id = this.activeUsers[data.email].id;
      this.server
        .to(id)
        .emit('reciveRequest', {update: newData});
    } catch (error) {
      console.log(error);
    }
  }

  @SubscribeMessage('respondToRequest')
 async respondToRequest(@MessageBody() data: any) {
   const newData = await this.userService.respondTorequest(data.responseUser, data.requestUser, data.action)
    try {
      const id = this.activeUsers[data.email].id;
      this.server
        .to(id)
        .emit('reciveRequest', {update: newData});
    } catch (error) {
      console.log(error);
    }
  }

  getUsers() {
    return this.activeUsers;
  }
}
