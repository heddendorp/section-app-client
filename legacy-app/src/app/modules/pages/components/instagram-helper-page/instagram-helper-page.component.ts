import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { EventService } from '@tumi/services';
import { startOfToday } from 'date-fns';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { format } from 'date-fns/esm';

@Component({
  selector: 'app-instagram-helper-page',
  templateUrl: './instagram-helper-page.component.html',
  styleUrls: ['./instagram-helper-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstagramHelperPageComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('downloadButton') downloadButton: ElementRef<HTMLLinkElement>;
  events$: Observable<any[]>;

  constructor(private events: EventService) {}

  ngOnInit(): void {
    this.events$ = this.events
      .upcomingOfTypes$({ types: ['event'], date: startOfToday() })
      .pipe(
        map((events) => events.filter((event) => event.visibility === 'public'))
      );
  }

  ngAfterViewInit() {
    console.log(this.canvas);
    const context = this.canvas.nativeElement.getContext('2d');
    if (!context) return;
    this.events$.subscribe(async (events) => {
      context.fillStyle = '#000';
      context.fillRect(0, 0, 1080, 1920);
      const bgImage = new Image(1080, 1920);
      bgImage.src = 'https://tumi.esn.world/assets/images/background.jpg';
      bgImage.addEventListener('load', () => {
        context.drawImage(bgImage, 0, 0, 1080, 1920);
        const text = 'Upcoming TUMi Events';

        context.font = 'bold 60pt sans-serif';
        context.textAlign = 'center';
        context.fillStyle = '#fff';
        context.fillText(text, 540, 200);
        context.font = 'normal 57pt sans-serif';
        context.fillText('Register at: tumi.esn.world', 540, 300);

        events.forEach((event, index) => {
          const offset = 400 + index * 200;
          context.globalAlpha = 0.4;
          context.fillStyle = '#fff';
          context.strokeStyle = '#fff';
          context.lineWidth = 2;
          // context.fillRect(25, offset + 25, 1030, 150);
          this.roundRect(context, 25, offset + 25, 1030, 150);
          context.globalAlpha = 1.0;
          context.fillStyle = '#000';
          const [icon, style] = event.icon.split(':');
          const eventImage = new Image(100, 100);
          eventImage.src = `https://img.icons8.com/${style ?? 'color'}/150/${
            icon ?? ''
          }.png?token=9b757a847e9a44b7d84dc1c200a3b92ecf6274b2`;
          eventImage.addEventListener('load', () => {
            context.drawImage(eventImage, 40, offset + 25);
            context.font = 'normal 40pt sans-serif';
            context.textAlign = 'left';
            context.textBaseline = 'middle';
            context.fillText(event.name, 220, offset + 75, 810);
            context.font = 'normal 30pt sans-serif';
            if (!event.name.includes('ESNcard')) {
              context.fillText(
                format(event.start, 'EEEEEE dd MMM HH:mm'),
                220,
                offset + 130,
                780
              );
            } else {
              context.fillText(
                'Any time at tumi.esn.world',
                220,
                offset + 130,
                780
              );
            }
          });
        });
      });
    });
  }
  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius = 16,
    fill = true,
    stroke = true
  ) {
    const radiusObject = { tl: radius, tr: radius, br: radius, bl: radius };
    ctx.beginPath();
    ctx.moveTo(x + radiusObject.tl, y);
    ctx.lineTo(x + width - radiusObject.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radiusObject.tr);
    ctx.lineTo(x + width, y + height - radiusObject.br);
    ctx.quadraticCurveTo(
      x + width,
      y + height,
      x + width - radiusObject.br,
      y + height
    );
    ctx.lineTo(x + radiusObject.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radiusObject.bl);
    ctx.lineTo(x, y + radiusObject.tl);
    ctx.quadraticCurveTo(x, y, x + radiusObject.tl, y);
    ctx.closePath();
    if (fill) {
      ctx.fill();
    }
    if (stroke) {
      ctx.globalAlpha = 0.6;
      ctx.stroke();
    }
  }
}
