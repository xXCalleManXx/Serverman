import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {CoreModule} from '../../core/core.module';
import {MainLayoutComponent} from './main-layout/main-layout.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import {MetronicModule} from "./components/metronic/metronic.module";
import { PulseComponent } from './components/pulse/pulse.component';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import { ServerWidgetComponent } from './components/server-widget/server-widget.component';
import {FormsModule} from "@angular/forms";

const DECLARATIONS = [
  // Components

  // Layouts
  MainLayoutComponent,
];

@NgModule({
  declarations: [
    DECLARATIONS,
    HeaderComponent,
    FooterComponent,
    PulseComponent,
    ServerWidgetComponent,
  ],
  exports: [
    DECLARATIONS,
    PulseComponent,
    ServerWidgetComponent,
  ],
  providers: [
  ],
  imports: [
    CommonModule,
    RouterModule,
    CoreModule,
    MetronicModule,
    FontAwesomeModule,
    FormsModule,
  ],
})
export class LayoutModule {}
