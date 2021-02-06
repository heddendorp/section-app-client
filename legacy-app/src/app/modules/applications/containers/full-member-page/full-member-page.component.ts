import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationState, User } from '@tumi/models';
import { AuthService, EventService, UserService } from '@tumi/services';
import { ApplicationService } from '@tumi/services/application.service';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-full-member-page',
  templateUrl: './full-member-page.component.html',
  styleUrls: ['./full-member-page.component.scss'],
})
export class FullMemberPageComponent implements OnInit {
  public applicationForm: FormGroup;
  private user$: Observable<User>;
  public hasApplication$: Observable<boolean>;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private events: EventService,
    private router: Router,
    private applications: ApplicationService
  ) {}

  async ngOnInit(): Promise<void> {
    this.applicationForm = this.fb.group({
      events: this.fb.array([]),
      comment: ['', Validators.required],
      duties: [false, Validators.requiredTrue],
    });
    this.user$ = this.auth.user$;
    const user = await this.user$.pipe(first()).toPromise();
    this.hasApplication$ = this.applications.userHasFullMemberApplication(
      user.id
    );
    const events = await this.events
      .getEventsForTutor(user.id)
      .pipe(first())
      .toPromise();
    if (events.length) {
      events.forEach((event) =>
        this.eventArray.push(
          this.fb.group({
            name: [event.name, Validators.required],
            comment: '',
            id: [event.id],
          })
        )
      );
    }
  }

  get eventArray(): FormArray {
    return this.applicationForm.get('events') as FormArray;
  }

  removeEvent(index: number) {
    this.eventArray.removeAt(index);
  }

  public addEvent(): void {
    this.eventArray.push(
      this.fb.group({
        name: [''],
        comment: [''],
      })
    );
  }

  public async saveApplication(): Promise<void> {
    const application = this.applicationForm.value;
    const user = await this.auth.user$.pipe(first()).toPromise();
    application.userId = user.id;
    application.created = new Date();
    application.state = ApplicationState.Submitted;
    await this.applications.addFullMember(application);
    await this.router.navigateByUrl('/apply/submitted');
  }
}
