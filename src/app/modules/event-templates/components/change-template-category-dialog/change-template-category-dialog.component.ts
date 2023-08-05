import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { NgFor } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-change-template-category-dialog',
    templateUrl: './change-template-category-dialog.component.html',
    styleUrls: ['./change-template-category-dialog.component.scss'],
    standalone: true,
    imports: [
        MatDialogModule,
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        NgFor,
        MatOptionModule,
        MatButtonModule,
    ],
})
export class ChangeTemplateCategoryDialogComponent {
  categorySelection = new FormControl('', Validators.required);
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { categories: { id: string; name: string }[] }
  ) {}
}
