import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModulesRoutingModule} from './modules.routing.module';
import {LayoutModule} from '../layout/layout.module';
import {CoreModule} from '../../core/core.module';
import {FrontpageComponent} from "./frontpage/frontpage.component";
import {MetronicModule} from "../layout/components/metronic/metronic.module";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

@NgModule({
  declarations: [
    FrontpageComponent,
  ],
  imports: [
    CommonModule,
    LayoutModule,
    CoreModule,

    // Routing
    ModulesRoutingModule,
    MetronicModule,
    FontAwesomeModule
  ]
})

export class ModulesModule {}
