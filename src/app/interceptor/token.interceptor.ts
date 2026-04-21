import {HttpInterceptorFn} from "@angular/common/http";

export const tokenInterceptor: HttpInterceptorFn = ((req, next) => {
  const authToken = localStorage.getItem('Authorization');

  if (authToken && !req.url.includes("auth")) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });
    return next(authReq)
  }

  return next(req);
})
