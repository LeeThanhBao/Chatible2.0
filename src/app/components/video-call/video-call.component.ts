
import { Component, Inject, OnInit } from '@angular/core';
import { CallService } from 'src/app/services/call.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import Peer from 'peerjs';
@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.scss']
})
export class VideoCallComponent implements OnInit {
  peer!: Peer;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { remoteId: string },
    public callService: CallService
  ) {}

  ngOnInit(): void {
    const idLocalVideo = <HTMLVideoElement>(
      document.getElementById('localStream')
    );
    const idRemoteVideo = <HTMLVideoElement>(
      document.getElementById('remotestream')
    );
    this.callService.openStream().then((stream) => {
      this.callService.playStream(idLocalVideo, stream);
      const call = this.peer.call(this.data.remoteId, stream);
      call.on('stream', (remoteStream) =>
        this.callService.playStream(idRemoteVideo, remoteStream)
      );
    });
  }

}
