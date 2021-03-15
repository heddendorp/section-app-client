import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewMemberApplication } from '@tumi/models';
import { FullMemberApplication } from '@tumi/models/fullMemberApplication';
import { formatDistanceToNow } from 'date-fns/esm';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-full-member-application-details',
  templateUrl: './full-member-application-details.component.html',
  styleUrls: ['./full-member-application-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FullMemberApplicationDetailsComponent implements OnInit {
  public application$: Observable<FullMemberApplication>;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.application$ = this.route.data.pipe(
      map(({ application }) => application)
    );
  }
}
