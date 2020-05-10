import { Component, OnInit } from '@angular/core';
import {ServerService} from "../../../../../core/services/server.service";

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent implements OnInit {

  constructor(
    private serverService: ServerService
  ) { }

  ngOnInit(): void {
  }

  get logs(): string[] {
    return this.serverService.getServerLogs(2);
  }

}
