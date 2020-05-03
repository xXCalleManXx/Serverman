import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServerComponent } from './server.component';
import {RouterModule} from "@angular/router";
import {ServerRoutingModule} from "./server.routing.module";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {LayoutModule} from "../../layout/layout.module";
import { TerminalComponent } from './pages/terminal/terminal.component';

@NgModule({
  declarations: [ServerComponent, TerminalComponent],
  imports: [
    CommonModule,
    RouterModule,
    ServerRoutingModule,
    FontAwesomeModule,
    LayoutModule,
  ]
})
export class ServerModule { }
