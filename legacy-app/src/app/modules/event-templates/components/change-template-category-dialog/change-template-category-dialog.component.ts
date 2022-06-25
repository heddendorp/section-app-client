import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-template-category-dialog',
  templateUrl: './change-template-category-dialog.component.html',
  styleUrls: ['./change-template-category-dialog.component.scss'],
})
export class ChangeTemplateCategoryDialogComponent {
  categorySelection = new FormControl('', Validators.required);
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { categories: { id: string; name: string }[] }
  ) {}
}
