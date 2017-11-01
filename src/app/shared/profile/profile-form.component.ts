import { Component } from '@angular/core';
import { ProfileModel } from './profile.model';
import { ProfileService } from './profile.service';

@Component({
  selector: 'uapi-profile-form',
  templateUrl: './profile-form.component.html'
})

export class ProfileFormComponent {
  public model: ProfileModel;
  constructor(
    public profile: ProfileService) {
    this.model = this.profile;
  }

}
