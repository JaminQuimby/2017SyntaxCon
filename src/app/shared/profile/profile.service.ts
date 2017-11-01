import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ProfileModel } from './profile.model';

@Injectable()
export class ProfileService {
    public uid: string;
    public displayName: string;
    public email: string;
    public photoURL: string;
    public phoneNumber: string;
    constructor(
        private authService: AuthService
    ) {
        this.authService.user$.subscribe((user: ProfileModel) => {
            this.uid = user.uid;
            this.displayName = user.displayName;
            this.email = user.email;
            this.photoURL = user.photoURL;
            this.phoneNumber = user.phoneNumber;
        });
    }
}
