import { Component } from '@angular/core';
import { SkyTileDashboardConfig } from '@blackbaud/skyux/dist/core';
import { ProjectsService } from '../projects/projects.service';
import { ProjectModel } from '../projects/project.model';
import { SkyAppAssetsService } from '@blackbaud/skyux-builder/runtime/assets.service';

@Component({
  selector: 'uapi-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  public projects: Array<ProjectModel> = [];
  public dashboardConfig: SkyTileDashboardConfig;

  constructor(
    private service: ProjectsService,
    private readonly assetsService: SkyAppAssetsService) {
    this.service.projects$.subscribe(projects => {
    const urlTest =  this.assetsService.getUrl('styles/tinycontent.css');
    console.log(urlTest);
      this.projects = projects;
    });
  }
}
