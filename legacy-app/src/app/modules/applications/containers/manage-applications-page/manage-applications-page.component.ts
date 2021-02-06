import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NewMemberApplication } from '@tumi/models';
import { ApplicationService } from '@tumi/services/application.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-manage-applications-page',
  templateUrl: './manage-applications-page.component.html',
  styleUrls: ['./manage-applications-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageApplicationsPageComponent implements OnInit {
  public applications$: Observable<NewMemberApplication[]>;
  constructor(private applications: ApplicationService) {}

  ngOnInit(): void {
    this.applications$ = this.applications.getAllNewMembers();
  }
}
