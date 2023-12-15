import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-form-display',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatSelectModule],
  templateUrl: './form-display.component.html',
  styleUrl: './form-display.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormDisplayComponent {
  @Input({ required: true }) form!: UntypedFormGroup;
  @Input({ required: true }) formConfig!: {
    type: string;
    label: string;
    options: string[];
  }[];
}
