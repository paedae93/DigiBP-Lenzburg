import { Injectable } from '@angular/core';
import { Session } from 'protractor';
import { SessionData } from '../classes/SessionData';

@Injectable({
  providedIn: 'root'
})
export class SessionServiceService {

  sessionData: SessionData = new SessionData();

  constructor() { 

  }

  clearSession(){
    this.sessionData.username = "";
    this.sessionData.actualTaskID = "";
    this.sessionData.actualTaskDefinitionKey = "";
    this.sessionData.actualTaskName = "";
    this.sessionData.businesskey = "";
    this.sessionData.customer_id  = 0;
    this.sessionData.customer_name = "";
    this.sessionData.processInstanceID  = "";
  }

  setLoading(show: boolean){
    if(show){
        this.sessionData.in_progress = true;
        this.sessionData.overlay = "block";
        this.sessionData.status = "Loading ..."
    }else{
      this.sessionData.in_progress = false;
      this.sessionData.overlay = "none";
      this.sessionData.status = "L"
    }
}
}
