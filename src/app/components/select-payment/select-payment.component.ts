import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CamundaRestService } from 'src/app/services/camunda-rest.service';
import { SessionServiceService } from 'src/app/services/session-service.service';

@Component({
  selector: 'app-select-payment',
  templateUrl: './select-payment.component.html',
  styleUrls: ['./select-payment.component.css']
})
export class SelectPaymentComponent implements OnInit {

  constructor(
    private camundaRestService : CamundaRestService,
    private sessionService : SessionServiceService,
    private router : Router
  ) { }

  ngOnInit(): void {
  }

  payment(method : String){
    this.camundaRestService.postCompleteTask(this.sessionService.sessionData.actualTaskID, "").subscribe((data) => {
      this.camundaRestService.getTaskOfProcessInstanceById(this.sessionService.sessionData.processInstanceID).subscribe((data)=>{

        if(data[0].taskDefinitionKey == 'Activity_16il0x1'){
          this.camundaRestService.postCompleteTask(data[0].id, "").subscribe((data) => {
            this.router.navigate(['/']);
          })
        }else{
          this.sessionService.sessionData.actualTaskID = data[0].id;
          this.sessionService.sessionData.actualTaskName = data[0].name;
          this.sessionService.sessionData.actualTaskDefinitionKey = data[0].taskDefinitionKey;
  
          this.router.navigate(['/' + this.sessionService.sessionData.actualTaskDefinitionKey]); 
        }

        this.sessionService.sessionData.in_progress = false;
      });
    });
  }

}
