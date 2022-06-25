import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  MembershipStatus,
  SubmitEventFeedbackGQL,
  TumiEvent,
  UpdateProfileGQL,
  UserProfileGQL,
  UserProfileQuery,
} from '@tumi/legacy-app/generated/generated';
import { first, firstValueFrom, map, Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { UpdateProfileDialogComponent } from '@tumi/legacy-app/modules/profile/components/update-profile-dialog/update-profile-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClaimEventDialogComponent } from '@tumi/legacy-app/modules/profile/components/claim-event-dialog/claim-event-dialog.component';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  @Output() claimRequest = new EventEmitter<String>();
  @Input() isOrganized: boolean = false;
  @Input() events: any[] = new Array<any>();

  ngOnInit(): void {
    console.log(this.isOrganized)
    console.log(this.events)
  }

  requestClaimDialog() {
    this.claimRequest.emit("")
  }

}
