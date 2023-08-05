import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { MembershipStatus } from '@tumi/legacy-app/generated/generated';
import { PermissionsService } from '@tumi/legacy-app/modules/shared/services/permissions.service';
import { first } from 'rxjs';

@Directive({
    selector: '[appIfStatus]',
    standalone: true,
})
export class IfStatusDirective {
  private hasView = false;
  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private permissions: PermissionsService
  ) {}

  @Input() set appIfStatus(allowList: MembershipStatus[]) {
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
