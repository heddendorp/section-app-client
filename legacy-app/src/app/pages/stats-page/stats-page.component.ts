import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../shared/services/stats.service';
import { Select } from '@ngxs/store';
import { AuthState } from '../../shared/state/auth.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-stats-page',
  templateUrl: './stats-page.component.html',
  styleUrls: ['./stats-page.component.scss']
})
export class StatsPageComponent implements OnInit {
  eventStats;
  @Select(AuthState.isAdmin) isAdmin$: Observable<boolean>;

  constructor(private statsService: StatsService) {
  }

  ngOnInit() {
    this.eventStats = this.statsService.getEventStats();
    this.eventStats.subscribe(console.log);
  }

  async rebuildStats() {
    await this.statsService.updateEventStats().toPromise();
  }
}
