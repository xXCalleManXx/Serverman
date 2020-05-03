import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FrontpageComponent} from "./frontpage/frontpage.component";
import {ServerComponent} from "./server/server.component";

const routes: Routes = [
  {
    path: '',
    component: FrontpageComponent
  },
  {
    path: 'server/:serverId',
    loadChildren: () => import('./server/server.module').then(m => m.ServerModule)
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ModulesRoutingModule {}
