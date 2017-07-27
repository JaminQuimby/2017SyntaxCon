import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

declare var Peer: any;
import './peer.js';

@Injectable()
export class PeerService {
  //    public peerid: Subject<any> = new Subject();
  private peer: any;
  private peerconn: any;
  public peerid: BehaviorSubject<any> = new BehaviorSubject(undefined);
  constructor() {

  }

  public startPeer() {
    let promise = new Promise((resolve, reject) => {

      this.peer = new Peer({
        debug: 3,
        host: 'otg2017peerserver.herokuapp.com',
        port: 443
      });
      this.peer.on('open', function (id: string) {
        resolve(id);
      });

      this.peer.on('connection', function (con: any) {
        con.on('data', function (data: any) {
          console.log('Incoming data', data);
          con.send('REPLY');
        });
      });

    });
    promise.then((value) => { this.peerid.next(value); });

  }

  public connect(id: string) {
    this.peerconn = this.peer.connect(id);

    // Receive messages
    this.peerconn.on('open', (data: any) => {
      this.peerconn.send('test');
    });

  }

  public send(message: any) {

    this.peerconn.send('test');
  }

}
