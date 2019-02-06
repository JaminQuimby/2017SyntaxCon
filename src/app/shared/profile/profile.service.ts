import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AuthService } from '../auth/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { UserModel } from '../user/user.model';

@Injectable()
export class ProfileService {
  public user$: BehaviorSubject<UserModel> = new BehaviorSubject(new UserModel());

  constructor(
    private authService: AuthService
    // ,
   // private db: AngularFirestore
  ) {
    this.authService.user$.subscribe(async (user: UserModel) => {
      let data: UserModel = new UserModel();
      data.uid = user.uid;
      data.displayName = user.displayName;
      data.email = user.email;
      data.photoURL = user.photoURL;
      data.phoneNumber = user.phoneNumber;
      if (user.uid) {
       // let lookupUser = await this.authService.lookupUserBy(user.uid);
      //  if (lookupUser) {
          // this.user$.next(lookupUser);
     //   } else {
          // this.user$.next({ 'role': 'admin', ...data });
          // this.db.collection(`/users`).doc(user.uid)
          //   .set(Object.assign({}, this.user$.getValue()));
     //   }
      }
    });
  }
}
