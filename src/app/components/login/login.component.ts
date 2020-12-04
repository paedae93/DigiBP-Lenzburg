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

  onSubmit(loginData: any){

    this.integromatService.login(loginData).subscribe((data) => {

        
        this.sessionService.sessionData.businesskey = Object.values(data)[0];
        this.sessionService.sessionData.username = loginData.customer_id;

        this.camundaRest.getProcessInstanceByBusinessKey(this.sessionService.sessionData.businesskey).subscribe({
          next : data => {
            this.sessionService.sessionData.processInstanceID = data[0].id;
            console.log("process instance: " + data[0].id)
            this.camundaRest.getTaskOfProcessInstanceById(this.sessionService.sessionData.processInstanceID).subscribe({
              next : data => {

                this.sessionService.sessionData.actualTaskID = data[0].id;
                this.sessionService.sessionData.actualTaskName = data[0].name;
                this.sessionService.sessionData.actualTaskDefinitionKey = data[0].taskDefinitionKey;

                if(this.sessionService.sessionData.actualTaskDefinitionKey == "Activity_1pqtdac"){
                  this.camundaRest.postCompleteTask(this.sessionService.sessionData.actualTaskID, {}).subscribe(()=>{
                    this.camundaRest.getTaskOfProcessInstanceById(this.sessionService.sessionData.processInstanceID).subscribe((data)=>{
                      this.sessionService.sessionData.actualTaskID = data[0].id;
                      this.sessionService.sessionData.actualTaskName = data[0].name;
                      this.sessionService.sessionData.actualTaskDefinitionKey = data[0].taskDefinitionKey;

                      this.router.navigate(['/' + this.sessionService.sessionData.actualTaskDefinitionKey]);
                    });
                  });
                }else{
                  this.router.navigate(['/' + this.sessionService.sessionData.actualTaskDefinitionKey]);
                }
                
              }
            });

          }
        });

        this.dialogRef.close();
    });
    //this.loginForm.reset();

  }


}
