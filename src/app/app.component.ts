import { Component } from '@angular/core';

import { SessionData } from './classes/SessionData';

import {MatDialog} from '@angular/material/dialog';
import {LoginComponent} from './components/login/login.component';
import { IntegromatService } from './services/integromat.service';
import { SessionServiceService } from './services/session-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Digital Pharmacy';

  sessionData : SessionData;

  constructor(
    public dialog: MatDialog,
    private IntegromatService: IntegromatService,
    private sessionService : SessionServiceService,
    private router : Router
  ){
    this.sessionData = this.sessionService.sessionData;
  }

  ngOnInit(){
    this.router.navigate(['/welcome']);
  }

  logout(){
    this.sessionService.sessionData = new SessionData();
    this.sessionData = this.sessionService.sessionData;
    this.router.navigate(['/welcome']);
  }

  openLogin(){
    const dialogRef = this.dialog.open(LoginComponent, {width: '500px'});
  }


}

