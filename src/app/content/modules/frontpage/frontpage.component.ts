import { Component, OnInit } from '@angular/core';
import {ServerService} from "../../../core/services/server.service";
import {Observable} from "rxjs";
import {Server} from "../../../core/models/server";

@Component({
  selector: 'app-frontpage',
  templateUrl: './frontpage.component.html',
  styleUrls: ['./frontpage.component.scss']
})
export class FrontpageComponent implements OnInit {

  arr;
  servers$: Observable<Server[]>

  constructor(
    private serverService: ServerService
  ) { }

  ngOnInit(): void {
    this.servers$ = this.serverService.getServers();
  }

  createServer() {
    this.serverService.createNewServer();
  }

}
