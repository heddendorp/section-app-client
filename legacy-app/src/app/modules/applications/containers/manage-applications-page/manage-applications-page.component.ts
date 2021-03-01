import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ApplicationVote, NewMemberApplication, User } from '@tumi/models';
import { FullMemberApplication } from '@tumi/models/fullMemberApplication';
import { ApplicationService } from '@tumi/services/application.service';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../services';

@Component({
  selector: 'app-manage-applications-page',
  templateUrl: './manage-applications-page.component.html',
  styleUrls: ['./manage-applications-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageApplicationsPageComponent implements OnInit {
  public newMemberApplications$: Observable<NewMemberApplication[]>;
  public fullMemberApplications$: Observable<FullMemberApplication[]>;
  public user$: Observable<User>;
  constructor(
    private applications: ApplicationService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.newMemberApplications$ = this.applications.getAllNewMembers();
    this.fullMemberApplications$ = this.applications.getAllFullMembers();
    this.user$ = this.auth.user$;
  }

  public hasVoted(votes: ApplicationVote[], id: string): string {
    return votes.find((v) => v.id === id) ? 'voted' : '';
  }
}
