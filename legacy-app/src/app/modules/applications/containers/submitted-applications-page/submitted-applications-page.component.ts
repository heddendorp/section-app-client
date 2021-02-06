import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NewMemberApplication } from '@tumi/models';
import { FullMemberApplication } from '@tumi/models/fullMemberApplication';
import { AuthService } from '@tumi/services';
import { ApplicationService } from '@tumi/services/application.service';
import { Observable } from 'rxjs';
import { first, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-submitted-applications-page',
  templateUrl: './submitted-applications-page.component.html',
  styleUrls: ['./submitted-applications-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmittedApplicationsPageComponent implements OnInit {
  public newMemberApplications$: Observable<NewMemberApplication[]>;
  public fullMemberApplications$: Observable<FullMemberApplication[]>;
  constructor(
    private applications: ApplicationService,
    private auth: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    this.newMemberApplications$ = this.auth.user$.pipe(
      switchMap((user) =>
        this.applications.newMemberApplicationsForUser(user.id)
      )
    );
    this.fullMemberApplications$ = this.auth.user$.pipe(
      switchMap((user) =>
        this.applications.fullMemberApplicationsForUser(user.id)
      )
    );
  }
}
