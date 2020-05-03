import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetComponent } from './components/widget/widget.component';
import { ButtonComponent } from './components/button/button.component';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {RouterModule} from "@angular/router";
import {LayoutModule} from "../../layout.module";
import { WidgetTitleComponent } from './components/widget/components/widget-title/widget-title.component';
import { WidgetDescriptionComponent } from './components/widget/components/widget-description/widget-description.component';
import { WidgetFooterComponent } from './components/widget/components/widget-footer/widget-footer.component';
import { WidgetBodyComponent } from './components/widget/components/widget-body/widget-body.component';



@NgModule({
  declarations: [WidgetComponent, ButtonComponent, WidgetTitleComponent, WidgetDescriptionComponent, WidgetFooterComponent, WidgetBodyComponent],
  exports: [
    WidgetComponent,
    ButtonComponent,
    WidgetTitleComponent,
    WidgetDescriptionComponent,
    WidgetFooterComponent,
    WidgetBodyComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterModule
  ]
})
export class MetronicModule { }
