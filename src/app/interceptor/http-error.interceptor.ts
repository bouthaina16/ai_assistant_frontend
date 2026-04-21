import {inject} from '@angular/core';
import {HttpInterceptorFn} from '@angular/common/http';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';

export const httpErrorInterceptor: HttpInterceptorFn = ((req, next) => {
  const router = inject(Router);
  return next(req).pipe(
    catchError((error) => {
      if ([403, 401].includes(error.status)) {
        localStorage.removeItem('Authorization');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
})

