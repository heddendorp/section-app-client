import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent implements OnInit {
  constructor(private meta: Meta, private title: Title) {}

  ngOnInit(): void {
    this.title.setTitle('About TUMi');
    this.meta.updateTag(
      { property: 'og:title', content: 'About TUMi' },
      "property='og:title'"
    );
    this.meta.updateTag(
      { property: 'og:url', content: `https://tumi.esn.world/about` },
      "property='og:url'"
    );
    this.meta.updateTag(
      {
        property: 'og:description',
        content:
          'Learn about ESN TUMi and how we can improve your student life',
      },
      "property='og:description'"
    );
    this.meta.updateTag(
      {
        name: 'description',
        content:
          'Learn about ESN TUMi and how we can improve your student life',
      },
      "name='description'"
    );
  }
}
