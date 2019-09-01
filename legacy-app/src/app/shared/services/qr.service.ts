import { Injectable } from '@angular/core';
import QRCode from 'qrcode';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class QrService {
  constructor(private domSan: DomSanitizer) {}

  async getURL(data): Promise<SafeResourceUrl> {
    try {
      const url = await QRCode.toDataURL(JSON.stringify(data), { errorCorrectionLevel: 'H' });
      return this.domSan.bypassSecurityTrustResourceUrl(url);
    } catch (err) {
      console.error(err);
    }
  }
}
