import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MemberRights, User } from '@tumi/models';

@Component({
  selector: 'app-rights-manager',
  templateUrl: './rights-manager.component.html',
  styleUrls: ['./rights-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RightsManagerComponent implements OnInit {
  @Input() user: User;
  @Output() rightsUpdated = new EventEmitter<MemberRights>();

  public rightsForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.rightsForm = this.fb.group({
      seeDrafts: [false, Validators.required],
      manageApplications: [false, Validators.required],
      manageMembers: [false, Validators.required],
      manageUsers: [false, Validators.required],
      accessTransactions: [false, Validators.required],
      scanRequests: [false, Validators.required],
      betaFeatures: [false, Validators.required],
    });
    this.rightsForm.setValue(this.user.rights);
  }
}
