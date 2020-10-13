import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[appIconSrc]',
})
export class IconSrcDirective implements OnChanges {
  @Input() appIconSrc = '';

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.appIconSrc?.currentValue) {
      const iconString = changes.appIconSrc.currentValue;
      const [icon, style] = iconString.split(':');
      this.el.nativeElement.src = `https://img.icons8.com/${
        style ?? 'color'
      }/192/${icon ?? ''}.svg?token=9b757a847e9a44b7d84dc1c200a3b92ecf6274b2`;
    }
  }
}
