import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { PermissionsService } from '@tumi/legacy-app/modules/shared/services/permissions.service';
import { first } from 'rxjs';
import { Role } from '@tumi/legacy-app/generated/generated';

@Directive({
  selector: '[appIfRole]',
  standalone: true,
})
export class IfRoleDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private permissions: PermissionsService,
  ) {}

  @Input() set appIfRole(allowList: Role[]) {
    this.permissions
      .hasRole(allowList)
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
