import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Server} from "../../../../core/models/server";
import {ServerService} from "../../../../core/services/server.service";
import {IpcService} from "../../../../core/services/ipc.service";

@Component({
  selector: 'app-server-widget',
  templateUrl: './server-widget.component.html',
  styleUrls: ['./server-widget.component.scss']
})
export class ServerWidgetComponent implements OnInit {

  @Input() server: Server;

  @ViewChild('nameInput') nameInput: ElementRef<HTMLInputElement>;
  @ViewChild('nameElement') nameElement: ElementRef<HTMLElement>;

  constructor(
    private serverService: ServerService
  ) { }

  ngOnInit(): void {
    this.updateInputSize();
  }

  getInputLength(str) {
    if (!this.nameElement) {
      return 10;
    }

    this.nameElement.nativeElement.innerHTML = str;

    return this.nameElement.nativeElement.clientWidth + 10;
  }

  updateInputSize(event?: KeyboardEvent) {
    if (event && event.key === 'Enter') {
      this.nameInput.nativeElement.blur();
      return;
    }

    setTimeout(() => {
      if (!this.nameInput) {
        return;
      }
      const width = this.getInputLength(this.nameInput.nativeElement.value);
      this.nameInput.nativeElement.style.width = width + 'px';
    }, 50)
  }

  saveName() {
    const name = this.nameInput.nativeElement.value.trim();
    this.nameInput.nativeElement.value = name;
    this.updateInputSize();
    if (this.server.id == -1) {
      if (!name) {
        this.serverService.removeServerById(-1);
        return;
      }
      this.serverService.createServer(name)
      console.log('Creating server: ' + name);
    } else {
      console.log('Name: ' + name);
      // alert('Name: ' + name);
    }

  }

  startServer() {
    this.serverService.startServer(this.server.id);
    this.serverService.updateServer(this.server.id, {
      processState: "online"
    })
  }

  stopServer() {
    this.serverService.stopServer(this.server.id);
    this.serverService.updateServer(this.server.id, {
      processState: "offline"
    })
  }

  deleteServer() {
    this.serverService.removeServerById(this.server.id);
  }

  isOnline() {
    if (!this.server) {
      return false;
    }
    return this.server.processState === 'online'
  }

  openServerFolder() {
    return this.serverService.openServerFolder(this.server.id);
  }

}
