import { Component } from '@angular/core';
import { SkyTileDashboardConfig } from '@blackbaud/skyux/dist/core';
import { ProjectModel } from '../projects/project.model';
import { Container } from '../shared/database.service';

@Component({
  selector: 'uapi-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  @Container('users/$uid$/projects')
  public projects: ProjectModel;
  public dashboardConfig: SkyTileDashboardConfig;

  constructor() {

  }
}
