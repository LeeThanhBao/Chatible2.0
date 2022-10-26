import { Injectable } from '@angular/core';
import io, { Socket } from 'socket.io-client';
export interface User {
  userId: string;
  name: string;
  sex?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CallService {
  public socket!: Socket;
  constructor() {}
  public openStream() {
    const config = { audio: false, video: true };
    return navigator.mediaDevices.getUserMedia(config);
  }
  public playStream(idVideoTag: any, stream: any) {
    const video = idVideoTag;
    video.srcObject = stream;
    video.play();
  }

  public caller(id: any) {
    const remoteId = id;
    this.openStream().then((stream) => {});
  }
}
