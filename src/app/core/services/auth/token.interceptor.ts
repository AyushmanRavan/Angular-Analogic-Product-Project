import { Injectable, Injector } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";

import { DATA } from '../../../core/data.enum';

import { AuthService } from "./auth.service";
import { Observable } from 'rxjs';
import { StorageServiceService } from "./storage-service.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private inject: Injector, private storageServiceService: StorageServiceService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    if (!request.url.endsWith("login")) {
      if (request.url.endsWith("/pdf") && (request.method === 'POST' || request.method === 'PUT')) {
        const auth = this.inject.get(AuthService);

        const customHeaders = new HttpHeaders().set(DATA.CACHE_CONTROL, 'no-cache')
          .set(DATA.APP_SUBJECT, this.storageServiceService.getStorageItem(DATA.APP_SUBJECT)).set(DATA.AUTHORIZATION, DATA.BEARER + this.storageServiceService.getStorageItem(DATA.TOKEN));


        request = request.clone({
          headers: customHeaders
        });
      } else {
        const auth = this.inject.get(AuthService);

        const customHeaders = new HttpHeaders().set(DATA.CACHE_CONTROL, 'no-cache').set(DATA.CONTENT_TYPE, 'application/json').
          set(DATA.APP_SUBJECT, this.storageServiceService.getStorageItem(DATA.APP_SUBJECT)).set(DATA.AUTHORIZATION, DATA.BEARER + this.storageServiceService.getStorageItem(DATA.TOKEN));
         
        request = request.clone({
          headers: customHeaders
        });

      }
    }
    return next.handle(request);
  }
}
