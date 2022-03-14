import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import {
  LoadPreviewEventsGQL,
  LoadPreviewEventsQuery,
  RegistrationMode,
} from '../../generated/generated';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-instagram',
  templateUrl: './instagram.component.html',
  styleUrls: ['./instagram.component.scss'],
})
export class InstagramComponent implements AfterViewInit {
  private events$: Observable<LoadPreviewEventsQuery['events']>;
  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement> | null = null;
  constructor(loadPreviewEventsGQL: LoadPreviewEventsGQL) {
    this.events$ = loadPreviewEventsGQL.watch().valueChanges.pipe(
      tap((data) => console.log(data)),
      map(({ data }) =>
        data.events
          .filter((event) => event.freeParticipantSpots !== 'Event is full')
          .filter((event) => event.registrationMode !== RegistrationMode.Online)
          .slice(0, 7)
      )
    );
  }

  ngAfterViewInit() {
    if (!this.canvas) return;
    const context = this.canvas.nativeElement.getContext('2d');
    if (!context) return;
    this.events$.subscribe(async (events) => {
      context.fillStyle = '#000';
      context.fillRect(0, 0, 1080, 1920);
      const bgImage = new Image(1080, 1920);
      bgImage.src =
        'https://experiments.esn.world/assets/images/background.jpg';
      bgImage.addEventListener('load', () => {
        context.drawImage(bgImage, 0, 0, 1080, 1920);
        const text = 'Upcoming TUMi Events';

        context.font = 'bold 60pt sans-serif';
        context.textAlign = 'center';
        context.fillStyle = '#fff';
        context.fillText(text, 540, 250);
        context.font = 'normal 57pt sans-serif';
        context.fillText('Register at: tumi.esn.world', 540, 350);

        events.forEach((event, index) => {
          const offset = 450 + index * 200;
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
          eventImage.src = `https://img.icons8.com/${style ?? 'fluency'}/150/${
            icon ?? ''
          }.png?token=9b757a847e9a44b7d84dc1c200a3b92ecf6274b2`;
          eventImage.addEventListener('load', () => {
            context.drawImage(eventImage, 40, offset + 25);
            context.font = 'normal 40pt sans-serif';
            context.textAlign = 'left';
            context.textBaseline = 'middle';
            context.fillText(event.title, 220, offset + 75, 810);
            context.font = 'normal 30pt sans-serif';
            if (!event.title.includes('ESNcard')) {
              context.fillText(
                DateTime.fromISO(event.start).toFormat('EEEE dd MMM HH:mm'),
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
