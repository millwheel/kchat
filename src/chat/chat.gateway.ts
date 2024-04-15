import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ namespace: 'chat', cors: { origin: '*' } })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatGateway');

  afterInit() {
    this.logger.log('웹소켓 서버 초기화 ✅');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client Connected : ${client.id} ${client.nsp.name}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client Disconnected : ${client.id} ${client.nsp.name}`);
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ): void {
    this.logger.log(`Client Message: ${message} Client ID: ${client.id}`);
    this.server.emit('receive', { message, clientId: client.id });
  }
}
