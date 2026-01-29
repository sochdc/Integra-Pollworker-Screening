import { bootstrapApplication, createApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { createCustomElement } from '@angular/elements';

// bootstrapApplication(App, appConfig)
//   .catch((err) => console.error(err));
// import 'zone.js';
import { importProvidersFrom, provideZonelessChangeDetection } from '@angular/core'
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { OktaAuthModule } from '@okta/okta-angular';
import { environment } from './environments/environment';
import OktaAuth from '@okta/okta-auth-js';
import { authInterceptor } from './app/auth.interceptor';
import { Screeningparent } from './app/screeningparent/screeningparent';

(async () => {
  // Create an Angular application instance to get an injector
  const app = await createApplication({
    providers: [
      provideZonelessChangeDetection(),
      provideHttpClient(withInterceptors([authInterceptor])),
      importProvidersFrom(
      OktaAuthModule.forRoot({
        oktaAuth: new OktaAuth({
          issuer: environment.oktaUrl,
          clientId: environment.clientId,
          redirectUri: `${window.location.origin}/Integra/callback`,
          scopes: ['openid', 'offline_access', 'profile', 'email'],
          pkce: true,
          logoutUrl: environment.logoutUrl,
          postLogoutRedirectUri:`${window.location.origin}/Integra/agree`,
          tokenManager: {
            autoRenew: true,
            storage: 'localStorage',
          },
        }),
      })
    ),
      // Add any global services your component might need here
    ],
  });

  // Convert the standalone Angular component to a custom element constructor
  const MyButtonElement = createCustomElement(Screeningparent, {
    injector: app.injector,
  });

  if(!customElements.get("app-screeningparent"))
  customElements.define('app-screeningparent', MyButtonElement);

})();
