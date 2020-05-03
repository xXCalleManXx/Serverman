import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ServerComponent} from "./server.component";
import {TerminalComponent} from "./pages/terminal/terminal.component";

const routes: Routes = [
  {
    path: '',
    component: ServerComponent
  },
  {
    path: 'terminal',
    component: TerminalComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ServerRoutingModule {}
