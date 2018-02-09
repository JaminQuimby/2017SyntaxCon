import { Component } from '@angular/core';
import { OrganizationService } from './organization.service';

@Component({
  selector: 'uapi-organization-form',
  templateUrl: './organization-form.component.html'
})

export class OrganizationFormComponent {
  constructor(service: OrganizationService) { }
}
