import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AuthService } from '../auth/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { OrganizationModel } from './organization.model';

@Injectable()
export class OrganizationService {
  public org$: BehaviorSubject<OrganizationModel> = new BehaviorSubject(new OrganizationModel());

  constructor(
    private authService: AuthService,
    private db: AngularFirestore
  ) {
    this.authService.user$.subscribe((org: OrganizationModel) => {
      if (org.id) {
        let lookupOrg = this.authService.lookupOrgBy(org.id);
        if (lookupOrg) {

        } else {

        }
      }
    });
  }
}
