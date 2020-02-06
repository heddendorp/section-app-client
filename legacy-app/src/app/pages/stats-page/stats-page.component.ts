import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../shared/services/stats.service';
import { Select } from '@ngxs/store';
import { AuthState } from '../../shared/state/auth.state';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-stats-page',
  templateUrl: './stats-page.component.html',
  styleUrls: ['./stats-page.component.scss']
})
export class StatsPageComponent implements OnInit {
  eventStats;
  userStats;
  loadingMessage = new BehaviorSubject(null);
  @Select(AuthState.isAdmin) isAdmin$: Observable<boolean>;

  constructor(private statsService: StatsService) {
  }

  ngOnInit() {
    this.eventStats = this.statsService.getEventStats();
    this.userStats = this.statsService.getUserStats();
  }

  async rebuildStats() {
    this.loadingMessage.next('Recalculating stats');
    await Promise.all([
      this.statsService.updateEventStats().toPromise(),
      this.statsService.updateUserStats().toPromise()
    ]);
    this.loadingMessage.next(null);
  }
}
