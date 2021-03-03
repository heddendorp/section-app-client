import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApplicationState,
  ApplicationVote,
  MemberStatus,
  NewMemberApplication,
} from '@tumi/models';
import { AuthService, UserService } from '@tumi/services';
import { ApplicationService } from '@tumi/services/application.service';
import { formatDistanceToNow } from 'date-fns/esm';
import { combineLatest, Observable } from 'rxjs';
import { first, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { IconToastComponent } from '../../../shared';

@Component({
  selector: 'app-application-details-page',
  templateUrl: './application-details-page.component.html',
  styleUrls: ['./application-details-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationDetailsPageComponent implements OnInit {
  public application$: Observable<NewMemberApplication>;
  public age$: Observable<string>;
  public studyTime$: Observable<string>;
  public newVoteForm: FormGroup;
  public votes$: Observable<ApplicationVote[]>;
  public alreadyVoted$: Observable<boolean>;
  public canBeAccepted$: Observable<boolean>;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private applications: ApplicationService,
    private users: UserService,
    private toast: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.application$ = this.route.data.pipe(
      map(({ application }) => application)
    );
    this.age$ = this.application$.pipe(
      map((application) => formatDistanceToNow(application.birthday))
    );
    this.studyTime$ = this.application$.pipe(
      map((application) => formatDistanceToNow(application.graduation))
    );
    this.votes$ = this.application$.pipe(
      switchMap(({ id }) => this.applications.votesForNewMemberApplication(id))
    );
    this.alreadyVoted$ = combineLatest([
      this.auth.user$,
      this.application$,
    ]).pipe(
      switchMap(([user, application]) =>
        this.applications.userHasVotedOnNewMember(application.id, user.id)
      )
    );
    this.canBeAccepted$ = this.application$.pipe(
      switchMap(({ id }) => this.applications.votesForNewMemberApplication(id)),
      map(
        (votes) =>
          votes.filter((vote: ApplicationVote) => vote.rating === 'approve')
            .length >= 2
      ),
      withLatestFrom(this.application$),
      map(
        ([enoughVotes, application]) =>
          enoughVotes && application.state === ApplicationState.Submitted
      )
    );
    this.newVoteForm = this.fb.group({
      comment: [''],
      rating: ['', Validators.required],
    });
  }

  public async submitForm(): Promise<void> {
    const application = await this.application$.pipe(first()).toPromise();
    const user = await this.auth.user$.pipe(first()).toPromise();
    const vote = this.newVoteForm.value;
    vote.author = user.name;
    await this.applications.setVoteOnNewMember(application.id, user.id, vote);
    location.reload();
  }

  public async acceptApplication(): Promise<void> {
    const application = await this.application$.pipe(first()).toPromise();
    await this.applications.updateNewMemberApplication(application.id, {
      state: ApplicationState.Accepted,
    });
    await this.users.update(application.userId, {
      status: MemberStatus.trial,
      joinedAssociation: new Date(),
    });
    this.toast.openFromComponent<IconToastComponent>(IconToastComponent, {
      data: {
        message: 'Application was successfully accepted!',
        icon: 'icon-checkmark',
      },
    });
    this.router.navigateByUrl('/apply/manage');
  }
}
