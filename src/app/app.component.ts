import { Component } from '@angular/core';

import { SessionData } from './classes/SessionData';

import {MatDialog} from '@angular/material/dialog';
import {LoginComponent} from './components/login/login.component';
import { IntegromatService } from './services/integromat.service';
import { SessionServiceService } from './services/session-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DigiBP-Lenzburg';

  sessionData : SessionData;

  constructor(
    public dialog: MatDialog,
    private IntegromatService: IntegromatService,
    private sessionService : SessionServiceService
  ){
    this.sessionData = this.sessionService.sessionData;
    //this.sessionData.buisnesskey = "test";


  }

  logout(){
    // this.sessionService.sessionData = new Session();
    // this.sessionData = this.sessionService.sessionData;
    // this.router.navigate(['login']);
  }

  openLogin(){
    const dialogRef = this.dialog.open(LoginComponent);
  }


}

