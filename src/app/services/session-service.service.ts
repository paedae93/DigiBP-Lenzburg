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
}
