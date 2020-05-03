import { Component, OnInit } from '@angular/core';
import {ServerService} from "../../../../core/services/server.service";
import {Observable} from "rxjs";
import {Server} from "../../../../core/models/server";
import {HttpClient} from "@angular/common/http";
import {map, tap} from "rxjs/operators";
import {IpcService} from "../../../../core/services/ipc.service";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  servers$: Observable<Server[]>;
  publicIp$: Observable<string>;
  privateIp: string;

  constructor(
    private serverService: ServerService,
    private httpClient: HttpClient,
    private ipcService: IpcService
  ) {
  }

  ngOnInit(): void {
    this.servers$ = this.serverService.getServers();
    this.publicIp$ = this.httpClient.get('https://api.ipify.org?format=json').pipe(
      map(data => (data as any).ip)
    );

    this.ipcService.send('retrieve-private-ip');
    this.ipcService.on('retrieve-private-ip-reply', (event, args) => {
      if (!args.privateIp) {
        return;
      }
      this.privateIp = args.privateIp[0]?.address;
    })
  }

  createServer() {
    this.serverService.createNewServer();
  }

}
