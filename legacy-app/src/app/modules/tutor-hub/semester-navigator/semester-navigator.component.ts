import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-semester-navigator',
  templateUrl: './semester-navigator.component.html',
  styleUrls: ['./semester-navigator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SemesterNavigatorComponent implements OnInit {
  public semesterOffset = 0;
  public semesterText = 'Current semester';
  public start: DateTime = DateTime.now();
  public end: DateTime = DateTime.now();

  @Input()
  calculateStartEnd!: (date: DateTime) => { start: DateTime; end: DateTime; };

  @Output()
  rangeEmitter = new EventEmitter();

  ngOnInit() {
    this.update();
  }

  prevSemester() {
    this.semesterOffset--;
    this.update();
  }

  nextSemester() {
    this.semesterOffset++;
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
}
