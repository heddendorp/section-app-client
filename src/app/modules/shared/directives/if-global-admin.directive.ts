import {
  Directive,
  inject,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
  selector: '[appIfGlobalAdmin]',
  standalone: true,
})
export class IfGlobalAdminDirective {
  private hasView = false;
  private auth = inject(AuthService);
  private viewContainer = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef);
  constructor() {
    this.auth.idTokenClaims$.pipe(takeUntilDestroyed()).subscribe((claims) => {
      const allowed =
        claims &&
        claims['https://evorto.app/app_metadata'].globalAdmin === true;
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
