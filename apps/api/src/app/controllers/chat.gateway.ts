import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway({namespace: 'Chat'})
export class LiveChat {
  @WebSocketServer()
  server;

  @SubscribeMessage('message')
  testExample(@MessageBody() message: string){
    console.log(message)
    this.server.emit("message", message);
  }
}
