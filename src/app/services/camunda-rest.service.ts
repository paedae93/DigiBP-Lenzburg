import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProcessDefinition } from '../classes/ProcessDefinition';
import { Task } from '../classes/Task';
import { Suggestion } from '../classes/Suggestion';
import { SessionServiceService } from './session-service.service';
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CamundaRestService {

  private engineRestUrl = 'https://cors-anywhere.herokuapp.com/https://digibp-lenzburg.herokuapp.com/rest/'

  constructor(
    private http: HttpClient,
    private sessionService : SessionServiceService,
    private router : Router
    ) {

  }

  getNextTask(){
    if(!this.sessionService.sessionData.overlay){
      this.sessionService.setLoading(true);
    }
    this.sessionService.sessionData.status = "Get actual Task...";
    this.getTaskOfProcessInstanceById(this.sessionService.sessionData.processInstanceID).subscribe((data)=>{

      this.sessionService.sessionData.actualTaskID = data[0].id;
      this.sessionService.sessionData.actualTaskName = data[0].name;
      this.sessionService.sessionData.actualTaskDefinitionKey = data[0].taskDefinitionKey;

      this.router.navigate(['/' + this.sessionService.sessionData.actualTaskDefinitionKey]);            

      this.sessionService.setLoading(false);
    });
  }

  getTasks(): Observable<Task[]> {
    const endpoint = `${this.engineRestUrl}task?sortBy=created&sortOrder=desc&maxResults=10`;
    return this.http.get<any>(endpoint).pipe(
      tap(form => this.log(`fetched tasks`)),
      catchError(this.handleError('getTasks', []))
    );
  }

  getTaskOfProcessInstanceById(processInstanceID : String): Observable<any>{
    const endpoint = `${this.engineRestUrl}task?processInstanceId=${processInstanceID}`;
    return this.http.get(endpoint).pipe(
      map(resp => resp)
    );
  }

  getTaskFormKey(taskId: String): Observable<any> {
    const endpoint = `${this.engineRestUrl}task/${taskId}/form`;
    return this.http.get<any>(endpoint).pipe(
      tap(form => this.log(`fetched taskform`)),
      catchError(this.handleError('getTaskFormKey', []))
    );
  }

  getVariablesForTask(taskId: String,): Observable<any> {
    const endpoint = `${this.engineRestUrl}task/${taskId}/form-variables`;
    return this.http.get<any>(endpoint).pipe(
      tap(form => this.log(`fetched variables`)),
      catchError(this.handleError('getVariablesForTask', []))
    );
  }

  getSuggestion(taskId: String): Observable<any> {
    const endpoint = `${this.engineRestUrl}task/${taskId}/variables/suggestion`;
    return this.http.get<any>(endpoint).pipe(
      map(resp => resp),
      catchError(this.handleError('getVariableSuggestionForTask', []))
    );
  }

  postCompleteTask(taskId: String, variables: Object): Observable<any> {
    const endpoint = `${this.engineRestUrl}task/${taskId}/complete`;
    return this.http.post<any>(endpoint, variables, httpOptions).pipe(
      tap(tasks => tasks = true),
      catchError(this.handleError('postCompleteTask', []))
    );
  }

  getProcessDefinitionTaskKey(processDefinitionKey : String): Observable<any> {
    const url = `${this.engineRestUrl}process-definition/key/${processDefinitionKey}/startForm`;
    return this.http.get<any>(url).pipe(
      tap(form => this.log(`fetched formkey`)),
      catchError(this.handleError('getProcessDeifnitionFormKey', []))
    );
  }

  getProcessDefinitions(): Observable<ProcessDefinition[]> {

    return this.http.get<ProcessDefinition[]>(this.engineRestUrl + 'process-definition?latestVersion=true').pipe(
      tap(processDefinitions => this.log(`fetched processDefinitions`)),
      catchError(this.handleError('getProcessDefinitions', []))
    );
  }

  getProcessInstanceByBusinessKey(businessKey : String): Observable<any>{
    const endpoint = `${this.engineRestUrl}process-instance?businessKey=${businessKey}`;
    return this.http.get(endpoint).pipe(
      map(resp => resp)
    );
  }

  postProcessInstance(processDefinitionKey : String, variables : String): Observable<any> {
    const endpoint = `${this.engineRestUrl}process-definition/key/${processDefinitionKey}/start`;
    return this.http.post<any>(endpoint, variables).pipe(
      tap(processDefinitions => this.log(`posted process instance`)),
      catchError(this.handleError('postProcessInstance', []))
    );
  }

  deployProcess(fileToUpload: File): Observable<any> {
    const endpoint = `${this.engineRestUrl}deployment/create`;
    const formData = new FormData();

    formData.append('fileKey', fileToUpload, fileToUpload.name);

    return this.http.post(endpoint, formData);
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
