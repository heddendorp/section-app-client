import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { PermissionsService } from '../services/permissions.service';
import { MembershipStatus } from '@tumi/data-access';
import { first } from 'rxjs/operators';

@Directive({
  selector: '[tumiIfStatus]',
})
export class IfStatusDirective {
  private hasView = false;
  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private permissions: PermissionsService
  ) {}

  @Input() set tumiIfStatus(allowList: MembershipStatus[]) {
    this.permissions
      .hasStatus(allowList)
      .pipe(first())
      .toPromise()
      .then((allowed) => {
        if (!allowed && this.hasView) {
          this.viewContainer.clear();
          this.hasView = false;
        } else if (allowed && !this.hasView) {
          this.viewContainer.createEmbeddedView(this.templateRef);
          this.hasView = true;
        }
      });
  }
}
