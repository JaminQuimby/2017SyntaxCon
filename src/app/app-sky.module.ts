import {
  NgModule
} from '@angular/core';

import {
  SkyRadioModule,
  SkyCheckboxModule
} from '@skyux/forms';

import {
  SkyGridModule
} from '@skyux/grids';

import {
  SkyLabelModule
} from '@skyux/indicators';

import {
  SkyPageSummaryModule
} from '@skyux/layout';

import {
  SkyListModule,
  SkyListToolbarModule,
  SkyListSecondaryActionsModule
} from '@skyux/list-builder';

import {
  SkyListViewGridModule
} from '@skyux/list-builder-view-grids';

import {
  SkyModalModule
} from '@skyux/modals';

import {
  SkyDropdownModule
} from '@skyux/popovers';

import {
  SkyTilesModule
} from '@skyux/tiles';

import {
  SkyNavbarModule
} from '@skyux/navbar';
@NgModule({
  exports: [
    SkyCheckboxModule,
    SkyDropdownModule,
    SkyGridModule,
    SkyLabelModule,
    SkyListModule,
    SkyListSecondaryActionsModule,
    SkyListToolbarModule,
    SkyListViewGridModule,
    SkyModalModule,
    SkyPageSummaryModule,
    SkyRadioModule,
    SkyTilesModule,
    SkyNavbarModule
  ]
})
export class AppSkyModule { }
