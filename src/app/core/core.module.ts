import {NgModule} from '@angular/core';
import {CommonModule, Location} from '@angular/common';
import {TooltipDirective} from "./directives/tooltip.directive";


const DECLARATIONS = [
];

@NgModule({
  declarations: [
    DECLARATIONS,
    TooltipDirective
  ],
  exports: [
    DECLARATIONS,
    TooltipDirective
  ],
  imports: [
    CommonModule,
  ],
  providers: [
    Location,
  ]
})


export class CoreModule {

}
