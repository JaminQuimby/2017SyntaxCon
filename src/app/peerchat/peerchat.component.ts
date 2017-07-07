import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SkyModalService, SkyModalCloseArgs } from '@blackbaud/skyux/dist/core';
import * as toolbox from 'sw-toolbox';
declare var Peer: any;
import './peer.js';

@Component({
  selector: 'my-chat',
  templateUrl: './peerchat.component.html'
})

export class ChatComponent implements OnInit {
  @ViewChild('myvideo') myVideo: any;
  public tasks: FirebaseListObservable<any>;
  public nItems: Array<any> = [];
  private user: Object;
  public peer;
  public anotherid;
  public mypeerid;
  public items: Observable<Array<any>> = Observable.of([
    { id: '1', column1: 101, column2: 'Apple', column3: 'Anne eats apples' },
    { id: '2', column1: 202, column2: 'Banana', column3: 'Ben eats bananas' },
    { id: '3', column1: 303, column2: 'Pear', column3: 'Patty eats pears' },
    { id: '4', column1: 404, column2: 'Grape', column3: 'George eats grapes' },
    { id: '5', column1: 505, column2: 'Banana', column3: 'Becky eats bananas' },
    { id: '6', column1: 606, column2: 'Lemon', column3: 'Larry eats lemons' },
    { id: '7', column1: 707, column2: 'Strawberry', column3: 'Sally eats strawberries' }
  ]);
  constructor(
    private db: AngularFireDatabase,
    private modal: SkyModalService) {
  }
  ngOnInit() {
    let video = this.myVideo.nativeElement;
    this.peer = new Peer({ key: 'bvlix0oij17tlnmi', secure: true, debug: 3});
    setTimeout(() => {
      this.mypeerid = this.peer.id;
    }, 3000);

    this.peer.on('connection', function (conn) {
      conn.on('data', function (data) {
        console.log(data);
      });
    });

    var n = <any>navigator;

    n.getUserMedia = (n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia);

    this.peer.on('call', function (call) {

      n.getUserMedia({ video: true, audio: true }, function (stream) {
        call.answer(stream);
        call.on('stream', function (remotestream) {
          video.src = URL.createObjectURL(remotestream);
          video.play();
        })
      }, function (err) {
        console.log('Failed to get stream', err);
      })
    })
  }

  connect() {
    var conn = this.peer.connect(this.anotherid);
    conn.on('open', function () {
      conn.send('Message from that id');
    });
  }

  videoconnect() {
    let video = this.myVideo.nativeElement;
    var localvar = this.peer;
    var fname = this.anotherid;

    var n = <any>navigator;

    n.getUserMedia = (n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia);

    n.getUserMedia({ video: true, audio: true }, function (stream) {
      var call = localvar.call(fname, stream);
      call.on('stream', function (remotestream) {
        video.src = URL.createObjectURL(remotestream);
        video.play();
      })
    }, function (err) {
      console.log('Failed to get stream', err);
    })
  }
}
