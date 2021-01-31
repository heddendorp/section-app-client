import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Application, ApplicationVote } from '@tumi/models';
import { AuthService } from '@tumi/services';
import { ApplicationService } from '@tumi/services/application.service';
import {
  differenceInCalendarYears,
  differenceInYears,
  formatDistanceToNow,
} from 'date-fns/esm';
import { combineLatest, Observable } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-application-details-page',
  templateUrl: './application-details-page.component.html',
  styleUrls: ['./application-details-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationDetailsPageComponent implements OnInit {
  public application$: Observable<Application>;
  public age$: Observable<string>;
  public studyTime$: Observable<string>;
  public newVoteForm: FormGroup;
  public votes$: Observable<ApplicationVote[]>;
  public alreadyVoted$: Observable<boolean>;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private auth: AuthService,
    private applications: ApplicationService
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
      switchMap(({ id }) => this.applications.votesForApplication(id))
    );
    this.alreadyVoted$ = combineLatest([
      this.auth.user$,
      this.application$,
    ]).pipe(
      switchMap(([user, application]) =>
        this.applications.userHasVoted(application.id, user.id)
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
    await this.applications.setVote(application.id, user.id, vote);
    location.reload();
  }
}
