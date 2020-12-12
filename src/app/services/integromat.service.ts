import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginComponent } from '../components/login/login.component';
import { Prescription } from '../classes/Prescription';
import { SessionServiceService } from './session-service.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class IntegromatService {

  constructor(
    private http: HttpClient,
    private sessionService : SessionServiceService
    ) { }
  
  
  getPrescriptionsForCustomer(customerID : number) : Observable<Prescription[]>{
    let url = "https://hook.integromat.com/gkudovywtmsq2olxbijs66dn63y6i23y";
    const headers = { 'content-type': 'application/json'};
    const body = JSON.stringify({customer_id : customerID});
    return this.http.post<Prescription[]>(url, body, { headers }).pipe(
      map(resp => resp),
      catchError(this.handleError('getPrescriptionsForCustomer', []))
    );
  }

  updateOrderPrescription(prescription_id : number){
    let url = 'https://hook.integromat.com/xp2lqfrrw7mjto3dawpzn1f36pef3qz0';

    let data = {
      "prescription_id" : prescription_id,
      "business_key" : this.sessionService.sessionData.businesskey
    }
    console.log(JSON.stringify(data));
    return this.http.post(url, JSON.stringify(data), httpOptions).pipe(map(resp => resp));
  }

  login(loginData : any){
    let url = 'https://hook.integromat.com/wiq06rq41d33yacc5ombsuohpz6o9uy6';

    return this.http.post(url, JSON.stringify(loginData), httpOptions).pipe(map(resp => resp));
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log(message);
  }
}
