import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EventFormDialogComponent } from '@tumi/legacy-app/modules/event-templates/components/event-form-dialog/event-form-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  combineLatest,
  concat,
  firstValueFrom,
  map,
  Observable,
  of,
} from 'rxjs';
import {
  CreateEventTemplateGQL,
  GetLonelyEventTemplatesGQL,
  GetLonelyEventTemplatesQuery,
  GetTemplateCategoriesWithTemplatesGQL,
  GetTemplateCategoriesWithTemplatesQuery,
  Role,
} from '@tumi/legacy-app/generated/generated';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IconURLPipe } from '@tumi/legacy-app/modules/shared/pipes/icon-url.pipe';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { IfRoleDirective } from '../../../shared/directives/if-role.directive';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ResetScrollDirective } from '../../../shared/directives/reset-scroll.directive';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  AsyncPipe,
  DecimalPipe,
  NgFor,
  NgIf,
  NgOptimizedImage,
} from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveToolbarComponent } from '../../../shared/components/reactive-toolbar/reactive-toolbar.component';

@Component({
  selector: 'app-template-list-page',
  templateUrl: './template-list-page.component.html',
  styleUrls: ['./template-list-page.component.scss'],
  standalone: true,
  imports: [
    ReactiveToolbarComponent,
    MatToolbarModule,
    NgIf,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    ResetScrollDirective,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    IfRoleDirective,
    MatExpansionModule,
    NgFor,
    MatListModule,
    RouterLink,
    AsyncPipe,
    DecimalPipe,
    IconURLPipe,
    NgOptimizedImage,
  ],
})
export class TemplateListPageComponent {
  public Role = Role;
  public templateCategories$: Observable<
    GetTemplateCategoriesWithTemplatesQuery['eventTemplateCategories']
  >;
  public eventTemplates$: Observable<
    GetLonelyEventTemplatesQuery['eventTemplates']
  >;
  public searchEnabled = false;
  public searchControl = new FormControl('');
  @ViewChild('searchbar')
  private searchBar!: ElementRef;
  private eventTemplateQuery;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private createTemplateMutation: CreateEventTemplateGQL,
    private loadTemplates: GetLonelyEventTemplatesGQL,
    private getEventTemplatesGQL: GetTemplateCategoriesWithTemplatesGQL,
    private router: Router,
  ) {
    this.eventTemplateQuery = this.loadTemplates.watch(
      {},
      { fetchPolicy: 'cache-and-network' },
    );
    this.eventTemplates$ = combineLatest([
      concat(of(''), this.searchControl.valueChanges),
      this.eventTemplateQuery.valueChanges.pipe(
        map(({ data }) => data.eventTemplates),
      ),
    ]).pipe(
      map(([search, templates]) =>
        templates.filter((template) =>
          template.title.toLowerCase().includes((search ?? '').toLowerCase()),
        ),
      ),
    );
    this.templateCategories$ = combineLatest([
      concat(of(''), this.searchControl.valueChanges),
      this.getEventTemplatesGQL
        .watch()
        .valueChanges.pipe(map(({ data }) => data.eventTemplateCategories)),
    ]).pipe(
      map(([search, categories]) =>
        categories.map((category) => ({
          ...category,
          templates: category.templates.filter(
            (template) =>
              template.title
                .toLowerCase()
                .includes((search ?? '').toLowerCase()) || !search,
          ),
          templateCount: category.templates.filter(
            (template) =>
              template.title
                .toLowerCase()
                .includes((search ?? '').toLowerCase()) || !search,
          ).length,
        })),
      ),
    );
  }

  async createTemplate() {
    const categories = await firstValueFrom(this.templateCategories$);
    const template = await firstValueFrom(
      this.dialog
        .open(EventFormDialogComponent, {
          data: { categories },
          width: '600px',
          maxWidth: '100vw',
          panelClass: 'modern',
        })
        .afterClosed(),
    );
    if (template) {
      this.snackBar.open('Saving template', undefined, { duration: 0 });
      const response = await firstValueFrom(
        this.createTemplateMutation.mutate({ input: template }),
      );
      await this.eventTemplateQuery.refetch();
      this.snackBar.open('Template saved successfully');
      await this.router.navigate([
        '/event-templates',
        response?.data?.createEventTemplate.id,
      ]);
    }
  }

  initSearch(): void {
    if (this.searchEnabled) {
      this.searchEnabled = false;
      this.searchControl.setValue('');
    } else {
      this.searchEnabled = true;
      setTimeout(() => {
        this.searchBar.nativeElement.focus();
      });
    }
  }
}
