import { ErrorHandler } from '@angular/core';
import { sendEvent } from './shared/utility-functions';

export class AnalyticsErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    const message = error.message ? error.message : error.toString();
    sendEvent('exception', { fatal: false, description: message });
    throw error;
  }
}
