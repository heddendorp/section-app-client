import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { PermissionsService } from '../services/permissions.service';
import { Role } from '@tumi/data-access';
import { first } from 'rxjs/operators';

@Directive({
  selector: '[tumiIfRole]',
})
export class IfRoleDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private permissions: PermissionsService
  ) {}

  @Input() set tumiIfRole(allowList: Role[]) {
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
