import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-shop-page',
  templateUrl: './shop-page.component.html',
  styleUrls: ['./shop-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopPageComponent {
  constructor(meta: Meta, title: Title) {
    title.setTitle('TUMi - shop');
    meta.updateTag(
      { property: 'og:title', content: 'TUMi - shop' },
      "property='og:title'"
    );
    meta.updateTag(
      { property: 'og:url', content: `https://tumi.esn.world/page/shop` },
      "property='og:url'"
    );
    meta.updateTag(
      {
        property: 'og:description',
        content: 'TUMify you life with this amazing merch for Tutors!',
      },
      "property='og:description'"
    );
    meta.updateTag(
      {
        name: 'description',
        content: 'TUMify you life with this amazing merch for Tutors!',
      },
      "name='description'"
    );
    meta.updateTag(
      {
        property: 'og:image',
        content: `/assets/images/shop/icon.png`,
      },
      "property='og:image'"
    );
  }
}
