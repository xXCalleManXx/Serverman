import {ErrorHandler} from '@angular/core';
import * as Sentry from "@sentry/browser";
import {environment} from '../../environments/environment';

if (environment.sentryDSN) {
  Sentry.init({
    dsn: environment.sentryDSN
  });
}

export class GlobalErrorHandler implements ErrorHandler {

  handleError(error: any): void {

    if (!environment.sentryDSN) {
      throw error;
    }

    Sentry.captureException(error.originalError || error);
  }

}
