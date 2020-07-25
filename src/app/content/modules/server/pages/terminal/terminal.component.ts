import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ServerService} from "../../../../../core/services/server.service";
import {interval, Observable} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {Server} from "../../../../../core/models/server";
import {tap} from "rxjs/operators";

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent implements OnInit {

  serverLogs$: Observable<string[]>;

  constructor(
    private serverService: ServerService,
    private activatedRoute: ActivatedRoute,
    private changeDetector: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.serverLogs$ = this.getLogs();
  }

  get server(): Server {
    return this.serverService.getServerById(this.serverId);
  }

  get serverId() {
    return this.activatedRoute.snapshot.params['serverId'];
  }

  getLogs(): Observable<string[]> {
    return this.serverService.getServerLogs(this.serverId).pipe(
      tap(() => this.changeDetector.detectChanges())
    );
  }

}
