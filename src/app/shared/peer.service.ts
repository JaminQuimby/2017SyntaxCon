import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Rx';
declare var Peer: any;
import '../peerchat/peer.js';

@Injectable()
export class PeerService {
    //    public peerid: Subject<any> = new Subject();
    private peer: any;
    private peerconn: any;
    public peerid: EventEmitter<any> = new EventEmitter();
    constructor() {
    }

    public startPeer() {
        let promise = new Promise((resolve, reject) => {

            this.peer = new Peer({
                debug: 3,
                host: 'otg2017peerserver.herokuapp.com',
                port: 443
            });
            this.peer.on('open', function (id) {
                resolve(id);
            });

            this.peer.on('connection', function (con) {
                con.on('data', function (data) {
                    console.log('Incoming data', data);
                    con.send('REPLY');
                });
            });

        });
        promise.then((value) => { this.peerid.next(value); });

    }

    public getPeerId() {
        return this.peerid;
    }

    public connect(id) {
        this.peerconn = this.peer.connect(id);

        // Receive messages
        this.peerconn.on('open', (data) => {
            this.peerconn.send('test');
        });

    }

    public send(message) {

        this.peerconn.send('test');
    }

    private init() {
    }

}
