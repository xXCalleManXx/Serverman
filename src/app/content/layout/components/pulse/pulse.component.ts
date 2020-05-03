import {Component, Input, OnInit} from '@angular/core';

export type PulseColor = 'green'|'red'|'orange';

@Component({
  selector: 'app-pulse',
  templateUrl: './pulse.component.html',
  styleUrls: ['./pulse.component.scss']
})
export class PulseComponent implements OnInit {

  @Input() animate = true;
  @Input() color: PulseColor = 'green';

  constructor() { }

  ngOnInit(): void {
  }

  get classList(): string[] {
    const list = ['pulse'];

    list.push('pulse-' + this.color);

    if (this.animate) {
      list.push('animate')
    }

    return list;
  }

}
