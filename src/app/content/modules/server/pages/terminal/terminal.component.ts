import { Component, OnInit } from '@angular/core';
import {ServerService} from "../../../../../core/services/server.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent implements OnInit {

  constructor(
    private serverService: ServerService
  ) {
  }

  ngOnInit(): void {
  }

  getLogs(): Observable<string[]> {
    return this.serverService.getServerLogs(2);
  }

}
