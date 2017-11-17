import { Component } from '@angular/core';
import { UserModel } from '../user/user.model';
import { ProfileService } from './profile.service';

@Component({
  selector: 'uapi-profile-form',
  templateUrl: './profile-form.component.html'
})

export class ProfileFormComponent {
  public model: UserModel;
  constructor(
    public profile: ProfileService) {
    this.profile.user$.subscribe((user) => {
      this.model = user;
    });
  }

}
