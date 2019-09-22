import { ErrorHandler } from '@angular/core';
import { sendEvent } from './shared/utility-functions';

export class AnalyticsErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    sendEvent('exception', error);
  }
}
