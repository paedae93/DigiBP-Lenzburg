import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SessionData } from 'src/app/classes/SessionData';
import { CamundaRestService } from 'src/app/services/camunda-rest.service';
import { IntegromatService } from 'src/app/services/integromat.service';
import { SessionServiceService } from 'src/app/services/session-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm : FormGroup;
  loginCorrect : Boolean = false;
  wait : Boolean = false;
  status : String = "";
  overlay : String = "none"

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<LoginComponent>,
    private integromatService: IntegromatService,
    private sessionService : SessionServiceService,
    private camundaRest : CamundaRestService,
    private router : Router,
  ) { 
    this.loginForm = this.formBuilder.group({
      customer_id: '',
      password: ''
    });

  }

  ngOnInit(): void {
  }

  close(){
    this.dialogRef.close();
  }

  onSubmit(loginData: any){

    this.wait = true;
    this.overlay = "block";
    this.status = "Check login data."

    this.sessionService.sessionData.in_progress = true;

    this.integromatService.login(loginData).subscribe((data) => {
        this.status = "Login correct. Search actual Process."
        this.sessionService.sessionData.customer_id = Object.values(data)[1];
        this.sessionService.sessionData.businesskey = Object.values(data)[0];
        this.sessionService.sessionData.customer_name = Object.values(data)[3] + " " + Object.values(data)[2];
        this.sessionService.sessionData.username = loginData.customer_id;

        this.camundaRest.getProcessInstanceByBusinessKey(this.sessionService.sessionData.businesskey).subscribe({
          next : data => {
            this.status = "Found actual Process. Search actual Task"

            this.sessionService.sessionData.processInstanceID = data[0].id;
            this.camundaRest.getTaskOfProcessInstanceById(this.sessionService.sessionData.processInstanceID).subscribe({
              next : data => {

                this.status = "Found acutal Task."
                this.sessionService.sessionData.actualTaskID = data[0].id;
                this.sessionService.sessionData.actualTaskName = data[0].name;
                this.sessionService.sessionData.actualTaskDefinitionKey = data[0].taskDefinitionKey;

                if(this.sessionService.sessionData.actualTaskDefinitionKey == "Activity_1pqtdac"){
                  this.camundaRest.postCompleteTask(this.sessionService.sessionData.actualTaskID, {}).subscribe(()=>{
                    this.status = "Identify Customer."
                    this.camundaRest.getTaskOfProcessInstanceById(this.sessionService.sessionData.processInstanceID).subscribe((data)=>{
                      this.status = "Customer Identified. Get acutal Task."
                      this.sessionService.sessionData.actualTaskID = data[0].id;
                      this.sessionService.sessionData.actualTaskName = data[0].name;
                      this.sessionService.sessionData.actualTaskDefinitionKey = data[0].taskDefinitionKey;

                      this.router.navigate(['/' + this.sessionService.sessionData.actualTaskDefinitionKey]);
                      this.sessionService.sessionData.in_progress = false;

                      this.dialogRef.close();
                    });
                  });
                }else{
                  this.router.navigate(['/' + this.sessionService.sessionData.actualTaskDefinitionKey]);
                  this.sessionService.sessionData.in_progress = false;

                  this.dialogRef.close();
                }
                
              }
            });

          }
        });
    });
  }
}
