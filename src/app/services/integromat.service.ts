import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginComponent } from '../components/login/login.component';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class IntegromatService {

  constructor(
    private http: HttpClient
    ) { }
  
  
  getPrescriptionsForCustomer(customerID : number){
    let url = "https://hook.integromat.com/gkudovywtmsq2olxbijs66dn63y6i23y";
    return this.http.post(url, JSON.stringify({customer_id : customerID}), httpOptions).pipe(map(resp => resp));
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
