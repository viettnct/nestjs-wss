import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  /**
   * On initial
   * @param server
   */
  afterInit(server) {
    this.logger.log('Init');
  }

  /**
   * On client disconnected
   * @param client
   */
  handleDisconnect(client) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /**
   * On client connected
   * @param client
   * @param args
   */
  handleConnection(client, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  /**
   * Subscribe client
   * @param client
   * @param payload
   */
  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: { room: string, data: string}): void {
    client.broadcast.to(payload.room).emit('msgToClient', payload);
  }

  /**
   * Join to room share data
   * @param client
   * @param room
   */
  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
    this.logger.log(`Client ${client.id} join to ${room}`);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string) {
    client.leave(room);
    this.logger.log(`Client ${client.id} leave ${room}`);
  }
}
