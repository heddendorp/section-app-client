import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-image-grid',
  templateUrl: './image-grid.component.html',
  styleUrls: ['./image-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageGridComponent implements OnInit {
  @Input() images: any[];
  constructor() {}

  ngOnInit(): void {}
}
