import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

declare var Peer: any;
import './peer.js';

@Injectable()
export class PeerService {
  //    public peerid: Subject<any> = new Subject();

  private peer: any;
  private peerconn: any;
  private isConnected: boolean;
  public peerid: BehaviorSubject<any> = new BehaviorSubject(undefined);
  public msg: BehaviorSubject<any> = new BehaviorSubject({});
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
        this.isConnected = true;
      });
      this.peer.on('disconnected', function () {
        this.isConnected = false;
      });
      this.peer.on('connection', (con: any) => {
        con.on('data', (data: any) => {
          console.log('Incoming data', data);
          this.msg.next(data);
        });
      });

    });
    promise.then((value) => { this.peerid.next(value); });

  }

  public send(id: string, message: any) {
    if (this.isConnected) {
      console.warn('message sent');
      this.peerconn.send(message);
    } else {
      console.warn('offline trying again on' + id);
      let promise = new Promise((resolve, reject) => {
        this.peerconn = this.peer.connect(id);
        resolve(id);
      });
      promise.then((value) => {
        this.isConnected = true;
        this.peerconn.send(message);
      });

    }
  }
  /*
    private connect(id: string, message: any) {
      this.peerconn = this.peer.connect(id);

      // Receive messages
      this.peerconn.on('open', (data: any) => {
        this.peerconn.send(message);
      });
    }
    */

}
