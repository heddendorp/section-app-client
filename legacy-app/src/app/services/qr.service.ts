import { Injectable } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { toDataURL } from 'qrcode';

@Injectable({
  providedIn: 'root',
})
export class QrService {
  constructor(private domSan: DomSanitizer) {}

  async getURL(data: any): Promise<SafeResourceUrl> {
    console.log(JSON.stringify(data));
    try {
      const url = await toDataURL(JSON.stringify(data));
      return this.domSan.bypassSecurityTrustResourceUrl(url);
    } catch (err) {
      console.error(err);
    }
    return this.domSan.bypassSecurityTrustResourceUrl('#');
  }
}
