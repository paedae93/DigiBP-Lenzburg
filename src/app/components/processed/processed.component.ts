import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CamundaRestService } from 'src/app/services/camunda-rest.service';
import { IntegromatService } from 'src/app/services/integromat.service';
import { SessionServiceService } from 'src/app/services/session-service.service';

@Component({
  selector: 'app-processed',
  templateUrl: './processed.component.html',
  styleUrls: ['./processed.component.css']
})
export class ProcessedComponent implements OnInit {

  constructor(
    private sessionService : SessionServiceService,
    private router : Router,

    private integromatService : IntegromatService,
    private camundaRest : CamundaRestService
  ) { }

  ngOnInit(): void {
  }

  process(process : boolean){
    if(process){
      this.continue();
    }else{
      this.sessionService.clearSession();
      this.router.navigate(['/welcome']);
    }
  }

  continue(){

    this.sessionService.setLoading(true);
    this.sessionService.sessionData.status = "Create new Order...";

    let loginData = {
      customer_id : String(this.sessionService.sessionData.customer_id),
      password : this.sessionService.sessionData.password
    }

    this.integromatService.login(loginData).subscribe((data) => {
      if(Object.values(data)[0]){
        this.sessionService.sessionData.status = "Login correct. Search actual Process."
        this.sessionService.sessionData.customer_id = Object.values(data)[2];
        this.sessionService.sessionData.businesskey = Object.values(data)[1];
        this.sessionService.sessionData.customer_name = Object.values(data)[4] + " " + Object.values(data)[3];
        this.sessionService.sessionData.username = String(loginData.customer_id);
        this.sessionService.sessionData.password = loginData.password;
        this.login();
      }else{
        //LOGIN WRONG
      }
    });
  }

  login(){
    this.camundaRest.getProcessInstanceByBusinessKey(this.sessionService.sessionData.businesskey).subscribe({
      next : data => {
        this.sessionService.sessionData.status = "Found actual Process. Search actual Task";

        this.sessionService.sessionData.processInstanceID = data[0].id;
        this.camundaRest.getTaskOfProcessInstanceById(this.sessionService.sessionData.processInstanceID).subscribe({
          next : data => {

            this.sessionService.sessionData.status = "Found acutal Task."
            this.sessionService.sessionData.actualTaskID = data[0].id;
            this.sessionService.sessionData.actualTaskName = data[0].name;
            this.sessionService.sessionData.actualTaskDefinitionKey = data[0].taskDefinitionKey;

            if(this.sessionService.sessionData.actualTaskDefinitionKey == "Activity_1pqtdac"){
              this.camundaRest.postCompleteTask(this.sessionService.sessionData.actualTaskID, {}).subscribe(()=>{
                this.sessionService.sessionData.status = "Identify Customer."
                this.camundaRest.getTaskOfProcessInstanceById(this.sessionService.sessionData.processInstanceID).subscribe((data)=>{
                  this.sessionService.sessionData.status = "Customer Identified. Get acutal Task."
                  this.sessionService.sessionData.actualTaskID = data[0].id;
                  this.sessionService.sessionData.actualTaskName = data[0].name;
                  this.sessionService.sessionData.actualTaskDefinitionKey = data[0].taskDefinitionKey;

                  this.router.navigate(['/' + this.sessionService.sessionData.actualTaskDefinitionKey]);
                  this.sessionService.sessionData.in_progress = false;
                });
              });
            }else{
              this.router.navigate(['/' + this.sessionService.sessionData.actualTaskDefinitionKey]);
              this.sessionService.sessionData.in_progress = false;
            }
            
          }
        });

      }
    });    
  }
}
