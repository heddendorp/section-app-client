import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateFormFieldDialogComponent } from '@tumi/legacy-app/components/dynamicForms/form-builder/create-form-field-dialog/create-form-field-dialog.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-form-builder',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './form-builder.component.html',
  styleUrl: './form-builder.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormBuilderComponent {
  @Output() protected fieldChange = new EventEmitter();
  protected formFields = signal<
    { type: string; label: string; options: string[] }[]
  >([]);
  private dialog = inject(MatDialog);

  @Input()
  set fields(
    fields: { type: string; label: string; options: string[] }[] | undefined,
  ) {
    if (fields) {
      this.formFields.set(fields);
    }
  }

  removeField(label: string) {
    this.formFields.update((fields) =>
      fields.filter((field) => field.label !== label),
    );
  }

  protected async addField() {
    const field = await firstValueFrom(
      this.dialog.open(CreateFormFieldDialogComponent).afterClosed(),
    );
    if (!field) return;
    this.formFields.update((fields) => [...fields, field]);
  }
}
