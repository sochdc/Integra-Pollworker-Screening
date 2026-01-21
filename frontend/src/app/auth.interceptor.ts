import { HttpInterceptorFn, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, from, mergeMap, Observable, switchMap, take, throwError } from 'rxjs';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js';
import { v4 as uuidv4 } from 'uuid';
import { Helpservice } from './helpservice';
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // console.log(accessToken);
  //   if(!req.url.includes("IAMApplication")){
  // //  return from("").pipe(
  // //         switchMap(accessToken => {
  // //           if (accessToken) {
  // //             req = req.clone({
  // //               setHeaders: {
  // //                 Authorization: 'Bearer ' + accessToken
  // //               }
  // //             });
  // //           }
  // //           return next(req);
  // //         })
  // //       );
  //  if (accessToken) {
  //     const clonedReq = req.clone({
  //       headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
  //     });
  //     return next(clonedReq);
  //   }
  //    return next(req);
  //    }
  //   else{
  //        return next(req);
  //  }
  const oktaAuth = inject(OKTA_AUTH);
    if (req.url.includes('forrest')) {
    const helpService = inject(Helpservice);
    // const accessToken = helpService.accessToken();
    const accessToken = oktaAuth.getAccessToken();
    if(accessToken) {
      let url=(req.url.split('forrest')[req.url.split('forrest').length-1]);
      let origin=window.location.origin+"/forrest/vriksh";
      const myUuid = uuidv4();
      const headers = new HttpHeaders({
        'firstName': helpService.localityInfo().localityId?.toString()!,
        'Original_Path': url,
        'X-Request-ID':`${myUuid}-${helpService.localityInfo().localityId}${new Date().getTime()}${helpService.localityInfo().userId}`
      });
    req = req.clone({ headers});
    req=req.clone({ url: origin });
    if (req.url.includes('forrest')) {
      req = req.clone({
        headers: req.headers
          .append('Authorization', 'Bearer ' + accessToken)
          .append('Cache-Control', 'no-cache'),
      });
    }

      
      // const clonedReq = req.clone({
      //   headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
      // });
      // return next(clonedReq);
    }
  }
    if (req.url.includes('ghatna')) {
    const helpService = inject(Helpservice);
    // const accessToken = helpService.accessToken();
    const accessToken = oktaAuth.getAccessToken();
    if(accessToken) {
      let url=(req.url.split('ghatna')[req.url.split('ghatna').length-1]);
      let origin=window.location.origin+"/forrest/ghatna";
      const myUuid = uuidv4();
      const headers = new HttpHeaders({
        'firstName': helpService.localityInfo().localityId?.toString()!,
        'Original_Path': url,
        'X-Request-ID':`${myUuid}-${helpService.localityInfo().localityId}${new Date().getTime()}${helpService.localityInfo().userId}`
      });
    req = req.clone({ headers});
    req=req.clone({ url: origin });
    if (req.url.includes('forrest')) {
      req = req.clone({
        headers: req.headers
          .append('Authorization', 'Bearer ' + accessToken)
          .append('Cache-Control', 'no-cache'),
      });
    }

      
      // const clonedReq = req.clone({
      //   headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
      // });
      // return next(clonedReq);
    }
  }
   if(req.url.includes('yantar')){
     const helpService = inject(Helpservice);
      const accessToken = oktaAuth.getAccessToken();
      let url=(req.url.split('yantar')[req.url.split('yantar').length-1]);
      let origin=window.location.origin+"/forrest/yantar";
      // httpRequest = httpRequest.clone({
      //   headers: httpRequest.headers.append('firstName', this.utilservice.userLocality.localityId?.toString())
      // });
       const myUuid = uuidv4();
      const headers = new HttpHeaders({
        'firstName': helpService.localityInfo().localityId?.toString()!,
        'Original_Path': url,
        'X-Request-ID':`${myUuid}-${helpService.localityInfo()}${new Date().getTime()}${helpService.localityInfo().userId}`
      });
      req = req.clone({
      headers
    });
    req=req.clone({ url: origin });
      if (req.url.includes('forrest')) {
      req = req.clone({
        headers: req.headers
          .append('Authorization', 'Bearer ' + accessToken)
          .append('Cache-Control', 'no-cache'),
      });
    }
    
     
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Handle 401 error: auto logout and redirect
        console.error('401 Unauthorized error, logging out...');
        // authService.logout(); // A method in your service to clear storage and navigate
        // router.navigate(['/login']); // Redirect to your login route
        oktaAuth.signOut();
      }
      // Re-throw the error so other handlers/components can still catch it
      return throwError(() => error);
    })
  );

  
};


