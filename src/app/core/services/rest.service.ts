import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment as env } from './../../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class RestService {
  constructor(private httpClient: HttpClient) { }
  /**
  * Performs a request with `post` http method.
  */
  postText(url: string, body: any) {
    return this.httpClient.post(`${env.api}${url}`, JSON.stringify(body), { responseType: 'text' }).pipe(catchError(this.handleError));
  }

  postForPDF(url: string, body: FormData) {
    return this.httpClient.post(`${env.api}${url}`, body).pipe(catchError(this.handleError));
  }
  putForPDF(url: string, body: FormData) {
    return this.httpClient.post(`${env.api}${url}`, body).pipe(catchError(this.handleError));
  }



  /**
   * Performs a request with `post` http method.
   */
  post(url: string, body: any): Observable<any> {
    return this.httpClient.post<any>(`${env.api}${url}`, JSON.stringify(body)).pipe(catchError(this.handleError));
  }
  /**
   * Performs a request with `get` http method.
   */
  get(url: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${env.api}${url}`).pipe(catchError(this.handleError));
  }
  getLogoImage(url: string): Observable<Blob> {
    return this.httpClient.get(`${url}`, { responseType: 'blob' }).pipe(catchError(this.handleError));
  }
  /**
   * Performs a request with `delete` http method.
   */
  del(url: string, id: any) {
    return this.httpClient
      .delete(`${env.api}${url}/${id}`)
      .pipe(catchError(this.handleError));
  }
  /** 
   * Performs a request with `put` http method.
   */
  put(url: string, body: any) {
    return this.httpClient
      .put(`${env.api}${url}`, JSON.stringify(body))
      .pipe(catchError(this.handleError));
  }
  /**
   * Parses error if any and then thorw with message.
   */
  handleError(error: HttpResponse<any> | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body: any = error.json() || "";
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ""} ${err}`;
    } else {
      errMsg = error.message ? error : error.toString();
    }
    return throwError(errMsg);
  }
}
