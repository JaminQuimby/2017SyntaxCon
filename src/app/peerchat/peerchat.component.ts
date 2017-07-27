import { Component, OnInit, ViewChild } from '@angular/core';
import {  FirebaseListObservable } from 'angularfire2/database';

// import * as toolbox from 'sw-toolbox';
declare var Peer: any;
import '../shared/peer.js';

@Component({
  selector: 'my-chat',
  templateUrl: './peerchat.component.html'
})

export class ChatComponent implements OnInit {
  @ViewChild('myvideo')
  public myVideo: any;
  public tasks: FirebaseListObservable<any>;
  public nItems: Array<any> = [];
  // private user: Object;
  public peer: any;
  public anotherid: string;
  public mypeerid: string;

  constructor(
    // private db: AngularFireDatabase,
    //  private modal: SkyModalService
  ) {
  }
  public ngOnInit() {
    let video = this.myVideo.nativeElement;
    this.peer = new Peer({
      debug: 3,
      host: 'otg2017peerserver.herokuapp.com',
      port: 443
    });
    setTimeout(() => {
      this.mypeerid = this.peer.id;
    }, 3000);

    this.peer.on('connection', function (conn: any) {
      conn.on('data', function (data: any) {
        console.log(data);
      });
    });

    let n = <any>navigator;

    n.getUserMedia = (
      n.getUserMedia ||
      n.webkitGetUserMedia ||
      n.mozGetUserMedia ||
      n.msGetUserMedia);

    this.peer.on('call', function (call: any) {

      n.getUserMedia({ video: true, audio: true }, function (stream: any) {
        call.answer(stream);
        call.on('stream', function (remotestream: any) {
          video.src = URL.createObjectURL(remotestream);
          video.play();
        });
      }, function (err: any) {
        console.log('Failed to get stream', err);
      });
    });
  }

  public connect() {
    let conn = this.peer.connect(this.anotherid);
    conn.on('open', function () {
      conn.send('Message from that id');
    });
  }

  public videoconnect() {
    let video = this.myVideo.nativeElement;
    let localvar = this.peer;
    let fname = this.anotherid;

    let n = <any>navigator;

    n.getUserMedia = (
      n.getUserMedia ||
      n.webkitGetUserMedia ||
      n.mozGetUserMedia ||
      n.msGetUserMedia
    );

    n.getUserMedia({ video: true, audio: true }, function (stream: any) {
      let call = localvar.call(fname, stream);
      call.on('stream', function (remotestream: any) {
        video.src = URL.createObjectURL(remotestream);
        video.play();
      });
    }, function (err: any) {
      console.log('Failed to get stream', err);
    });
  }
}
