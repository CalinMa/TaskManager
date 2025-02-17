import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone the request and set 'withCredentials' to true
    const modifiedRequest = request.clone({
      withCredentials: true, // Enable cookies
    });

    return next.handle(modifiedRequest);
  }
}

