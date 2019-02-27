import { Component, ChangeDetectionStrategy } from '@angular/core';

import {
  SkyTileDashboardConfig
} from '@skyux/tiles';

import { ProjectModel } from '../projects/project.model';
import { Container } from '../shared/database.decorator';

@Component({
  selector: 'uapi-dashboard',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  @Container('users/projects')
  public projects: ProjectModel;
  public dashboardConfig: SkyTileDashboardConfig;

  constructor() {

  }
}
