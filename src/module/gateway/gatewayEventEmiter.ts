import { Injectable } from '@nestjs/common';

type EmitFn = (room: string, event: string, payload: any) => void;

@Injectable()
export class GatewayEventService {
  private emitter?: EmitFn;

  registerEmitter(emitter: EmitFn) {
    this.emitter = emitter;
  }

  emitToUser(room: string, event: string, payload: any) {
    if (!this.emitter) return;
    this.emitter(room, event, payload);
  }
}
