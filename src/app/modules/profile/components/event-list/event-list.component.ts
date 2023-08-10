import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TumiEvent } from '@tumi/legacy-app/generated/generated';
import { DateTime } from 'luxon';
import { MatRippleModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { EventListItemComponent } from '../../../shared/components/event-list-item/event-list-item.component';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { NgIf, NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
  standalone: true,
  imports: [
    MatIconModule,
    NgIf,
    MatListModule,
    MatButtonModule,
    NgFor,
    EventListItemComponent,
    MatExpansionModule,
    MatRippleModule,
  ],
})
export class EventListComponent implements OnInit {
  @Output() claimRequest = new EventEmitter<String>();
  @Input() title: string = '';
  @Input() isOrganized: boolean = false;
  @Input() events: any[] | null | undefined = null;

  ngOnInit(): void {}

  requestClaimDialog() {
    this.claimRequest.emit('');
  }

  isFuture(event: TumiEvent) {
    return DateTime.fromISO(event.end) >= DateTime.now();
  }

  compareEventTime(e1: TumiEvent, e2: TumiEvent) {
    return (
      DateTime.fromISO(e2.start).toMillis() -
      DateTime.fromISO(e1.start).toMillis()
    );
  }

  futureEvents() {
    if (!this.events) return [];
    return this.events
      .filter(this.isFuture)
      .sort((e1, e2) => this.compareEventTime(e2, e1));
  }

  pastEvents() {
    if (!this.events) return [];
    return this.events
      .filter((e) => !this.isFuture(e))
      .sort(this.compareEventTime);
  }
}
