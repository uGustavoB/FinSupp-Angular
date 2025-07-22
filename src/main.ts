import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

registerLocaleData(localePt);

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers,
    provideAnimations(),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    provideCharts(withDefaultRegisterables())
  ]
})
.catch((err) => console.error(err));
