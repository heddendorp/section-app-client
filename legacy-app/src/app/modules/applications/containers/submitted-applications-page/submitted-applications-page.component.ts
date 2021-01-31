import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Application } from '@tumi/models';
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
  public applications$: Observable<Application[]>;
  constructor(
    private applications: ApplicationService,
    private auth: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    this.applications$ = this.auth.user$.pipe(
      switchMap((user) => this.applications.applicationsForUser(user.id))
    );
  }
}
