import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { DateTime } from 'luxon';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-semester-navigator',
    templateUrl: './semester-navigator.component.html',
    styleUrls: ['./semester-navigator.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        NgIf,
    ],
})
export class SemesterNavigatorComponent implements OnInit {
  public semesterOffset = 0;
  public semesterText = 'Current semester';
  public start: DateTime | undefined;
  public end: DateTime | undefined;
  public isAllTime = false;

  @Input()
  calculateStartEnd!: (date: DateTime) => { start: DateTime; end: DateTime };

  @Output()
  rangeEmitter = new EventEmitter();

  ngOnInit() {
    this.update();
  }

  prevSemester() {
    if (this.isAllTime) {
      this.isAllTime = false;
    } else {
      this.semesterOffset--;
    }
    this.update();
  }

  nextSemester() {
    if (this.isAllTime) {
      this.isAllTime = false;
    } else {
      this.semesterOffset++;
    }
    this.update();
  }

  update() {
    const { start, end } = this.calculateStartEnd(
      DateTime.now().plus({ months: 6 * this.semesterOffset })
    );
    this.start = start;
    this.end = end;

    const isSummer = start.month >= 4 && start.month < 10;
    this.semesterText = `${isSummer ? 'Summer' : 'Winter'} ${start.year}${
      isSummer ? '' : '/' + (start.year + 1)
    }`;

    this.rangeEmitter.emit({
      start: this.start,
      end: this.end,
    });
  }

  allTime() {
    this.semesterText = 'All time';
    this.isAllTime = true;

    this.rangeEmitter.emit({
      start: null,
      end: null,
    });
  }
}
