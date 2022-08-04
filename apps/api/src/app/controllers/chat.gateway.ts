/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200',
  },
})
export class LiveChat implements OnGatewayDisconnect {
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
      console.log(error)
    }
  }

  @SubscribeMessage('answerCall')
  answerCall(@MessageBody() data: any) {
    const id = this.activeUsers[data.from].id;
    this.server.to(id).emit('callAccepted', {peerToCall: data.peerToCall});
  }

  @SubscribeMessage('rejectCall')
  rejectCall(@MessageBody() data: any) {
    console.log(data);
    const id = this.activeUsers[data.callerEmail].id;
    this.server.to(id).emit('callRejected', {message: `${data.callerName} is busy`});
  }

  getUsers() {
    return this.activeUsers;
  }
}
