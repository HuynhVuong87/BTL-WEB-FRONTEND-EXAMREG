import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap, } from 'rxjs/operators';

@Injectable()
export class MakeRequest {

  constructor(private http: HttpClient) {

  }

  private extractData(res: Response) {
    const body = res;
    return body || {};
  }

  GETmethod({ url, headers }: { url: string; headers: any; }): Observable<any> {
    return this.http.get(url, { withCredentials: true }).pipe(
      map(this.extractData))
      ;
  }

  POSTmethod({ url, body }: { url: string; body: any; }): Observable<any> {
    return this.http.post(url, body, {
      withCredentials: true
    }).pipe(
      map(this.extractData));
  }

  errorHandler(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
}
