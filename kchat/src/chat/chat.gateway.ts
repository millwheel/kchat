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
    this.logger.log('WebSocket Server Initialized ✅');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client Connected : ${client.id} ${client.nsp.name}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client Disconnected : ${client.id} ${client.nsp.name}`);
    client.rooms.forEach((room) => {
      if (room !== client.id) {
        client.leave(room);
      }
    });
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ): void {
    client.join(room);
    this.logger.log(`Client ${client.id} joined room ${room}`);
    this.server
      .to(room)
      .emit('roomNotification', `User ${client.id} has joined the room.`);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ): void {
    client.leave(room);
    this.logger.log(`Client ${client.id} left room ${room}`);
    this.server
      .to(room)
      .emit('roomNotification', `User ${client.id} has left the room.`);
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: { room: string; message: string },
    @ConnectedSocket() client: Socket,
  ): void {
    this.logger.log(
      `Client Message: ${data.message} from Client ID: ${client.id} to Room: ${data.room}`,
    );
    this.server
      .to(data.room)
      .emit('receive', { message: data.message, clientId: client.id });
  }
}
